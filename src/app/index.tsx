import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { SvgXml } from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";
import { useAppData } from "../contexts/AppDataContext";
import { Type, FontFamily } from "../constants/Theme";

const LOGO_SVG = `<svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M60,180 Q60,92 147,92 Q235,92 235,180" stroke="#22C55E" stroke-width="15" stroke-linecap="round" fill="none"/>
  <line x1="95"  y1="130" x2="95"  y2="180" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="147" y1="105" x2="147" y2="180" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <rect x="60" y="180" width="125" height="280" stroke="#22C55E" stroke-width="15" fill="none" stroke-linejoin="round"/>
  <line x1="235" y1="180" x2="235" y2="260" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="100" y1="180" x2="100" y2="460" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="140" y1="180" x2="140" y2="460" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <line x1="100" y1="215" x2="140" y2="215" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="250" x2="140" y2="250" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="285" x2="140" y2="285" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="320" x2="140" y2="320" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="355" x2="140" y2="355" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="390" x2="140" y2="390" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="100" y1="425" x2="140" y2="425" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <polyline points="190,190 322,92 465,190" stroke="#22C55E" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <rect x="190" y="190" width="275" height="235" stroke="#22C55E" stroke-width="15" fill="none" stroke-linejoin="round"/>
  <line x1="180" y1="425" x2="465" y2="425" stroke="#22C55E" stroke-width="15" stroke-linecap="round"/>
  <rect x="297" y="215" width="50" height="40" stroke="#22C55E" stroke-width="12" fill="none" stroke-linejoin="round"/>
  <line x1="215" y1="310" x2="440" y2="310" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <rect x="215" y="310" width="110" height="115" stroke="#22C55E" stroke-width="12" fill="none" stroke-linejoin="round"/>
  <line x1="325" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="12" stroke-linecap="round"/>
  <line x1="215" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="325" y1="310" x2="215" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="325" y1="310" x2="440" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
  <line x1="440" y1="310" x2="325" y2="425" stroke="#22C55E" stroke-width="10" stroke-linecap="round"/>
</svg>`;

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isAuthenticated, onboardingDone, loading } = useAppData();
  const [minDelayDone, setMinDelayDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.55, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 800, useNativeDriver: true, easing: Easing.linear })
    ).start();

    const timer = setTimeout(() => setMinDelayDone(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!minDelayDone || loading) return;
    if (isAuthenticated && onboardingDone) {
      router.replace("/(tabs)/dashboard");
    } else {
      router.replace("/welcome");
    }
  }, [minDelayDone, loading, isAuthenticated, onboardingDone]);

  const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Animated.View style={[styles.logoWrap, { opacity: Animated.multiply(fadeAnim, pulseAnim) }]}>
        <SvgXml xml={LOGO_SVG} width={84} height={84} />
      </Animated.View>
      <Animated.Text style={[styles.wordmark, { color: colors.textPrimary, opacity: fadeAnim }]}>SiloGuard</Animated.Text>
      <Animated.View style={[styles.spinner, { borderTopColor: colors.actionPrimary, borderColor: colors.borderDefault, transform: [{ rotate: spin }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  wordmark: {
    fontSize: 22,
    fontWeight: Type.h3.fontWeight,
    fontFamily: FontFamily.semibold,
    letterSpacing: -0.4,
  },
  spinner: {
    position: "absolute",
    bottom: 72,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
  },
});
