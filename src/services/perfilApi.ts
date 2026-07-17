import { apiFetch } from "../config/api";
import { PerfilResponse, PreferenciasResponse } from "./types";

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

  cambiarPassword: (currentPassword: string, newPassword: string) =>
    apiFetch<void>("/perfil/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getPreferencias: () => apiFetch<PreferenciasResponse>("/perfil/notificaciones"),

  // El PUT reemplaza las 4 preferencias, así que hay que mandarlas completas.
  updatePreferencias: (payload: PreferenciasResponse) =>
    apiFetch<PreferenciasResponse>("/perfil/notificaciones", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
