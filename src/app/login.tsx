import { useState } from "react";
import {
  View, Text, StyleSheet,
  Alert, TouchableOpacity, KeyboardAvoidingView, Platform,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { ApiError } from "../config/api";
import { useAppData } from "../contexts/AppDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { Spacing, FontSize, Radius } from "../constants/Theme";
import { Button, Input, AuthHeader } from "../components";

function GoogleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.378-3.066c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.56-1.702z"
        fill="#F5F5F5"
      />
    </Svg>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAppData();
  const { colors } = useTheme();
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
      await login(email.trim(), password);
      router.replace("/(tabs)/dashboard");
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "Ocurrió un error. Intentá de nuevo.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert("Próximamente", "El inicio de sesión con Google estará disponible en la próxima versión.");
  };

  const handleAppleSignIn = () => {
    Alert.alert("Próximamente", "El inicio de sesión con Apple estará disponible en la próxima versión.");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={Platform.OS === "ios"}
    >
      <AuthHeader title="Iniciar sesión" showBack onBack={() => router.back()} />

      <View style={styles.content}>
        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotContainer} onPress={() => router.push("/recuperar")}>
          <Text style={[styles.forgotText, { color: colors.primary }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button variant="primary" fullWidth loading={loading} onPress={handleLogin}>
          Ingresar
        </Button>

        {/* Separador */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textMuted }]}>o continuá con</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Botones Sociales lado a lado */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[styles.socialBtn, { borderColor: colors.borderStrong, backgroundColor: colors.surface2 }]}
            activeOpacity={0.75}
            onPress={handleGoogleSignIn}
          >
            <GoogleLogo />
            <Text style={[styles.socialBtnText, { color: colors.text }]}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialBtn, { borderColor: colors.borderStrong, backgroundColor: colors.surface2 }]}
            activeOpacity={0.75}
            onPress={handleAppleSignIn}
          >
            <AppleLogo />
            <Text style={[styles.socialBtnText, { color: colors.text }]}>Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { color: colors.textMuted }]}>¿No tenés cuenta? </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={[styles.registerLink, { color: colors.primary }]}>Registrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, justifyContent: "flex-start" },

  form: { gap: Spacing.md },

  forgotContainer: { alignItems: "flex-end", marginTop: Spacing.sm, marginBottom: Spacing.xl },
  forgotText: { fontSize: FontSize.bodyMd },

  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: Spacing.xl },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { paddingHorizontal: Spacing.md, fontSize: FontSize.bodySm },

  socialRow: { flexDirection: "row", gap: Spacing.sm, marginBottom: Spacing.xxl },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingVertical: 14,
  },
  socialBtnText: {
    fontSize: FontSize.bodyMd,
    fontWeight: "600",
  },

  registerContainer: { flexDirection: "row", justifyContent: "center", marginTop: "auto", marginBottom: Spacing.xl },
  registerText: { fontSize: FontSize.bodyMd },
  registerLink: { fontSize: FontSize.bodyMd, fontWeight: "600" },
});
