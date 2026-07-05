import { apiFetch } from "../config/api";
import { LoteResponse } from "./types";

export const loteApi = {
  list: () => apiFetch<LoteResponse[]>("/lotes"),

  getById: (id: number) => apiFetch<LoteResponse>(`/lotes/${id}`),

  // Inicia un lote en el silo (POST sin body). 409 si el silo ya tiene uno en monitoreo.
  iniciar: (siloId: number) =>
    apiFetch<LoteResponse>(`/silos/${siloId}/lotes`, { method: "POST" }),

  // Finaliza el lote: el backend computa el pasaporte (score + promedios) sobre las lecturas.
  finalizar: (id: number) =>
    apiFetch<LoteResponse>(`/lotes/${id}/finalizar`, { method: "POST" }),
};
