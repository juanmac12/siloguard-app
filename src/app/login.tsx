import { useState } from "react";
import {
  View, Text, StyleSheet,
  Alert, TouchableOpacity, KeyboardAvoidingView, Platform,
} from "react-native";
import { SvgXml, Svg, Path } from "react-native-svg";
import { useRouter } from "expo-router";
import { ApiError } from "../config/api";
import { useAppData } from "../contexts/AppDataContext";
import { Colors, Spacing, FontSize, Radius } from "../constants/Theme";
import { Button, Input } from "../components";

const LOGO_SVG = `<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M60,180 Q60,92 147,92 Q235,92 235,180" stroke="#22C55E" stroke-width="15" stroke-linecap="round" fill="none"/>
  <line x1="95"  y1="130" x2="95"  y2="180" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="147" y1="105" x2="147" y2="180" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <rect x="60" y="180" width="125" height="280" stroke="#22C55E" stroke-width="15" fill="none" stroke-linejoin="round"/>
  <line x1="235" y1="180" x2="235" y2="260" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="100" y1="180" x2="100" y2="460" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="140" y1="180" x2="140" y2="460" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="100" y1="215" x2="140" y2="215" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="250" x2="140" y2="250" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="285" x2="140" y2="285" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="320" x2="140" y2="320" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="355" x2="140" y2="355" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="390" x2="140" y2="390" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="425" x2="140" y2="425" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <polyline points="190,190 322,92 465,190" stroke="#22C55E" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="190" y="190" width="275" height="235" stroke="#22C55E" stroke-width="15" fill="none" stroke-linejoin="round"/>
  <line x1="180" y1="425" x2="465" y2="425" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <rect x="297" y="215" width="50" height="40" stroke="#22C55E" stroke-width="12" fill="none" stroke-linejoin="round"/>
  <line x1="215" y1="310" x2="440" y2="310" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <rect x="215" y="310" width="110" height="115" stroke="#22C55E" stroke-width="12" fill="none" stroke-linejoin="round"/>
  <line x1="325" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="215" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="325" y1="310" x2="215" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="325" y1="310" x2="440" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="440" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
</svg>`;

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      enabled={Platform.OS === "ios"}
    >
      <View style={styles.content}>

        {/* Header Logo */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <SvgXml xml={LOGO_SVG} width={36} height={36} />
          </View>
          <Text style={styles.logoText}>SiloGuard</Text>
        </View>

        <Text style={styles.heading}>Iniciar sesión</Text>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="tu@email.com"
            value={email}
            onChangeText={setEmail}
          />
          <Input
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.forgotContainer}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button variant="primary" fullWidth loading={loading} onPress={handleLogin}>
          Ingresar
        </Button>

        {/* Separador */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o continuá con</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Botones Sociales */}
        <View style={styles.socialStack}>
          <TouchableOpacity
            style={styles.socialBtn}
            activeOpacity={0.75}
            onPress={handleGoogleSignIn}
          >
            <View style={styles.socialBtnIcon}>
              <GoogleLogo />
            </View>
            <Text style={styles.socialBtnText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialBtn}
            activeOpacity={0.75}
            onPress={handleAppleSignIn}
          >
            <View style={styles.socialBtnIcon}>
              <AppleLogo />
            </View>
            <Text style={styles.socialBtnText}>Continuar con Apple</Text>
          </TouchableOpacity>
        </View>

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
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xxl * 1.5, justifyContent: "flex-start" },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: Spacing.xxl },
  logoCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(34,197,94,0.12)", justifyContent: "center", alignItems: "center", marginRight: Spacing.sm },
  logoText: { color: "#FFFFFF", fontSize: FontSize.headingLg, fontWeight: "700" },

  heading: { color: "#FFFFFF", fontSize: 28, fontWeight: "700", marginBottom: Spacing.xl },
  form: { gap: Spacing.md },

  forgotContainer: { alignItems: "flex-end", marginTop: Spacing.sm, marginBottom: Spacing.xl },
  forgotText: { color: Colors.primary, fontSize: FontSize.bodyMd },

  dividerContainer: { flexDirection: "row", alignItems: "center", marginVertical: Spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { color: Colors.textMuted, paddingHorizontal: Spacing.md, fontSize: FontSize.bodySm },

  socialStack: { gap: Spacing.sm, marginBottom: Spacing.xxl },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface2,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
  },
  socialBtnIcon: {
    width: 28,
    alignItems: "center",
  },
  socialBtnText: {
    flex: 1,
    textAlign: "center",
    color: Colors.text,
    fontSize: FontSize.bodyMd,
    fontWeight: "600",
    marginRight: 28,
  },

  registerContainer: { flexDirection: "row", justifyContent: "center", marginTop: "auto", marginBottom: Spacing.xxl },
  registerText: { color: Colors.textMuted, fontSize: FontSize.bodyMd },
  registerLink: { color: Colors.primary, fontSize: FontSize.bodyMd, fontWeight: "600" },
});
