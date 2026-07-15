import { useMemo, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Spacing, FontSize, ThemeColors, Radius, FontWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { ListItem, Icon, OfflineBanner } from "../../components";

// TODO: reemplazar por detección real de conectividad (ej. @react-native-community/netinfo).
// Por ahora el banner queda listo en UI pero oculto (isOffline siempre false).
const MOCK_IS_OFFLINE = false;

const FARM_NAME = "Estancia La Esperanza";

function getMostCriticalReading(s: { temp: number; hum: number; co2: number }): { value: string; unit: string } {
  const sensors = [
    { value: String(s.temp), unit: "°C",  score: s.temp > 35 ? 2 : s.temp > 28 ? 1 : 0, pri: 3 },
    { value: String(s.hum),  unit: "%",   score: s.hum  > 20 ? 2 : s.hum  > 16 ? 1 : 0, pri: 2 },
    { value: String(s.co2),  unit: "ppm", score: s.co2  > 800 ? 2 : s.co2 > 600 ? 1 : 0, pri: 1 },
  ];
  return sensors.sort((a, b) => b.score - a.score || b.pri - a.pri)[0];
}

function StatChip({
  label,
  value,
  valueColor,
  styles,
}: {
  label: string;
  value: string | number;
  valueColor: string;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.chip}>
      <Text style={[styles.chipValue, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos, alerts, notification, clearNotification } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "del" } | null>(null);

  // Se ejecuta cada vez que el dashboard entra en foco (incluyendo cuando se navega desde agregar/editar silo)
  useFocusEffect(
    useCallback(() => {
      if (!notification) return;
      const isDelete = notification.toLowerCase().includes("eliminad");
      setToast({ msg: notification, type: isDelete ? "del" : "ok" });
      clearNotification();
    }, [notification])
  );

  // Auto-descarta el toast después de 2.5s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast?.msg]);

  const active = alerts.filter((a) => a.status === "active");
  const hasCritical = active.some((a) => a.variant === "critical");
  const estadoLabel = hasCritical ? "Crítico" : active.length > 0 ? "Revisar" : "Óptimo";
  const estadoColor = hasCritical
    ? colors.statusCritical
    : active.length > 0
    ? colors.statusWarn
    : colors.statusOk;

  return (
    <View style={styles.container}>
      <OfflineBanner offline={MOCK_IS_OFFLINE} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.farmName}>{FARM_NAME}</Text>
          <Text style={styles.title}>Mis silos</Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/alertas")}
          style={styles.bellBtn}
        >
          <Icon name="bell" size={20} color={colors.textPrimary} />
          {active.length > 0 && <View style={styles.bellDot} />}
        </Pressable>
      </View>

      {/* Stat chips */}
      <View style={styles.statsRow}>
        <StatChip label="Silos"   value={silos.length}    valueColor={colors.textPrimary} styles={styles} />
        <StatChip label="Alertas" value={active.length}   valueColor={active.length ? colors.statusCritical : colors.statusOk} styles={styles} />
        <StatChip label="Estado"  value={estadoLabel}     valueColor={estadoColor} styles={styles} />
      </View>

      {/* Weekly summary banner */}
      <TouchableOpacity style={styles.weeklyBanner} activeOpacity={0.7}>
        <Icon name="clipboard" size={16} color={colors.actionPrimary} />
        <Text style={styles.weeklyText}>Resumen semanal disponible</Text>
        <Icon name="chevron-right" size={16} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Alert banner */}
      {active.length > 0 && (
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/alertas")}
          style={[
            styles.alertBanner,
            {
              backgroundColor: hasCritical
                ? "rgba(239,68,68,0.07)"
                : "rgba(234,179,8,0.07)",
              borderColor: hasCritical ? colors.statusCritical : colors.statusWarn,
            },
          ]}
          activeOpacity={0.7}
        >
          <Icon
            name="alert-triangle"
            size={16}
            color={hasCritical ? colors.statusCritical : colors.statusWarn}
          />
          <Text style={styles.alertBannerText}>
            {active.length} {active.length === 1 ? "alerta activa" : "alertas activas"} — toca para ver
          </Text>
          <Icon name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      )}

      {/* Toast notification */}
      {toast && (
        <View style={[styles.toast, { backgroundColor: toast.type === "ok" ? colors.statusOkTint : "rgba(107,114,128,0.15)", borderColor: toast.type === "ok" ? colors.statusOk : colors.borderDefault }]}>
          <Icon name={toast.type === "ok" ? "check-circle" : "trash"} size={16} color={toast.type === "ok" ? colors.statusOk : colors.textSecondary} />
          <Text style={[styles.toastText, { color: toast.type === "ok" ? colors.statusOk : colors.textSecondary }]}>{toast.msg}</Text>
        </View>
      )}

      {/* Silo list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>TUS SILOS</Text>
        <View style={styles.siloList}>
          {silos.map((silo) => {
            const reading = getMostCriticalReading(silo);
            return (
              <ListItem
                key={silo.id}
                tone={silo.status}
                title={silo.name}
                subtitle={`${silo.grain} · ${silo.tons} t · ${silo.lastUpdate}`}
                value={reading.value}
                valueUnit={reading.unit}
                onPress={() => router.push(`/silo/${silo.id}` as any)}
              />
            );
          })}
        </View>

        {/* FAB — siempre debajo del último silo, alineado a la derecha */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => router.push("/agregar-silo" as any)}
        >
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: Spacing.md,
      paddingTop: 56,
      paddingBottom: 10,
    },
    farmName: {
      color: c.textSecondary,
      fontSize: FontSize.bodySm,
      fontWeight: FontWeight.medium as any,
      marginBottom: 3,
      letterSpacing: 0.2,
    },
    title: {
      color: c.textPrimary,
      fontSize: 26,
      fontWeight: "700",
      letterSpacing: -0.3,
    },
    bellBtn: {
      width: 40,
      height: 40,
      borderRadius: Radius.md,
      backgroundColor: c.surfaceCard,
      borderWidth: 1,
      borderColor: c.borderDefault,
      alignItems: "center",
      justifyContent: "center",
    },
    bellDot: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.statusCritical,
      borderWidth: 2,
      borderColor: c.bg,
    },

    statsRow: {
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: Spacing.md,
      paddingBottom: 12,
    },
    chip: {
      flex: 1,
      backgroundColor: c.surfaceCard,
      borderWidth: 1,
      borderColor: c.borderDefault,
      borderRadius: Radius.md,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    chipValue: {
      fontSize: FontSize.headingMd,
      fontWeight: "700",
      letterSpacing: -0.3,
      lineHeight: 28,
    },
    chipLabel: {
      color: c.textSecondary,
      fontSize: 10,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginTop: 4,
    },

    weeklyBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: Spacing.md,
      marginBottom: 8,
      paddingHorizontal: 14,
      paddingVertical: 11,
      backgroundColor: "rgba(34,197,94,0.08)",
      borderWidth: 1,
      borderColor: "rgba(34,197,94,0.2)",
      borderRadius: Radius.lg,
    },
    weeklyText: {
      flex: 1,
      color: c.textPrimary,
      fontSize: FontSize.bodySm + 1,
      fontWeight: FontWeight.medium as any,
    },

    alertBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: Spacing.md,
      marginBottom: 12,
      paddingHorizontal: 14,
      paddingVertical: 11,
      borderWidth: 1,
      borderRadius: Radius.lg,
    },
    alertBannerText: {
      flex: 1,
      color: c.textPrimary,
      fontSize: FontSize.bodySm + 1,
      fontWeight: FontWeight.medium as any,
    },

    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: Spacing.md,
      paddingBottom: 32,
    },
    sectionLabel: {
      color: c.textSecondary,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.6,
      textTransform: "uppercase",
      marginBottom: 8,
    },
    siloList: { gap: 8 },

    toast: {
      flexDirection: "row", alignItems: "center", gap: 8,
      marginHorizontal: Spacing.md, marginBottom: 8,
      paddingHorizontal: 14, paddingVertical: 10,
      borderRadius: Radius.md, borderWidth: 1,
    },
    toastText: { flex: 1, fontSize: 13, fontWeight: "600" },

    fab: {
      alignSelf: "flex-end",
      marginTop: 16,
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.actionPrimary,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: c.actionPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    fabPlus: {
      color: c.actionPrimaryText,
      fontSize: 28,
      fontWeight: "300",
      lineHeight: 32,
      marginTop: -2,
    },
  });
