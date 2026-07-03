import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ApiError } from "../config/api";
import { useAppData } from "../contexts/AppDataContext";
import { Colors, Spacing, FontSize } from "../constants/Theme";
import { Button, Input } from "../components";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAppData();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    telefono: "",
    establecimiento: "",
    localidad: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Completá email y contraseña.");
      return;
    }
    if (form.password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.establecimiento.trim() || form.email.split("@")[0],
        email: form.email.trim(),
        password: form.password,
        phone: form.telefono.trim() || undefined,
        farmName: form.establecimiento.trim() || "Mi establecimiento",
        farmLoc: form.localidad.trim() || undefined,
      });
      router.replace("/registro-exitoso");
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "Ocurrió un error. Intentá de nuevo.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header (Fijo arriba) */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear cuenta</Text>
        </View>
        <View style={styles.headerSeparator} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Form fields */}
        <View style={styles.form}>
          <Input label="Email" placeholder="juan@email.com" value={form.email} onChangeText={(v) => updateField("email", v)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
          <Input label="Teléfono" placeholder="+54 9 341 555-0123" value={form.telefono} onChangeText={(v) => updateField("telefono", v)} keyboardType="phone-pad" autoCorrect={false} />
          <Input label="Nombre del establecimiento" placeholder="Estancia La Esperanza" value={form.establecimiento} onChangeText={(v) => updateField("establecimiento", v)} autoCorrect={false} />
          <Input label="Localidad / Provincia" placeholder="Pergamino, Buenos Aires" value={form.localidad} onChangeText={(v) => updateField("localidad", v)} autoCorrect={false} />
          <Input label="Contraseña" placeholder="Mínimo 8 caracteres" value={form.password} onChangeText={(v) => updateField("password", v)} secureTextEntry autoCapitalize="none" autoCorrect={false} />
          <Input label="Confirmar contraseña" placeholder="Repetí tu contraseña" value={form.confirmPassword} onChangeText={(v) => updateField("confirmPassword", v)} secureTextEntry autoCapitalize="none" autoCorrect={false} />
        </View>

        <Button variant="primary" fullWidth loading={loading} onPress={handleRegister} style={styles.submit}>
          Crear cuenta
        </Button>

        <Text style={styles.terms}>
          Al registrarte, aceptás los{"\n"}
          <Text style={styles.termsLink}>Términos y Condiciones</Text> y la{" "}
          <Text style={styles.termsLink}>Política de Privacidad</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerContainer: { paddingTop: 60, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  backButton: { paddingRight: Spacing.md },
  backArrow: { color: Colors.text, fontSize: 32, fontWeight: "400", lineHeight: 32, marginTop: -4 },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingLg, fontWeight: "700" },
  headerSeparator: { height: 1, backgroundColor: Colors.border, width: "100%" },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.xxl },
  progressContainer: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: Spacing.xl },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  dotActive: { width: 16, height: 4, borderRadius: 2, backgroundColor: Colors.primary },
  form: { gap: Spacing.md },
  submit: { marginTop: Spacing.lg, marginBottom: Spacing.lg },
  terms: { color: Colors.textMuted, fontSize: FontSize.bodySm, textAlign: "center", lineHeight: 20 },
  termsLink: { color: Colors.textMuted, fontWeight: "600" },
});
