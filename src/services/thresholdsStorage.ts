/**
 * Persistencia LOCAL de umbrales por silo (SecureStore, clave "sg_thresholds_v1").
 * TODO: reemplazar por un endpoint real (ej. PUT /api/silos/{id}/umbrales) cuando
 * el backend soporte umbrales configurables por usuario/silo.
 */
import * as SecureStore from "expo-secure-store";

const KEY = "sg_thresholds_v1";

export interface MetricThreshold {
  warn: number;
  crit: number;
}

export interface SiloThresholds {
  co2: MetricThreshold;
  temp: MetricThreshold;
  hum: MetricThreshold;
}

type ThresholdsMap = Record<number, SiloThresholds>;

export async function loadThresholds(): Promise<ThresholdsMap> {
  try {
    const raw = await SecureStore.getItemAsync(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveThresholdsForSilo(siloId: number, thresholds: SiloThresholds): Promise<void> {
  const all = await loadThresholds();
  all[siloId] = thresholds;
  await SecureStore.setItemAsync(KEY, JSON.stringify(all));
}
