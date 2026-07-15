import React, { createContext, useContext, useEffect, useState } from 'react';
import { alertaApi } from '../services/alertaApi';
import { authApi, RegisterPayload } from '../services/authApi';
import { perfilApi, PerfilUpdatePayload } from '../services/perfilApi';
import { siloApi, SiloCreatePayload, SiloUpdatePayload } from '../services/siloApi';
import { loteApi } from '../services/loteApi';
import { clearToken, getToken, saveToken } from '../services/tokenStorage';
import { AlertaResponse, LoteResponse, PerfilResponse, SiloResponse } from '../services/types';
import { formatRelativeTime } from '../utils/relativeTime';

export interface Profile {
  name: string;
  email: string;
  phone: string;
  farmName: string;
  farmLoc: string;
  farmHa: number;
}

export interface Silo {
  id: number;
  name: string;
  grain: string;
  tons: number;
  acopio: string;
  status: 'ok' | 'warn' | 'critical';
  temp: number;
  hum: number;
  co2: number;
  storage: string;
  lastUpdate: string;
}

export interface SiloAlert {
  id: number;
  siloId: number;
  silo: string;
  variant: 'critical' | 'warning' | 'resolved';
  title: string;
  time: string;
  estimate?: string;
  action?: string;
  desc: string;
  sensor: 'temp' | 'humidity' | 'co2';
  value: string;
  unit: string;
  threshold: string;
  status: 'active' | 'resolved';
  resolutionNote?: string;
  resolutionReason?: string;
}

export interface Lote {
  id: number;
  codigo: string;
  siloId: number;
  siloName: string;
  name: string;
  grain: string;
  tons: number;
  start: string;
  end: string | null;
  days: number;
  status: 'monitoring' | 'finalized';
  score: number;
  alertsResolved: number;
  avg: { co2: number; temp: number; hum: number };
}

const EMPTY_PROFILE: Profile = { name: '', email: '', phone: '', farmName: '', farmLoc: '', farmHa: 0 };

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function mapProfile(r: PerfilResponse): Profile {
  return {
    name: r.name,
    email: r.email,
    phone: r.phone ?? '',
    farmName: r.farmName,
    farmLoc: r.farmLoc ?? '',
    farmHa: r.farmHa ?? 0,
  };
}

function mapSilo(r: SiloResponse): Silo {
  return {
    id: r.id,
    name: r.name,
    grain: r.grain,
    tons: r.tons,
    acopio: r.acopio,
    status: r.status,
    temp: r.lastTemp,
    hum: r.lastHum,
    co2: r.lastCo2,
    storage: r.storage,
    lastUpdate: formatRelativeTime(r.lastReadingAt),
  };
}

function mapAlert(r: AlertaResponse): SiloAlert {
  return {
    id: r.id,
    siloId: r.siloId,
    silo: r.siloName,
    variant: r.variant,
    title: r.title,
    time: formatRelativeTime(r.createdAt),
    estimate: r.estimate ?? undefined,
    action: r.action ?? undefined,
    desc: r.description,
    sensor: r.sensor,
    value: r.value,
    unit: r.unit,
    threshold: r.threshold,
    status: r.status,
    resolutionNote: r.resolutionNote ?? undefined,
    resolutionReason: r.resolutionReason ?? undefined,
  };
}

function mapLote(r: LoteResponse): Lote {
  return {
    id: r.id,
    codigo: r.codigo,
    siloId: r.siloId,
    siloName: r.siloName,
    name: r.name,
    grain: r.grain,
    tons: r.tons,
    start: fmtDate(r.startAt),
    end: r.endAt ? fmtDate(r.endAt) : null,
    days: r.days,
    status: r.status,
    score: r.score,
    alertsResolved: r.alertsResolved,
    avg: { co2: r.avgCo2, temp: r.avgTemp, hum: r.avgHum },
  };
}

interface AppDataContextValue {
  silos: Silo[];
  lotes: Lote[];
  alerts: SiloAlert[];
  notification: string | null;
  profile: Profile;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  addSilo: (payload: SiloCreatePayload) => Promise<void>;
  updateSilo: (id: number, payload: SiloUpdatePayload) => Promise<void>;
  deleteSilo: (id: number) => Promise<void>;
  resolveAlert: (id: number, note?: string, reason?: string) => Promise<void>;
  // Filtro resuelto en la API (GET /api/alertas?status=&variant=), no en el cliente.
  filterAlerts: (status?: string, variant?: string) => Promise<SiloAlert[]>;
  iniciarLote: (siloId: number) => Promise<void>;
  finalizarLote: (id: number) => Promise<void>;
  notify: (msg: string) => void;
  clearNotification: () => void;
  updateProfile: (payload: PerfilUpdatePayload) => Promise<void>;
  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [alerts, setAlerts] = useState<SiloAlert[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const [p, s, a, l] = await Promise.all([perfilApi.get(), siloApi.list(), alertaApi.list(), loteApi.list()]);
    setProfile(mapProfile(p));
    setSilos(s.map(mapSilo));
    setAlerts(a.map(mapAlert));
    setLotes(l.map(mapLote));
  };

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        try {
          // Validamos el token contra la API antes de dar la sesión por buena:
          // un token guardado puede estar vencido, o el servidor puede no responder.
          await loadAll();
          setIsAuthenticated(true);
        } catch {
          // 401 → apiFetch ya limpió el token. Error de red → conservamos el token
          // pero arrancamos en el login, nunca en un dashboard vacío sin datos.
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    await saveToken(result.token);
    setIsAuthenticated(true);
    await loadAll();
  };

  const register = async (payload: RegisterPayload) => {
    await authApi.register(payload);
  };

  const logout = async () => {
    await clearToken();
    setIsAuthenticated(false);
    setSilos([]);
    setLotes([]);
    setAlerts([]);
    setProfile(EMPTY_PROFILE);
  };

  const addSilo = async (payload: SiloCreatePayload) => {
    const created = await siloApi.create(payload);
    setSilos((prev) => [...prev, mapSilo(created)]);
  };

  const updateSilo = async (id: number, payload: SiloUpdatePayload) => {
    const updated = await siloApi.update(id, payload);
    setSilos((prev) => prev.map((s) => (s.id === id ? mapSilo(updated) : s)));
  };

  const deleteSilo = async (id: number) => {
    await siloApi.remove(id);
    setSilos((prev) => prev.filter((s) => s.id !== id));
    setAlerts((prev) => prev.filter((a) => a.siloId !== id));
  };

  const resolveAlert = async (id: number, note?: string, reason?: string) => {
    const updated = await alertaApi.resolver(id, note, reason);
    setAlerts((prev) => prev.map((a) => (a.id === id ? mapAlert(updated) : a)));
  };

  // El filtrado se resuelve en el servidor: la API traduce status/variant a un
  // WHERE en la consulta (AlertaRepository.ListByUserAsync), no filtramos acá.
  const filterAlerts = async (status?: string, variant?: string) => {
    const result = await alertaApi.list(status, variant);
    return result.map(mapAlert);
  };

  const iniciarLote = async (siloId: number) => {
    const created = await loteApi.iniciar(siloId);
    setLotes((prev) => [mapLote(created), ...prev]);
  };

  const finalizarLote = async (id: number) => {
    const updated = await loteApi.finalizar(id);
    setLotes((prev) => prev.map((l) => (l.id === id ? mapLote(updated) : l)));
  };

  const notify = (msg: string) => setNotification(msg);
  const clearNotification = () => setNotification(null);

  const updateProfile = async (payload: PerfilUpdatePayload) => {
    const updated = await perfilApi.update(payload);
    setProfile(mapProfile(updated));
  };

  return (
    <AppDataContext.Provider
      value={{
        silos,
        lotes,
        alerts,
        notification,
        profile,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        addSilo,
        updateSilo,
        deleteSilo,
        resolveAlert,
        filterAlerts,
        iniciarLote,
        finalizarLote,
        notify,
        clearNotification,
        updateProfile,
        refresh: loadAll,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
