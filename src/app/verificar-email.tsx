import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppData } from "../contexts/AppDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { AuthHeader, Button, Icon } from "../components";
import { FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

const RESEND_COOLDOWN = 60;

export default function VerificarEmailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, completeOnboarding } = useAppData();
  const params = useLocalSearchParams<{ email?: string }>();
  const styles = makeStyles(colors);

  const email = params.email || profile.email || "tu@email.com";
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resentMsg, setResentMsg] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const resend = () => {
    if (cooldown > 0) return;
    setCooldown(RESEND_COOLDOWN);
    setResentMsg(true);
    setTimeout(() => setResentMsg(false), 2500);
  };

  const continuar = () => {
    router.replace("/permisos");
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Verificá tu email" showBack={false} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.iconCircle}>
          <Icon name="mail" size={36} color={colors.actionPrimary} />
        </View>
        <Text style={styles.title}>Verificá tu email</Text>
        <Text style={styles.desc}>
          Te enviamos un enlace de verificación a <Text style={styles.emailBold}>{email}</Text>. Revisá tu bandeja de entrada.
        </Text>

        <View style={styles.resendWrap}>
          <Button variant="secondary" fullWidth disabled={cooldown > 0} onPress={resend}>
            {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar email"}
          </Button>
        </View>
        {resentMsg ? <Text style={styles.resentMsg}>Email reenviado correctamente ✓</Text> : null}

        <Text style={styles.spamHint}>¿No lo encontrás? Revisá tu carpeta de spam.</Text>

        <View style={styles.linksRow}>
          <Text style={styles.linkMuted} onPress={() => router.replace("/register")}>
            Cambiar email
          </Text>
          <Text style={styles.linkUnderline} onPress={() => router.push("/contacto-tecnico")}>
            ¿Problemas? Contactanos
          </Text>
        </View>

        <View style={styles.continueWrap}>
          <Button
            variant="primary"
            fullWidth
            onPress={() => {
              completeOnboarding();
              continuar();
            }}
          >
            Ya verifiqué mi email
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: 24, paddingTop: 32, alignItems: "center" },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: c.greenTint,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      color: c.textPrimary,
      marginBottom: 12,
      textAlign: "center",
    },
    desc: {
      maxWidth: 280,
      fontSize: 14,
      lineHeight: 22,
      color: c.textSecondary,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
      textAlign: "center",
    },
    emailBold: {
      color: c.textPrimary,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
    },
    resendWrap: { width: "100%", marginTop: 28 },
    resentMsg: { fontSize: 12, color: c.statusOk, marginTop: 12, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    spamHint: { fontSize: 12, lineHeight: 18, color: c.textSecondary, marginTop: 20, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    linksRow: { flexDirection: "row", gap: 20, marginTop: 16 },
    linkMuted: { fontSize: 12, color: c.textLink, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    linkUnderline: { fontSize: 12, color: c.textSecondary, textDecorationLine: "underline", fontFamily: fontFamilyForWeight(FontWeight.regular) },
    continueWrap: { width: "100%", marginTop: 32 },
  });
