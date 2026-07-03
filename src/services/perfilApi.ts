import { apiFetch } from "../config/api";
import { PerfilResponse } from "./types";

export interface PerfilUpdatePayload {
  name: string;
  phone?: string;
  farmName: string;
  farmLoc?: string;
  farmHa?: number;
}

export const perfilApi = {
  get: () => apiFetch<PerfilResponse>("/perfil"),

  update: (payload: PerfilUpdatePayload) =>
    apiFetch<PerfilResponse>("/perfil", { method: "PUT", body: JSON.stringify(payload) }),
};
