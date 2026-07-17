import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthHeader, Button, Icon } from "../components";
import { useTheme } from "../contexts/ThemeContext";
import { FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

export default function PermisosScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const [loading, setLoading] = useState(false);

  const goVincular = () => router.replace("/vincular-lanza");

  const activar = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      goVincular();
    }, 800);
  };

  return (
    <View style={styles.container}>
      <AuthHeader title="Notificaciones" showBack={false} />
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="bell" size={36} color={colors.actionPrimary} />
        </View>
        <Text style={styles.title}>Activá las notificaciones</Text>
        <Text style={styles.desc}>
          SiloGuard te avisa con al menos 48 hs de anticipación cuando detecta un problema en tu grano. Sin
          notificaciones, podrías perderte una alerta crítica.
        </Text>

        <View style={styles.spacer} />

        <View style={styles.ctaWrap}>
          <Button variant="primary" fullWidth disabled={loading} onPress={activar}>
            {loading ? "Activando…" : "Activar notificaciones"}
          </Button>
        </View>
        <Text style={styles.skip} onPress={goVincular}>
          Ahora no
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    content: { flex: 1, padding: 24, paddingTop: 32, alignItems: "center" },
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
    spacer: { flex: 1, minHeight: 16 },
    ctaWrap: { width: "100%" },
    skip: {
      marginTop: 16,
      fontSize: 12,
      color: c.textSecondary,
      textDecorationLine: "underline",
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
  });
