import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, FontSize } from "../constants/Theme";

export default function RegistroExitosoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success icon */}
        <View style={styles.iconContainer}>
          {/* Outer glow */}
          <View style={styles.iconGlow} />
          {/* Main circle */}
          <View style={styles.iconCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* Text */}
        <Text style={styles.title}>¡Cuenta creada!</Text>
        <Text style={styles.subtitle}>
          Tu cuenta fue creada con éxito.{"\n"}
          Revisá tu email para verificarla{"\n"}
          y después iniciá sesión.
        </Text>
      </View>

      {/* Button at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },

  // Success icon
  iconContainer: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  iconGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary,
    opacity: 0.12,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: Colors.primary,
    fontSize: 48,
    fontWeight: "700",
    marginTop: -4,
  },

  // Text
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.bodyLg,
    textAlign: "center",
    lineHeight: 24,
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.bg,
    fontSize: FontSize.bodyLg,
    fontWeight: "700",
  },
});
