import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, FontSize, ThemeColors, Radius } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData, SiloAlert } from "../../contexts/AppDataContext";
import { AlertCard, Icon } from "../../components";

// Cada solapa se traduce a los query params ?status=&variant= que resuelve la API
// (rúbrica 3.4: consulta con 2 parámetros filtrada en el servidor, no en el cliente).
const TABS = [
  { id: "todas",        label: "Todas",        status: undefined,  variant: undefined },
  { id: "criticas",     label: "Críticas",     status: "active",   variant: "critical" },
  { id: "advertencias", label: "Advertencias", status: "active",   variant: "warning" },
  { id: "resueltas",    label: "Resueltas",    status: "resolved", variant: undefined },
] as const;

type TabId = typeof TABS[number]["id"];

export default function AlertasScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alerts, filterAlerts } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<TabId>("todas");
  const [filtered, setFiltered] = useState<SiloAlert[]>(alerts);

  // Al cambiar de solapa, el filtrado lo hace la API: GET /api/alertas?status=&variant=.
  // Si la consulta falla (p. ej. sin conexión), se mantiene la última lista conocida.
  useEffect(() => {
    const tab = TABS.find((t) => t.id === activeTab)!;
    let cancelled = false;
    filterAlerts(tab.status, tab.variant)
      .then((result) => { if (!cancelled) setFiltered(result); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [activeTab, alerts]);

  const counts = {
    todas:        alerts.length,
    criticas:     alerts.filter((a) => a.status === "active" && a.variant === "critical").length,
    advertencias: alerts.filter((a) => a.status === "active" && a.variant === "warning").length,
    resueltas:    alerts.filter((a) => a.status === "resolved").length,
  };

  const emptyTitle = activeTab === "todas" ? "Sin alertas" : activeTab === "criticas" ? "Sin alertas críticas" : activeTab === "advertencias" ? "Sin advertencias" : "Sin resueltas";
  const emptySub   = activeTab === "resueltas" ? "Aún no resolviste ninguna alerta." : "Todos los silos están en orden.";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertas</Text>
      </View>

      {/* Tab bar — borde separado para evitar superposición con el indicador */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = counts[tab.id];
            return (
              <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => setActiveTab(tab.id)}>
                <View style={styles.tabInner}>
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab.label}</Text>
                  {count > 0 && (
                    <View style={[styles.badge, { backgroundColor: isActive ? colors.actionPrimary : colors.surfaceCard, borderColor: isActive ? colors.actionPrimary : colors.borderDefault }]}>
                      <Text style={[styles.badgeText, { color: isActive ? colors.actionPrimaryText : colors.textSecondary }]}>
                        {count}
                      </Text>
                    </View>
                  )}
                </View>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={[styles.tabBorder, { backgroundColor: colors.borderDefault }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Icon name="check-circle" size={28} color={colors.statusOk} />
            </View>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptySubtitle}>{emptySub}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filtered.map((alerta) => (
              <AlertCard
                key={alerta.id}
                variant={alerta.variant}
                title={alerta.title}
                silo={alerta.silo}
                time={alerta.time}
                description={alerta.desc}
                onPress={alerta.status === "active" ? () => router.push(`/alerta/${alerta.id}` as any) : undefined}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md,
      backgroundColor: c.bg,
    },
    headerTitle: { color: c.textPrimary, fontSize: 26, fontWeight: "700", letterSpacing: -0.3 },

    tabScroll: { flexGrow: 0 },
    tabBorder: { height: 1 },
    tabContent: { paddingHorizontal: Spacing.md, flexDirection: "row" },
    tab: { marginRight: 20, paddingBottom: 10, paddingTop: 4, position: "relative" },
    tabInner: { flexDirection: "row", alignItems: "center", gap: 6 },
    tabText: { color: c.textSecondary, fontSize: FontSize.bodyMd, fontWeight: "500" },
    tabTextActive: { color: c.actionPrimary, fontWeight: "700" },
    tabIndicator: {
      position: "absolute", bottom: 0, left: 0, right: 0,
      height: 2, backgroundColor: c.actionPrimary, borderRadius: 2,
    },
    badge: {
      minWidth: 18, height: 18, borderRadius: 9,
      paddingHorizontal: 5, borderWidth: 1,
      alignItems: "center", justifyContent: "center",
    },
    badgeText: { fontSize: 11, fontWeight: "700", lineHeight: 14 },

    scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: 40 },
    list: { gap: 8 },

    emptyContainer: { alignItems: "center", paddingTop: 80 },
    emptyIcon: {
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: c.statusOkTint, borderWidth: 1.5, borderColor: c.statusOk,
      alignItems: "center", justifyContent: "center", marginBottom: Spacing.md,
    },
    emptyTitle: { color: c.textPrimary, fontSize: 20, fontWeight: "700", marginBottom: Spacing.sm },
    emptySubtitle: { color: c.textSecondary, fontSize: FontSize.bodyMd, textAlign: "center", lineHeight: 22 },
  });
