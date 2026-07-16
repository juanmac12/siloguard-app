/**
 * AppDataContext — capa de datos contra la API real (SiloGuard.Api).
 *
 * Mantiene la misma forma de `useAppData()` que consumen las pantallas del
 * rediseño y absorbe acá adentro las diferencias entre los modelos de UI y los
 * DTOs del backend, así ninguna pantalla necesita saber de la API:
 *   - `addSilo` agrega la lectura inicial que exige POST /api/silos.
 *   - `updateSilo`/`updateProfile` completan el objeto que exigen los PUT.
 *
 * Lo único que sigue siendo mock es `devices` (las lanzas): no existe entidad
 * de dispositivo en el backend. Ver `src/mock/seed.ts`.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { alertaApi } from "../services/alertaApi";
import { authApi } from "../services/authApi";
import { loteApi } from "../services/loteApi";
import { perfilApi } from "../services/perfilApi";
import { siloApi } from "../services/siloApi";
import { umbralApi } from "../services/umbralApi";
import { clearToken, getToken, saveToken } from "../services/tokenStorage";
import type {
  AlertaResponse,
  LoteResponse,
  PerfilResponse,
  PreferenciasResponse,
  SiloResponse,
} from "../services/types";
import { RECOM, SEED_DEVICES, SEED_NOTIFICATIONS } from "../mock/seed";
import type { Device, Grain, NotificationSettings } from "../mock/seed";
import { formatRelativeTime } from "../utils/relativeTime";

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
  status: "ok" | "warn" | "critical";
  temp: number;
  hum: number;
  co2: number;
  storage: string;
  lastUpdate: string;
  // null mientras la lanza no mandó ninguna lectura — `useDeviceState` lo maneja.
  lastSignalAt: string | null;
}

export interface SiloAlert {
  id: number;
  siloId: number;
  silo: string;
  variant: "critical" | "warning" | "resolved";
  title: string;
  time: string;
  estimate?: string;
  action?: string;
  desc: string;
  sensor: "temp" | "humidity" | "co2";
  value: string;
  unit: string;
  threshold?: string;
  status: "active" | "resolved";
  resolutionNote?: string;
  resolutionReason?: string;
}

export interface Lote {
  id: number;
  /** Código público del pasaporte (`SG-2026-A1F3`): es lo que se muestra y se comparte. */
  codigo: string;
  siloId: number;
  siloName: string;
  name: string;
  grain: string;
  tons: number;
  start: string;
  end: string | null;
  days: number;
  status: "monitoring" | "finalized";
  score: number;
  alertsResolved: number;
  avg: { co2: number; temp: number; hum: number };
}

export type ThresholdPair = { warn: number; crit: number };
export type SiloThresholds = { co2: ThresholdPair; temp: ThresholdPair; hum: ThresholdPair };

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  farmName: string;
  farmLoc?: string;
  farmHa?: number;
}

export interface SiloCreatePayload {
  name: string;
  grain: string;
  tons: number;
  acopio: string;
  storage: string;
}

export type SiloUpdatePayload = Partial<SiloCreatePayload>;

export interface PerfilUpdatePayload {
  name?: string;
  phone?: string;
  farmName?: string;
  farmLoc?: string;
  farmHa?: number;
}

const EMPTY_PROFILE: Profile = { name: "", email: "", phone: "", farmName: "", farmLoc: "", farmHa: 0 };

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

function mapProfile(r: PerfilResponse): Profile {
  return {
    name: r.name,
    email: r.email,
    phone: r.phone ?? "",
    farmName: r.farmName,
    farmLoc: r.farmLoc ?? "",
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
    lastSignalAt: r.lastReadingAt ?? null,
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

/** Recomendación de UI por grano. Ojo: el backend usa recomendados fijos (ver `RECOM` en seed.ts). */
function defaultThresholds(grain: string): SiloThresholds {
  const r = RECOM[grain as Grain] || RECOM.default;
  return {
    co2: { warn: r.co2.w, crit: r.co2.c },
    temp: { warn: r.temp.w, crit: r.temp.c },
    hum: { warn: r.hum.w, crit: r.hum.c },
  };
}

/** Preferencias que el backend sí persiste. `push` es local. */
const BACKEND_PREF_KEYS: (keyof NotificationSettings)[] = [
  "warning",
  "nightSilence",
  "nightStart",
  "nightEnd",
];

function toPrefs(n: NotificationSettings): PreferenciasResponse {
  return {
    advertencias: n.warning,
    silencioNocturno: n.nightSilence,
    silencioDesde: n.nightStart,
    silencioHasta: n.nightEnd,
  };
}

function fromPrefs(p: PreferenciasResponse, prev: NotificationSettings): NotificationSettings {
  return {
    ...prev,
    warning: p.advertencias,
    nightSilence: p.silencioNocturno,
    nightStart: p.silencioDesde ?? prev.nightStart,
    nightEnd: p.silencioHasta ?? prev.nightEnd,
  };
}

interface AppDataContextValue {
  silos: Silo[];
  lotes: Lote[];
  alerts: SiloAlert[];
  devices: Device[];
  notificationSettings: NotificationSettings;
  notification: string | null;
  profile: Profile;
  isAuthenticated: boolean;
  onboardingDone: boolean;
  loading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  changePassword: (current: string, next: string) => Promise<void>;

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
  updateNotificationSettings: (payload: Partial<NotificationSettings>) => void;

  thresholdsFor: (siloId: number) => SiloThresholds;
  recommendedFor: (grain: string) => SiloThresholds;
  setSiloThresholds: (siloId: number, thresholds: SiloThresholds) => Promise<void>;
  resetSiloThresholds: (siloId: number) => Promise<void>;
  applyThresholdsToOthers: (sourceSiloId: number, targetSiloIds: number[]) => Promise<void>;

  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [silos, setSilos] = useState<Silo[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [alerts, setAlerts] = useState<SiloAlert[]>([]);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [thresholds, setThresholds] = useState<Record<number, SiloThresholds>>({});
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(SEED_NOTIFICATIONS);
  const [devices] = useState<Device[]>(SEED_DEVICES);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    // Los cuatro de arriba son la sesión: si alguno falla, no hay app que mostrar.
    const [p, s, a, l] = await Promise.all([
      perfilApi.get(),
      siloApi.list(),
      alertaApi.list(),
      loteApi.list(),
    ]);
    const mappedSilos = s.map(mapSilo);
    setProfile(mapProfile(p));
    setSilos(mappedSilos);
    setAlerts(a.map(mapAlert));
    setLotes(l.map(mapLote));

    // Estos dos son secundarios: si fallan, se cae a los valores por defecto
    // en vez de tumbar la sesión entera.
    const [prefs, umbrales] = await Promise.all([
      perfilApi.getPreferencias().catch(() => null),
      Promise.all(
        mappedSilos.map((silo) =>
          umbralApi
            .get(silo.id)
            .then((r) => r.thresholds)
            .catch(() => defaultThresholds(silo.grain))
        )
      ),
    ]);
    if (prefs) setNotificationSettings((prev) => fromPrefs(prefs, prev));
    setThresholds(Object.fromEntries(mappedSilos.map((silo, i) => [silo.id, umbrales[i]])));
  };

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) {
        try {
          // Validamos el token contra la API antes de dar la sesión por buena:
          // puede estar vencido, o el servidor puede no responder.
          await loadAll();
          setIsAuthenticated(true);
          // Con sesión válida el onboarding ya se hizo; sin esto el gate de
          // `index.tsx` mandaría a /welcome a alguien que ya está logueado.
          setOnboardingDone(true);
        } catch {
          // 401 → apiFetch ya limpió el token. Error de red → conservamos el token
          // pero arrancamos en el login, nunca en un dashboard vacío.
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

  // A diferencia de main, acá el alta deja la sesión abierta: el onboarding del
  // rediseño sigue con /permisos → /vincular-lanza, que ya llama a la API.
  const register = async (payload: RegisterPayload) => {
    const result = await authApi.register(payload);
    await saveToken(result.token);
    setIsAuthenticated(true);
    await loadAll();
  };

  const logout = async () => {
    await clearToken();
    setIsAuthenticated(false);
    setOnboardingDone(false);
    setSilos([]);
    setLotes([]);
    setAlerts([]);
    setThresholds({});
    setProfile(EMPTY_PROFILE);
    setNotificationSettings(SEED_NOTIFICATIONS);
  };

  const completeOnboarding = () => setOnboardingDone(true);

  const changePassword = async (current: string, next: string) => {
    await perfilApi.cambiarPassword(current, next);
  };

  const addSilo = async (payload: SiloCreatePayload) => {
    // La lanza todavía no manda una lectura real (QR/WiFi son simulación), así que
    // el alta viaja con una lectura inicial plausible: el backend la persiste en la
    // misma transacción y POST /api/silos la exige.
    const created = await siloApi.create({
      ...payload,
      initialTemp: r1(22 + Math.random() * 3),
      initialHum: r1(12 + Math.random() * 2),
      initialCo2: Math.round(380 + Math.random() * 40),
    });
    setSilos((prev) => [...prev, mapSilo(created)]);
    const { thresholds: t } = await umbralApi
      .get(created.id)
      .catch(() => ({ thresholds: defaultThresholds(created.grain) }));
    setThresholds((prev) => ({ ...prev, [created.id]: t }));
  };

  const updateSilo = async (id: number, payload: SiloUpdatePayload) => {
    const current = silos.find((s) => s.id === id);
    if (!current) return;
    // El PUT reemplaza el silo entero y sus validaciones son NotEmpty, así que
    // completamos con lo que ya tenemos lo que la pantalla no haya tocado.
    const updated = await siloApi.update(id, {
      name: payload.name ?? current.name,
      grain: payload.grain ?? current.grain,
      tons: payload.tons ?? current.tons,
      acopio: payload.acopio ?? current.acopio,
      storage: payload.storage ?? current.storage,
    });
    setSilos((prev) => prev.map((s) => (s.id === id ? mapSilo(updated) : s)));
  };

  const deleteSilo = async (id: number) => {
    await siloApi.remove(id);
    setSilos((prev) => prev.filter((s) => s.id !== id));
    setAlerts((prev) => prev.filter((a) => a.siloId !== id));
    setThresholds((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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
    // Mismo caso que updateSilo: el PUT exige name y farmName sí o sí.
    const updated = await perfilApi.update({
      name: payload.name ?? profile.name,
      phone: payload.phone ?? profile.phone,
      farmName: payload.farmName ?? profile.farmName,
      farmLoc: payload.farmLoc ?? profile.farmLoc,
      farmHa: payload.farmHa ?? profile.farmHa,
    });
    setProfile(mapProfile(updated));
  };

  const updateNotificationSettings = (payload: Partial<NotificationSettings>) => {
    const next = { ...notificationSettings, ...payload };
    setNotificationSettings(next);
    // `push` no tiene backend: se queda en memoria.
    if (!BACKEND_PREF_KEYS.some((k) => k in payload)) return;
    perfilApi.updatePreferencias(toPrefs(next)).catch(() => {
      setNotificationSettings(notificationSettings);
      notify("No se pudo guardar la preferencia. Intentá de nuevo.");
    });
  };

  // Sync a propósito: se llama desde un initializer de useState en umbrales/[siloId].
  const thresholdsFor = (siloId: number): SiloThresholds => {
    if (thresholds[siloId]) return thresholds[siloId];
    return defaultThresholds(silos.find((s) => s.id === siloId)?.grain ?? "default");
  };

  const recommendedFor = (grain: string): SiloThresholds => defaultThresholds(grain);

  const setSiloThresholds = async (siloId: number, next: SiloThresholds) => {
    const saved = await umbralApi.save(siloId, next);
    setThresholds((prev) => ({ ...prev, [siloId]: saved }));
  };

  const resetSiloThresholds = async (siloId: number) => {
    await umbralApi.restore(siloId);
    const { thresholds: t } = await umbralApi.get(siloId);
    setThresholds((prev) => ({ ...prev, [siloId]: t }));
  };

  // No hay endpoint bulk: son N PUT. Con allSettled, que uno falle no cancela el resto.
  const applyThresholdsToOthers = async (sourceSiloId: number, targetSiloIds: number[]) => {
    const source = thresholds[sourceSiloId];
    if (!source) return;
    const results = await Promise.allSettled(
      targetSiloIds.map((id) => umbralApi.save(id, source))
    );
    const applied: Record<number, SiloThresholds> = {};
    results.forEach((r, i) => {
      if (r.status === "fulfilled") applied[targetSiloIds[i]] = r.value;
    });
    setThresholds((prev) => ({ ...prev, ...applied }));

    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed > 0) {
      notify(`No se pudieron actualizar ${failed} de ${targetSiloIds.length} silos.`);
    }
  };

  return (
    <AppDataContext.Provider
      value={{
        silos,
        lotes,
        alerts,
        devices,
        notificationSettings,
        notification,
        profile,
        isAuthenticated,
        onboardingDone,
        loading,
        login,
        register,
        logout,
        completeOnboarding,
        changePassword,
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
        updateNotificationSettings,
        thresholdsFor,
        recommendedFor,
        setSiloThresholds,
        resetSiloThresholds,
        applyThresholdsToOthers,
        refresh: loadAll,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
