import { useEffect, useState } from "react";

export type DeviceState = "ok" | "device-offline-recent" | "device-offline-prolonged";

// Cadencia normal de lectura de la lanza: por debajo de esto, todo bien.
const OK_MS = 10 * 60_000; // 10 min
// A partir de acá, sin respuesta hace rato — se pasa de "recent" a "prolonged".
const PROLONGED_MS = 30 * 60_000; // 30 min

/**
 * Estado de la lanza de un silo, derivado de `now - lastSignalAt`.
 */
export function useDeviceState(lastSignalAt: string | null | undefined) {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!lastSignalAt) {
    return { state: "ok" as DeviceState, minutesSinceSignal: 0 };
  }

  const elapsed = Date.now() - new Date(lastSignalAt).getTime();
  const minutesSinceSignal = Math.max(0, Math.round(elapsed / 60_000));

  if (elapsed < OK_MS) return { state: "ok" as DeviceState, minutesSinceSignal };
  if (elapsed < PROLONGED_MS) return { state: "device-offline-recent" as DeviceState, minutesSinceSignal };
  return { state: "device-offline-prolonged" as DeviceState, minutesSinceSignal };
}

export default useDeviceState;
