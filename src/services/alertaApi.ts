import { apiFetch } from "../config/api";
import { AlertaResponse } from "./types";

export const alertaApi = {
  list: (status?: string, variant?: string) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (variant) params.set("variant", variant);
    const qs = params.toString();
    return apiFetch<AlertaResponse[]>(`/alertas${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => apiFetch<AlertaResponse>(`/alertas/${id}`),

  resolver: (id: number, resolutionNote?: string, resolutionReason?: string) =>
    apiFetch<AlertaResponse>(`/alertas/${id}/resolver`, {
      method: "PATCH",
      body: JSON.stringify({ resolutionNote, resolutionReason }),
    }),
};
