import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, Linking, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../constants/Theme";
import { useTheme } from "../contexts/ThemeContext";
import { useAppData } from "../contexts/AppDataContext";
import { useConnState } from "../hooks/useConnState";
import { useTechAvailability } from "../hooks/useTechAvailability";
import { useToast } from "../components/Toast";
import { Icon, Button, StatusBadge, StatusDot } from "../components";

const PHONE_DISPLAY = "011 4000-1234";
const PHONE_TEL = "+5491140001234";
const WHATSAPP_NUMBER = "5491140001234";

const MOTIVOS = [
  { id: "confirmar", label: "Necesito confirmar una acción" },
  { id: "no-funciono", label: "La acción recomendada no funcionó" },
  { id: "otro", label: "Otro motivo" },
];

const LBL = {
  fontSize: 11,
  fontWeight: FontWeight.semibold,
  fontFamily: fontFamilyForWeight(FontWeight.semibold),
  letterSpacing: 0.6,
  textTransform: "uppercase" as const,
  marginBottom: 8,
};

const SENSOR_LABEL: Record<string, string> = { temp: "Temp.", humidity: "Humedad", co2: "CO₂" };
const SENSOR_UNIT: Record<string, string> = { temp: "°C", humidity: "%", co2: "ppm" };

function timeStr(d: Date): string {
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export default function ContactoTecnicoScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { alerts } = useAppData();
  const conn = useConnState();
  const { inHours } = useTechAvailability();
  const toast = useToast();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { alertId } = useLocalSearchParams<{ alertId?: string }>();

  const alerta = alertId ? alerts.find((a) => a.id === Number(alertId)) : undefined;
  const offline = conn.state !== "online";
  const cr = alerta?.variant === "critical";
  const sensorLabel = alerta ? SENSOR_LABEL[alerta.sensor] ?? "Lectura" : "";
  const unit = alerta ? SENSOR_UNIT[alerta.sensor] ?? "" : "";

  const [showForm, setShowForm] = useState(!inHours);
  useEffect(() => setShowForm(!inHours), [inHours]);

  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  const callDisabled = !inHours;
  const messageDisabled = !inHours || offline;
  const canSubmit = !!motivo && mensaje.trim().length >= 10 && !offline;

  const doCall = () => {
    if (callDisabled) return;
    Linking.openURL(`tel:${PHONE_TEL}`).catch(() => toast.addToast({ tone: "critical", title: "No se pudo iniciar la llamada" }));
  };

  const doWhatsapp = () => {
    if (messageDisabled) return;
    const text = `Hola, soy productor de SiloGuard.\nSilo: ${alerta?.silo ?? ""}\nAlerta: ${alerta?.title ?? ""}`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`).catch(() =>
      toast.addToast({ tone: "critical", title: "No se pudo abrir WhatsApp" })
    );
  };

  const submit = () => {
    if (!canSubmit) return;
    setState("sending");
    setTimeout(() => setState("sent"), 900);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Contactar técnico</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {offline && (
          <View style={[styles.offlineBox, { backgroundColor: "rgba(245,158,11,0.06)", borderColor: colors.statusWarn }]}>
            <Icon name="wifi-off" size={16} color={colors.statusWarn} />
            <View style={{ flex: 1 }}>
              <Text style={styles.offlineTitle}>Necesitás conexión para contactar al técnico por mensaje</Text>
              <Text style={styles.offlineBody}>Podés llamar directamente — la llamada no requiere internet.</Text>
            </View>
          </View>
        )}

        {alerta && (
          <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <StatusBadge tone={cr ? "critical" : "warn"} label={cr ? "Crítica" : "Advertencia"} />
              <Text style={styles.alertTime}>{alerta.time}</Text>
            </View>
            <Text style={styles.alertTitle}>{alerta.title}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Icon name="map-pin" size={13} color={colors.textSecondary} />
              <Text style={styles.alertSilo}>{alerta.silo}</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View style={[styles.valueChip, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}>
                <Text style={[styles.valueChipValue, { color: cr ? colors.statusCritical : colors.statusWarn }]}>{alerta.value} {unit}</Text>
                <Text style={styles.valueChipLabel}>{sensorLabel}</Text>
              </View>
              <View style={[styles.valueChip, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}>
                <Text style={[styles.valueChipValue, { color: colors.textSecondary }]}>{alerta.threshold ?? "—"}</Text>
                <Text style={styles.valueChipLabel}>Umbral</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <StatusDot tone={inHours ? "ok" : "warn"} size={9} glow />
            <Text style={[styles.availText, { color: inHours ? colors.statusOk : colors.statusWarn }]}>
              {inHours ? "Disponible ahora" : "Fuera de horario de atención"}
            </Text>
          </View>
          <Text style={styles.availSub}>Lunes a sábados, 7:00 a 20:00 · Ahora son las {timeStr(new Date())}</Text>
        </View>

        {!inHours && (
          <View style={[styles.warnBox, { backgroundColor: "rgba(245,158,11,0.07)", borderColor: colors.statusWarn }]}>
            <Text style={styles.warnBoxText}>Fuera de horario de atención. Dejá tu consulta y te respondemos a primera hora.</Text>
          </View>
        )}

        <View style={{ gap: 10 }}>
          <View>
            <Button variant="primary" fullWidth disabled={callDisabled} onPress={doCall} leadingIcon={<Icon name="phone" size={18} color={colors.actionPrimaryText} />}>
              Llamar ahora
            </Button>
            <Text style={styles.phoneHint}>{PHONE_DISPLAY}</Text>
          </View>
          <Button variant="secondary" fullWidth disabled={messageDisabled} onPress={doWhatsapp} leadingIcon={<Icon name="message-circle" size={18} color={colors.textPrimary} />}>
            Enviar mensaje (WhatsApp)
          </Button>
          {callDisabled ? (
            <View style={styles.hintRow}>
              <Icon name="clock" size={12} color={colors.textMuted} />
              <Text style={styles.hintText}>Fuera de horario — dejá tu consulta abajo</Text>
            </View>
          ) : messageDisabled ? (
            <View style={styles.hintRow}>
              <Icon name="wifi-off" size={12} color={colors.textMuted} />
              <Text style={styles.hintText}>Requiere conexión</Text>
            </View>
          ) : null}
        </View>

        {inHours && !showForm && state === "idle" && (
          <Pressable onPress={() => setShowForm(true)} style={styles.writeLink}>
            <Icon name="edit" size={13} color={colors.actionPrimary} />
            <Text style={styles.writeLinkText}>Prefiero dejar mi consulta por escrito</Text>
          </Pressable>
        )}

        {showForm && state !== "sent" && (
          <View style={[styles.formWrap, { borderTopColor: colors.borderDefault }]}>
            <Text style={[LBL, { color: colors.textMuted }]}>¿Por qué motivo nos contactás?</Text>
            <View style={{ gap: 6 }}>
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
                  <Text style={[styles.optionText, { fontWeight: motivo === m.id ? FontWeight.semibold : FontWeight.regular }]}>{m.label}</Text>
                </Pressable>
              ))}
            </View>

            <View>
              <Text style={[LBL, { color: colors.textMuted }]}>Tu consulta</Text>
              <TextInput
                value={mensaje}
                onChangeText={(t) => setMensaje(t.slice(0, 500))}
                maxLength={500}
                multiline
                numberOfLines={4}
                placeholder="Ej: la aireación no bajó el CO₂ después de 6 horas."
                placeholderTextColor={colors.textMuted}
                style={[styles.textarea, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault, color: colors.textPrimary }]}
              />
              <Text style={styles.charCount}>{mensaje.length}/500</Text>
            </View>

            <Button variant="primary" fullWidth disabled={!canSubmit || state === "sending"} loading={state === "sending"} onPress={submit}>
              Enviar consulta
            </Button>
            {offline && (
              <View style={styles.hintRow}>
                <Icon name="wifi-off" size={12} color={colors.textMuted} />
                <Text style={styles.hintText}>Necesitás conexión para enviar tu consulta</Text>
              </View>
            )}
            <Text style={styles.footNote}>
              {inHours ? "Te respondemos a la brevedad." : "Te contactamos a primera hora del próximo horario de atención."}
            </Text>
          </View>
        )}

        {state === "sent" && (
          <View style={styles.sentWrap}>
            <View style={[styles.sentIcon, { backgroundColor: colors.greenTint, borderColor: colors.actionPrimary }]}>
              <Icon name="check-circle" size={30} color={colors.actionPrimary} />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.sentTitle}>Consulta enviada</Text>
              <Text style={styles.sentBody}>
                Te respondemos pronto{!inHours ? ", a primera hora del próximo horario de atención" : ""}.
              </Text>
            </View>
            <Button variant="ghost" onPress={() => router.back()}>Volver a la alerta</Button>
          </View>
        )}

        {state !== "sent" && (
          <Text style={styles.privacyNote}>Al contactar aceptás compartir los datos actuales del silo con el técnico.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary },

    scroll: { padding: 16, gap: 16, paddingBottom: 32 },

    offlineBox: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 12, borderRadius: Radius.lg, borderWidth: 1 },
    offlineTitle: { fontSize: 13, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary },
    offlineBody: { fontSize: 12, color: c.textSecondary, marginTop: 2, lineHeight: 17, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    card: { borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    alertTime: { fontSize: 12, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    alertTitle: { fontSize: 15, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: c.textPrimary, marginBottom: 3 },
    alertSilo: { fontSize: 13, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    valueChip: { flex: 1, borderRadius: Radius.md, borderWidth: 1, padding: 10 },
    valueChipValue: { fontSize: 17, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.2 },
    valueChipLabel: { fontSize: 10, color: c.textMuted, letterSpacing: 0.4, textTransform: "uppercase", marginTop: 3, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    availText: { fontSize: 14, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold) },
    availSub: { fontSize: 12, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    warnBox: { padding: 12, borderRadius: Radius.lg, borderWidth: 1 },
    warnBoxText: { fontSize: 13, color: c.textPrimary, lineHeight: 19, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    phoneHint: { textAlign: "center", marginTop: 6, fontSize: 12, color: c.textMuted, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    hintRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    hintText: { fontSize: 11.5, color: c.textMuted, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    writeLink: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
    writeLinkText: { fontSize: 13, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium), color: c.actionPrimary, textDecorationLine: "underline" },

    formWrap: { gap: 12, paddingTop: 14, borderTopWidth: 1 },
    optionRow: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderRadius: Radius.md, padding: 12 },
    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    radioDot: { width: 8, height: 8, borderRadius: 4 },
    optionText: { fontSize: 14, color: c.textPrimary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    textarea: { borderWidth: 1, borderRadius: Radius.md, padding: 11, fontSize: 14, lineHeight: 20, minHeight: 88, textAlignVertical: "top", fontFamily: fontFamilyForWeight(FontWeight.regular) },
    charCount: { textAlign: "right", marginTop: 4, fontSize: 11, color: c.textMuted, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    footNote: { fontSize: 12, color: c.textMuted, lineHeight: 18, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    sentWrap: { alignItems: "center", gap: 14, paddingVertical: 24, paddingHorizontal: 8 },
    sentIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center", borderWidth: 1 },
    sentTitle: { fontSize: 16, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: c.textPrimary, marginBottom: 4 },
    sentBody: { fontSize: 13, color: c.textSecondary, lineHeight: 19, textAlign: "center", maxWidth: 260, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    privacyNote: { fontSize: 11, color: c.textMuted, lineHeight: 16, textAlign: "center", marginTop: 4, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  });
