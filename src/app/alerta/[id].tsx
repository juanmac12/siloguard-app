import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { useConnState } from "../../hooks/useConnState";
import { useToast } from "../../components/Toast";
import { Icon, StatusBadge, Button, SensorStat, BottomSheet, DisabledHint } from "../../components";

const RESOLUTION_OPTIONS = [
  { id: "aire", label: "Encendí aireación" },
  { id: "insp", label: "Inspeccioné el silo" },
  { id: "tec", label: "Llamé al técnico" },
  { id: "otro", label: "Otro" },
];

const LBL = {
  fontSize: 11,
  fontWeight: FontWeight.bold,
  fontFamily: fontFamilyForWeight(FontWeight.bold),
  letterSpacing: 0.6,
  textTransform: "uppercase" as const,
  marginBottom: 8,
};

const SENSOR_LABEL: Record<string, string> = { temp: "Temp.", humidity: "Humedad", co2: "CO₂" };

export default function AlertaDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { alerts, resolveAlert } = useAppData();
  const conn = useConnState();
  const offline = conn.state !== "online";
  const toast = useToast();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const alerta = alerts.find((a) => a.id === Number(id));
  if (!alerta) return null;

  const isCritical = alerta.variant === "critical";
  const isResolved = alerta.status === "resolved" || done;
  const ac = isCritical ? colors.statusCritical : colors.statusWarn;
  const acTint = isCritical ? colors.statusCriticalTint : colors.statusWarnTint;
  const sensorLabel = SENSOR_LABEL[alerta.sensor] ?? "Lectura";

  const confirm = async () => {
    setConfirming(true);
    try {
      await resolveAlert(alerta.id, note || picked, picked);
      setOpen(false);
      setDone(true);
      toast.addToast({ tone: "ok", title: "Alerta resuelta", message: "Se registró la acción tomada." });
      setTimeout(() => router.back(), 400);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Detalle de alerta</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.severityCard, { backgroundColor: acTint, borderColor: ac }]}>
          <View style={[styles.severityIcon, { backgroundColor: isCritical ? "rgba(239,68,68,0.12)" : "rgba(234,179,8,0.12)" }]}>
            <Icon name="alert-triangle" size={22} color={ac} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <StatusBadge tone={isCritical ? "critical" : "warn"} label={isCritical ? "Crítica" : "Advertencia"} />
              <Text style={styles.timeText}>{alerta.time}</Text>
            </View>
            <Text style={styles.alertTitle}>{alerta.title}</Text>
            <Text style={styles.alertSilo}>{alerta.silo}</Text>
          </View>
        </View>

        {!isResolved && (
          <View style={{ marginBottom: 14 }}>
            <Text style={[LBL, { color: colors.textSecondary }]}>Lectura registrada</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <SensorStat kind={alerta.sensor} value={alerta.value} tone={isCritical ? "critical" : "warn"} />
              <View style={[styles.thStat, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
                <Text style={styles.thLabel}>UMBRAL MÁX.</Text>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
                  <Text style={styles.thValue}>{alerta.threshold ?? "—"}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ marginBottom: 14 }}>
          <Text style={[LBL, { color: colors.textSecondary }]}>¿Qué está pasando?</Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Text style={styles.descText}>{alerta.desc}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={[LBL, { color: colors.textSecondary }]}>¿Dónde?</Text>
          <View style={[styles.rowCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Icon name="map-pin" size={16} color={colors.textSecondary} />
            <Text style={styles.rowText}>{alerta.silo}</Text>
          </View>
        </View>

        {alerta.estimate && !isResolved && (
          <View style={{ marginBottom: 14 }}>
            <Text style={[LBL, { color: colors.textSecondary }]}>¿Cuánto tiempo tenés?</Text>
            <View style={[styles.rowCard, { backgroundColor: "rgba(239,68,68,0.06)", borderColor: colors.statusCritical }]}>
              <Icon name="clock" size={15} color={colors.statusCritical} />
              <Text style={[styles.rowText, { color: colors.statusCritical, fontWeight: FontWeight.semibold }]}>{alerta.estimate}</Text>
            </View>
          </View>
        )}

        {alerta.action && !isResolved && (
          <View style={{ marginBottom: 14 }}>
            <Text style={[LBL, { color: colors.textSecondary }]}>¿Qué hacer?</Text>
            <View style={[styles.rowCard, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}>
              <Icon name="info" size={16} color={colors.actionPrimary} />
              <Text style={styles.rowText}>{alerta.action}</Text>
            </View>
          </View>
        )}

        {isResolved && (
          <View style={[styles.resolvedBox, { backgroundColor: colors.statusOkTint, borderColor: colors.statusOk }]}>
            <Icon name="check-circle" size={22} color={colors.statusOk} />
            <View style={{ flex: 1 }}>
              <Text style={styles.resolvedTitle}>Alerta resuelta</Text>
              {alerta.resolutionNote ? <Text style={styles.resolvedNote}>{alerta.resolutionNote}</Text> : null}
            </View>
          </View>
        )}
      </ScrollView>

      {!isResolved && (
        <View style={[styles.actionBar, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg, paddingBottom: 16 + insets.bottom }]}>
          <Button
            variant="secondary"
            fullWidth
            leadingIcon={<Icon name="trending-up" size={16} color={colors.textPrimary} />}
            onPress={() => router.push(`/historial/${alerta.siloId}?variable=${alerta.sensor === "humidity" ? "hum" : alerta.sensor}` as any)}
          >
            Ver historial de sensores
          </Button>
          <Button
            variant="secondary"
            fullWidth
            leadingIcon={<Icon name="phone" size={16} color={colors.textPrimary} />}
            onPress={() => router.push(`/contacto-tecnico?alertId=${alerta.id}` as any)}
          >
            Contactar técnico
          </Button>
          <Button variant="primary" fullWidth onPress={() => setOpen(true)} disabled={offline}>
            Marcar como resuelta
          </Button>
          {offline && <DisabledHint>Necesitás conexión para marcar como resuelta</DisabledHint>}
        </View>
      )}

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Marcar como resuelta"
        actions={[
          <Button key="ok" variant="primary" fullWidth onPress={confirm} disabled={!picked} loading={confirming}>
            Confirmar resolución
          </Button>,
          <Button key="no" variant="ghost" fullWidth onPress={() => setOpen(false)}>
            Cancelar
          </Button>,
        ]}
      >
        <Text style={styles.sheetSub}>¿Qué acción tomaste?</Text>
        <View style={{ gap: 6 }}>
          {RESOLUTION_OPTIONS.map((o) => (
            <Pressable
              key={o.id}
              onPress={() => setPicked(o.label)}
              style={[
                styles.optionRow,
                {
                  backgroundColor: picked === o.label ? colors.statusOkTint : colors.surfaceInput,
                  borderColor: picked === o.label ? colors.actionPrimary : colors.borderDefault,
                },
              ]}
            >
              <View style={[styles.radio, { borderColor: picked === o.label ? colors.actionPrimary : colors.borderDefault }]}>
                {picked === o.label && <View style={[styles.radioDot, { backgroundColor: colors.actionPrimary }]} />}
              </View>
              <Text style={[styles.optionText, { fontWeight: picked === o.label ? FontWeight.semibold : FontWeight.regular }]}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
        <View>
          <Text style={[LBL, { color: colors.textSecondary, marginBottom: 6 }]}>Notas (opcional)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Ej: Encendí la aireación a las 14:30 por 2 horas."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            style={[styles.noteInput, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault, color: colors.textPrimary }]}
          />
        </View>
      </BottomSheet>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary },

    scroll: { padding: 16, paddingBottom: 24 },

    severityCard: { flexDirection: "row", gap: 12, borderRadius: Radius.lg, borderWidth: 1, padding: 16, marginBottom: 14, alignItems: "flex-start" },
    severityIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    timeText: { fontSize: 12, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    alertTitle: { fontSize: 17, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.2, marginBottom: 2, color: c.textPrimary },
    alertSilo: { fontSize: 13, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    thStat: { flex: 1, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, alignItems: "center", justifyContent: "center", gap: Spacing.sm },
    thLabel: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: 0.4, color: c.textMuted },
    thValue: { fontSize: 22, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: c.textSecondary, letterSpacing: -0.5 },

    card: { borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    descText: { fontSize: 14, lineHeight: 22, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    rowCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: Radius.md, borderWidth: 1, padding: 12 },
    rowText: { flex: 1, fontSize: 14, color: c.textPrimary, fontFamily: fontFamilyForWeight(FontWeight.medium), fontWeight: FontWeight.medium },

    resolvedBox: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    resolvedTitle: { fontSize: 14, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), marginBottom: 4, color: c.statusOk },
    resolvedNote: { fontSize: 13, lineHeight: 20, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    actionBar: { padding: 16, gap: 8, borderTopWidth: 1 },

    sheetSub: { fontSize: 14, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    optionRow: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderRadius: Radius.md, padding: 12 },
    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    radioDot: { width: 8, height: 8, borderRadius: 4 },
    optionText: { fontSize: 14, color: c.textPrimary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    noteInput: { borderWidth: 1, borderRadius: Radius.md, padding: 10, fontSize: 14, lineHeight: 20, minHeight: 72, textAlignVertical: "top", fontFamily: fontFamilyForWeight(FontWeight.regular) },
  });
