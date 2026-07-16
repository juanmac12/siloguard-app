/**
 * Lo que todavía no tiene backend.
 *
 * Silos, alertas, lotes y perfil salían de acá cuando el rediseño era un
 * prototipo; hoy vienen de la API (ver `src/contexts/AppDataContext.tsx`).
 * Queda solo esto:
 *
 * - `SEED_DEVICES` (las lanzas): no existe entidad de dispositivo en el
 *   backend, así que Dispositivos y Vincular lanza siguen siendo una demo.
 * - `RECOM`: recomendación de umbrales por grano, para la UI. El backend
 *   también tiene recomendados, pero fijos (temp 28/35, hum 16/20, co2
 *   600/800), no por grano — así que los valores que sugiere esta pantalla y
 *   los que aplica un "restaurar recomendados" del servidor pueden no coincidir.
 * - `SEED_NOTIFICATIONS`: valores iniciales hasta que responde
 *   GET /api/perfil/notificaciones. De los 7 campos el backend persiste 4;
 *   `push` y `weeklySummary` viven solo en memoria, y las críticas no se
 *   configuran (siempre se notifican).
 */

export type Grain = "Soja" | "Maíz" | "Trigo" | "Girasol";

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

/** Lanza #3 arranca sin batería y sin señal a propósito: muestra el estado offline. */
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

export const RECOM: Record<Grain | "default", { co2: { w: number; c: number }; temp: { w: number; c: number }; hum: { w: number; c: number } }> = {
  Soja: { co2: { w: 500, c: 800 }, temp: { w: 25.0, c: 30.0 }, hum: { w: 14.0, c: 16.0 } },
  Maíz: { co2: { w: 500, c: 800 }, temp: { w: 28.0, c: 35.0 }, hum: { w: 14.5, c: 16.0 } },
  Trigo: { co2: { w: 450, c: 700 }, temp: { w: 22.0, c: 28.0 }, hum: { w: 13.0, c: 15.0 } },
  Girasol: { co2: { w: 500, c: 800 }, temp: { w: 25.0, c: 32.0 }, hum: { w: 10.0, c: 12.0 } },
  default: { co2: { w: 500, c: 800 }, temp: { w: 25.0, c: 35.0 }, hum: { w: 14.0, c: 16.0 } },
};
