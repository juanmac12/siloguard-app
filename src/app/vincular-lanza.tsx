import { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAppData } from "../contexts/AppDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthHeader, Button, Icon, Input, OnboardingStepProgress } from "../components";
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

const WIFI_NETS = [
  { id: "w1", name: "Red_campo_01" },
  { id: "w2", name: "SiloNet_Pro" },
  { id: "w3", name: "Red_campo_02" },
  { id: "w4", name: "iPhone de Lucas" },
];

const TIPOS = ["Silo fijo", "Silobolsa"] as const;
const GRANOS = ["Soja", "Maíz", "Trigo", "Girasol", "Otro"] as const;

type Phase = "qr" | "wifi" | "asignacion";
type QrStatus = "idle" | "scanning" | "ok" | "invalid";
type WifiStatus = "idle" | "connecting" | "error-password" | "error-unreachable";
type AsigStatus = "idle" | "loading" | "error";

export default function VincularLanzaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addSilo } = useAppData();
  const styles = makeStyles(colors);

  const [phase, setPhase] = useState<Phase>("qr");

  const [qrStatus, setQrStatus] = useState<QrStatus>("idle");
  const [showManualQr, setShowManualQr] = useState(false);
  const [manualQrCode, setManualQrCode] = useState("");
  const qrTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const qrAdvanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [selectedWifiId, setSelectedWifiId] = useState<string | null>(null);
  const [showManualSsid, setShowManualSsid] = useState(false);
  const [manualSsid, setManualSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiShowPassword, setWifiShowPassword] = useState(false);
  const [wifiStatus, setWifiStatus] = useState<WifiStatus>("idle");
  const wifiTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const wifiAdvanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [asigNombre, setAsigNombre] = useState("");
  const [asigTipo, setAsigTipo] = useState<(typeof TIPOS)[number]>("Silo fijo");
  const [asigTonelaje, setAsigTonelaje] = useState("");
  const [asigGrano, setAsigGrano] = useState<(typeof GRANOS)[number]>("Soja");
  const [asigGranoCustom, setAsigGranoCustom] = useState("");
  const [asigStatus, setAsigStatus] = useState<AsigStatus>("idle");
  const asigTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleBack = () => {
    if (phase === "qr") {
      router.back();
    } else if (phase === "wifi") {
      setPhase("qr");
    } else {
      setPhase("wifi");
    }
  };

  // ── QR ──
  const qrButtonLabel = qrStatus === "scanning" ? "Leyendo…" : qrStatus === "ok" ? "Continuar" : qrStatus === "invalid" ? "Reintentar" : "Simular escaneo";
  const qrAction = () => {
    if (qrStatus === "scanning") return;
    if (qrStatus === "ok") {
      setPhase("wifi");
      return;
    }
    setQrStatus("scanning");
    clearTimeout(qrTimer.current);
    qrTimer.current = setTimeout(() => {
      setQrStatus("ok");
      clearTimeout(qrAdvanceTimer.current);
      qrAdvanceTimer.current = setTimeout(() => setPhase("wifi"), 700);
    }, 1300);
  };
  const submitManualQr = () => {
    if (!manualQrCode.trim()) return;
    setQrStatus("ok");
    setShowManualQr(false);
    clearTimeout(qrAdvanceTimer.current);
    qrAdvanceTimer.current = setTimeout(() => setPhase("wifi"), 500);
  };

  // ── WiFi ──
  const hasManualSsid = showManualSsid && manualSsid.trim().length > 0;
  const wifiNetworkPicked = !!selectedWifiId || hasManualSsid;
  const wifiPasswordOk = wifiPassword.length > 0;
  const wifiSubmitDisabled = !wifiNetworkPicked || !wifiPasswordOk || wifiStatus === "connecting";
  const wifiButtonLabel =
    wifiStatus === "connecting" ? "Conectando…" : wifiStatus === "error-password" || wifiStatus === "error-unreachable" ? "Reintentar" : "Conectar";
  const wifiErrorMsg =
    wifiStatus === "error-password"
      ? "No se pudo conectar. Verificá la contraseña o acercá el celular al router."
      : wifiStatus === "error-unreachable"
        ? "La lanza no responde. Verificá que esté encendida y cerca del router."
        : "";

  const connectWifi = () => {
    if (wifiSubmitDisabled) return;
    setWifiStatus("connecting");
    clearTimeout(wifiTimer.current);
    wifiTimer.current = setTimeout(() => {
      setWifiStatus("idle");
      clearTimeout(wifiAdvanceTimer.current);
      wifiAdvanceTimer.current = setTimeout(() => setPhase("asignacion"), 500);
    }, 1100);
  };

  // ── Asignación ──
  const asigFilled = asigNombre.trim().length > 0;
  const asigButtonLabel = asigStatus === "loading" ? "Guardando…" : "Guardar y continuar";
  const submitAsignacion = async () => {
    if (!asigFilled || asigStatus === "loading") return;
    setAsigStatus("loading");
    clearTimeout(asigTimer.current);
    asigTimer.current = setTimeout(async () => {
      const grain = asigGrano === "Otro" ? asigGranoCustom.trim() || "Otro" : asigGrano;
      await addSilo({
        name: asigNombre.trim(),
        grain,
        tons: Number(asigTonelaje) || 0,
        acopio: todayStr(),
        storage: asigTipo,
      });
      setAsigStatus("idle");
      router.replace("/tutorial");
    }, 900);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AuthHeader title="Vincular lanza" onBack={handleBack} />
      <OnboardingStepProgress
        step={phase === "asignacion" ? 2 : 1}
        total={2}
        caption={phase === "qr" ? "Paso 1 de 2 — Escaneo QR" : phase === "wifi" ? "Paso 1 de 2 — Conexión WiFi" : "Paso 2 de 2 — Datos del silo"}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {phase === "qr" ? (
          <>
            <View style={styles.centerText}>
              <Text style={styles.subtitle}>Apuntá la cámara al código QR</Text>
              <Text style={styles.caption}>El código está impreso en el lateral de tu lanza SiloGuard.</Text>
            </View>

            <View style={styles.qrViewport}>
              {qrStatus === "idle" ? <Text style={styles.qrIdleLabel}>Vista de cámara</Text> : null}
              {qrStatus === "scanning" ? (
                <View style={styles.qrStateCol}>
                  <View style={styles.qrSpinner} />
                  <Text style={styles.qrScanningLabel}>Leyendo QR…</Text>
                </View>
              ) : null}
              {qrStatus === "ok" ? (
                <View style={styles.qrStateCol}>
                  <View style={[styles.qrResultCircle, { backgroundColor: colors.greenTint, borderColor: colors.actionPrimary }]}>
                    <Icon name="check" size={28} color={colors.actionPrimary} />
                  </View>
                  <Text style={[styles.qrResultLabel, { color: colors.actionPrimary }]}>QR detectado</Text>
                </View>
              ) : null}
              {qrStatus === "invalid" ? (
                <View style={styles.qrStateCol}>
                  <View style={[styles.qrResultCircle, { backgroundColor: colors.statusCriticalTint, borderColor: colors.statusCritical }]}>
                    <Icon name="x-circle" size={28} color={colors.statusCritical} />
                  </View>
                  <Text style={[styles.qrResultLabel, { color: colors.statusCritical }]}>Código inválido</Text>
                </View>
              ) : null}

              {[
                { top: 16, left: 16 },
                { top: 16, right: 16 },
                { bottom: 16, left: 16 },
                { bottom: 16, right: 16 },
              ].map((pos, i) => (
                <View key={i} style={[styles.qrCorner, pos]} />
              ))}
            </View>

            {qrStatus === "invalid" ? <Text style={styles.errorText}>Este código no corresponde a una lanza SiloGuard. Intentá de nuevo.</Text> : null}

            <Button variant="primary" fullWidth disabled={qrStatus === "scanning"} onPress={qrAction}>
              {qrButtonLabel}
            </Button>

            <Text style={styles.linkCentered} onPress={() => setShowManualQr((s) => !s)}>
              {showManualQr ? "Ocultar ingreso manual" : "¿No tenés el código QR o no podés escanear?"}
            </Text>

            {showManualQr ? (
              <View style={styles.manualBlock}>
                <Input label="CÓDIGO DE LA LANZA" placeholder="SG-0000-0000" value={manualQrCode} onChangeText={setManualQrCode} autoCapitalize="characters" />
                <Button variant="secondary" fullWidth disabled={!manualQrCode.trim()} onPress={submitManualQr}>
                  Validar código
                </Button>
              </View>
            ) : null}
          </>
        ) : null}

        {phase === "wifi" ? (
          <>
            <View style={styles.centerText}>
              <View style={styles.wifiIconCircle}>
                <Icon name="wifi" size={24} color={colors.actionPrimary} />
              </View>
              <Text style={styles.subtitle}>Conectá la lanza al WiFi</Text>
              <Text style={styles.caption}>Seleccioná la red del campo para que la lanza pueda transmitir datos.</Text>
            </View>

            <View style={styles.wifiList}>
              {WIFI_NETS.map((net, i) => {
                const selected = selectedWifiId === net.id;
                return (
                  <Pressable
                    key={net.id}
                    onPress={() => {
                      setSelectedWifiId(net.id);
                      setShowManualSsid(false);
                      setWifiStatus("idle");
                    }}
                    style={[
                      styles.wifiRow,
                      i < WIFI_NETS.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.borderDefault } : null,
                      selected ? { backgroundColor: colors.greenTint } : null,
                    ]}
                  >
                    <Icon name="wifi" size={16} color={selected ? colors.actionPrimary : colors.textSecondary} />
                    <Text style={[styles.wifiName, selected ? { color: colors.textPrimary, fontWeight: FontWeight.semibold } : { color: colors.textSecondary }]}>
                      {net.name}
                    </Text>
                    {selected ? <Icon name="check" size={16} color={colors.actionPrimary} /> : null}
                  </Pressable>
                );
              })}
            </View>

            <Text
              style={styles.linkCentered}
              onPress={() => {
                setShowManualSsid((s) => !s);
                setSelectedWifiId(null);
                setWifiStatus("idle");
              }}
            >
              {showManualSsid ? "Elegir red de la lista" : "¿No ves tu red? Ingresarla manualmente"}
            </Text>

            {showManualSsid ? <Input label="NOMBRE DE LA RED (SSID)" placeholder="Ej: Red_del_campo" value={manualSsid} onChangeText={setManualSsid} /> : null}

            {wifiNetworkPicked ? (
              <Input
                label="CONTRASEÑA DE LA RED"
                placeholder="••••••••"
                value={wifiPassword}
                onChangeText={setWifiPassword}
                secureTextEntry={!wifiShowPassword}
                editable={wifiStatus !== "connecting"}
                trailingIcon={
                  <Pressable onPress={() => setWifiShowPassword((s) => !s)} hitSlop={8}>
                    <Icon name={wifiShowPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
                  </Pressable>
                }
              />
            ) : null}

            {wifiErrorMsg ? <Text style={styles.errorText}>{wifiErrorMsg}</Text> : null}

            <Button variant="primary" fullWidth disabled={wifiSubmitDisabled} onPress={connectWifi}>
              {wifiButtonLabel}
            </Button>
          </>
        ) : null}

        {phase === "asignacion" ? (
          <>
            <View style={styles.connectedBanner}>
              <Icon name="check-circle" size={18} color={colors.actionPrimary} />
              <Text style={styles.connectedText}>Lanza conectada correctamente</Text>
            </View>

            <Input label="NOMBRE DEL SILO" placeholder="Ej: Silo Norte, Bolsa 3" value={asigNombre} onChangeText={setAsigNombre} editable={asigStatus !== "loading"} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TIPO DE ALMACENAMIENTO</Text>
              <View style={styles.chipRow}>
                {TIPOS.map((t) => {
                  const active = asigTipo === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setAsigTipo(t)}
                      style={[styles.tipoChip, active ? { backgroundColor: colors.greenTint, borderColor: colors.actionPrimary } : { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}
                    >
                      <Text style={[styles.tipoChipLabel, { color: active ? colors.textPrimary : colors.textSecondary, fontWeight: active ? FontWeight.semibold : FontWeight.regular }]}>{t}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Input
              label="TONELAJE ESTIMADO (OPCIONAL)"
              placeholder="0"
              value={asigTonelaje}
              onChangeText={setAsigTonelaje}
              keyboardType="numeric"
              editable={asigStatus !== "loading"}
            />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TIPO DE GRANO (OPCIONAL)</Text>
              <View style={styles.chipWrapRow}>
                {GRANOS.map((g) => {
                  const active = asigGrano === g;
                  return (
                    <Pressable
                      key={g}
                      onPress={() => setAsigGrano(g)}
                      style={[styles.granoChip, active ? { backgroundColor: colors.greenTint, borderColor: colors.actionPrimary } : { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}
                    >
                      <Text style={[styles.granoChipLabel, { color: active ? colors.textPrimary : colors.textSecondary, fontWeight: active ? FontWeight.semibold : FontWeight.regular }]}>{g}</Text>
                    </Pressable>
                  );
                })}
              </View>
              {asigGrano === "Otro" ? (
                <View style={{ marginTop: 8 }}>
                  <Input placeholder="Escribí el tipo de grano" value={asigGranoCustom} onChangeText={setAsigGranoCustom} />
                </View>
              ) : null}
            </View>

            {asigStatus === "error" ? <Text style={styles.errorText}>No pudimos guardar el silo. Verificá tu conexión e intentá de nuevo.</Text> : null}

            <Button variant="primary" fullWidth disabled={!asigFilled || asigStatus === "loading"} loading={asigStatus === "loading"} onPress={submitAsignacion}>
              {asigButtonLabel}
            </Button>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: 24, paddingTop: 8, gap: 16, flexGrow: 1 },
    centerText: { alignItems: "center", gap: 6 },
    subtitle: { fontSize: 16, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary, textAlign: "center" },
    caption: { fontSize: 12, color: c.textSecondary, textAlign: "center", fontFamily: fontFamilyForWeight(FontWeight.regular) },
    qrViewport: {
      aspectRatio: 1,
      backgroundColor: "#000",
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: c.borderDefault,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    },
    qrIdleLabel: { fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: fontFamilyForWeight(FontWeight.regular) },
    qrStateCol: { alignItems: "center", gap: 10 },
    qrSpinner: { width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: c.actionPrimary, borderTopColor: "transparent" },
    qrScanningLabel: { fontSize: 13, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    qrResultCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, alignItems: "center", justifyContent: "center" },
    qrResultLabel: { fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
    qrCorner: { position: "absolute", width: 22, height: 22, borderColor: c.actionPrimary },
    errorText: { fontSize: 12, color: c.statusCritical, textAlign: "center", fontFamily: fontFamilyForWeight(FontWeight.regular) },
    linkCentered: { fontSize: 13, color: c.textSecondary, textDecorationLine: "underline", textAlign: "center", fontFamily: fontFamilyForWeight(FontWeight.regular) },
    manualBlock: { gap: 12 },
    wifiIconCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: c.greenTint,
      borderWidth: 1,
      borderColor: "rgba(34,197,94,0.25)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
    },
    wifiList: { backgroundColor: c.surfaceCard, borderWidth: 1, borderColor: c.borderDefault, borderRadius: Radius.lg, overflow: "hidden" },
    wifiRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 13 },
    wifiName: { flex: 1, fontSize: 14, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    connectedBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 13,
      backgroundColor: c.greenTint,
      borderWidth: 1,
      borderColor: "rgba(34,197,94,0.25)",
      borderRadius: Radius.lg,
    },
    connectedText: { fontSize: 13, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.actionPrimary },
    fieldGroup: { gap: 8 },
    fieldLabel: { fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    chipRow: { flexDirection: "row", gap: Spacing.sm },
    tipoChip: { flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: Radius.md, borderWidth: 1, alignItems: "center" },
    tipoChipLabel: { fontSize: 13 },
    chipWrapRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
    granoChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: Radius.full, borderWidth: 1 },
    granoChipLabel: { fontSize: 13 },
  });
