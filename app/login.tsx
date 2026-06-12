import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { Colors, Spacing, FontSize } from "../constants/Theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Completá email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Login exitoso → ir al Dashboard
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      let msg = "Ocurrió un error. Intentá de nuevo.";
      if (error.code === "auth/user-not-found") msg = "No existe una cuenta con ese email.";
      if (error.code === "auth/wrong-password") msg = "Contraseña incorrecta.";
      if (error.code === "auth/invalid-email") msg = "El email no es válido.";
      if (error.code === "auth/invalid-credential") msg = "Email o contraseña incorrectos.";
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
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoIconText}>◉</Text>
          </View>
          <Text style={styles.logoText}>SiloGuard</Text>
        </View>

        <Text style={styles.heading}>Iniciar sesión</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input} placeholder="tu@email.com"
          placeholderTextColor={Colors.textMuted} value={email}
          onChangeText={setEmail} keyboardType="email-address"
          autoCapitalize="none" autoCorrect={false}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input} placeholder="Mínimo 8 caracteres"
          placeholderTextColor={Colors.textMuted} value={password}
          onChangeText={setPassword} secureTextEntry
        />

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin} disabled={loading} activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.bg} />
          ) : (
            <Text style={styles.buttonText}>Ingresar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tenés cuenta? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: "center" },
  logoContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: Spacing.xxl },
  logoIcon: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: Spacing.sm },
  logoIconText: { color: Colors.primary, fontSize: 14 },
  logoText: { color: Colors.primary, fontSize: FontSize.headingLg, fontWeight: "700" },
  heading: { color: Colors.text, fontSize: FontSize.headingXl, fontWeight: "700", marginBottom: Spacing.xl },
  label: { color: Colors.primary, fontSize: FontSize.bodySm, fontWeight: "500", marginBottom: Spacing.xs, marginTop: Spacing.md },
  input: { backgroundColor: Colors.surface, borderRadius: 8, paddingHorizontal: Spacing.md, paddingVertical: 14, color: Colors.text, fontSize: FontSize.bodyMd, borderWidth: 1, borderColor: Colors.border },
  forgotContainer: { alignItems: "flex-end", marginTop: Spacing.sm, marginBottom: Spacing.lg },
  forgotText: { color: Colors.primary, fontSize: FontSize.bodyMd },
  button: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16, alignItems: "center", marginBottom: Spacing.lg },
  buttonDisabled: { backgroundColor: Colors.primaryDark },
  buttonText: { color: Colors.bg, fontSize: FontSize.bodyLg, fontWeight: "700" },
  registerContainer: { flexDirection: "row", justifyContent: "center" },
  registerText: { color: Colors.textMuted, fontSize: FontSize.bodyMd },
  registerLink: { color: Colors.primary, fontSize: FontSize.bodyMd, fontWeight: "600" },
});
