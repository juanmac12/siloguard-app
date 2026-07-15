import { useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Modal, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spacing, ThemeColors, Radius, FontSize } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { ApiError } from "../../config/api";
import { Icon, StatusBadge, Button } from "../../components";

const RESOLUTION_OPTIONS = [
  { id: "aire", label: "Encendí aireación" },
  { id: "insp", label: "Inspeccioné el silo" },
  { id: "tec",  label: "Llamé al técnico" },
  { id: "otro", label: "Otro" },
];

const LBL = { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.6, textTransform: "uppercase" as const, marginBottom: 8 };

export default function DetalleAlertaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alerts, resolveAlert } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [modalOpen, setModalOpen] = useState(false);
  const [picked, setPicked]       = useState("");
  const [note, setNote]           = useState("");
  const [done, setDone]           = useState(false);

  const alerta = alerts.find((a) => a.id === Number(id));
  if (!alerta) return null;

  const isCritical = alerta.variant === "critical";
  const isResolved = alerta.status === "resolved";
  const ac = isCritical ? colors.statusCritical : colors.statusWarn;
  const acTint = isCritical ? colors.statusCriticalTint : colors.statusWarnTint;

  const sensorLabel = { temp: "Temp.", humidity: "Humedad", co2: "CO₂" }[alerta.sensor] ?? "Lectura";

  const confirm = async () => {
    setModalOpen(false);
    try {
      await resolveAlert(Number(id), note || picked, picked);
      setDone(true);
      setTimeout(() => router.back(), 400);
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "No se pudo marcar la alerta como resuelta.";
      Alert.alert("Error", msg);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de alerta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Severity card */}
        <View style={[styles.severityCard, { backgroundColor: acTint, borderColor: ac }]}>
          <View style={[styles.severityIcon, { backgroundColor: isCritical ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)" }]}>
            <Icon name="alert-triangle" size={22} color={ac} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <StatusBadge tone={isCritical ? "critical" : "warn"} label={isCritical ? "Crítica" : "Advertencia"} />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>{alerta.time}</Text>
            </View>
            <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>{alerta.title}</Text>
            <Text style={[styles.alertSilo, { color: colors.textSecondary }]}>{alerta.silo}</Text>
          </View>
        </View>

        {/* Sensor reading vs threshold */}
        {!isResolved && (
          <View style={{ marginBottom: 14 }}>
            <Text style={[LBL, { color: colors.textSecondary }]}>Lectura registrada</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {/* Reading */}
              <View style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault, flex: 1 }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{sensorLabel}</Text>
                <Text style={[styles.statValue, { color: ac }]}>{alerta.value}</Text>
                <Text style={[styles.statUnit, { color: colors.textSecondary }]}>{alerta.unit}</Text>
              </View>
              {/* Threshold */}
              <View style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault, flex: 1 }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Umbral máx.</Text>
                <Text style={[styles.statValue, { color: colors.textSecondary }]}>{alerta.threshold}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Description */}
        <View style={{ marginBottom: 14 }}>
          <Text style={[LBL, { color: colors.textSecondary }]}>¿Qué está pasando?</Text>
          <View style={[styles.descCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Text style={[styles.descText, { color: colors.textSecondary }]}>{alerta.desc}</Text>
          </View>
        </View>

        {/* Location */}
        <View style={{ marginBottom: 14 }}>
          <Text style={[LBL, { color: colors.textSecondary }]}>¿Dónde?</Text>
          <View style={[styles.rowCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Icon name="map-pin" size={16} color={colors.textSecondary} />
            <Text style={[styles.rowText, { color: colors.textPrimary }]}>{alerta.silo}</Text>
          </View>
        </View>

        {/* Time estimate */}
        {alerta.estimate && !isResolved && (
          <View style={{ marginBottom: 14 }}>
            <Text style={[LBL, { color: colors.textSecondary }]}>¿Cuánto tiempo tenés?</Text>
            <View style={[styles.rowCard, { backgroundColor: "rgba(239,68,68,0.06)", borderColor: colors.statusCritical }]}>
              <Icon name="clock" size={15} color={colors.statusCritical} />
              <Text style={[styles.rowText, { color: colors.statusCritical, fontWeight: "600" }]}>{alerta.estimate}</Text>
            </View>
          </View>
        )}

        {/* Action */}
        {alerta.action && !isResolved && (
          <View style={{ marginBottom: 14 }}>
            <Text style={[LBL, { color: colors.textSecondary }]}>¿Qué hacer?</Text>
            <View style={[styles.rowCard, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}>
              <Icon name="info" size={16} color={colors.actionPrimary} />
              <Text style={[styles.rowText, { color: colors.textPrimary }]}>{alerta.action}</Text>
            </View>
          </View>
        )}

        {/* Resolved state */}
        {isResolved && (
          <View style={[styles.resolvedBox, { backgroundColor: colors.statusOkTint, borderColor: colors.statusOk }]}>
            <Icon name="check-circle" size={22} color={colors.statusOk} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.resolvedTitle, { color: colors.statusOk }]}>Alerta resuelta</Text>
              {alerta.resolutionNote && (
                <Text style={[styles.resolvedNote, { color: colors.textSecondary }]}>{alerta.resolutionNote}</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action bar */}
      {!isResolved && (
        <View style={[styles.actionBar, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg }]}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={() => router.push(`/historial/${alerta.siloId}` as any)}
              style={[styles.secBtn, { flex: 1, borderColor: colors.borderDefault }]}
            >
              <Icon name="trending-up" size={16} color={colors.textPrimary} />
              <Text style={[styles.secBtnText, { color: colors.textPrimary }]}>Ver historial</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push(`/contacto-tecnico?alertaId=${alerta.id}` as any)}
              style={[styles.secBtn, { flex: 1, borderColor: colors.borderDefault }]}
            >
              <Icon name="phone" size={16} color={colors.textPrimary} />
              <Text style={[styles.secBtnText, { color: colors.textPrimary }]}>Contactar técnico</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setModalOpen(true)}
            disabled={done}
            style={[styles.primaryBtn, { backgroundColor: done ? colors.statusOk : colors.actionPrimary }]}
          >
            <Text style={[styles.primaryBtnText, { color: colors.actionPrimaryText }]}>
              {done ? "✓ Resuelta" : "Marcar como resuelta"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Resolution Modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <Pressable style={styles.overlay} onPress={() => setModalOpen(false)} />
          <View style={[styles.sheet, { backgroundColor: colors.surfaceCard, borderTopColor: colors.borderDefault }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.borderDefault }]} />
            <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>Marcar como resuelta</Text>
            <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>¿Qué acción tomaste?</Text>

            <View style={{ gap: 6, marginBottom: 14 }}>
              {RESOLUTION_OPTIONS.map((o) => (
                <Pressable
                  key={o.id}
                  onPress={() => setPicked(o.label)}
                  style={[styles.optionRow, {
                    backgroundColor: picked === o.label ? colors.statusOkTint : colors.surfaceInput,
                    borderColor: picked === o.label ? colors.actionPrimary : colors.borderDefault,
                  }]}
                >
                  <View style={[styles.radio, {
                    borderColor: picked === o.label ? colors.actionPrimary : colors.borderDefault,
                  }]}>
                    {picked === o.label && <View style={[styles.radioDot, { backgroundColor: colors.actionPrimary }]} />}
                  </View>
                  <Text style={[styles.optionText, { color: colors.textPrimary, fontWeight: picked === o.label ? "600" : "400" }]}>{o.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[LBL, { color: colors.textSecondary }]}>Notas (opcional)</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Ej: Encendí la aireación a las 14:30 por 2 horas."
              placeholderTextColor={colors.textSecondary}
              multiline numberOfLines={3}
              style={[styles.noteInput, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault, color: colors.textPrimary }]}
            />

            <TouchableOpacity
              onPress={confirm}
              disabled={!picked}
              style={[styles.confirmBtn, { backgroundColor: picked ? colors.actionPrimary : colors.surfaceInput }]}
            >
              <Text style={[styles.confirmBtnText, { color: picked ? colors.actionPrimaryText : colors.textSecondary }]}>
                Confirmar resolución
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.cancelBtn}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8,
      borderBottomWidth: 1,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: "600", color: c.textPrimary },

    scroll: { padding: 16, gap: 0, paddingBottom: 24 },

    severityCard: { flexDirection: "row", gap: 12, borderRadius: Radius.lg, borderWidth: 1, padding: 16, marginBottom: 14 },
    severityIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    timeText: { fontSize: 12 },
    alertTitle: { fontSize: 17, fontWeight: "700", letterSpacing: -0.2, marginBottom: 2 },
    alertSilo: { fontSize: 13 },

    statCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    statLabel: { fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
    statValue: { fontSize: 28, fontWeight: "700", letterSpacing: -0.5, lineHeight: 32 },
    statUnit: { fontSize: 12, marginTop: 2 },

    descCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    descText: { fontSize: 14, lineHeight: 22 },

    rowCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: Radius.md, borderWidth: 1, padding: 12 },
    rowText: { flex: 1, fontSize: 14 },

    resolvedBox: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    resolvedTitle: { fontSize: 14, fontWeight: "700", marginBottom: 4 },
    resolvedNote: { fontSize: 13, lineHeight: 20 },

    actionBar: { padding: 16, gap: 8, borderTopWidth: 1 },
    secBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
      borderWidth: 1, borderRadius: Radius.md, paddingVertical: 12,
    },
    secBtnText: { fontSize: 14, fontWeight: "500" },
    primaryBtn: { borderRadius: Radius.md, paddingVertical: 14, alignItems: "center" },
    primaryBtnText: { fontSize: 15, fontWeight: "700" },

    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
    sheet: {
      borderTopLeftRadius: 20, borderTopRightRadius: 20,
      borderTopWidth: 1, padding: 20, paddingBottom: 40,
    },
    sheetHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
    sheetTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
    sheetSub: { fontSize: 14, marginBottom: 14 },
    optionRow: {
      flexDirection: "row", alignItems: "center", gap: 12,
      borderWidth: 1, borderRadius: Radius.md, padding: 12,
    },
    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    radioDot: { width: 8, height: 8, borderRadius: 4 },
    optionText: { fontSize: 14 },
    noteInput: {
      borderWidth: 1, borderRadius: Radius.md, padding: 10,
      fontSize: 14, lineHeight: 20, marginBottom: 16, minHeight: 72,
      textAlignVertical: "top",
    },
    confirmBtn: { borderRadius: Radius.md, paddingVertical: 14, alignItems: "center", marginBottom: 8 },
    confirmBtnText: { fontSize: 15, fontWeight: "700" },
    cancelBtn: { paddingVertical: 10, alignItems: "center" },
    cancelBtnText: { fontSize: 14 },
  });
