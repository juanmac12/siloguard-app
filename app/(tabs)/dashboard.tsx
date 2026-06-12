import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, FontSize } from "../../constants/Theme";

const SILOS = [
  {
    id: "norte",
    nombre: "Silo Norte — Soja",
    toneladas: 380,
    ultimaLectura: "hace 2 min",
    estado: "ACTIVO",
    co2: "180 ppm",
    temp: "24 °C",
    hum: "12.8 %",
    estadoColor: "normal",
  },
  {
    id: "sur",
    nombre: "Silo Sur — Maíz",
    toneladas: 210,
    ultimaLectura: "hace 8 min",
    estado: "AVISO",
    co2: "340 ppm",
    temp: "27 °C",
    hum: "14.1 %",
    estadoColor: "warning",
  },
];

const ALERTAS_RECIENTES = [
  { id: "1", titulo: "Temperatura alta — Silo Norte", tiempo: "hace 5 min" },
];

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity>
          <Text style={styles.headerIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Mis Silos</Text>

        {SILOS.map((silo) => (
          <TouchableOpacity
            key={silo.id}
            style={[styles.siloCard, silo.estadoColor === "warning" && styles.siloCardWarning]}
            activeOpacity={0.7}
            onPress={() => router.push(`/silo/${silo.id}`)}
          >
            <View style={styles.siloHeader}>
              <Text style={styles.siloName}>{silo.nombre}</Text>
              <View style={[styles.badge, silo.estadoColor === "warning" ? styles.badgeWarning : styles.badgeNormal]}>
                <Text style={styles.badgeText}>{silo.estado}</Text>
              </View>
            </View>
            <Text style={styles.siloMeta}>{silo.toneladas} tn · Última lectura {silo.ultimaLectura}</Text>
            <View style={styles.metricsRow}>
              <MetricChip label="CO₂" value={silo.co2} warning={silo.estadoColor === "warning"} />
              <MetricChip label="TEMP" value={silo.temp} warning={silo.estadoColor === "warning"} />
              <MetricChip label="HUM" value={silo.hum} warning={silo.estadoColor === "warning"} />
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Alertas recientes</Text>

        {ALERTAS_RECIENTES.map((alerta) => (
          <TouchableOpacity
            key={alerta.id}
            style={styles.alertCard}
            activeOpacity={0.7}
            onPress={() => router.push(`/alerta/${alerta.id}`)}
          >
            <View style={styles.alertIndicator} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alerta.titulo}</Text>
              <Text style={styles.alertMeta}>{alerta.tiempo} · Toca para ver detalle →</Text>
            </View>
            <Text style={styles.alertAction}>VER</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function MetricChip({ label, value, warning }: { label: string; value: string; warning?: boolean }) {
  return (
    <View style={styles.metricChip}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, warning && styles.metricValueWarning]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingXl, fontWeight: "700" },
  headerIcon: { color: Colors.textMuted, fontSize: 20 },
  scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.xl },
  sectionTitle: { color: Colors.text, fontSize: FontSize.headingMd, fontWeight: "700", marginBottom: Spacing.sm },
  siloCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  siloCardWarning: { backgroundColor: "rgba(245,158,11,0.08)", borderColor: Colors.accent },
  siloHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.xs },
  siloName: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "700", flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4 },
  badgeNormal: { backgroundColor: Colors.primaryDark },
  badgeWarning: { backgroundColor: Colors.accent },
  badgeText: { color: Colors.text, fontSize: FontSize.badge, fontWeight: "700" },
  siloMeta: { color: Colors.textMuted, fontSize: FontSize.bodySm, marginBottom: Spacing.sm },
  metricsRow: { flexDirection: "row", gap: Spacing.sm },
  metricChip: { flex: 1, backgroundColor: Colors.surface2, borderRadius: 6, paddingHorizontal: Spacing.sm, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  metricLabel: { color: Colors.textMuted, fontSize: FontSize.badge, fontWeight: "700", marginBottom: 2 },
  metricValue: { color: Colors.text, fontSize: FontSize.bodySm, fontWeight: "600" },
  metricValueWarning: { color: Colors.accent },
  alertCard: { backgroundColor: Colors.surface, borderRadius: 10, padding: Spacing.md, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: Colors.border },
  alertIndicator: { width: 4, height: 48, borderRadius: 2, backgroundColor: Colors.danger, marginRight: Spacing.sm },
  alertContent: { flex: 1 },
  alertTitle: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "700", marginBottom: 2 },
  alertMeta: { color: Colors.textMuted, fontSize: FontSize.bodySm },
  alertAction: { color: Colors.primary, fontSize: FontSize.bodySm, fontWeight: "700" },
});
