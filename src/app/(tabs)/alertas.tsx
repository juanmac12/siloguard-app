import { useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, ThemeColors, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { AlertCard, EmptyState, Tabs, TabItem } from "../../components";

const TABS: TabItem[] = [
  { id: "todas", label: "Todas" },
  { id: "criticas", label: "Críticas" },
  { id: "advertencias", label: "Advertencias" },
  { id: "resueltas", label: "Resueltas" },
];

type TabId = "todas" | "criticas" | "advertencias" | "resueltas";

export default function AlertasScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alerts } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [activeTab, setActiveTab] = useState<TabId>("todas");

  const critical = alerts.filter((a) => a.status === "active" && a.variant === "critical");
  const warnings = alerts.filter((a) => a.status === "active" && a.variant === "warning");
  const resolved = alerts.filter((a) => a.status === "resolved");
  const list = activeTab === "todas" ? alerts : activeTab === "criticas" ? critical : activeTab === "advertencias" ? warnings : resolved;

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
    header: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md },
    headerTitle: { color: c.textPrimary, fontSize: 26, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.3 },
    tabsWrap: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
    scroll: { paddingHorizontal: Spacing.md, paddingBottom: 40 },
    list: { gap: 8 },
  });
