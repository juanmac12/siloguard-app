import { useEffect, useState } from "react";

/**
 * Disponibilidad del técnico según el reloj real: Lun–Sáb 7:00–20:00.
 * Portado de `ctIsInHours` del handoff.
 */
export function useTechAvailability() {
  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => forceTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const day = now.getDay(); // 0 = domingo
  const hour = now.getHours();
  const inHours = day >= 1 && day <= 6 && hour >= 7 && hour < 20;

  return { inHours };
}

export default useTechAvailability;
