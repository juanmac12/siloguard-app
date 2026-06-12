import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing, FontSize } from "../../constants/Theme";

// Datos simulados
const SILO_DATA: Record<string, any> = {
  norte: {
    nombre: "Silo Norte — Soja",
    toneladas: 380,
    ultimaLectura: "hace 2 min",
    score: 96,
    estado: "NORMAL",
    estadoColor: Colors.primaryDark,
    co2: { valor: "180", unidad: "ppm", estado: "Normal ✓", color: Colors.primary },
    temp: { valor: "24°", unidad: "celsius", estado: "Normal ✓", color: Colors.primary },
    hum: { valor: "12.8", unidad: "%", estado: "Normal ✓", color: Colors.primary },
    tendencia: "Estable en las últimas 24 hs.",
    dias: "47 días continuos",
    alertas: "0",
    alertasColor: Colors.primary,
  },
  sur: {
    nombre: "Silo Sur — Maíz",
    toneladas: 210,
    ultimaLectura: "hace 8 min",
    score: 65,
    estado: "AVISO",
    estadoColor: Colors.accent,
    co2: { valor: "340", unidad: "ppm", estado: "⚠ Alto", color: Colors.accent },
    temp: { valor: "27°", unidad: "celsius", estado: "⚠ Alto", color: Colors.accent },
    hum: { valor: "14.1", unidad: "%", estado: "⚠ Alta", color: Colors.accent },
    tendencia: "En ascenso — monitorear cada hora.",
    dias: "47 días continuos",
    alertas: "1",
    alertasColor: Colors.accent,
  },
};

export default function DetalleSiloScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const silo = SILO_DATA[id || "norte"];

  if (!silo) return null;

  const isWarning = silo.estado === "AVISO";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{silo.nombre}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.meta}>{silo.toneladas} tn · Última lectura {silo.ultimaLectura}</Text>

        {/* Score Card */}
        <View style={[styles.scoreCard, isWarning && styles.scoreCardWarning]}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{silo.score} / 100</Text>
          <View style={[styles.scoreBadge, { backgroundColor: silo.estadoColor }]}>
            <Text style={styles.scoreBadgeText}>{silo.estado}</Text>
          </View>
        </View>

        {/* Valores actuales */}
        <Text style={styles.sectionTitle}>Valores actuales</Text>
        <View style={styles.metricsRow}>
          {[
            { label: "CO₂", ...silo.co2 },
            { label: "TEMP", ...silo.temp },
            { label: "HUM", ...silo.hum },
          ].map((m) => (
            <View key={m.label} style={[styles.metricCard, isWarning && styles.metricCardWarning]}>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.valor}</Text>
              <Text style={styles.metricUnit}>{m.unidad}</Text>
              <Text style={[styles.metricStatus, { color: m.color }]}>{m.estado}</Text>
            </View>
          ))}
        </View>

        {/* Tendencia */}
        <Text style={styles.sectionTitle}>Tendencia</Text>
        <Text style={[styles.tendencia, isWarning && { color: Colors.accent }]}>
          {silo.tendencia}
        </Text>

        {/* CTA Historial */}
        <TouchableOpacity
          style={[styles.historialButton, isWarning && styles.historialButtonWarning]}
          onPress={() => router.push(`/historial/${id}`)}
          activeOpacity={0.8}
        >
          <Text style={styles.historialButtonText}>VER HISTORIAL DE SENSORES ›</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statLabel}>Días monitoreados</Text>
            <Text style={styles.statValue}>{silo.dias}</Text>
          </View>
          <View>
            <Text style={styles.statLabel}>Alertas activas</Text>
            <Text style={[styles.statValue, { color: silo.alertasColor }]}>{silo.alertas}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backArrow: { color: Colors.text, fontSize: 32, fontWeight: "700", marginRight: Spacing.sm, lineHeight: 32 },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingLg, fontWeight: "700", flex: 1 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
  meta: { color: Colors.textMuted, fontSize: FontSize.bodySm, marginBottom: Spacing.md },
  sectionTitle: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "700", marginBottom: Spacing.sm, marginTop: Spacing.lg },

  // Score
  scoreCard: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.lg,
    alignItems: "center", borderWidth: 1, borderColor: Colors.border,
  },
  scoreCardWarning: { backgroundColor: "rgba(245,158,11,0.08)", borderColor: Colors.accent },
  scoreLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: "700", marginBottom: 4 },
  scoreValue: { color: Colors.text, fontSize: 36, fontWeight: "700", marginBottom: Spacing.sm },
  scoreBadge: { paddingHorizontal: 14, paddingVertical: 4, borderRadius: 4 },
  scoreBadgeText: { color: Colors.text, fontSize: FontSize.badge, fontWeight: "700" },

  // Metrics
  metricsRow: { flexDirection: "row", gap: Spacing.sm },
  metricCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  metricCardWarning: { backgroundColor: "rgba(245,158,11,0.08)", borderColor: Colors.accent },
  metricLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: "700", marginBottom: 4 },
  metricValue: { color: Colors.text, fontSize: 22, fontWeight: "700" },
  metricUnit: { color: Colors.textMuted, fontSize: 10, marginBottom: 2 },
  metricStatus: { fontSize: 10, fontWeight: "600" },

  // Tendencia
  tendencia: { color: Colors.textMuted, fontSize: FontSize.bodyMd },

  // Historial button
  historialButton: {
    backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16,
    alignItems: "center", marginTop: Spacing.md,
  },
  historialButtonWarning: { backgroundColor: Colors.accent },
  historialButtonText: { color: Colors.bg, fontSize: FontSize.bodyMd, fontWeight: "700" },

  // Stats
  statsRow: {
    flexDirection: "row", justifyContent: "space-between",
    marginTop: Spacing.lg, paddingTop: Spacing.md,
  },
  statLabel: { color: Colors.textMuted, fontSize: FontSize.bodySm, fontWeight: "700" },
  statValue: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "600", marginTop: 4 },
});
