import { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../config/firebase";
import { ApiError } from "../config/api";
import { useAppData } from "../contexts/AppDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { Spacing, FontSize, Radius, ThemeColors } from "../constants/Theme";
import { Button, Input, AuthHeader, AuthStepDots, Icon } from "../components";

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Ya existe una cuenta con ese email.";
    case "auth/invalid-email":
      return "El email no es válido.";
    case "auth/weak-password":
      return "La contraseña es muy débil. Usá al menos 8 caracteres.";
    default:
      return "Ocurrió un error. Intentá de nuevo.";
  }
}

const passwordRules = (password: string) => ({
  length: password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
});

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAppData();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [step, setStep] = useState(0); // 0: datos, 1: establecimiento
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    establecimiento: "",
    localidad: "",
    password: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const rules = passwordRules(form.password);
  const passwordValid = rules.length && rules.uppercase && rules.number;

  const handleNext = () => {
    if (!form.nombre.trim() || !form.email.trim()) {
      Alert.alert("Error", "Completá tu nombre y email.");
      return;
    }
    if (!passwordValid) {
      Alert.alert("Error", "La contraseña no cumple los requisitos.");
      return;
    }
    setStep(1);
  };

  const handleRegister = async () => {
    if (!form.establecimiento.trim()) {
      Alert.alert("Error", "Completá el nombre de tu establecimiento.");
      return;
    }
    if (!acceptedTerms) {
      Alert.alert("Error", "Tenés que aceptar los Términos y condiciones.");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );
      await sendEmailVerification(credential.user);

      try {
        await register({
          name: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.telefono.trim() || undefined,
          farmName: form.establecimiento.trim(),
          farmLoc: form.localidad.trim() || undefined,
        });
      } catch (backendError) {
        // La cuenta de Firebase ya se creó — si el backend falla (ej. email
        // duplicado en la base propia) la deshacemos para poder reintentar.
        await credential.user.delete().catch(() => {});
        throw backendError;
      }

      router.replace({ pathname: "/verificar-email", params: { email: form.email.trim() } });
    } catch (error: any) {
      const msg =
        error instanceof ApiError
          ? error.message
          : typeof error?.code === "string"
            ? firebaseErrorMessage(error.code)
            : "Ocurrió un error. Intentá de nuevo.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      setStep(0);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AuthHeader title="Crear cuenta" showBack onBack={handleBack} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AuthStepDots total={2} active={step} />

        {step === 0 ? (
          <>
            <Text style={styles.stepCaption}>Paso 1 de 2 — Tus datos</Text>
            <View style={styles.form}>
              <Input label="Nombre completo" placeholder="Juan Pérez" value={form.nombre} onChangeText={(v) => updateField("nombre", v)} autoCorrect={false} />
              <Input label="Email" placeholder="juan@email.com" value={form.email} onChangeText={(v) => updateField("email", v)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
              <Input label="Teléfono" placeholder="+54 9 341 555-0123" value={form.telefono} onChangeText={(v) => updateField("telefono", v)} keyboardType="phone-pad" autoCorrect={false} />
              <Input label="Contraseña" placeholder="Mínimo 8 caracteres" value={form.password} onChangeText={(v) => updateField("password", v)} secureTextEntry autoCapitalize="none" autoCorrect={false} />

              <View style={styles.rulesBox}>
                <PasswordRule ok={rules.length} label="Al menos 8 caracteres" colors={colors} />
                <PasswordRule ok={rules.uppercase} label="Una mayúscula" colors={colors} />
                <PasswordRule ok={rules.number} label="Un número" colors={colors} />
              </View>
            </View>

            <Button variant="primary" fullWidth onPress={handleNext} style={styles.submit}>
              Siguiente
            </Button>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tenés cuenta? </Text>
              <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}>Iniciá sesión</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.stepCaption}>Paso 2 de 2 — Tu establecimiento</Text>
            <View style={styles.form}>
              <Input label="Establecimiento" placeholder="Estancia La Esperanza" value={form.establecimiento} onChangeText={(v) => updateField("establecimiento", v)} autoCorrect={false} />
              <Input label="Localidad / Provincia" placeholder="Pergamino, Buenos Aires" value={form.localidad} onChangeText={(v) => updateField("localidad", v)} autoCorrect={false} />
            </View>

            <Pressable style={styles.checkboxRow} onPress={() => setAcceptedTerms((v) => !v)}>
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms ? <Icon name="check" size={14} color={colors.actionPrimaryText} /> : null}
              </View>
              <Text style={styles.checkboxLabel}>Acepto los Términos y condiciones</Text>
            </Pressable>

            <Button variant="primary" fullWidth loading={loading} onPress={handleRegister} style={styles.submit}>
              Crear cuenta
            </Button>

            <Text style={styles.note}>
              Al registrarte vas a recibir un email para verificar tu cuenta.
            </Text>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PasswordRule({ ok, label, colors }: { ok: boolean; label: string; colors: ThemeColors }) {
  return (
    <View style={ruleStyles.row}>
      <Icon name={ok ? "check-circle" : "x-circle"} size={14} color={ok ? colors.statusOk : colors.textSecondary} />
      <Text style={[ruleStyles.text, { color: ok ? colors.statusOk : colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const ruleStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { fontSize: 12 },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.xxl },
    stepCaption: { color: c.textSecondary, fontSize: FontSize.bodySm, fontWeight: "600", marginBottom: Spacing.md },
    form: { gap: Spacing.md },
    rulesBox: { gap: 4, marginTop: -4 },
    submit: { marginTop: Spacing.lg, marginBottom: Spacing.lg },
    loginContainer: { flexDirection: "row", justifyContent: "center" },
    loginText: { color: c.textMuted, fontSize: FontSize.bodySm },
    loginLink: { color: c.primary, fontSize: FontSize.bodySm, fontWeight: "600" },
    checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: Spacing.lg },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: Radius.xs,
      borderWidth: 1.5,
      borderColor: c.borderStrong,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: { backgroundColor: c.actionPrimary, borderColor: c.actionPrimary },
    checkboxLabel: { color: c.textPrimary, fontSize: FontSize.bodySm, flexShrink: 1 },
    note: { color: c.textMuted, fontSize: FontSize.bodySm, textAlign: "center", marginTop: Spacing.md, lineHeight: 18 },
  });
