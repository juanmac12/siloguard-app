import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, FontSize } from "../constants/Theme";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Background grain pattern */}
      <View style={styles.bgPattern}>
        <View style={styles.grain1} />
        <View style={styles.grain2} />
        <View style={styles.grain3} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌾</Text>
          </View>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Logo text */}
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>◉</Text>
            </View>
            <Text style={styles.brandName}>SiloGuard</Text>
          </View>

          <Text style={styles.title}>Bienvenido a SiloGuard</Text>
          <Text style={styles.subtitle}>
            Gestión inteligente y monitoreo{"\n"}de sus silos.
          </Text>

          {/* Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/register")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // Background decorative elements
  bgPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  grain1: {
    position: "absolute",
    top: 80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.06,
  },
  grain2: {
    position: "absolute",
    top: 200,
    left: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary,
    opacity: 0.04,
  },
  grain3: {
    position: "absolute",
    top: 140,
    left: 100,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.accent,
    opacity: 0.03,
  },

  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: Spacing.xxl,
  },

  // Top logo area
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: {
    fontSize: 56,
  },

  // Card
  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  brandIconText: {
    color: Colors.primary,
    fontSize: 12,
  },
  brandName: {
    color: Colors.primary,
    fontSize: FontSize.headingLg,
    fontWeight: "700",
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.headingXl,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.bodyLg,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },

  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    color: Colors.bg,
    fontSize: FontSize.bodyLg,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: FontSize.bodyLg,
    fontWeight: "600",
  },
});
