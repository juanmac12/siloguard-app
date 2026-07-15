import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Linking, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemeColors, Radius, Spacing } from "../constants/Theme";
import { useTheme } from "../contexts/ThemeContext";
import { useAppData } from "../contexts/AppDataContext";
import { AuthHeader, Button, Icon, StatusBadge } from "../components";

const SUPPORT_PHONE = "+5491140001234";
const SUPPORT_WHATSAPP = "5491140001234";

const MOTIVOS = [
  { id: "confirmar", label: "Confirmar una acción" },
  { id: "no_funciono", label: "Lo que probé no funcionó" },
  { id: "otro", label: "Otro" },
];

function isInSupportHours(date: Date): boolean {
  const day = date.getDay(); // 0=domingo
  const hour = date.getHours();
  if (day === 0) return false; // domingo cerrado
  return hour >= 7 && hour < 20;
}

export default function ContactoTecnicoScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alerts } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { alertaId } = useLocalSearchParams<{ alertaId?: string }>();

  const alerta = alerts.find((a) => a.id === Number(alertaId));
  const now = useMemo(() => new Date(), []);
  const inHours = isInSupportHours(now);

  const [motivo, setMotivo] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sensorLabel = alerta ? ({ temp: "Temp.", humidity: "Humedad", co2: "CO₂" }[alerta.sensor] ?? "Lectura") : "";

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
  };

  const handleWhatsapp = () => {
    const context = alerta
      ? `Hola, necesito ayuda con una alerta en ${alerta.silo}: "${alerta.title}" (${sensorLabel}: ${alerta.value} ${alerta.unit}, umbral ${alerta.threshold}).`
      : "Hola, necesito ayuda con SiloGuard.";
    Linking.openURL(`https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(context)}`);
  };

  const canSend = motivo && msg.trim().length >= 10 && msg.trim().length <= 500;

  const handleSend = () => {
    if (!canSend) return;
    setSending(true);
    // TODO: no hay endpoint de consultas técnicas todavía. Cuando exista,
    // reemplazar por un POST real (ej. /api/soporte/consultas).
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 900);
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <AuthHeader title="Contacto técnico" showBack onBack={() => router.back()} />
        <View style={styles.sentBox}>
          <View style={[styles.iconCircle, { backgroundColor: colors.greenTint }]}>
            <Icon name="check-circle" size={28} color={colors.green} />
          </View>
          <Text style={styles.sentTitle}>Consulta enviada</Text>
          <Text style={styles.sentDesc}>
            Un técnico va a revisar tu consulta y te va a responder a la brevedad.
          </Text>
          <Button variant="primary" fullWidth onPress={() => router.back()} style={{ marginTop: Spacing.lg }}>
            Volver
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AuthHeader title="Contacto técnico" showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {alerta && (
          <View style={[styles.alertCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <StatusBadge tone={alerta.variant === "critical" ? "critical" : "warn"} label={alerta.variant === "critical" ? "Crítica" : "Advertencia"} />
              <Text style={styles.alertTime}>{alerta.time}</Text>
            </View>
            <Text style={styles.alertTitle}>{alerta.title}</Text>
            <Text style={styles.alertSilo}>{alerta.silo}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
              <View style={[styles.chip, { backgroundColor: colors.surfaceInput }]}>
                <Text style={styles.chipText}>{sensorLabel}: {alerta.value} {alerta.unit}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: colors.surfaceInput }]}>
                <Text style={styles.chipText}>Umbral: {alerta.threshold}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.hoursRow, { backgroundColor: inHours ? colors.statusOkTint : colors.surfaceCard, borderColor: inHours ? colors.statusOk : colors.borderDefault }]}>
          <Icon name="clock" size={15} color={inHours ? colors.statusOk : colors.textSecondary} />
          <Text style={[styles.hoursText, { color: inHours ? colors.statusOk : colors.textSecondary }]}>
            {inHours ? "Disponible ahora" : "Fuera de horario de atención (Lun a Sáb, 7 a 20 hs)"}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable onPress={handleCall} style={[styles.actionBtn, { backgroundColor: colors.actionPrimary }]}>
            <Icon name="phone" size={18} color={colors.actionPrimaryText} />
            <Text style={[styles.actionBtnText, { color: colors.actionPrimaryText }]}>Llamar ahora</Text>
          </Pressable>
          <Pressable
            onPress={handleWhatsapp}
            disabled={!inHours}
            style={[styles.actionBtn, { backgroundColor: colors.surfaceCard, borderWidth: 1, borderColor: colors.borderDefault, opacity: inHours ? 1 : 0.5 }]}
          >
            <Icon name="message-circle" size={18} color={colors.textPrimary} />
            <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>WhatsApp</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>O escribinos tu consulta</Text>

        <View style={{ gap: 6, marginBottom: 14 }}>
          {MOTIVOS.map((m) => (
            <Pressable
              key={m.id}
              onPress={() => setMotivo(m.id)}
              style={[styles.optionRow, {
                backgroundColor: motivo === m.id ? colors.statusOkTint : colors.surfaceInput,
                borderColor: motivo === m.id ? colors.actionPrimary : colors.borderDefault,
              }]}
            >
              <View style={[styles.radio, { borderColor: motivo === m.id ? colors.actionPrimary : colors.borderDefault }]}>
                {motivo === m.id && <View style={[styles.radioDot, { backgroundColor: colors.actionPrimary }]} />}
              </View>
              <Text style={[styles.optionText, { color: colors.textPrimary, fontWeight: motivo === m.id ? "600" : "400" }]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          value={msg}
          onChangeText={(t) => setMsg(t.slice(0, 500))}
          placeholder="Contanos qué pasó y qué probaste…"
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          style={[styles.textarea, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault, color: colors.textPrimary }]}
        />
        <Text style={styles.counter}>{msg.trim().length}/500 {msg.trim().length < 10 ? "(mínimo 10 caracteres)" : ""}</Text>

        <Button variant="primary" fullWidth disabled={!canSend} loading={sending} onPress={handleSend} style={{ marginTop: Spacing.sm }}>
          {sending ? "Enviando…" : "Enviar consulta"}
        </Button>

        <Text style={styles.privacyNote}>
          Tu consulta se comparte solo con el equipo técnico de SiloGuard.
        </Text>
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: Spacing.md, paddingBottom: 40 },

    alertCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 14, marginBottom: Spacing.md },
    alertTime: { fontSize: 12, color: c.textSecondary },
    alertTitle: { fontSize: 15, fontWeight: "700", color: c.textPrimary, marginBottom: 2 },
    alertSilo: { fontSize: 13, color: c.textSecondary },
    chip: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 5 },
    chipText: { fontSize: 11, color: c.textSecondary, fontWeight: "600" },

    hoursRow: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: Radius.md, borderWidth: 1, padding: 12, marginBottom: Spacing.md },
    hoursText: { flex: 1, fontSize: 12, fontWeight: "600" },

    actionsRow: { flexDirection: "row", gap: 8, marginBottom: Spacing.lg },
    actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: Radius.md, paddingVertical: 14 },
    actionBtnText: { fontSize: 14, fontWeight: "700" },

    sectionTitle: { fontSize: 15, fontWeight: "700", color: c.textPrimary, marginBottom: Spacing.sm },

    optionRow: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderRadius: Radius.md, padding: 12 },
    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    radioDot: { width: 8, height: 8, borderRadius: 4 },
    optionText: { fontSize: 14, color: c.textPrimary },

    textarea: { borderWidth: 1, borderRadius: Radius.md, padding: 12, fontSize: 14, lineHeight: 20, minHeight: 90, textAlignVertical: "top" },
    counter: { fontSize: 11, color: c.textSecondary, textAlign: "right", marginTop: 4 },

    privacyNote: { fontSize: 11, color: c.textSecondary, textAlign: "center", marginTop: Spacing.md, lineHeight: 16 },

    sentBox: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: Spacing.xl },
    iconCircle: { width: 72, height: 72, borderRadius: 999, alignItems: "center", justifyContent: "center", marginBottom: Spacing.md },
    sentTitle: { fontSize: 20, fontWeight: "700", color: c.textPrimary, marginBottom: 8 },
    sentDesc: { fontSize: 14, color: c.textSecondary, textAlign: "center", lineHeight: 20 },
  });
