import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useAppData } from "../contexts/AppDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthHeader, Button, Icon, Input } from "../components";
import { Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, completeOnboarding } = useAppData();
  const styles = makeStyles(colors);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filled = email.trim().length > 0 && password.length > 0;

  const handleLogin = async () => {
    if (!filled || loading) return;
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      completeOnboarding();
      router.replace("/(tabs)/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AuthHeader title="Iniciar sesión" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <Input
            label="EMAIL"
            placeholder="tu@email.com"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
          <Input
            label="CONTRASEÑA"
            placeholder="••••••••"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setError("");
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            error={error}
            trailingIcon={
              <Pressable onPress={() => setShowPassword((s) => !s)} hitSlop={8}>
                <Icon name={showPassword ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
              </Pressable>
            }
          />
        </View>

        <Pressable onPress={() => router.push("/recuperar")} style={styles.forgotBtn}>
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </Pressable>

        <View style={styles.submitWrap}>
          <Button variant="primary" fullWidth disabled={!filled} loading={loading} onPress={handleLogin}>
            {loading ? "Ingresando…" : "Ingresar"}
          </Button>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o continuá con</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Button variant="secondary" fullWidth style={styles.socialBtn}>
            Google
          </Button>
          <Button variant="secondary" fullWidth style={styles.socialBtn}>
            Apple
          </Button>
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>¿No tenés cuenta? </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.registerLink}>Registrate</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: 24, paddingTop: 28, flexGrow: 1 },
    form: { gap: 16 },
    forgotBtn: { alignSelf: "flex-start", marginTop: 12 },
    forgotText: { fontSize: 12, color: c.textLink, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    submitWrap: { marginTop: 24 },
    dividerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 24 },
    dividerLine: { flex: 1, height: 1, backgroundColor: c.borderDefault },
    dividerText: { fontSize: 12, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    socialRow: { flexDirection: "row", gap: Spacing.md },
    socialBtn: { flex: 1 },
    registerRow: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
    registerText: { fontSize: 14, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    registerLink: { fontSize: 14, color: c.textLink, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  });
