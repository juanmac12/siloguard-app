import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, FontSize } from "../../constants/Theme";

const TABS = ["Todas", "Críticas", "Resueltas"];

const ALERTAS = [
  {
    id: "1",
    badge: "CRÍTICA",
    badgeColor: Colors.danger,
    bgColor: "rgba(239,68,68,0.08)",
    barColor: Colors.danger,
    titulo: "Temperatura alta",
    silo: "Silo Norte — Soja",
    tiempo: "hace 5 min",
    tipo: "critica",
  },
  {
    id: "2",
    badge: "AVISO",
    badgeColor: Colors.accent,
    bgColor: "rgba(245,158,11,0.08)",
    barColor: Colors.accent,
    titulo: "Humedad crítica",
    silo: "Silo Sur — Maíz",
    tiempo: "hace 20 min",
    tipo: "critica",
  },
  {
    id: "3",
    badge: "RESUELTA",
    badgeColor: Colors.textMuted,
    bgColor: Colors.surface,
    barColor: Colors.textMuted,
    titulo: "CO₂ elevado (resuelto)",
    silo: "Silo Este — Trigo",
    tiempo: "ayer 14:30",
    tipo: "resuelta",
  },
];

export default function AlertasScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Todas");

  const filtered = ALERTAS.filter((a) => {
    if (activeTab === "Todas") return true;
    if (activeTab === "Críticas") return a.tipo === "critica";
    if (activeTab === "Resueltas") return a.tipo === "resuelta";
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertas</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyCheck}>✓</Text>
            </View>
            <Text style={styles.emptyTitle}>Todo bien por ahora</Text>
            <Text style={styles.emptySubtitle}>
              Cuando los sensores detecten algo fuera{"\n"}de rango, las alertas aparecen acá.
            </Text>
          </View>
        ) : (
          filtered.map((alerta) => (
            <TouchableOpacity
              key={alerta.id}
              style={[styles.alertCard, { backgroundColor: alerta.bgColor }]}
              activeOpacity={0.7}
              onPress={() => router.push(`/alerta/${alerta.id}`)}
            >
              <View style={[styles.alertBar, { backgroundColor: alerta.barColor }]} />
              <View style={styles.alertContent}>
                {/* Top row: badge + time */}
                <View style={styles.alertTopRow}>
                  <View style={[styles.badge, { backgroundColor: alerta.badgeColor }]}>
                    <Text style={styles.badgeText}>{alerta.badge}</Text>
                  </View>
                  <Text style={styles.alertTime}>{alerta.tiempo}</Text>
                </View>
                {/* Title */}
                <Text
                  style={[
                    styles.alertTitle,
                    alerta.tipo === "resuelta" && styles.alertTitleMuted,
                  ]}
                >
                  {alerta.titulo}
                </Text>
                {/* Silo */}
                <Text style={styles.alertSilo}>{alerta.silo} · Ver Silo ›</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 0,
  },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingXl, fontWeight: "700" },

  // Tabs
  tabBar: {
    flexDirection: "row", backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.md,
  },
  tab: { marginRight: Spacing.xl, paddingBottom: Spacing.sm },
  tabText: { color: Colors.textMuted, fontSize: FontSize.bodyMd, fontWeight: "500" },
  tabTextActive: { color: Colors.primary, fontWeight: "700" },
  tabIndicator: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: 3, backgroundColor: Colors.primary, borderRadius: 2,
  },

  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.xl },

  // Alert Card
  alertCard: {
    borderRadius: 10, padding: Spacing.md, marginBottom: Spacing.md,
    flexDirection: "row", borderWidth: 1, borderColor: Colors.border,
  },
  alertBar: { width: 4, borderRadius: 2, marginRight: Spacing.sm },
  alertContent: { flex: 1 },
  alertTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeText: { color: Colors.text, fontSize: FontSize.badge, fontWeight: "700" },
  alertTime: { color: Colors.textMuted, fontSize: FontSize.bodySm },
  alertTitle: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "700", marginBottom: 4 },
  alertTitleMuted: { color: Colors.textMuted, fontWeight: "400" },
  alertSilo: { color: Colors.textMuted, fontSize: FontSize.bodySm },

  // Empty state
  emptyContainer: { alignItems: "center", paddingTop: 100 },
  emptyIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(34,197,94,0.12)", borderWidth: 1.5, borderColor: Colors.primary,
    alignItems: "center", justifyContent: "center", marginBottom: Spacing.lg,
  },
  emptyCheck: { color: Colors.primary, fontSize: 32, fontWeight: "700" },
  emptyTitle: { color: Colors.text, fontSize: 22, fontWeight: "700", marginBottom: Spacing.sm },
  emptySubtitle: { color: Colors.textMuted, fontSize: FontSize.bodyMd, textAlign: "center", lineHeight: 22 },
});
