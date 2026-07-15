import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { TutorialCard, Icon, IconName } from "../components";
import { Spacing } from "../constants/Theme";

const STEPS: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "home",
    title: "Tu Dashboard",
    desc: "Vas a ver todos tus silos con su estado resumido: verde, amarillo o rojo, de un vistazo.",
  },
  {
    icon: "bell",
    title: "Alertas inteligentes",
    desc: "Te avisamos con al menos 48 hs de anticipación cuando un silo necesita atención.",
  },
  {
    icon: "trending-up",
    title: "Historial de sensores",
    desc: "Revisá la evolución de CO₂, temperatura y humedad de cada silo en el tiempo.",
  },
  {
    icon: "shield",
    title: "Pasaporte de Calidad",
    desc: "Certificá tus lotes y compartilos con bancos, acopios o compradores.",
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const handleNext = () => {
    if (isLast) {
      router.replace("/(tabs)/dashboard");
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Mini-dashboard de fondo, solo decorativo, para simular el spotlight */}
      <View style={[styles.backdrop, { backgroundColor: colors.surfaceCard }]}>
        <Icon name="home" size={48} color={colors.borderStrong} />
      </View>

      <View style={styles.overlay}>
        <TutorialCard
          icon={current.icon}
          title={current.title}
          desc={current.desc}
          step={step}
          total={STEPS.length}
          buttonLabel={isLast ? "¡Empezar!" : "Siguiente"}
          onNext={handleNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backdrop: { flex: 1, alignItems: "center", justifyContent: "center", opacity: 0.4 },
  overlay: { position: "absolute", left: 0, right: 0, bottom: 0, padding: Spacing.lg, paddingBottom: Spacing.xxl },
});
