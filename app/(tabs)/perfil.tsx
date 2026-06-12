import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { Colors, Spacing, FontSize } from "../../constants/Theme";

export default function PerfilScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
          router.replace("/welcome");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      <View style={styles.content}>
        {/* User info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {auth.currentUser?.email?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
          <Text style={styles.email}>{auth.currentUser?.email || "—"}</Text>
          <Text style={styles.verified}>
            {auth.currentUser?.emailVerified ? "✓ Email verificado" : "⚠ Email sin verificar"}
          </Text>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingXl, fontWeight: "700" },
  content: {
    flex: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.lg,
  },
  userCard: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: Spacing.lg,
    alignItems: "center", borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center",
    marginBottom: Spacing.md,
  },
  avatarText: { color: Colors.bg, fontSize: 28, fontWeight: "700" },
  email: { color: Colors.text, fontSize: FontSize.bodyLg, fontWeight: "600", marginBottom: Spacing.xs },
  verified: { color: Colors.primary, fontSize: FontSize.bodySm },
  logoutButton: {
    borderRadius: 8, paddingVertical: 16, alignItems: "center",
    borderWidth: 1.5, borderColor: Colors.danger,
  },
  logoutText: { color: Colors.danger, fontSize: FontSize.bodyLg, fontWeight: "600" },
});
