import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { Spacing, FontSize } from "../constants/Theme";
import { Button, AuthHeader, Icon } from "../components";

export default function PermisosScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [requesting, setRequesting] = useState(false);

  // TODO: pedir permiso real de notificaciones (expo-notifications) cuando se integre push.
  const handleActivate = () => {
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      router.replace({ pathname: "/agregar-silo", params: { onboarding: "1" } });
    }, 600);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <AuthHeader title="Notificaciones" showBack={false} />

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.greenTint }]}>
          <Icon name="bell" size={32} color={colors.green} />
        </View>

        <Text style={[styles.heading, { color: colors.textPrimary }]}>Activá las notificaciones</Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          SiloGuard te avisa con al menos 48 hs de anticipación cuando un silo necesita atención.
        </Text>

        <Button variant="primary" fullWidth loading={requesting} onPress={handleActivate} style={styles.primaryBtn}>
          {requesting ? "Activando…" : "Activar notificaciones"}
        </Button>

        <Text
          style={[styles.link, { color: colors.primary }]}
          onPress={() => router.replace({ pathname: "/agregar-silo", params: { onboarding: "1" } })}
        >
          Ahora no
        </Text>

        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Podés activarlas después desde Configuración.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: "center", alignItems: "center", gap: Spacing.md, marginTop: -40 },
  iconCircle: { width: 80, height: 80, borderRadius: 999, justifyContent: "center", alignItems: "center", marginBottom: Spacing.sm },
  heading: { fontSize: FontSize.headingXl, fontWeight: "700", textAlign: "center" },
  description: { fontSize: FontSize.bodyMd, textAlign: "center", lineHeight: 22, marginBottom: Spacing.md },
  primaryBtn: { marginTop: Spacing.sm },
  link: { fontSize: FontSize.bodyMd, fontWeight: "600", marginTop: Spacing.md },
  hint: { fontSize: FontSize.bodySm, marginTop: Spacing.sm, textAlign: "center" },
});
