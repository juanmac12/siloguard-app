import React, { createContext, useContext, useEffect, useState } from 'react';
import { alertaApi } from '../services/alertaApi';
import { authApi, RegisterPayload } from '../services/authApi';
import { perfilApi, PerfilUpdatePayload } from '../services/perfilApi';
import { siloApi, SiloCreatePayload, SiloUpdatePayload } from '../services/siloApi';
import { clearToken, getToken, saveToken } from '../services/tokenStorage';
import { AlertaResponse, PerfilResponse, SiloResponse } from '../services/types';
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

const EMPTY_PROFILE: Profile = { name: '', email: '', phone: '', farmName: '', farmLoc: '', farmHa: 0 };

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

interface AppDataContextValue {
  silos: Silo[];
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
  notify: (msg: string) => void;
  clearNotification: () => void;
  updateProfile: (payload: PerfilUpdatePayload) => Promise<void>;
  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [alerts, setAlerts] = useState<SiloAlert[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const [p, s, a] = await Promise.all([perfilApi.get(), siloApi.list(), alertaApi.list()]);
    setProfile(mapProfile(p));
    setSilos(s.map(mapSilo));
    setAlerts(a.map(mapAlert));
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
