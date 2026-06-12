import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing, FontSize } from "../../constants/Theme";

const RANGES = ["24h", "48h", "72h"];

// Datos simulados para las barras del gráfico
const CHART_DATA = [
  { hora: "00", co2: 180, temp: 24, hum: 12.8 },
  { hora: "04", co2: 185, temp: 23, hum: 12.9 },
  { hora: "08", co2: 190, temp: 25, hum: 13.0 },
  { hora: "12", co2: 195, temp: 27, hum: 13.1 },
  { hora: "16", co2: 188, temp: 26, hum: 12.9 },
  { hora: "20", co2: 182, temp: 24, hum: 12.8 },
  { hora: "24", co2: 185, temp: 24, hum: 12.8 },
];

const STATS = [
  { label: "CO₂ prom.", valor: "185", unidad: "ppm", trend: "↘ -3%", trendColor: Colors.primary },
  { label: "Temp máx.", valor: "25°", unidad: "celsius", trend: "→ estable", trendColor: Colors.textMuted },
  { label: "Hum prom.", valor: "12.9", unidad: "%", trend: "↗ +0.2", trendColor: Colors.accent },
];

export default function HistorialScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedRange, setSelectedRange] = useState("24h");

  const siloName = id === "sur" ? "Silo Sur" : "Silo Norte";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial — {siloName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Range tabs */}
        <View style={styles.rangeRow}>
          {RANGES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.rangeTab, selectedRange === r && styles.rangeTabActive]}
              onPress={() => setSelectedRange(r)}
            >
              <Text style={[styles.rangeText, selectedRange === r && styles.rangeTextActive]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Simulated Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartLabel}>CO₂ (ppm)</Text>
          <View style={styles.chartArea}>
            {CHART_DATA.map((d, i) => (
              <View key={i} style={styles.barGroup}>
                <View
                  style={[
                    styles.bar,
                    styles.barCo2,
                    { height: ((d.co2 - 150) / 60) * 100 },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.barTemp,
                    { height: ((d.temp - 15) / 15) * 100 },
                  ]}
                />
                <View
                  style={[
                    styles.bar,
                    styles.barHum,
                    { height: ((d.hum - 10) / 5) * 100 },
                  ]}
                />
                <Text style={styles.barLabel}>{d.hora}h</Text>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.legendText}>CO₂ (ppm)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.accent }]} />
              <Text style={styles.legendText}>Temp (°C)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.info }]} />
              <Text style={styles.legendText}>Humedad (%)</Text>
            </View>
          </View>
        </View>

        {/* Resumen stats */}
        <Text style={styles.sectionTitle}>Resumen últimas {selectedRange}</Text>
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.valor}</Text>
              <Text style={styles.statUnit}>{s.unidad}</Text>
              <Text style={[styles.statTrend, { color: s.trendColor }]}>{s.trend}</Text>
            </View>
          ))}
        </View>

        {/* Post-action note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteTitle}>Tras encender aireación</Text>
          <Text style={styles.noteText}>
            Los valores empiezan a normalizarse en 6-12 hs
          </Text>
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
  sectionTitle: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "700", marginBottom: Spacing.sm, marginTop: Spacing.lg },

  // Range tabs
  rangeRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.md },
  rangeTab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 6, backgroundColor: Colors.surface2 },
  rangeTabActive: { backgroundColor: Colors.primaryDark },
  rangeText: { color: Colors.textMuted, fontSize: FontSize.bodySm, fontWeight: "600" },
  rangeTextActive: { color: Colors.text, fontWeight: "700" },

  // Chart
  chartContainer: {
    backgroundColor: Colors.surface2, borderRadius: 8, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  chartLabel: { color: Colors.textMuted, fontSize: 10, marginBottom: Spacing.sm },
  chartArea: {
    flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end",
    height: 120, marginBottom: Spacing.md,
  },
  barGroup: { alignItems: "center", gap: 2 },
  bar: { width: 8, borderRadius: 4, minHeight: 4 },
  barCo2: { backgroundColor: Colors.primary },
  barTemp: { backgroundColor: Colors.accent },
  barHum: { backgroundColor: Colors.info },
  barLabel: { color: Colors.textMuted, fontSize: 9, marginTop: 4 },

  // Legend
  legend: { flexDirection: "row", justifyContent: "center", gap: Spacing.md },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 4, borderRadius: 2 },
  legendText: { color: Colors.textMuted, fontSize: 11 },

  // Stats
  statsRow: { flexDirection: "row", gap: Spacing.sm },
  statCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 8, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  statLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: "700", marginBottom: 4 },
  statValue: { color: Colors.text, fontSize: 20, fontWeight: "700" },
  statUnit: { color: Colors.textMuted, fontSize: 10, marginBottom: 2 },
  statTrend: { fontSize: 11, fontWeight: "700" },

  // Note
  noteContainer: {
    marginTop: Spacing.lg, paddingTop: Spacing.md,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  noteTitle: { color: Colors.textMuted, fontSize: FontSize.bodySm, fontWeight: "700", marginBottom: 4 },
  noteText: { color: Colors.text, fontSize: FontSize.bodySm },
});
