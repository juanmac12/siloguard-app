import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, FontSize } from "../constants/Theme";

export default function VerificarEmailScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header Fijo */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verificar email</Text>
        </View>
        <View style={styles.headerSeparator} />
      </View>

      <View style={styles.content}>
        {/* Icono de Campana */}
        <View style={styles.iconContainer}>
          <View style={styles.bellIconPlaceholder}>
            {/* Si agregas un paquete de iconos como expo/vector-icons usa un ícono de campana acá */}
            <Text style={styles.bellIconEmoji}>🔔</Text>
          </View>
        </View>

        <Text style={styles.heading}>Revisá tu correo</Text>

        <Text style={styles.description}>
          Te enviamos un enlace de verificación a{"\n"}
          <Text style={styles.emailBold}>tu correo</Text>. Tocá el enlace para activar{"\n"}
          tu cuenta.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/registro-exitoso")}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Ya verifiqué</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.6}>
          <Text style={styles.secondaryButtonText}>Reenviar email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerContainer: { paddingTop: 60, backgroundColor: Colors.bg },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md },
  backButton: { paddingRight: Spacing.md },
  backArrow: { color: Colors.text, fontSize: 32, fontWeight: "400", lineHeight: 32, marginTop: -4 },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingLg, fontWeight: "700" },
  headerSeparator: { height: 1, backgroundColor: Colors.border, width: "100%" },
  content: { flex: 1, paddingHorizontal: Spacing.lg, justifyContent: "center", alignItems: "center", marginTop: -60 },
  iconContainer: { marginBottom: Spacing.xl },
  bellIconPlaceholder: { width: 80, height: 80, backgroundColor: "#1E293B", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  bellIconEmoji: { fontSize: 32 },
  heading: { color: "#FFFFFF", fontSize: FontSize.headingXl, fontWeight: "700", marginBottom: Spacing.md },
  description: { color: Colors.textMuted, fontSize: FontSize.bodyMd, textAlign: "center", lineHeight: 22, marginBottom: Spacing.xxl },
  emailBold: { color: "#FFFFFF", fontWeight: "600" },
  primaryButton: { backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 16, alignItems: "center", width: "100%", marginBottom: Spacing.lg },
  primaryButtonText: { color: Colors.bg, fontSize: FontSize.bodyLg, fontWeight: "700" },
  secondaryButton: { paddingVertical: Spacing.sm },
  secondaryButtonText: { color: Colors.primary, fontSize: FontSize.bodyMd, fontWeight: "500" },
});
