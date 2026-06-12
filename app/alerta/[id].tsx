import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing, FontSize } from "../../constants/Theme";

const ALERTA_DATA: Record<string, any> = {
  "1": {
    badge: "CRÍTICA",
    badgeColor: Colors.danger,
    titulo: "Temperatura alta — Silo Norte",
    tiempo: "hace 5 min",
    silo: "Silo Norte — Soja",
    descripcion:
      "La temperatura interna subió 4°C en las últimas 6 hs sin cambio externo. Patrón compatible con inicio de fermentación en zona noreste.",
    zona: "Sector noreste — ~40 tn en riesgo",
    tiempoEstimado: "48 – 72 hs antes de pérdida irreversible",
    tiempoColor: Colors.danger,
  },
  "2": {
    badge: "AVISO",
    badgeColor: Colors.accent,
    titulo: "Humedad crítica — Silo Sur",
    tiempo: "hace 20 min",
    silo: "Silo Sur — Maíz",
    descripcion:
      "La humedad del grano llegó al 14.1%, por encima del umbral seguro de 14%. Si la tendencia continúa, podría activarse fermentación en 24-48 hs.",
    zona: "Todo el silo — 210 tn monitoreadas",
    tiempoEstimado: "24 – 48 hs si la tendencia continúa",
    tiempoColor: Colors.accent,
  },
  "3": {
    badge: "RESUELTA",
    badgeColor: Colors.textMuted,
    titulo: "CO₂ elevado (resuelto) — Silo Este",
    tiempo: "ayer 14:30",
    silo: "Silo Este — Trigo",
    descripcion:
      "Elevación de CO₂ detectada y resuelta tras encender la aireación. Los valores volvieron a la normalidad en 8 hs.",
    zona: "Sector central",
    tiempoEstimado: "Resuelta — sin riesgo actual",
    tiempoColor: Colors.textMuted,
  },
};

export default function DetalleAlertaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const alerta = ALERTA_DATA[id || "1"];

  if (!alerta) return null;

  const isResolved = alerta.badge === "RESUELTA";

  const handleAction = (action: string) => {
    Alert.alert("Acción registrada", `"${action}" fue registrada correctamente.`, [
      { text: "OK" },
    ]);
  };

  const handleMarcarResuelta = () => {
    Alert.alert("Marcar como resuelta", "¿Confirmás que esta alerta fue atendida?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, marcar resuelta",
        onPress: () => {
          Alert.alert("Alerta resuelta", "La alerta fue marcada como resuelta.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Alerta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Badge + time */}
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: alerta.badgeColor }]}>
            <Text style={styles.badgeText}>{alerta.badge}</Text>
          </View>
          <Text style={styles.time}>{alerta.tiempo}</Text>
        </View>

        {/* Title */}
        <Text style={styles.titulo}>{alerta.titulo}</Text>
        <Text style={styles.siloText}>{alerta.tiempo} · {alerta.silo}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* ¿Qué está pasando? */}
        <Text style={styles.sectionTitle}>¿Qué está pasando?</Text>
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionText}>{alerta.descripcion}</Text>
        </View>

        {/* Zona + Tiempo */}
        <Text style={styles.fieldLabel}>Zona afectada</Text>
        <Text style={styles.fieldValue}>{alerta.zona}</Text>

        <Text style={styles.fieldLabel}>Tiempo estimado</Text>
        <Text style={[styles.fieldValue, { color: alerta.tiempoColor }]}>
          {alerta.tiempoEstimado}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Acciones */}
        {!isResolved && (
          <>
            <Text style={styles.sectionTitle}>Acción recomendada</Text>

            {/* Primary CTA */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleAction("Encender aireación")}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>ENCENDER AIREACIÓN</Text>
            </TouchableOpacity>

            {/* Secondary actions */}
            <View style={styles.secondaryRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleAction("Llamar técnico")}
              >
                <Text style={styles.secondaryButtonText}>Llamar técnico</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleMarcarResuelta}
              >
                <Text style={styles.secondaryButtonText}>Marcar resuelta</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {isResolved && (
          <View style={styles.resolvedBox}>
            <Text style={styles.resolvedCheck}>✓</Text>
            <Text style={styles.resolvedText}>Esta alerta fue resuelta</Text>
          </View>
        )}
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

  // Top
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.sm },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  badgeText: { color: Colors.text, fontSize: FontSize.badge, fontWeight: "700" },
  time: { color: Colors.textMuted, fontSize: FontSize.bodySm },
  titulo: { color: Colors.text, fontSize: FontSize.headingMd, fontWeight: "700", marginBottom: 4 },
  siloText: { color: Colors.textMuted, fontSize: FontSize.bodySm, marginBottom: Spacing.md },

  // Divider
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md },

  // Sections
  sectionTitle: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "700", marginBottom: Spacing.sm },
  descriptionBox: {
    backgroundColor: Colors.surface2, borderRadius: 8, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md,
  },
  descriptionText: { color: Colors.textMuted, fontSize: FontSize.bodySm, lineHeight: 18 },

  // Fields
  fieldLabel: { color: Colors.textMuted, fontSize: FontSize.bodySm, fontWeight: "700", marginTop: Spacing.sm },
  fieldValue: { color: Colors.text, fontSize: FontSize.bodyMd, fontWeight: "600", marginBottom: Spacing.sm },

  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16,
    alignItems: "center", marginBottom: Spacing.md,
  },
  primaryButtonText: { color: Colors.bg, fontSize: FontSize.bodyMd, fontWeight: "700" },
  secondaryRow: { flexDirection: "row", gap: Spacing.md },
  secondaryButton: {
    flex: 1, borderRadius: 8, paddingVertical: 14, alignItems: "center",
    borderWidth: 1, borderColor: Colors.border,
  },
  secondaryButtonText: { color: Colors.text, fontSize: FontSize.bodyMd },

  // Resolved
  resolvedBox: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: Colors.surface, borderRadius: 8, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  resolvedCheck: { color: Colors.primary, fontSize: 24, fontWeight: "700", marginRight: Spacing.sm },
  resolvedText: { color: Colors.textMuted, fontSize: FontSize.bodyLg },
});
