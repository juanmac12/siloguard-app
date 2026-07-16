import { useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../constants/Theme";
import { useTheme } from "../contexts/ThemeContext";
import { useAppData } from "../contexts/AppDataContext";
import { useConnState } from "../hooks/useConnState";
import { useToast } from "../components/Toast";
import { Icon, EmptyState, DateField, formatDateEs } from "../components";

const GRAIN_TYPES = ["Soja", "Maíz", "Trigo", "Girasol", "Sorgo", "Cebada", "Otro"];
const STORAGE_TYPES = ["Silo fijo", "Silobolsa"];
const MOCK_WIFI = ["SiloNet-A3F2", "SiloNet-B7D1", "WiFi-SG-002", "Agro-Red-Principal"];

type Step = "qr" | "wifi" | "form";

interface FormState {
  name: string;
  grain: string;
  customGrain: string;
  storage: string;
  tons: string;
  acopio: string;
}

interface FormErrors {
  name?: string;
  grain?: string;
  acopio?: string;
  tons?: string;
}

export default function AgregarSiloScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addSilo } = useAppData();
  const toast = useToast();
  const conn = useConnState();
  const offline = conn.state !== "online";
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [step, setStep] = useState<Step>("qr");
  const [selectedWifi, setSelectedWifi] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [showWifiPassword, setShowWifiPassword] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", grain: "Soja", customGrain: "", storage: "Silo fijo", tons: "", acopio: formatDateEs(new Date()),
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanned(true); }, 1600);
    setTimeout(() => setStep("wifi"), 2200);
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) {
      e.name = "El nombre del silo no puede estar vacío";
    }
    if (form.grain === "Otro" && !form.customGrain.trim()) {
      e.grain = "Especificá el tipo de grano";
    }
    if (!form.acopio.trim()) {
      e.acopio = "La fecha de acopio no puede estar vacía";
    }
    const t = Number(form.tons);
    if (!form.tons.trim()) {
      e.tons = "El tonelaje no puede estar vacío";
    } else if (isNaN(t)) {
      e.tons = "Ingresá un número válido";
    } else if (t <= 0) {
      e.tons = t < 0 ? "El tonelaje no puede ser negativo" : "El tonelaje debe ser mayor a 0";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirm = async () => {
    if (!validate()) return;
    const finalGrain = form.grain === "Otro" ? form.customGrain.trim() : form.grain;
    setSaving(true);
    try {
      await addSilo({
        name: form.name.trim(),
        grain: finalGrain,
        storage: form.storage,
        tons: Number(form.tons),
        acopio: form.acopio.trim(),
      });
      toast.addToast({ tone: "ok", title: "Silo creado", message: `${form.name.trim()} ya está monitoreado.` });
      router.replace("/(tabs)/dashboard" as any);
    } finally {
      setSaving(false);
    }
  };

  const stepIndex = step === "qr" ? 0 : step === "wifi" ? 1 : 2;

  if (offline) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar silo</Text>
        </View>
        <EmptyState
          variant="offline"
          title="Necesitás conexión"
          body="Para vincular un nuevo dispositivo necesitás conexión a internet. Probá de nuevo cuando tengas señal."
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar silo</Text>
        </View>

        {/* Step dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, {
              backgroundColor: i <= stepIndex ? colors.actionPrimary : colors.borderDefault,
              width: i === stepIndex ? 20 : 8,
            }]} />
          ))}
        </View>

        {/* ── Step 1: QR ── */}
        {step === "qr" && (
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Conectar dispositivo</Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              Apuntá la cámara al código QR del módulo SiloGuard para identificarlo.
            </Text>
            <View style={[styles.qrFrame, { borderColor: scanned ? colors.actionPrimary : colors.borderStrong, backgroundColor: colors.surfaceCard }]}>
              {!scanned ? (
                <>
                  <Icon name="scan-qr" size={64} color={scanning ? colors.actionPrimary : colors.textSecondary} />
                  <View style={[styles.qrCorner, styles.qrTL, { borderColor: colors.actionPrimary }]} />
                  <View style={[styles.qrCorner, styles.qrTR, { borderColor: colors.actionPrimary }]} />
                  <View style={[styles.qrCorner, styles.qrBL, { borderColor: colors.actionPrimary }]} />
                  <View style={[styles.qrCorner, styles.qrBR, { borderColor: colors.actionPrimary }]} />
                  {scanning && <View style={[styles.qrScanLine, { backgroundColor: colors.actionPrimary }]} />}
                </>
              ) : (
                <>
                  <View style={[styles.checkCircle, { backgroundColor: colors.statusOkTint }]}>
                    <Icon name="check-circle" size={36} color={colors.statusOk} />
                  </View>
                  <Text style={[styles.scanOkText, { color: colors.statusOk }]}>Dispositivo identificado</Text>
                  <Text style={[styles.scanDevice, { color: colors.textSecondary }]}>SG-MODULE-A3F2</Text>
                </>
              )}
            </View>
            <TouchableOpacity
              onPress={simulateScan}
              disabled={scanning}
              style={[styles.primaryBtn, { backgroundColor: scanning ? colors.surfaceInput : colors.actionPrimary }]}
            >
              <Icon name="scan-qr" size={18} color={scanning ? colors.textSecondary : colors.actionPrimaryText} />
              <Text style={[styles.primaryBtnText, { color: scanning ? colors.textSecondary : colors.actionPrimaryText }]}>
                {scanning ? "Escaneando…" : "Simular escaneo QR"}
              </Text>
            </TouchableOpacity>
            <View style={[styles.infoBox, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              <Icon name="info" size={15} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                El código QR se encuentra en la tapa del módulo sensor SiloGuard.
              </Text>
            </View>
          </ScrollView>
        )}

        {/* ── Step 2: WiFi ── */}
        {step === "wifi" && (
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Seleccioná tu red WiFi</Text>
            <Text style={[styles.stepSub, { color: colors.textSecondary }]}>
              El módulo necesita conectarse a tu red local para enviar datos.
            </Text>
            <View style={{ gap: 6 }}>
              {MOCK_WIFI.map((net) => (
                <Pressable key={net} onPress={() => setSelectedWifi(net)}
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
            {selectedWifi ? (
              <View style={styles.fieldGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Contraseña de la red</Text>
                <View style={[styles.input, styles.passwordRow, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}>
                  <TextInput
                    value={wifiPassword}
                    onChangeText={setWifiPassword}
                    placeholder="Contraseña WiFi"
                    placeholderTextColor={colors.textSecondary}
                    secureTextEntry={!showWifiPassword}
                    style={[styles.passwordInput, { color: colors.textPrimary }]}
                  />
                  <Pressable onPress={() => setShowWifiPassword((s) => !s)} hitSlop={8}>
                    <Icon name={showWifiPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
                  </Pressable>
                </View>
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => { if (selectedWifi && wifiPassword) setStep("form"); }}
              disabled={!selectedWifi || !wifiPassword}
              style={[styles.primaryBtn, { marginTop: 8, backgroundColor: selectedWifi && wifiPassword ? colors.actionPrimary : colors.surfaceInput }]}
            >
              <Text style={[styles.primaryBtnText, { color: selectedWifi && wifiPassword ? colors.actionPrimaryText : colors.textSecondary }]}>Continuar</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* ── Step 3: Form ── */}
        {step === "form" && (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
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
              {errors.name ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.name}</Text> : null}
            </View>

            {/* Tipo de grano */}
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: errors.grain ? colors.statusCritical : colors.textSecondary }]}>Tipo de grano</Text>
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
                  placeholder="Ej: Canola, Centeno…"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.input, { marginTop: 8, backgroundColor: colors.surfaceInput, borderColor: errors.grain ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
                />
              )}
              {errors.grain ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.grain}</Text> : null}
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
              <Text style={[styles.label, { color: errors.tons ? colors.statusCritical : colors.textSecondary }]}>Tonelaje estimado</Text>
              <TextInput
                value={form.tons}
                onChangeText={set("tons")}
                placeholder="Ej: 180"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.tons ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
              />
              {errors.tons ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.tons}</Text> : null}
            </View>

            {/* Fecha de acopio */}
            <View style={styles.fieldGroup}>
              <DateField label="Fecha de acopio" value={form.acopio} onChange={set("acopio")} error={errors.acopio} maximumDate={new Date()} />
            </View>

            <TouchableOpacity
              onPress={confirm}
              disabled={saving}
              style={[styles.primaryBtn, { backgroundColor: saving ? colors.surfaceInput : colors.actionPrimary }]}
            >
              <Icon name="check" size={18} color={saving ? colors.textSecondary : colors.actionPrimaryText} />
              <Text style={[styles.primaryBtnText, { color: saving ? colors.textSecondary : colors.actionPrimaryText }]}>
                {saving ? "Guardando…" : "Confirmar y guardar"}
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
    header: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8, borderBottomWidth: 1,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary },

    dotsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12 },
    dot: { height: 8, borderRadius: 4 },

    scroll: { padding: 16, paddingBottom: 40 },
    stepTitle: { fontSize: 22, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), marginBottom: 6, letterSpacing: -0.3 },
    stepSub: { fontSize: 14, lineHeight: 22, marginBottom: 20, fontFamily: fontFamilyForWeight(FontWeight.regular) },

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
    scanOkText: { fontSize: 15, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold) },
    scanDevice: { fontSize: 12, marginTop: 4, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    wifiRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: Radius.md, borderWidth: 1 },
    wifiName: { flex: 1, fontSize: 14, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    passwordRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    passwordInput: { flex: 1, fontSize: 15, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    primaryBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
      borderRadius: Radius.md, paddingVertical: 14,
    },
    primaryBtnText: { fontSize: 15, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold) },

    infoBox: {
      flexDirection: "row", alignItems: "flex-start", gap: 10,
      padding: 12, borderRadius: Radius.md, borderWidth: 1, marginTop: 12,
    },
    infoText: { flex: 1, fontSize: 13, lineHeight: 20, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    fieldGroup: { marginBottom: 16 },
    label: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
    input: { borderWidth: 1, borderRadius: Radius.md, padding: 12, fontSize: 15, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    errorText: { fontSize: 12, marginTop: 5, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },

    chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    selectChip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6 },
    selectChipText: { fontSize: 13, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },

    storageChip: { flex: 1, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: "center" },
    storageChipText: { fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  });
