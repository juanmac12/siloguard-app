import { useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemeColors, Radius } from "../constants/Theme";
import { useTheme } from "../contexts/ThemeContext";
import { useAppData } from "../contexts/AppDataContext";
import { ApiError } from "../config/api";
import { Icon, AuthHeader, OnboardingStepProgress } from "../components";

const GRAIN_TYPES = ["Soja", "Maíz", "Trigo", "Girasol", "Otro"];
const STORAGE_TYPES = ["Silo fijo", "Silobolsa"];
const MOCK_WIFI = ["Red_campo_01", "SiloNet_Pro", "Red_campo_02"];

type Step = "qr" | "wifi" | "form";
type QrPhase = "idle" | "scanning" | "ok" | "denied";
type WifiPhase = "idle" | "connecting" | "ok" | "error";

interface FormState {
  name: string;
  grain: string;
  customGrain: string;
  storage: string;
  tons: string;
}

interface FormErrors {
  name?: string;
  grain?: string;
  tons?: string;
}

export default function AgregarSiloScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addSilo, notify } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const params = useLocalSearchParams<{ onboarding?: string }>();
  const isOnboarding = params.onboarding === "1";

  const [step, setStep] = useState<Step>("qr");

  // ── QR state ──
  const [qrPhase, setQrPhase] = useState<QrPhase>("idle");
  const [manualCodeMode, setManualCodeMode] = useState(false);
  const [manualCode, setManualCode] = useState("");

  // ── WiFi state ──
  const [selectedWifi, setSelectedWifi] = useState("");
  const [manualSsidMode, setManualSsidMode] = useState(false);
  const [manualSsid, setManualSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiPhase, setWifiPhase] = useState<WifiPhase>("idle");
  const [wifiError, setWifiError] = useState("");

  // ── Form state ──
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", grain: "Soja", customGrain: "", storage: "Silo fijo", tons: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const finishOnboardingOrDashboard = () => {
    router.replace(isOnboarding ? "/tutorial" : ("/(tabs)/dashboard" as any));
  };

  // ── QR handlers ──
  const simulateScan = () => {
    setQrPhase("scanning");
    setTimeout(() => setQrPhase("ok"), 1600);
    setTimeout(() => setStep("wifi"), 2200);
  };

  const validateManualCode = () => {
    const pattern = /^SG-\d{4}-\d{4}$/i;
    if (!pattern.test(manualCode.trim())) {
      Alert.alert("Código inválido", "Ingresá el código con el formato SG-0000-0000.");
      return;
    }
    setQrPhase("ok");
    setTimeout(() => setStep("wifi"), 400);
  };

  // ── WiFi handlers ──
  const activeSsid = manualSsidMode ? manualSsid.trim() : selectedWifi;

  const connectWifi = () => {
    if (!activeSsid) return;
    setWifiPhase("connecting");
    setWifiError("");
    setTimeout(() => {
      if (wifiPassword.trim().length > 0 && wifiPassword.trim().length < 8) {
        setWifiPhase("error");
        setWifiError("Contraseña incorrecta. Verificá e intentá de nuevo.");
        return;
      }
      setWifiPhase("ok");
      setTimeout(() => setStep("form"), 500);
    }, 1400);
  };

  // ── Form handlers ──
  function r1(n: number) { return Math.round(n * 10) / 10; }

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) {
      e.name = "El nombre del silo no puede estar vacío";
    }
    if (form.grain === "Otro" && !form.customGrain.trim()) {
      e.grain = "Especificá el tipo de grano";
    }
    if (form.tons.trim()) {
      const t = Number(form.tons);
      if (isNaN(t) || t <= 0) {
        e.tons = "Ingresá un número válido";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirm = async () => {
    if (!validate()) return;
    const finalGrain = form.grain === "Otro" ? form.customGrain.trim() : form.grain;
    setSaving(true);
    try {
      // La lanza todavía no manda una lectura real (QR/WiFi son simulación),
      // así que se envía una lectura inicial plausible junto con el alta del silo —
      // el backend la persiste en la misma transacción (POST /api/silos).
      await addSilo({
        name: form.name.trim(),
        grain: finalGrain,
        storage: form.storage,
        tons: form.tons.trim() ? Number(form.tons) : 0,
        acopio: new Date().toISOString().slice(0, 10),
        initialTemp: r1(22 + Math.random() * 3),
        initialHum: r1(12 + Math.random() * 2),
        initialCo2: Math.round(380 + Math.random() * 40),
      });
      notify("Silo creado exitosamente");
      finishOnboardingOrDashboard();
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "No se pudo crear el silo. Intentá de nuevo.";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const onboardingStep = step === "form" ? 2 : 1;
  const onboardingCaption =
    step === "qr" ? "Paso 1 de 2 — Escaneo QR"
    : step === "wifi" ? "Paso 1 de 2 — Conexión WiFi"
    : "Paso 2 de 2 — Datos del silo";

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <AuthHeader
          title="Vincular lanza"
          showBack={!isOnboarding || step !== "qr"}
          onBack={() => {
            if (step === "wifi") setStep("qr");
            else if (step === "form") setStep("wifi");
            else router.back();
          }}
        />

        <OnboardingStepProgress step={onboardingStep} total={2} caption={onboardingCaption} />

        {/* ── Step 1a: QR ── */}
        {step === "qr" && (
          <ScrollView contentContainerStyle={styles.scroll}>
            {qrPhase === "denied" ? (
              <View style={[styles.deniedBox, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
                <Icon name="wifi-off" size={40} color={colors.textSecondary} />
                <Text style={[styles.stepTitle, { color: colors.textPrimary, marginTop: 12 }]}>No tenés acceso a la cámara</Text>
                <Text style={[styles.stepSub, { color: colors.textSecondary, marginBottom: 12 }]}>
                  Activá el permiso de cámara para escanear el código QR de la lanza.
                </Text>
                <TouchableOpacity onPress={() => setQrPhase("idle")} style={[styles.primaryBtn, { backgroundColor: colors.actionPrimary }]}>
                  <Text style={[styles.primaryBtnText, { color: colors.actionPrimaryText }]}>Reintentar acceso</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Apuntá la cámara al código QR</Text>
                <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
                  El código está impreso en el lateral de tu lanza SiloGuard.
                </Text>
                <View style={[styles.qrFrame, { borderColor: qrPhase === "ok" ? colors.actionPrimary : colors.borderStrong, backgroundColor: colors.surfaceCard }]}>
                  {qrPhase !== "ok" ? (
                    <>
                      <Icon name="scan-qr" size={64} color={qrPhase === "scanning" ? colors.actionPrimary : colors.textSecondary} />
                      <View style={[styles.qrCorner, styles.qrTL, { borderColor: colors.actionPrimary }]} />
                      <View style={[styles.qrCorner, styles.qrTR, { borderColor: colors.actionPrimary }]} />
                      <View style={[styles.qrCorner, styles.qrBL, { borderColor: colors.actionPrimary }]} />
                      <View style={[styles.qrCorner, styles.qrBR, { borderColor: colors.actionPrimary }]} />
                      {qrPhase === "scanning" && <View style={[styles.qrScanLine, { backgroundColor: colors.actionPrimary }]} />}
                    </>
                  ) : (
                    <>
                      <View style={[styles.checkCircle, { backgroundColor: colors.statusOkTint }]}>
                        <Icon name="check-circle" size={36} color={colors.statusOk} />
                      </View>
                      <Text style={[styles.scanOkText, { color: colors.statusOk }]}>QR detectado</Text>
                      <Text style={[styles.scanDevice, { color: colors.textSecondary }]}>SG-0421-8837</Text>
                    </>
                  )}
                </View>

                {!manualCodeMode ? (
                  <>
                    <TouchableOpacity
                      onPress={simulateScan}
                      disabled={qrPhase === "scanning" || qrPhase === "ok"}
                      style={[styles.primaryBtn, { backgroundColor: qrPhase === "scanning" ? colors.surfaceInput : colors.actionPrimary }]}
                    >
                      <Icon name="scan-qr" size={18} color={qrPhase === "scanning" ? colors.textSecondary : colors.actionPrimaryText} />
                      <Text style={[styles.primaryBtnText, { color: qrPhase === "scanning" ? colors.textSecondary : colors.actionPrimaryText }]}>
                        {qrPhase === "scanning" ? "Leyendo…" : "Simular escaneo"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setManualCodeMode(true)} style={styles.linkBtn}>
                      <Text style={[styles.linkText, { color: colors.primary }]}>
                        ¿No tenés el código QR o no podés escanear?
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setQrPhase("denied")} style={styles.linkBtn}>
                      <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                        No tengo acceso a la cámara
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Código de la lanza</Text>
                    <TextInput
                      value={manualCode}
                      onChangeText={setManualCode}
                      placeholder="SG-0000-0000"
                      autoCapitalize="characters"
                      placeholderTextColor={colors.textSecondary}
                      style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault, color: colors.textPrimary }]}
                    />
                    <TouchableOpacity onPress={validateManualCode} style={[styles.primaryBtn, { marginTop: 12, backgroundColor: colors.actionPrimary }]}>
                      <Text style={[styles.primaryBtnText, { color: colors.actionPrimaryText }]}>Validar código</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setManualCodeMode(false)} style={styles.linkBtn}>
                      <Text style={[styles.linkText, { color: colors.textSecondary }]}>Volver a escanear</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={[styles.infoBox, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
                  <Icon name="info" size={15} color={colors.textSecondary} />
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    El código QR se encuentra impreso en el lateral de tu lanza SiloGuard.
                  </Text>
                </View>
              </>
            )}
          </ScrollView>
        )}

        {/* ── Step 1b: WiFi ── */}
        {step === "wifi" && (
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Conectá la lanza al WiFi</Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              Seleccioná la red del campo para que la lanza pueda transmitir datos.
            </Text>

            {!manualSsidMode ? (
              <>
                <View style={{ gap: 6 }}>
                  {MOCK_WIFI.map((net) => (
                    <Pressable key={net} onPress={() => { setSelectedWifi(net); setWifiPhase("idle"); setWifiError(""); }}
                      style={[styles.wifiRow, {
                        backgroundColor: selectedWifi === net ? colors.statusOkTint : colors.surfaceCard,
                        borderColor: selectedWifi === net ? colors.actionPrimary : colors.borderDefault,
                      }]}
                    >
                      <Icon name="wifi" size={18} color={selectedWifi === net ? colors.actionPrimary : colors.textSecondary} />
                      <Text style={[styles.wifiName, { color: selectedWifi === net ? colors.textPrimary : colors.textSecondary, fontWeight: selectedWifi === net ? "600" : "400" }]}>
                        {net}
                      </Text>
                      {selectedWifi === net && <Icon name="check" size={16} color={colors.actionPrimary} />}
                    </Pressable>
                  ))}
                </View>
                <TouchableOpacity onPress={() => setManualSsidMode(true)} style={styles.linkBtn}>
                  <Text style={[styles.linkText, { color: colors.primary }]}>¿No ves tu red? Ingresarla manualmente</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Nombre de la red (SSID)</Text>
                <TextInput
                  value={manualSsid}
                  onChangeText={setManualSsid}
                  placeholder="Ej: Red_campo_03"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault, color: colors.textPrimary }]}
                />
                <TouchableOpacity onPress={() => setManualSsidMode(false)} style={styles.linkBtn}>
                  <Text style={[styles.linkText, { color: colors.textSecondary }]}>Elegir de la lista</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeSsid ? (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Contraseña de la red</Text>
                <TextInput
                  value={wifiPassword}
                  onChangeText={(v) => { setWifiPassword(v); setWifiPhase("idle"); setWifiError(""); }}
                  placeholder="••••••••"
                  secureTextEntry
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: wifiPhase === "error" ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
                />
                {wifiPhase === "error" ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{wifiError}</Text> : null}
              </View>
            ) : null}

            <TouchableOpacity
              onPress={connectWifi}
              disabled={!activeSsid || wifiPhase === "connecting"}
              style={[styles.primaryBtn, { marginTop: 20, backgroundColor: activeSsid && wifiPhase !== "connecting" ? colors.actionPrimary : colors.surfaceInput }]}
            >
              <Text style={[styles.primaryBtnText, { color: activeSsid && wifiPhase !== "connecting" ? colors.actionPrimaryText : colors.textSecondary }]}>
                {wifiPhase === "connecting" ? "Conectando…" : wifiPhase === "error" ? "Reintentar" : "Conectar"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ── Step 2: Form ── */}
        {step === "form" && (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={[styles.successChip, { backgroundColor: colors.statusOkTint }]}>
              <Icon name="check-circle" size={16} color={colors.statusOk} />
              <Text style={[styles.successChipText, { color: colors.statusOk }]}>Lanza conectada correctamente</Text>
            </View>

            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Datos del silo</Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>Completá la información para identificar este silo en tu cuenta.</Text>

            {/* Nombre */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Nombre del silo</Text>
              <TextInput
                value={form.name}
                onChangeText={set("name")}
                placeholder="Ej: Silo Norte"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.name ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
              />
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>Podés cambiarlo después desde el detalle del silo.</Text>
              {errors.name ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.name}</Text> : null}
            </View>

            {/* Tipo de almacenamiento */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo de almacenamiento</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {STORAGE_TYPES.map((s) => (
                  <Pressable key={s} onPress={() => setForm((f) => ({ ...f, storage: s }))}
                    style={[styles.storageChip, {
                      backgroundColor: form.storage === s ? colors.actionPrimary : colors.surfaceInput,
                      borderColor: form.storage === s ? colors.actionPrimary : colors.borderDefault,
                    }]}>
                    <Text style={[styles.storageChipText, { color: form.storage === s ? colors.actionPrimaryText : colors.textSecondary }]}>{s}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Tonelaje */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: errors.tons ? colors.statusCritical : colors.textSecondary }]}>Tonelaje estimado (opcional)</Text>
              <TextInput
                value={form.tons}
                onChangeText={set("tons")}
                placeholder="Ej: 180"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.tons ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
              />
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>En toneladas (tn)</Text>
              {errors.tons ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.tons}</Text> : null}
            </View>

            {/* Tipo de grano */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: errors.grain ? colors.statusCritical : colors.textSecondary }]}>Tipo de grano (opcional)</Text>
              <View style={styles.chipWrap}>
                {GRAIN_TYPES.map((g) => (
                  <Pressable key={g} onPress={() => { setForm((f) => ({ ...f, grain: g, customGrain: g !== "Otro" ? f.customGrain : "" })); setErrors((e) => ({ ...e, grain: undefined })); }}
                    style={[styles.selectChip, {
                      backgroundColor: form.grain === g ? colors.actionPrimary : colors.surfaceInput,
                      borderColor: form.grain === g ? colors.actionPrimary : (errors.grain ? colors.statusCritical : colors.borderDefault),
                    }]}>
                    <Text style={[styles.selectChipText, { color: form.grain === g ? colors.actionPrimaryText : colors.textSecondary }]}>{g}</Text>
                  </Pressable>
                ))}
              </View>
              {form.grain === "Otro" && (
                <TextInput
                  value={form.customGrain}
                  onChangeText={set("customGrain")}
                  placeholder="Ej: Sorgo, Cebada…"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { marginTop: 8, backgroundColor: colors.surfaceInput, borderColor: errors.grain ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
                />
              )}
              {errors.grain ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.grain}</Text> : null}
            </View>

            <TouchableOpacity
              onPress={confirm}
              disabled={saving}
              style={[styles.primaryBtn, { backgroundColor: saving ? colors.surfaceInput : colors.actionPrimary }]}
            >
              <Icon name="check" size={18} color={saving ? colors.textSecondary : colors.actionPrimaryText} />
              <Text style={[styles.primaryBtnText, { color: saving ? colors.textSecondary : colors.actionPrimaryText }]}>
                {saving ? "Guardando…" : "Guardar y continuar"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },

    scroll: { padding: 16, paddingBottom: 40 },
    stepTitle: { fontSize: 22, fontWeight: "700", marginBottom: 6, letterSpacing: -0.3 },
    stepSub: { fontSize: 14, lineHeight: 22, marginBottom: 20 },

    qrFrame: {
      height: 240, borderRadius: Radius.xl, borderWidth: 2,
      alignItems: "center", justifyContent: "center", marginBottom: 16, overflow: "hidden", position: "relative",
    },
    qrCorner: { position: "absolute", width: 24, height: 24, borderWidth: 3 },
    qrTL: { top: 16, left: 16, borderRightWidth: 0, borderBottomWidth: 0 },
    qrTR: { top: 16, right: 16, borderLeftWidth: 0, borderBottomWidth: 0 },
    qrBL: { bottom: 16, left: 16, borderRightWidth: 0, borderTopWidth: 0 },
    qrBR: { bottom: 16, right: 16, borderLeftWidth: 0, borderTopWidth: 0 },
    qrScanLine: { position: "absolute", left: 20, right: 20, height: 2, top: "50%", borderRadius: 1, opacity: 0.8 },
    checkCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 10 },
    scanOkText: { fontSize: 15, fontWeight: "700" },
    scanDevice: { fontSize: 12, marginTop: 4 },

    deniedBox: { alignItems: "center", padding: 24, borderRadius: Radius.xl, borderWidth: 1, marginTop: 20 },

    wifiRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: Radius.md, borderWidth: 1 },
    wifiName: { flex: 1, fontSize: 14 },

    linkBtn: { paddingVertical: 12, alignItems: "center" },
    linkText: { fontSize: 13, fontWeight: "600" },

    primaryBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
      borderRadius: Radius.md, paddingVertical: 14,
    },
    primaryBtnText: { fontSize: 15, fontWeight: "700" },

    infoBox: {
      flexDirection: "row", alignItems: "flex-start", gap: 10,
      padding: 12, borderRadius: Radius.md, borderWidth: 1, marginTop: 12,
    },
    infoText: { flex: 1, fontSize: 13, lineHeight: 20 },

    successChip: {
      flexDirection: "row", alignItems: "center", gap: 8,
      alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: Radius.full, marginBottom: 16,
    },
    successChipText: { fontSize: 13, fontWeight: "600" },

    fieldGroup: { marginBottom: 16 },
    label: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
    input: { borderWidth: 1, borderRadius: Radius.md, padding: 12, fontSize: 15 },
    hintText: { fontSize: 12, marginTop: 5 },
    errorText: { fontSize: 12, marginTop: 5, fontWeight: "500" },

    chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    selectChip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6 },
    selectChipText: { fontSize: 13, fontWeight: "500" },

    storageChip: { flex: 1, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: "center" },
    storageChipText: { fontSize: 14, fontWeight: "600" },
  });
