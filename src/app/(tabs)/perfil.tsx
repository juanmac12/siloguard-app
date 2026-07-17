import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { BottomSheet, Button, Icon } from "../../components";
import type { IconName } from "../../components";

function Avatar({ name, size = 72 }: { name: string; size?: number }) {
  const { colors } = useTheme();
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.greenTint,
        borderWidth: 2,
        borderColor: colors.actionPrimary,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: size * 0.35, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: colors.actionPrimary, letterSpacing: -0.5 }}>
        {initials}
      </Text>
    </View>
  );
}

function VerifiedBadge() {
  const { colors } = useTheme();
  return (
    <View style={[styles.verifiedBadge, { backgroundColor: colors.greenTint }]}>
      <Icon name="check-circle" size={11} color={colors.actionPrimary} />
      <Text style={[styles.verifiedText, { color: colors.actionPrimary }]}>Verificado</Text>
    </View>
  );
}

function MRow({ icon, label, value, onPress, danger = false, last = false, colors }: { icon: IconName; label: string; value?: string; onPress?: () => void; danger?: boolean; last?: boolean; colors: ThemeColors }) {
  return (
    <Pressable onPress={onPress} style={[styles.mrow, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault }]}>
      <Icon name={icon} size={20} color={danger ? colors.statusCritical : colors.textSecondary} />
      <Text style={[styles.mrowLabel, { color: danger ? colors.statusCritical : colors.textPrimary }]}>{label}</Text>
      {value ? <Text style={[styles.mrowValue, { color: colors.textSecondary }]}>{value}</Text> : null}
      {onPress && !danger ? <Icon name="chevron-right" size={18} color={colors.textSecondary} /> : null}
    </Pressable>
  );
}

function SCard({ label, children, colors }: { label?: string; children: React.ReactNode; colors: ThemeColors }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{label}</Text> : null}
      <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>{children}</View>
    </View>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, silos, logout } = useAppData();
  const [logoutSheet, setLogoutSheet] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      setLoggingOut(false);
      setLogoutSheet(false);
      router.replace("/login");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.identityCol} onPress={() => router.push("/perfil/editar")}>
          <Avatar name={profile.name} size={72} />
          <Text style={[styles.userName, { color: colors.textPrimary }]}>{profile.name}</Text>
          <View style={styles.emailRow}>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{profile.email}</Text>
            <VerifiedBadge />
          </View>
        </Pressable>

        <Pressable style={[styles.farmCard, { backgroundColor: colors.greenTint, borderColor: "rgba(34,197,94,0.2)" }]} onPress={() => router.push("/perfil/editar")}>
          <View style={styles.farmRow}>
            <Icon name="map-pin" size={16} color={colors.actionPrimary} />
            <Text style={[styles.farmName, { color: colors.textPrimary }]}>{profile.farmName}</Text>
          </View>
          <Text style={[styles.farmMeta, { color: colors.textSecondary }]}>
            {profile.farmLoc} · {silos.length} silos · {profile.farmHa} ha
          </Text>
        </Pressable>

        <SCard label="CONFIGURACIÓN" colors={colors}>
          <MRow icon="bell" label="Notificaciones" onPress={() => router.push("/perfil/notificaciones")} colors={colors} />
          <MRow icon="target" label="Umbrales de alerta" onPress={() => router.push("/umbrales" as any)} colors={colors} last />
        </SCard>

        <SCard label="SEGURIDAD" colors={colors}>
          <MRow icon="lock" label="Cambiar contraseña" onPress={() => router.push("/perfil/cambiar-password")} colors={colors} last />
        </SCard>

        <SCard label="AYUDA" colors={colors}>
          <MRow icon="info" label="Repetir tutorial" onPress={() => router.push("/tutorial")} colors={colors} />
          <MRow icon="message-circle" label="Soporte por WhatsApp" onPress={() => Linking.openURL("https://wa.me/5491100000000")} colors={colors} />
          <MRow icon="file-text" label="Términos y condiciones" onPress={() => {}} colors={colors} />
          <MRow icon="shield" label="Política de privacidad" onPress={() => {}} colors={colors} last />
        </SCard>

        <Button variant="ghost" fullWidth onPress={() => setLogoutSheet(true)} style={{ marginTop: 8 }}>
          <Text style={{ color: colors.statusCritical, fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) }}>Cerrar sesión</Text>
        </Button>

        <View style={styles.footerRow}>
          <Text style={[styles.version, { color: colors.textMuted }]}>SiloGuard v1.0.0</Text>
          <Text style={[styles.version, { color: colors.textMuted }]}>·</Text>
          <Text style={[styles.version, { color: colors.statusCritical }]} onPress={() => {}}>
            Eliminar cuenta
          </Text>
        </View>
      </ScrollView>

      <BottomSheet
        open={logoutSheet}
        onClose={() => setLogoutSheet(false)}
        title="¿Cerrar sesión?"
        actions={[
          <Button key="y" variant="danger" fullWidth loading={loggingOut} onPress={confirmLogout}>
            Sí, cerrar sesión
          </Button>,
          <Button key="n" variant="ghost" fullWidth onPress={() => setLogoutSheet(false)}>
            Cancelar
          </Button>,
        ]}
      >
        <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 21, fontFamily: fontFamilyForWeight(FontWeight.regular) }}>
          Vas a salir de tu cuenta en este dispositivo. Podés volver a iniciar sesión en cualquier momento.
        </Text>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 26, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.3 },
  content: { paddingHorizontal: Spacing.md, paddingTop: 4, paddingBottom: Spacing.xl },

  identityCol: { alignItems: "center", paddingVertical: 16, paddingBottom: 20 },
  userName: { fontSize: 20, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), marginTop: 12, marginBottom: 6, letterSpacing: -0.3 },
  emailRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  userEmail: { fontSize: 13, fontFamily: fontFamilyForWeight(FontWeight.regular) },

  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 999 },
  verifiedText: { fontSize: 11, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },

  farmCard: { borderWidth: 1, borderRadius: Radius.lg, padding: 14, marginBottom: 16 },
  farmRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  farmName: { fontSize: 15, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  farmMeta: { fontSize: 12, lineHeight: 18, fontFamily: fontFamilyForWeight(FontWeight.regular) },

  cardLabel: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8, marginLeft: 2 },
  card: { borderRadius: Radius.lg, borderWidth: 1, paddingHorizontal: 14 },
  mrow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13 },
  mrowLabel: { flex: 1, fontSize: 15, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },
  mrowValue: { fontSize: 13, marginRight: 4, fontFamily: fontFamilyForWeight(FontWeight.regular) },

  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 },
  version: { fontSize: 11, fontFamily: fontFamilyForWeight(FontWeight.regular) },
});
