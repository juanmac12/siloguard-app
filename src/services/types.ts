// Espejo de los DTOs de respuesta del backend (SiloGuard.Api/DTOs/*).

export interface AuthResult {
  token: string;
  userId: number;
  name: string;
  email: string;
}

export interface PerfilResponse {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  farmName: string;
  farmLoc?: string | null;
  farmHa?: number | null;
}

export interface SiloResponse {
  id: number;
  name: string;
  grain: string;
  tons: number;
  acopio: string;
  storage: string;
  status: "ok" | "warn" | "critical";
  lastCo2: number;
  lastTemp: number;
  lastHum: number;
  lastReadingAt?: string | null;
}

export interface LecturaResponse {
  timestamp: string;
  co2: number;
  temp: number;
  hum: number;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface AlertaResponse {
  id: number;
  siloId: number;
  siloName: string;
  sensor: "temp" | "humidity" | "co2";
  value: string;
  unit: string;
  threshold: string;
  variant: "critical" | "warning" | "resolved";
  title: string;
  description: string;
  estimate?: string | null;
  action?: string | null;
  status: "active" | "resolved";
  resolutionNote?: string | null;
  resolutionReason?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}
