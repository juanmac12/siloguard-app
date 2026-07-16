/**
 * Umbrales de alerta por silo, contra la API real:
 *   GET    /api/silos/{id}/umbrales  → umbrales efectivos (custom o recomendados)
 *   PUT    /api/silos/{id}/umbrales  → reemplaza los 3 umbrales (transaccional)
 *   DELETE /api/silos/{id}/umbrales  → restaura los valores recomendados
 * Reemplaza a la persistencia local por SecureStore (thresholdsStorage).
 */
import { apiFetch } from "../config/api";

export interface MetricThreshold {
  warn: number;
  crit: number;
}

export interface SiloThresholds {
  co2: MetricThreshold;
  temp: MetricThreshold;
  hum: MetricThreshold;
}

interface UmbralItemDto {
  variable: "temp" | "hum" | "co2";
  warn: number;
  crit: number;
}

interface UmbralesResponseDto {
  siloId: number;
  isCustom: boolean;
  items: UmbralItemDto[];
}

function toThresholds(dto: UmbralesResponseDto): SiloThresholds {
  const find = (v: UmbralItemDto["variable"]) => dto.items.find((i) => i.variable === v);
  return {
    temp: { warn: find("temp")?.warn ?? 28, crit: find("temp")?.crit ?? 35 },
    hum: { warn: find("hum")?.warn ?? 16, crit: find("hum")?.crit ?? 20 },
    co2: { warn: find("co2")?.warn ?? 600, crit: find("co2")?.crit ?? 800 },
  };
}

export const umbralApi = {
  get: async (siloId: number): Promise<{ thresholds: SiloThresholds; isCustom: boolean }> => {
    const dto = await apiFetch<UmbralesResponseDto>(`/silos/${siloId}/umbrales`);
    return { thresholds: toThresholds(dto), isCustom: dto.isCustom };
  },

  save: async (siloId: number, t: SiloThresholds): Promise<SiloThresholds> => {
    const dto = await apiFetch<UmbralesResponseDto>(`/silos/${siloId}/umbrales`, {
      method: "PUT",
      body: JSON.stringify({
        items: (["temp", "hum", "co2"] as const).map((variable) => ({
          variable,
          warn: t[variable].warn,
          crit: t[variable].crit,
        })),
      }),
    });
    return toThresholds(dto);
  },

  restore: (siloId: number) =>
    apiFetch<void>(`/silos/${siloId}/umbrales`, { method: "DELETE" }),
};
