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

// Las alertas críticas no son configurables: siempre se notifican.
export interface PreferenciasResponse {
  advertencias: boolean;
  silencioNocturno: boolean;
  silencioDesde?: string | null;
  silencioHasta?: string | null;
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

export interface LoteResponse {
  id: number;
  codigo: string;
  siloId: number;
  siloName: string;
  name: string;
  grain: string;
  tons: number;
  startAt: string;
  endAt?: string | null;
  days: number;
  status: "monitoring" | "finalized";
  score: number;
  alertsResolved: number;
  avgCo2: number;
  avgTemp: number;
  avgHum: number;
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
