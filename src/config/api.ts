import { router } from "expo-router";
import { clearToken, getToken } from "../services/tokenStorage";

// IP LAN de la compu que corre el backend (dotnet run --project backend/src/SiloGuard.Api
// --urls "http://0.0.0.0:5210"). Si cambia de red/IP, actualizar acá.
export const API_BASE_URL = "http://192.168.0.9:5210/api";

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(statusCode: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean; // default true
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = await getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders });
  } catch {
    // fetch tira TypeError cuando ni siquiera llega al servidor (backend apagado,
    // IP de LAN cambiada, celular en otra red). Sin esto, las pantallas muestran
    // un mensaje genérico que no dice cuál es el problema real.
    throw new ApiError(
      0,
      "No se pudo conectar al servidor. Verificá que el backend esté corriendo y que el dispositivo esté en la misma red Wi-Fi."
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      await clearToken();
      router.replace("/login");
    }
    const message = body?.message ?? "Ocurrió un error. Intentá de nuevo.";
    throw new ApiError(response.status, message, body?.errors);
  }

  return body as T;
}
