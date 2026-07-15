/**
 * SiloGuard — datos semilla del prototipo mock.
 * Traducidos desde design_refs/screens/mock-data.js y pasaporte-screens.jsx,
 * con los tipos de la app (Silo, SiloAlert, Lote, Profile, Device).
 *
 * Silo Sur (id 2) lleva `lastSignalAt` viejo a propósito: demuestra el estado
 * "lanza sin respuesta" (useDeviceState) apenas se abre el prototipo.
 */

export type Grain = "Soja" | "Maíz" | "Trigo" | "Girasol";

export interface RawSilo {
  id: number;
  name: string;
  grain: Grain;
  tons: number;
  acopio: string;
  status: "ok" | "warn" | "critical";
  temp: number;
  hum: number;
  co2: number;
  storage: "Silo fijo" | "Silobolsa";
  lastSignalAt: string;
}

export interface RawAlert {
  id: number;
  siloId: number;
  silo: string;
  variant: "critical" | "warning" | "resolved";
  title: string;
  createdAt: string;
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

export interface RawLote {
  id: string;
  siloId: number;
  name: string;
  grain: Grain;
  tons: number;
  start: string;
  end: string | null;
  days: number;
  status: "monitoring" | "finalized";
  score: number;
  alertsResolved: number;
  avg: { co2: number; temp: number; hum: number };
}

export interface Device {
  id: number;
  name: string;
  siloId: number | null;
  status: "online" | "offline";
  battery: number;
  lastSync: string;
}

export interface NotificationSettings {
  push: boolean;
  critical: boolean;
  warning: boolean;
  weeklySummary: boolean;
  nightSilence: boolean;
  nightStart: string;
  nightEnd: string;
}

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export const SEED_SILOS: RawSilo[] = [
  { id: 1, name: "Silo Norte", grain: "Soja", tons: 180, acopio: "15 mar 2024", status: "ok", temp: 22.1, hum: 13.8, co2: 420, storage: "Silo fijo", lastSignalAt: minutesAgo(5) },
  { id: 2, name: "Silo Sur", grain: "Maíz", tons: 240, acopio: "20 ene 2024", status: "critical", temp: 42.3, hum: 15.1, co2: 890, storage: "Silo fijo", lastSignalAt: minutesAgo(52) },
  { id: 3, name: "Silo Este", grain: "Trigo", tons: 95, acopio: "08 feb 2024", status: "warn", temp: 28.4, hum: 18.2, co2: 550, storage: "Silobolsa", lastSignalAt: minutesAgo(8) },
  { id: 4, name: "Silo Oeste", grain: "Soja", tons: 210, acopio: "01 abr 2024", status: "ok", temp: 21.8, hum: 13.2, co2: 390, storage: "Silo fijo", lastSignalAt: minutesAgo(3) },
  { id: 5, name: "Silo 5", grain: "Girasol", tons: 120, acopio: "10 mar 2024", status: "ok", temp: 23.0, hum: 12.9, co2: 410, storage: "Silo fijo", lastSignalAt: minutesAgo(15) },
  { id: 6, name: "Silo 6", grain: "Maíz", tons: 155, acopio: "22 feb 2024", status: "warn", temp: 30.1, hum: 16.8, co2: 620, storage: "Silobolsa", lastSignalAt: minutesAgo(20) },
];

export const SEED_ALERTS: RawAlert[] = [
  {
    id: 1, siloId: 2, silo: "Silo Sur", variant: "critical", title: "Temperatura crítica",
    createdAt: minutesAgo(120), estimate: "Crítico en 24 h", action: "Inspección presencial",
    desc: "La temperatura superó el umbral crítico de 35 °C. Riesgo de desarrollo de hongos y pérdida de calidad del grano.",
    sensor: "temp", value: "42.3", unit: "°C", threshold: "35°C", status: "active",
  },
  {
    id: 2, siloId: 3, silo: "Silo Este", variant: "warning", title: "Humedad elevada",
    createdAt: minutesAgo(300), estimate: "Revisar en 48 h", action: "Encender aireación",
    desc: "La humedad relativa superó el umbral recomendado. Posible condensación y riesgo de hongos a corto plazo.",
    sensor: "humidity", value: "18.2", unit: "%", threshold: "14%", status: "active",
  },
  {
    id: 3, siloId: 6, silo: "Silo 6", variant: "warning", title: "CO₂ elevado",
    createdAt: minutesAgo(60 * 20), action: "Ventilación recomendada",
    desc: "Niveles de CO₂ levemente por encima del umbral. Monitorear en las próximas horas.",
    sensor: "co2", value: "620", unit: "ppm", threshold: "600 ppm", status: "active",
  },
  {
    id: 4, siloId: 1, silo: "Silo Norte", variant: "resolved", title: "Temperatura elevada",
    createdAt: minutesAgo(60 * 24 * 3), action: "Encender aireación",
    desc: "Temperatura levemente elevada. Resuelta mediante aireación.",
    sensor: "temp", value: "31.0", unit: "°C", status: "resolved",
    resolutionNote: "Activé la aireación por 3 horas.",
  },
  {
    id: 5, siloId: 4, silo: "Silo Oeste", variant: "resolved", title: "Humedad elevada",
    createdAt: minutesAgo(60 * 24 * 6), action: "Encender aireación",
    desc: "Humedad levemente elevada. Resuelta por ventilación.",
    sensor: "humidity", value: "15.8", unit: "%", status: "resolved",
    resolutionNote: "Aireé el silo. Bajó a 13.2 %.",
  },
];

export const SEED_LOTES: RawLote[] = [
  { id: "SG-2024-A1F3", siloId: 1, name: "Lote Soja Norte 01", grain: "Soja", tons: 180, start: "01 mar 2024", end: null, days: 44, status: "monitoring", score: 92, alertsResolved: 1, avg: { co2: 412, temp: 21.8, hum: 13.4 } },
  { id: "SG-2024-B7C2", siloId: 2, name: "Lote Maíz Sur 03", grain: "Maíz", tons: 240, start: "05 feb 2024", end: null, days: 127, status: "monitoring", score: 58, alertsResolved: 3, avg: { co2: 702, temp: 29.1, hum: 15.9 } },
  { id: "SG-2024-D4E8", siloId: 3, name: "Lote Trigo Este", grain: "Trigo", tons: 95, start: "22 ene 2024", end: null, days: 141, status: "monitoring", score: 76, alertsResolved: 2, avg: { co2: 548, temp: 26.4, hum: 15.2 } },
  { id: "SG-2024-F9A5", siloId: 4, name: "Lote Soja Oeste", grain: "Soja", tons: 210, start: "12 mar 2024", end: null, days: 105, status: "monitoring", score: 88, alertsResolved: 0, avg: { co2: 398, temp: 22.0, hum: 13.1 } },
  { id: "SG-2024-C1B6", siloId: 6, name: "Lote Maíz 06", grain: "Maíz", tons: 155, start: "20 mar 2024", end: null, days: 97, status: "monitoring", score: 83, alertsResolved: 1, avg: { co2: 428, temp: 22.4, hum: 13.7 } },
  { id: "SG-2023-9B4C", siloId: 5, name: "Lote Girasol 2023", grain: "Girasol", tons: 120, start: "08 nov 2023", end: "22 feb 2024", days: 106, status: "finalized", score: 81, alertsResolved: 2, avg: { co2: 462, temp: 22.9, hum: 14.3 } },
  { id: "SG-2023-3E7D", siloId: 2, name: "Lote Maíz Temporada", grain: "Maíz", tons: 265, start: "15 oct 2023", end: "30 ene 2024", days: 107, status: "finalized", score: 79, alertsResolved: 4, avg: { co2: 534, temp: 24.6, hum: 15.0 } },
  { id: "SG-2023-7F2A", siloId: 3, name: "Lote Trigo 2023", grain: "Trigo", tons: 170, start: "02 sep 2023", end: "18 dic 2023", days: 107, status: "finalized", score: 87, alertsResolved: 1, avg: { co2: 471, temp: 23.1, hum: 14.2 } },
];

export const SEED_PROFILE = {
  name: "Lucas Escobar",
  email: "lucas.escobar@gmail.com",
  phone: "+54 9 341 555-0123",
  farmName: "Estancia La Esperanza",
  farmLoc: "Pergamino, Buenos Aires",
  farmHa: 320,
};

export const SEED_DEVICES: Device[] = [
  { id: 1, name: "Lanza #1", siloId: 1, status: "online", battery: 87, lastSync: minutesAgo(5) },
  { id: 2, name: "Lanza #2", siloId: 2, status: "online", battery: 64, lastSync: minutesAgo(52) },
  { id: 3, name: "Lanza #3", siloId: 3, status: "offline", battery: 12, lastSync: minutesAgo(60 * 24 * 3) },
];

export const SEED_NOTIFICATIONS: NotificationSettings = {
  push: true,
  critical: true,
  warning: true,
  weeklySummary: true,
  nightSilence: false,
  nightStart: "22:00",
  nightEnd: "07:00",
};

/** Umbrales recomendados por grano — pantalla Umbrales (dura, sin backend). */
export const RECOM: Record<Grain | "default", { co2: { w: number; c: number }; temp: { w: number; c: number }; hum: { w: number; c: number } }> = {
  Soja: { co2: { w: 500, c: 800 }, temp: { w: 25.0, c: 30.0 }, hum: { w: 14.0, c: 16.0 } },
  Maíz: { co2: { w: 500, c: 800 }, temp: { w: 28.0, c: 35.0 }, hum: { w: 14.5, c: 16.0 } },
  Trigo: { co2: { w: 450, c: 700 }, temp: { w: 22.0, c: 28.0 }, hum: { w: 13.0, c: 15.0 } },
  Girasol: { co2: { w: 500, c: 800 }, temp: { w: 25.0, c: 32.0 }, hum: { w: 10.0, c: 12.0 } },
  default: { co2: { w: 500, c: 800 }, temp: { w: 25.0, c: 35.0 }, hum: { w: 14.0, c: 16.0 } },
};
