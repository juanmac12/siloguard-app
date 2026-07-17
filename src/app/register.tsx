import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppData } from "../contexts/AppDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthHeader, Button, Checkbox, Icon, Input, StepDots } from "../components";
import { FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

function RuleRow({ ok, label }: { ok: boolean; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={ruleStyles.row}>
      <Icon name="check-circle" size={14} color={ok ? colors.statusOk : colors.textSecondary} />
      <Text style={[ruleStyles.label, { color: ok ? colors.statusOk : colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const ruleStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontSize: 12 },
});

export default function RegisterScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { register } = useAppData();
  const styles = makeStyles(colors);

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    establecimiento: "",
    localidad: "",
    accepted: false,
  });

  const update = (key: keyof typeof form, value: string | boolean) => setForm((prev) => ({ ...prev, [key]: value }));

  const ruleLen = form.password.length >= 8;
  const ruleUpper = /[A-Z]/.test(form.password);
  const ruleNum = /[0-9]/.test(form.password);
  const emailOk = /\S+@\S+\.\S+/.test(form.email);
  const step1Valid = !!(form.nombre.trim() && emailOk && form.telefono.trim() && ruleLen && ruleUpper && ruleNum);
  const step2Valid = !!(form.establecimiento.trim() && form.localidad.trim() && form.accepted);

  const goStep2 = () => {
    if (!step1Valid) return;
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  const submit = async () => {
    if (!step2Valid || loading) return;
    setError("");
    setLoading(true);
    try {
      await register({
        name: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.telefono.trim(),
        farmName: form.establecimiento.trim(),
        farmLoc: form.localidad.trim(),
      });
      router.replace(`/verificar-email?email=${encodeURIComponent(form.email.trim())}`);
    } catch {
      setError("Este email ya está registrado. ¿Querés iniciar sesión?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AuthHeader title="Crear cuenta" onBack={handleBack} />
      <View style={styles.dotsRow}>
        <StepDots total={2} active={step - 1} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {step === 1 ? (
          <>
            <Text style={styles.stepLabel}>PASO 1 DE 2 — TUS DATOS</Text>
            <View style={styles.form}>
              <Input label="NOMBRE COMPLETO" placeholder="Juan Pérez" value={form.nombre} onChangeText={(v) => update("nombre", v)} autoCorrect={false} />
              <Input
                label="EMAIL"
                placeholder="juan@email.com"
                value={form.email}
                onChangeText={(v) => update("email", v)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Input
                label="TELÉFONO"
                placeholder="+54 9 341 555-0123"
                value={form.telefono}
                onChangeText={(v) => update("telefono", v)}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
              <Input
                label="CONTRASEÑA"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChangeText={(v) => update("password", v)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                trailingIcon={
                  <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                    <Icon name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
                  </Pressable>
                }
              />
            </View>

            <View style={styles.rules}>
              <RuleRow ok={ruleLen} label="Mínimo 8 caracteres" />
              <RuleRow ok={ruleUpper} label="Al menos 1 mayúscula" />
              <RuleRow ok={ruleNum} label="Al menos 1 número" />
            </View>

            <View style={styles.submitWrap}>
              <Button variant="primary" fullWidth disabled={!step1Valid} onPress={goStep2}>
                Siguiente
              </Button>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>¿Ya tenés cuenta? </Text>
              <Pressable onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Iniciá sesión</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.stepLabel}>PASO 2 DE 2 — TU ESTABLECIMIENTO</Text>
            <View style={styles.form}>
              <Input
                label="ESTABLECIMIENTO"
                placeholder="Estancia La Esperanza"
                value={form.establecimiento}
                onChangeText={(v) => update("establecimiento", v)}
                editable={!loading}
                autoCorrect={false}
              />
              <Input
                label="LOCALIDAD / PROVINCIA"
                placeholder="Pergamino, Buenos Aires"
                value={form.localidad}
                onChangeText={(v) => update("localidad", v)}
                editable={!loading}
                autoCorrect={false}
              />
            </View>

            <View style={styles.checkboxRow}>
              <Checkbox checked={form.accepted} onChange={(v) => update("accepted", v)} disabled={loading} label="Acepto los Términos y condiciones" />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.submitWrap}>
              <Button variant="primary" fullWidth disabled={!step2Valid} loading={loading} onPress={submit}>
                {loading ? "Creando cuenta…" : "Crear cuenta"}
              </Button>
            </View>
            <Text style={styles.smallPrint}>Al registrarte vas a recibir un email para verificar tu cuenta.</Text>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    dotsRow: { alignItems: "center", paddingVertical: 16 },
    scroll: { padding: 24, paddingTop: 8, flexGrow: 1 },
    stepLabel: {
      fontSize: 12,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: c.textSecondary,
      marginBottom: 20,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    form: { gap: 16 },
    rules: { gap: 8, marginTop: 14 },
    submitWrap: { marginTop: 28 },
    footerRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
    footerText: { fontSize: 14, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    footerLink: { fontSize: 14, color: c.textLink, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
    checkboxRow: { marginTop: 20 },
    errorText: { fontSize: 12, color: c.statusCritical, marginTop: 16, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    smallPrint: { fontSize: 11, lineHeight: 16, color: c.textSecondary, textAlign: "center", marginTop: 16, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  });
