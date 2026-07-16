import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, ThemeColors, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData, SiloAlert } from "../../contexts/AppDataContext";
import { AlertCard, EmptyState, Tabs, TabItem } from "../../components";

const TABS: TabItem[] = [
  { id: "todas", label: "Todas" },
  { id: "criticas", label: "Críticas" },
  { id: "advertencias", label: "Advertencias" },
  { id: "resueltas", label: "Resueltas" },
];

type TabId = "todas" | "criticas" | "advertencias" | "resueltas";

/** Cada tab es un query a la API, no un filtro en memoria. */
const TAB_QUERY: Record<TabId, { status?: string; variant?: string }> = {
  todas: {},
  criticas: { status: "active", variant: "critical" },
  advertencias: { status: "active", variant: "warning" },
  resueltas: { status: "resolved" },
};

export default function AlertasScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alerts, filterAlerts } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<TabId>("todas");

  // La lista la resuelve el servidor (GET /api/alertas?status=&variant=).
  const [list, setList] = useState<SiloAlert[]>(alerts);
  useEffect(() => {
    let alive = true;
    const q = TAB_QUERY[activeTab];
    filterAlerts(q.status, q.variant)
      .then((r) => { if (alive) setList(r); })
      .catch(() => { if (alive) setList([]); });
    return () => { alive = false; };
  }, [activeTab, alerts]);

  // Los contadores de los tabs salen del estado que ya tenemos: pedirlos a la
  // API serían 4 requests más solo para los badges.
  const critical = alerts.filter((a) => a.status === "active" && a.variant === "critical");
  const warnings = alerts.filter((a) => a.status === "active" && a.variant === "warning");
  const resolved = alerts.filter((a) => a.status === "resolved");

  const tabsWithCounts: TabItem[] = TABS.map((t) => ({
    ...t,
    count: t.id === "todas" ? alerts.length : t.id === "criticas" ? critical.length : t.id === "advertencias" ? warnings.length : resolved.length,
  }));

  const emptyTitle =
    activeTab === "todas" ? "Sin alertas" : activeTab === "criticas" ? "Sin alertas críticas" : activeTab === "advertencias" ? "Sin advertencias" : "Sin resueltas";
  const emptyBody = activeTab === "todas" ? "Todos los silos están en orden." : activeTab === "resueltas" ? "Aún no resolviste ninguna alerta." : "No hay alertas de este tipo en la temporada.";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertas</Text>
      </View>

      <View style={styles.tabsWrap}>
        <Tabs items={tabsWithCounts} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <EmptyState variant={activeTab === "resueltas" ? "empty" : "no-alerts"} size="sm" title={emptyTitle} body={emptyBody} />
        ) : (
          <View style={styles.list}>
            {list.map((alerta) => (
              <AlertCard
                key={alerta.id}
                variant={alerta.variant}
                title={alerta.title}
                silo={alerta.silo}
                time={alerta.time}
                description={alerta.desc}
                estimate={alerta.estimate}
                action={alerta.action}
                onPress={() => router.push(`/alerta/${alerta.id}` as any)}
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
    header: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md },
    headerTitle: { color: c.textPrimary, fontSize: 26, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.3 },
    tabsWrap: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
    scroll: { paddingHorizontal: Spacing.md, paddingBottom: 40 },
    list: { gap: 8 },
  });
