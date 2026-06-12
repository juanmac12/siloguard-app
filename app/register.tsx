import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../config/firebase";
import { Colors, Spacing, FontSize } from "../constants/Theme";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
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
    if (!form.nombre || !form.email || !form.password) {
      Alert.alert("Error", "Completá nombre, email y contraseña.");
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      await sendEmailVerification(userCredential.user);

      // Navegar a pantalla de éxito en vez de Alert
      router.replace("/registro-exitoso");
    } catch (error: any) {
      let msg = "Ocurrió un error. Intentá de nuevo.";
      if (error.code === "auth/email-already-in-use")
        msg = "Ya existe una cuenta con ese email.";
      if (error.code === "auth/invalid-email")
        msg = "El email no es válido.";
      if (error.code === "auth/weak-password")
        msg = "La contraseña es muy débil. Usá al menos 8 caracteres.";
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear cuenta</Text>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Form fields */}
        <FormField label="Nombre completo" placeholder="Juan Pérez" value={form.nombre} onChangeText={(v) => updateField("nombre", v)} />
        <FormField label="Email" placeholder="juan@email.com" value={form.email} onChangeText={(v) => updateField("email", v)} keyboardType="email-address" autoCapitalize="none" />
        <FormField label="Teléfono" placeholder="+54 9 341 555-0123" value={form.telefono} onChangeText={(v) => updateField("telefono", v)} keyboardType="phone-pad" />
        <FormField label="Nombre del establecimiento" placeholder="Estancia La Esperanza" value={form.establecimiento} onChangeText={(v) => updateField("establecimiento", v)} />
        <FormField label="Localidad / Provincia" placeholder="Pergamino, Buenos Aires" value={form.localidad} onChangeText={(v) => updateField("localidad", v)} />
        <FormField label="Contraseña" placeholder="Mínimo 8 caracteres" value={form.password} onChangeText={(v) => updateField("password", v)} secureTextEntry />
        <FormField label="Confirmar contraseña" placeholder="Repetí tu contraseña" value={form.confirmPassword} onChangeText={(v) => updateField("confirmPassword", v)} secureTextEntry />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.bg} />
          ) : (
            <Text style={styles.buttonText}>Crear cuenta</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.terms}>
          Al registrarte, aceptás los{" "}
          <Text style={styles.termsLink}>Términos y Condiciones</Text> y la{" "}
          <Text style={styles.termsLink}>Política de Privacidad</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FormField({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }: {
  label: string; placeholder: string; value: string; onChangeText: (text: string) => void;
  secureTextEntry?: boolean; keyboardType?: any; autoCapitalize?: any;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? "sentences"}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.xxl },
  header: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.md },
  backArrow: { color: Colors.text, fontSize: 28, fontWeight: "700", marginRight: Spacing.sm, lineHeight: 28 },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingXl, fontWeight: "700" },
  progressContainer: { flexDirection: "row", gap: 8, marginBottom: Spacing.lg },
  dot: { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.primary },
  fieldContainer: { marginBottom: Spacing.md },
  label: { color: Colors.primary, fontSize: FontSize.bodySm, fontWeight: "500", marginBottom: Spacing.xs },
  input: { backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: Spacing.md, paddingVertical: 14, color: Colors.text, fontSize: FontSize.bodyMd, borderWidth: 1, borderColor: Colors.border },
  button: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16, alignItems: "center", marginTop: Spacing.lg, marginBottom: Spacing.md },
  buttonDisabled: { backgroundColor: Colors.primaryDark },
  buttonText: { color: Colors.bg, fontSize: FontSize.bodyLg, fontWeight: "700" },
  terms: { color: Colors.textMuted, fontSize: FontSize.bodySm, textAlign: "center", lineHeight: 18 },
  termsLink: { color: Colors.primary, fontWeight: "600" },
});
