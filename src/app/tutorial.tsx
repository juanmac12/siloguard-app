import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppData } from "../contexts/AppDataContext";
import { useTheme } from "../contexts/ThemeContext";
import { Icon, IconName, ListItem, NavBar, TutorialCard } from "../components";
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

const STEPS: { icon: IconName; title: string; desc: string; spotlight: "dashboard" | "alertas" | "historial" | "pasaporte"; cardPos: "top" | "middle" | "bottom" }[] = [
  {
    icon: "home",
    title: "Tu Dashboard",
    desc: "Vas a ver todos tus silos con su estado resumido: verde, amarillo o rojo según qué tan urgente sea revisarlos.",
    spotlight: "dashboard",
    cardPos: "middle",
  },
  {
    icon: "bell",
    title: "Alertas inteligentes",
    desc: "Te avisamos con al menos 48 hs de anticipación cuando algo necesita tu atención.",
    spotlight: "alertas",
    cardPos: "top",
  },
  {
    icon: "trending-up",
    title: "Historial de sensores",
    desc: "Revisá la evolución de CO₂, temperatura y humedad para confirmar que una acción correctiva funcionó.",
    spotlight: "historial",
    cardPos: "middle",
  },
  {
    icon: "shield",
    title: "Pasaporte de Calidad",
    desc: "Certificá tus lotes y compartilos con bancos, acopios o compradores.",
    spotlight: "pasaporte",
    cardPos: "bottom",
  },
];

export default function TutorialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { profile, silos, completeOnboarding } = useAppData();
  const styles = makeStyles(colors);

  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const lastSilo = silos[silos.length - 1];

  const finish = () => {
    completeOnboarding();
    router.replace("/(tabs)/dashboard");
  };

  const next = () => {
    if (step >= STEPS.length - 1) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* mini-dashboard de fondo, no interactivo */}
      <View style={[styles.bg, { paddingTop: insets.top + 14 }]} pointerEvents="none">
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.farmName}>{profile.farmName || "Mi establecimiento"}</Text>
            <Text style={styles.pageTitle}>Mis silos</Text>
          </View>
          <View
            style={[
              styles.bellBox,
              current.spotlight === "alertas" ? { borderColor: colors.actionPrimary, ...styles.glowShadow } : { borderColor: colors.borderDefault },
            ]}
          >
            <Icon name="bell" size={20} color={colors.textPrimary} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{silos.length || 1}</Text>
            <Text style={styles.statLabel}>SILOS</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { color: colors.statusOk }]}>0</Text>
            <Text style={styles.statLabel}>ALERTAS</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, { fontSize: 15, color: colors.statusOk }]}>Óptimo</Text>
            <Text style={styles.statLabel}>ESTADO</Text>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionLabel}>TUS SILOS</Text>
          <View style={current.spotlight === "dashboard" ? styles.glowRing : null}>
            <ListItem
              title={lastSilo?.name || "Silo Norte"}
              subtitle={`${lastSilo?.grain || "Soja"} · recién vinculado`}
              value={22}
              valueUnit="°C"
              tone="ok"
            />
          </View>

          <View
            style={[
              styles.historialRow,
              current.spotlight === "historial" ? { borderColor: colors.actionPrimary, ...styles.glowShadow } : { borderColor: colors.borderDefault },
            ]}
          >
            <Icon name="trending-up" size={15} color={current.spotlight === "historial" ? colors.actionPrimary : colors.textSecondary} />
            <Text style={[styles.historialLabel, { color: current.spotlight === "historial" ? colors.actionPrimary : colors.textSecondary }]}>
              Ver historial completo
            </Text>
          </View>
        </View>

        <View style={current.spotlight === "pasaporte" ? styles.glowRing : null}>
          <NavBar active="dashboard" />
        </View>
      </View>

      {/* overlay del tutorial */}
      <View style={styles.overlay}>
        <View
          style={[
            styles.cardWrap,
            current.cardPos === "top" ? { top: insets.top + 88 } : current.cardPos === "bottom" ? { bottom: insets.bottom + 110 } : { top: "42%" },
          ]}
        >
          <TutorialCard
            icon={current.icon}
            title={current.title}
            desc={current.desc}
            step={step}
            total={STEPS.length}
            buttonLabel={step === STEPS.length - 1 ? "¡Empezar!" : "Siguiente"}
            onNext={next}
          />
        </View>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    bg: { flex: 1 },
    headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 10 },
    farmName: { fontSize: 12, color: c.textSecondary, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium), marginBottom: 3 },
    pageTitle: { fontSize: 26, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.3, color: c.textPrimary },
    bellBox: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: c.surfaceCard, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    glowShadow: { shadowColor: c.actionPrimary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 6 },
    glowRing: { borderRadius: Radius.lg, shadowColor: c.actionPrimary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.55, shadowRadius: 12, elevation: 8 },
    statsRow: { flexDirection: "row", gap: Spacing.sm, paddingHorizontal: 16, paddingBottom: 12 },
    statTile: { flex: 1, backgroundColor: c.surfaceCard, borderWidth: 1, borderColor: c.borderDefault, borderRadius: Radius.md, padding: 10 },
    statValue: { fontSize: 22, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: c.textPrimary },
    statLabel: { fontSize: 10, color: c.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 4, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    listSection: { paddingHorizontal: 16, paddingBottom: 12, gap: 10 },
    sectionLabel: { fontSize: 11, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), letterSpacing: 0.5, textTransform: "uppercase", color: c.textSecondary },
    historialRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, padding: 10, borderWidth: 1, borderRadius: Radius.md, marginTop: 10 },
    historialLabel: { fontSize: 13, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
    cardWrap: { position: "absolute", left: 20, right: 20 },
  });
