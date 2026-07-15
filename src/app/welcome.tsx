import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";
import { Icon, IconName, Button, StepDots } from "../components";
import { Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

const SLIDES: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "target",
    title: "Monitoreo en tiempo real",
    desc: "Vigilá CO₂, temperatura y humedad de tus silos desde la palma de tu mano.",
  },
  {
    icon: "bell",
    title: "Alertas con anticipación",
    desc: "Te avisamos con al menos 48 hs antes de que el deterioro sea irreversible.",
  },
  {
    icon: "shield",
    title: "Pasaporte de calidad",
    desc: "Certificá tus lotes y compartilos con bancos, acopios o compradores.",
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 4200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const active = SLIDES[slide];
  const styles = makeStyles(colors);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.center}>
        <View style={styles.iconCircle}>
          <Icon name={active.icon} size={40} color={colors.actionPrimary} />
        </View>
        <Text style={styles.title}>{active.title}</Text>
        <Text style={styles.desc}>{active.desc}</Text>
      </View>

      <View style={styles.dotsRow}>
        <StepDots total={SLIDES.length} active={slide} />
      </View>

      <View style={styles.ctaCol}>
        <Button variant="primary" fullWidth onPress={() => router.push("/register")}>
          Registrarme
        </Button>
        <Button variant="ghost" fullWidth onPress={() => router.push("/login")}>
          Iniciar sesión
        </Button>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bg,
      paddingHorizontal: 24,
    },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: c.greenTint,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 26,
      lineHeight: 32,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      letterSpacing: -0.5,
      color: c.textPrimary,
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
    dotsRow: {
      alignItems: "center",
      paddingVertical: 12,
    },
    ctaCol: {
      gap: Spacing.sm,
    },
  });
