import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { Spacing, FontSize } from "../constants/Theme";
import { Button, Input, AuthHeader, Icon } from "../components";

export default function RecuperarScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email.trim()) return;
    setLoading(true);
    // TODO: no hay endpoint de recuperación de contraseña en el backend todavía.
    // Cuando exista, reemplazar por authApi.recoverPassword(email).
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <AuthHeader title="Recuperar contraseña" showBack onBack={() => router.back()} />

      <View style={styles.content}>
        {sent ? (
          <View style={styles.sentBox}>
            <View style={[styles.iconCircle, { backgroundColor: colors.greenTint }]}>
              <Icon name="mail" size={28} color={colors.green} />
            </View>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>Revisá tu bandeja de entrada</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>
              Si el email existe en nuestra base, vas a recibir un enlace para restablecer tu contraseña.
            </Text>
            <Button variant="primary" fullWidth onPress={() => router.replace("/login")} style={styles.submit}>
              Volver a iniciar sesión
            </Button>
          </View>
        ) : (
          <>
            <Text style={[styles.desc, { color: colors.textSecondary, marginBottom: Spacing.lg }]}>
              Ingresá el email de tu cuenta y te enviamos un enlace para restablecer tu contraseña.
            </Text>
            <Input
              label="Email"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button
              variant="primary"
              fullWidth
              loading={loading}
              disabled={!email.trim()}
              onPress={handleSend}
              style={styles.submit}
            >
              {loading ? "Enviando…" : "Enviar enlace"}
            </Button>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl },
  desc: { fontSize: FontSize.bodyMd, lineHeight: 22 },
  submit: { marginTop: Spacing.lg },
  sentBox: { alignItems: "center", paddingTop: Spacing.xxl, gap: 12 },
  iconCircle: { width: 72, height: 72, borderRadius: 999, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  heading: { fontSize: FontSize.headingLg, fontWeight: "700", textAlign: "center" },
});
