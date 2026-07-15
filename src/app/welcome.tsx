import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { Button, Icon, IconName } from "../components";
import { Type } from "../constants/Theme";

const { width: SCREEN_W } = Dimensions.get("window");

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
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: next * SCREEN_W, animated: true });
        return next;
      });
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setIndex(newIndex);
  };

  const goToSlide = (i: number) => {
    setIndex(i);
    scrollRef.current?.scrollTo({ x: i * SCREEN_W, animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        style={styles.carousel}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={[styles.slide, { width: SCREEN_W }]}>
            <View style={[styles.iconCircle, { backgroundColor: colors.greenTint }]}>
              <Icon name={slide.icon} size={40} color={colors.green} />
            </View>
            <Text style={[styles.title, { color: colors.textPrimary }]}>{slide.title}</Text>
            <Text style={[styles.desc, { color: colors.textSecondary }]}>{slide.desc}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            onTouchEnd={() => goToSlide(i)}
            style={[
              styles.dot,
              {
                width: i === index ? 20 : 6,
                backgroundColor: i === index ? colors.actionPrimary : colors.borderStrong,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.actions}>
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

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", paddingBottom: 40 },
  carousel: { flexGrow: 0 },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 100,
    paddingBottom: 40,
    gap: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Type.h2.fontSize,
    lineHeight: Type.h2.lineHeight,
    fontWeight: Type.h2.fontWeight,
    textAlign: "center",
  },
  desc: {
    fontSize: Type.body.fontSize,
    lineHeight: Type.body.lineHeight,
    textAlign: "center",
  },
  dotsRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16 },
  dot: { height: 6, borderRadius: 999 },
  actions: { paddingHorizontal: 24, gap: 8 },
});
