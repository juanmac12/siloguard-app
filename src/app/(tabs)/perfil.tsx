import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Spacing, FontSize, ThemeColors, Radius, FontWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { Icon } from "../../components";
import type { IconName } from "../../components";

const DEVICES = [
  { id: 1, status: "online" },
  { id: 2, status: "online" },
  { id: 3, status: "offline" },
];

function Avatar({ name, size = 52 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "rgba(34,197,94,0.12)",
        borderWidth: 2,
        borderColor: "#22C55E",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: size * 0.35,
          fontWeight: "700",
          color: "#22C55E",
          letterSpacing: -0.5,
        }}
      >
        {initials}
      </Text>
    </View>
  );
}

function MRow({
  icon,
  label,
  value,
  onPress,
  danger = false,
  last = false,
  colors,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  last?: boolean;
  colors: ThemeColors;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      style={[
        styles.mrow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
      ]}
    >
      <Icon
        name={icon}
        size={20}
        color={danger ? colors.statusCritical : colors.textSecondary}
      />
      <Text
        style={[
          styles.mrowLabel,
          { color: danger ? colors.statusCritical : colors.textPrimary },
        ]}
      >
        {label}
      </Text>
      {value ? (
        <Text style={[styles.mrowValue, { color: colors.textSecondary }]}>{value}</Text>
      ) : null}
      {onPress && !danger ? (
        <Icon name="chevron-right" size={18} color={colors.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );
}

function SCard({
  label,
  children,
  colors,
}: {
  label?: string;
  children: React.ReactNode;
  colors: ThemeColors;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? (
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{label}</Text>
      ) : null}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export default function PerfilScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, silos, logout } = useAppData();

  const onlineCount = DEVICES.filter((d) => d.status === "online").length;
  const totalDevices = DEVICES.length;

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "Vas a salir de tu cuenta en este dispositivo.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Mi Perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User row — compacto */}
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => router.push("/perfil/editar")}
          activeOpacity={0.7}
        >
          <Avatar name={profile.name} size={52} />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>
              {profile.name}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {profile.email}
            </Text>
          </View>
          <Text style={[styles.editLink, { color: colors.actionPrimary }]}>Editar</Text>
          <Icon name="chevron-right" size={16} color={colors.actionPrimary} />
        </TouchableOpacity>

        {/* Farm card */}
        <View
          style={[
            styles.farmCard,
            { backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" },
          ]}
        >
          <View style={styles.farmRow}>
            <Icon name="map-pin" size={16} color={colors.actionPrimary} />
            <Text style={[styles.farmName, { color: colors.textPrimary }]}>
              {profile.farmName}
            </Text>
          </View>
          <Text style={[styles.farmMeta, { color: colors.textSecondary }]}>
            {profile.farmLoc} · {silos.length} silos · {profile.farmHa} ha
          </Text>
        </View>

        {/* Configuración */}
        <SCard colors={colors}>
          <MRow
            icon="wifi"
            label="Mis lanzas"
            value={`${onlineCount}/${totalDevices} online`}
            onPress={() => router.push("/perfil/lanzas")}
            colors={colors}
          />
          <MRow
            icon="bell"
            label="Notificaciones"
            onPress={() => router.push("/perfil/notificaciones")}
            colors={colors}
          />
          <MRow
            icon="target"
            label="Umbrales de alerta"
            onPress={() => Alert.alert("Próximamente", "Configuración de umbrales en breve.")}
            colors={colors}
          />
          <MRow
            icon="lock"
            label="Cambiar contraseña"
            onPress={() => Alert.alert("Próximamente", "Esta función estará disponible pronto.")}
            colors={colors}
          />
          <MRow
            icon="refresh-cw"
            label="Repetir tutorial"
            onPress={() => Alert.alert("Tutorial", "Función disponible próximamente.")}
            colors={colors}
            last
          />
        </SCard>

        {/* Soporte */}
        <SCard colors={colors}>
          <MRow
            icon="message-circle"
            label="Soporte WhatsApp"
            onPress={() => Linking.openURL("https://wa.me/5491100000000")}
            colors={colors}
          />
          <MRow
            icon="file-text"
            label="Legal"
            onPress={() => Alert.alert("Legal", "Términos y condiciones próximamente.")}
            colors={colors}
            last
          />
        </SCard>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutBtn}
          activeOpacity={0.7}
        >
          <Text style={[styles.logoutText, { color: colors.statusCritical }]}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          SiloGuard v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: 56,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: Spacing.xl,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingBottom: 16,
    paddingTop: 4,
    cursor: "pointer",
  } as any,
  userInfo: { flex: 1 },
  userName: {
    fontSize: FontSize.bodyLg,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  userEmail: {
    fontSize: FontSize.bodySm,
    marginTop: 2,
  },
  editLink: {
    fontSize: FontSize.bodySm,
    fontWeight: FontWeight.semibold as any,
  },

  farmCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 16,
  },
  farmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  farmName: {
    fontSize: FontSize.bodyMd + 1,
    fontWeight: "600",
  },
  farmMeta: {
    fontSize: 12,
    lineHeight: 18,
  },

  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  mrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
  },
  mrowLabel: {
    flex: 1,
    fontSize: FontSize.bodyMd + 1,
    fontWeight: FontWeight.medium as any,
  },
  mrowValue: {
    fontSize: FontSize.bodySm,
    marginRight: 4,
  },

  logoutBtn: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutText: {
    fontSize: FontSize.bodyMd,
    fontWeight: "600",
  },
  version: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
  },
});
