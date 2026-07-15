import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../config/firebase";
import { useTheme } from "../contexts/ThemeContext";
import { Spacing, FontSize } from "../constants/Theme";
import { Button, AuthHeader, Icon } from "../components";

const RESEND_COOLDOWN = 60;

export default function VerificarEmailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? auth.currentUser?.email ?? "tu correo";
  const [cooldown, setCooldown] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      if (auth.currentUser) await sendEmailVerification(auth.currentUser);
      setCooldown(RESEND_COOLDOWN);
    } catch {
      Alert.alert("Error", "No pudimos reenviar el email. Intentá de nuevo en unos minutos.");
    }
  };

  const handleAlreadyVerified = async () => {
    setChecking(true);
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        router.replace("/permisos");
      } else {
        Alert.alert("Todavía no", "No encontramos la verificación. Revisá tu bandeja de entrada y volvé a intentar.");
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <AuthHeader title="Verificar email" showBack={false} />

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.greenTint }]}>
          <Icon name="mail" size={32} color={colors.green} />
        </View>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Verificá tu email</Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Te enviamos un enlace de verificación a{"\n"}
          <Text style={[styles.emailBold, { color: colors.textPrimary }]}>{email}</Text>. Revisá tu bandeja de entrada.
        </Text>

        <Button variant="primary" fullWidth loading={checking} onPress={handleAlreadyVerified} style={styles.primaryBtn}>
          Ya verifiqué
        </Button>

        <Button variant="ghost" fullWidth disabled={cooldown > 0} onPress={handleResend}>
          {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar email"}
        </Button>

        <Text style={[styles.hint, { color: colors.textMuted }]}>¿No lo encontrás? Revisá tu carpeta de spam.</Text>

        <View style={styles.linksRow}>
          <Text style={[styles.link, { color: colors.primary }]} onPress={() => router.replace("/register")}>
            Cambiar email
          </Text>
          <Text style={[styles.link, { color: colors.primary }]} onPress={() => Alert.alert("Contactanos", "Escribinos a soporte@siloguard.com")}>
            ¿Problemas? Contactanos
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: "center", alignItems: "center", gap: Spacing.md, marginTop: -40 },
  iconCircle: { width: 80, height: 80, borderRadius: 999, justifyContent: "center", alignItems: "center", marginBottom: Spacing.sm },
  heading: { fontSize: FontSize.headingXl, fontWeight: "700" },
  description: { fontSize: FontSize.bodyMd, textAlign: "center", lineHeight: 22, marginBottom: Spacing.md },
  emailBold: { fontWeight: "600" },
  primaryBtn: { marginTop: Spacing.sm },
  hint: { fontSize: FontSize.bodySm, marginTop: Spacing.sm },
  linksRow: { flexDirection: "row", gap: Spacing.lg, marginTop: Spacing.md },
  link: { fontSize: FontSize.bodySm, fontWeight: "600" },
});
