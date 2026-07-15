/**
 * AppDataContext — capa de datos 100% mock (sin backend).
 * Mantiene la misma forma de `useAppData()` que consumían las pantallas,
 * pero resuelve todo en memoria a partir de `src/mock/seed.ts`. Los métodos
 * async simulan latencia con `setTimeout` donde el prototipo original lo hacía.
 */
import React, { createContext, useContext, useMemo, useState } from "react";
import {
  SEED_SILOS,
  SEED_ALERTS,
  SEED_LOTES,
  SEED_PROFILE,
  SEED_DEVICES,
  SEED_NOTIFICATIONS,
  RECOM,
  RawSilo,
  RawAlert,
  RawLote,
  Device,
  NotificationSettings,
  Grain,
} from "../mock/seed";
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
  lastSignalAt: string;
  trend: number[];
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
  id: string;
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

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function genLoteId(): string {
  const y = new Date().getFullYear();
  const hex = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, "0");
  return `SG-${y}-${hex}`;
}

function estimateScore(status: RawSilo["status"]): number {
  return status === "critical"
    ? 52 + Math.round(Math.random() * 10)
    : status === "warn"
      ? 68 + Math.round(Math.random() * 10)
      : 86 + Math.round(Math.random() * 10);
}

function mapSilo(r: RawSilo): Silo {
  return {
    id: r.id,
    name: r.name,
    grain: r.grain,
    tons: r.tons,
    acopio: r.acopio,
    status: r.status,
    temp: r.temp,
    hum: r.hum,
    co2: r.co2,
    storage: r.storage,
    lastUpdate: formatRelativeTime(r.lastSignalAt),
    lastSignalAt: r.lastSignalAt,
    trend: r.trend,
  };
}

function mapAlert(r: RawAlert): SiloAlert {
  return {
    id: r.id,
    siloId: r.siloId,
    silo: r.silo,
    variant: r.variant,
    title: r.title,
    time: formatRelativeTime(r.createdAt),
    estimate: r.estimate,
    action: r.action,
    desc: r.desc,
    sensor: r.sensor,
    value: r.value,
    unit: r.unit,
    threshold: r.threshold,
    status: r.status,
    resolutionNote: r.resolutionNote,
    resolutionReason: r.resolutionReason,
  };
}

function mapLote(r: RawLote, siloName: string): Lote {
  return {
    id: r.id,
    siloId: r.siloId,
    siloName,
    name: r.name,
    grain: r.grain,
    tons: r.tons,
    start: r.start,
    end: r.end,
    days: r.days,
    status: r.status,
    score: r.score,
    alertsResolved: r.alertsResolved,
    avg: r.avg,
  };
}

function defaultThresholds(grain: string): SiloThresholds {
  const r = RECOM[grain as Grain] || RECOM.default;
  return {
    co2: { warn: r.co2.w, crit: r.co2.c },
    temp: { warn: r.temp.w, crit: r.temp.c },
    hum: { warn: r.hum.w, crit: r.hum.c },
  };
}

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
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

  iniciarLote: (siloId: number, name?: string) => Promise<void>;
  finalizarLote: (id: string) => Promise<void>;

  notify: (msg: string) => void;
  clearNotification: () => void;

  updateProfile: (payload: PerfilUpdatePayload) => Promise<void>;
  updateNotificationSettings: (payload: Partial<NotificationSettings>) => void;

  thresholdsFor: (siloId: number) => SiloThresholds;
  recommendedFor: (grain: string) => SiloThresholds;
  setSiloThresholds: (siloId: number, thresholds: SiloThresholds) => Promise<void>;
  resetSiloThresholds: (siloId: number) => void;
  applyThresholdsToOthers: (sourceSiloId: number, targetSiloIds: number[]) => Promise<void>;

  refresh: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [rawSilos, setRawSilos] = useState<RawSilo[]>(SEED_SILOS);
  const [rawAlerts, setRawAlerts] = useState<RawAlert[]>(SEED_ALERTS);
  const [rawLotes, setRawLotes] = useState<RawLote[]>(SEED_LOTES);
  const [devices, setDevices] = useState<Device[]>(SEED_DEVICES);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(SEED_NOTIFICATIONS);
  const [profile, setProfile] = useState<Profile>(SEED_PROFILE);
  const [notification, setNotification] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [loading] = useState(false);
  const [thresholds, setThresholds] = useState<Record<number, SiloThresholds>>(() => {
    const db: Record<number, SiloThresholds> = {};
    SEED_SILOS.forEach((s) => {
      db[s.id] = defaultThresholds(s.grain);
    });
    return db;
  });

  const silos = useMemo(() => rawSilos.map(mapSilo), [rawSilos]);
  const alerts = useMemo(() => rawAlerts.map(mapAlert), [rawAlerts]);
  const lotes = useMemo(() => {
    const siloById = new Map(rawSilos.map((s) => [s.id, s.name]));
    return rawLotes.map((l) => mapLote(l, siloById.get(l.siloId) ?? "Silo"));
  }, [rawLotes, rawSilos]);

  const login = async (_email: string, _password: string) => {
    await delay(null, 500);
    setIsAuthenticated(true);
  };

  const register = async (payload: RegisterPayload) => {
    await delay(null, 600);
    setProfile((prev) => ({
      ...prev,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? prev.phone,
      farmName: payload.farmName,
      farmLoc: payload.farmLoc ?? prev.farmLoc,
      farmHa: payload.farmHa ?? prev.farmHa,
    }));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await delay(null, 200);
    setIsAuthenticated(false);
  };

  const completeOnboarding = () => setOnboardingDone(true);

  const changePassword = async (_current: string, _next: string) => {
    await delay(null, 500);
  };

  const addSilo = async (payload: SiloCreatePayload) => {
    await delay(null, 500);
    setRawSilos((prev) => {
      const id = prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      const status: RawSilo["status"] = "ok";
      const next: RawSilo = {
        id,
        name: payload.name,
        grain: payload.grain as Grain,
        tons: payload.tons,
        acopio: payload.acopio,
        status,
        temp: 22,
        hum: 13,
        co2: 400,
        storage: payload.storage as RawSilo["storage"],
        lastSignalAt: new Date().toISOString(),
        trend: [22, 22, 22, 22, 22, 22, 22],
      };
      setThresholds((t) => ({ ...t, [id]: defaultThresholds(payload.grain) }));
      return [...prev, next];
    });
  };

  const updateSilo = async (id: number, payload: SiloUpdatePayload) => {
    await delay(null, 500);
    setRawSilos((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...(payload.name !== undefined ? { name: payload.name } : null),
              ...(payload.grain !== undefined ? { grain: payload.grain as Grain } : null),
              ...(payload.tons !== undefined ? { tons: payload.tons } : null),
              ...(payload.acopio !== undefined ? { acopio: payload.acopio } : null),
              ...(payload.storage !== undefined ? { storage: payload.storage as RawSilo["storage"] } : null),
            }
          : s
      )
    );
  };

  const deleteSilo = async (id: number) => {
    await delay(null, 400);
    setRawSilos((prev) => prev.filter((s) => s.id !== id));
    setRawAlerts((prev) => prev.filter((a) => a.siloId !== id));
  };

  const resolveAlert = async (id: number, note?: string, reason?: string) => {
    await delay(null, 400);
    setRawAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "resolved", variant: "resolved", resolutionNote: note, resolutionReason: reason }
          : a
      )
    );
  };

  const iniciarLote = async (siloId: number, name?: string) => {
    await delay(null, 500);
    const silo = rawSilos.find((s) => s.id === siloId);
    if (!silo) return;
    const lote: RawLote = {
      id: genLoteId(),
      siloId,
      name: name?.trim() || `Lote ${silo.grain} ${silo.name.replace(/^Silo\s*/i, "")}`.trim(),
      grain: silo.grain,
      tons: silo.tons,
      start: todayStr(),
      end: null,
      days: 0,
      status: "monitoring",
      score: estimateScore(silo.status),
      alertsResolved: 0,
      avg: { co2: silo.co2, temp: silo.temp, hum: silo.hum },
    };
    setRawLotes((prev) => [lote, ...prev]);
  };

  const finalizarLote = async (id: string) => {
    await delay(null, 500);
    setRawLotes((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: "finalized", end: todayStr() } : l))
    );
  };

  const notify = (msg: string) => setNotification(msg);
  const clearNotification = () => setNotification(null);

  const updateProfile = async (payload: PerfilUpdatePayload) => {
    await delay(null, 500);
    setProfile((prev) => ({
      ...prev,
      ...(payload.name !== undefined ? { name: payload.name } : null),
      ...(payload.phone !== undefined ? { phone: payload.phone } : null),
      ...(payload.farmName !== undefined ? { farmName: payload.farmName } : null),
      ...(payload.farmLoc !== undefined ? { farmLoc: payload.farmLoc } : null),
      ...(payload.farmHa !== undefined ? { farmHa: payload.farmHa } : null),
    }));
  };

  const updateNotificationSettings = (payload: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({ ...prev, ...payload }));
  };

  const thresholdsFor = (siloId: number): SiloThresholds => {
    if (thresholds[siloId]) return thresholds[siloId];
    const silo = rawSilos.find((s) => s.id === siloId);
    return defaultThresholds(silo?.grain ?? "default");
  };

  const recommendedFor = (grain: string): SiloThresholds => defaultThresholds(grain);

  const setSiloThresholds = async (siloId: number, next: SiloThresholds) => {
    await delay(null, 400);
    setThresholds((prev) => ({ ...prev, [siloId]: next }));
  };

  const resetSiloThresholds = (siloId: number) => {
    const silo = rawSilos.find((s) => s.id === siloId);
    if (!silo) return;
    setThresholds((prev) => ({ ...prev, [siloId]: defaultThresholds(silo.grain) }));
  };

  const applyThresholdsToOthers = async (sourceSiloId: number, targetSiloIds: number[]) => {
    await delay(null, 400);
    const source = thresholds[sourceSiloId];
    if (!source) return;
    setThresholds((prev) => {
      const next = { ...prev };
      targetSiloIds.forEach((id) => {
        next[id] = JSON.parse(JSON.stringify(source));
      });
      return next;
    });
  };

  const refresh = async () => {
    await delay(null, 300);
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
        refresh,
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
