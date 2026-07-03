import { apiFetch } from "../config/api";
import { AuthResult } from "./types";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  farmName: string;
  farmLoc?: string;
  farmHa?: number;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiFetch<AuthResult>("/auth/register", { method: "POST", body: JSON.stringify(payload), auth: false }),

  login: (email: string, password: string) =>
    apiFetch<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      auth: false,
    }),
};
