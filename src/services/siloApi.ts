import { apiFetch } from "../config/api";
import { LecturaResponse, PagedResponse, SiloResponse } from "./types";

export interface SiloCreatePayload {
  name: string;
  grain: string;
  tons: number;
  acopio: string;
  storage: string;
  initialTemp: number;
  initialHum: number;
  initialCo2: number;
}

export interface SiloUpdatePayload {
  name: string;
  grain: string;
  tons: number;
  acopio: string;
  storage: string;
}

export const siloApi = {
  list: () => apiFetch<SiloResponse[]>("/silos"),

  getById: (id: number) => apiFetch<SiloResponse>(`/silos/${id}`),

  create: (payload: SiloCreatePayload) =>
    apiFetch<SiloResponse>("/silos", { method: "POST", body: JSON.stringify(payload) }),

  update: (id: number, payload: SiloUpdatePayload) =>
    apiFetch<SiloResponse>(`/silos/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  remove: (id: number) => apiFetch<void>(`/silos/${id}`, { method: "DELETE" }),

  getLecturas: (id: number, range: "24h" | "48h" | "7d", page = 1, pageSize = 50) =>
    apiFetch<PagedResponse<LecturaResponse>>(
      `/silos/${id}/lecturas?range=${range}&page=${page}&pageSize=${pageSize}`
    ),
};
