import { useEffect, useRef, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useToast } from "../components/Toast";

export type ConnState = "online" | "offline-recent" | "offline-prolonged";

const PROLONGED_MS = 60 * 60_000; // 1 h

/**
 * Estado de conexión del celular. Sostiene el timestamp en que se perdió
 * la red para distinguir "recién caída" de "prolongada" (>= 1 h), y dispara
 * un toast al reconectar.
 */
export function useConnState() {
  const [isOnline, setIsOnline] = useState(true);
  const [since, setSince] = useState<number | null>(null);
  const [, setTick] = useState(0);
  const wasOffline = useRef(false);
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = !!state.isConnected && state.isInternetReachable !== false;
      setIsOnline((prev) => {
        if (!online && prev) setSince(Date.now());
        if (online && !prev) setSince(null);
        return online;
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOnline && wasOffline.current) {
      toast.addToast({ title: "Conexión restablecida", tone: "ok" });
    }
    wasOffline.current = !isOnline;
  }, [isOnline, toast]);

  useEffect(() => {
    if (isOnline) return;
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [isOnline]);

  if (isOnline) {
    return { state: "online" as ConnState, minutesOffline: 0 };
  }

  const elapsed = since ? Date.now() - since : 0;
  const state: ConnState = elapsed >= PROLONGED_MS ? "offline-prolonged" : "offline-recent";
  return { state, minutesOffline: Math.max(1, Math.round(elapsed / 60_000)) };
}

export default useConnState;
