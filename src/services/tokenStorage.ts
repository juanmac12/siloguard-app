import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "siloguard_token";

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // si el Keychain no tiene la clave o falla al borrar, igual queremos
    // seguir adelante con el logout en memoria — nunca dejar al usuario
    // trabado en una sesión que visualmente ya cerró.
  }
}
