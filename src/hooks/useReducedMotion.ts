import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** Respeta la preferencia de accesibilidad "reducir movimiento" del SO. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((v) => mounted && setReduced(!!v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", (v: boolean) => setReduced(!!v));
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
}

export default useReducedMotion;
