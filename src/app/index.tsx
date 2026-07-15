import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { SvgXml } from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";
import { useAppData } from "../contexts/AppDataContext";

// Logo silo + galpón reconstruido desde el CSS de Figma (500×500 → viewBox 0 0 500 500)
const LOGO_SVG = `<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Cúpula del silo: arco superior -->
  <path d="M60,180 Q60,92 147,92 Q235,92 235,180" stroke="#22C55E" stroke-width="15" stroke-linecap="round" fill="none"/>
  <!-- Divisores internos de la cúpula -->
  <line x1="95"  y1="130" x2="95"  y2="180" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="147" y1="105" x2="147" y2="180" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <!-- Cuerpo del silo -->
  <rect x="60" y="180" width="125" height="280" stroke="#22C55E" stroke-width="15" fill="none" stroke-linejoin="round"/>
  <!-- Línea vertical derecha de la cúpula / separador silo-galpón -->
  <line x1="235" y1="180" x2="235" y2="260" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <!-- Escalera: rieles -->
  <line x1="100" y1="180" x2="100" y2="460" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="140" y1="180" x2="140" y2="460" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <!-- Escalera: peldaños -->
  <line x1="100" y1="215" x2="140" y2="215" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="250" x2="140" y2="250" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="285" x2="140" y2="285" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="320" x2="140" y2="320" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="355" x2="140" y2="355" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="390" x2="140" y2="390" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="425" x2="140" y2="425" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <!-- Techo del galpón (triángulo) -->
  <polyline points="190,190 322,92 465,190" stroke="#22C55E" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <!-- Cuerpo del galpón -->
  <rect x="190" y="190" width="275" height="235" stroke="#22C55E" stroke-width="15" fill="none" stroke-linejoin="round"/>
  <!-- Línea de suelo -->
  <line x1="180" y1="425" x2="465" y2="425" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <!-- Ventana -->
  <rect x="297" y="215" width="50" height="40" stroke="#22C55E" stroke-width="12" fill="none" stroke-linejoin="round"/>
  <!-- Puerta: marco horizontal superior -->
  <line x1="215" y1="310" x2="440" y2="310" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <!-- Puerta: panel izquierdo -->
  <rect x="215" y="310" width="110" height="115" stroke="#22C55E" stroke-width="12" fill="none" stroke-linejoin="round"/>
  <!-- Puerta: separador central -->
  <line x1="325" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <!-- Puerta: X panel izquierdo -->
  <line x1="215" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="325" y1="310" x2="215" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <!-- Puerta: X panel derecho -->
  <line x1="325" y1="310" x2="440" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="440" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
</svg>`;

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated, loading } = useAppData();
  const [minDelayDone, setMinDelayDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in del logo
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Pulso del glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Spinner: rotación continua
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ).start();

    // 2s en vez de 1.6s: en Expo Go con Fast Refresh el splash pasaba casi
    // desapercibido — un poco más de aire para que se note en la demo.
    const timer = setTimeout(() => setMinDelayDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Espera tanto la animación mínima como la verificación de sesión (token guardado)
  // antes de decidir a dónde navegar.
  useEffect(() => {
    if (!minDelayDone || loading) return;
    router.replace(isAuthenticated ? "/(tabs)/dashboard" : "/welcome");
  }, [minDelayDone, loading, isAuthenticated]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.center}>
        {/* Logo con glow */}
        <Animated.View style={[styles.logoWrap, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.glow, { opacity: glowAnim }]} />
          <SvgXml xml={LOGO_SVG} width={200} height={200} />
        </Animated.View>

        {/* Wordmark */}
        <Animated.Text style={[styles.wordmark, { color: colors.text, opacity: fadeAnim }]}>
          SiloGuard
        </Animated.Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Spinner fino (igual que el DS: borde con un lado verde) */}
        <Animated.View style={[styles.spinner, { borderTopColor: colors.primary, transform: [{ rotate: spin }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 80,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(34,197,94,0.12)",
  },
  wordmark: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  footer: {
    alignItems: "center",
    gap: 20,
  },
  tagline: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.12)",
    borderTopColor: "#22C55E",
  },
});
