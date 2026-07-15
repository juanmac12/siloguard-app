import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Svg, { Rect, Circle } from "react-native-svg";
import { ThemeColors, Radius, Spacing } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { AuthHeader, Button, Icon, IconName } from "../../components";
import { loadThresholds, saveThresholdsForSilo, SiloThresholds, MetricThreshold } from "../../services/thresholdsStorage";

type VarKey = "temp" | "hum" | "co2";

// Umbrales recomendados por defecto. TODO: reemplazar por recomendaciones
// agronómicas reales por tipo de grano cuando el backend las provea.
const RECOMMENDED: SiloThresholds = {
  temp: { warn: 28, crit: 35 },
  hum: { warn: 16, crit: 20 },
  co2: { warn: 600, crit: 800 },
};

const METRICS: Record<VarKey, { label: string; unit: string; icon: IconName; min: number; max: number }> = {
  temp: { label: "Temperatura", unit: "°C", icon: "thermometer", min: 15, max: 45 },
  hum: { label: "Humedad", unit: "%", icon: "droplet", min: 10, max: 30 },
  co2: { label: "CO₂", unit: "ppm", icon: "wind", min: 150, max: 1000 },
};

const TRACK_W = 300;
const TRACK_H = 10;

function pctOf(value: number, min: number, max: number) {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

function ThresholdTrack({ varKey, thresholds, current, colors }: {
  varKey: VarKey; thresholds: MetricThreshold; current: number; colors: ThemeColors;
}) {
  const m = METRICS[varKey];
  const warnX = pctOf(thresholds.warn, m.min, m.max) * TRACK_W;
  const critX = pctOf(thresholds.crit, m.min, m.max) * TRACK_W;
  const curX = pctOf(current, m.min, m.max) * TRACK_W;

  return (
    <Svg width={TRACK_W} height={24}>
      <Rect x={0} y={7} width={warnX} height={TRACK_H} rx={5} fill={colors.statusOkTint} />
      <Rect x={warnX} y={7} width={Math.max(0, critX - warnX)} height={TRACK_H} rx={5} fill={colors.statusWarnTint} />
      <Rect x={critX} y={7} width={Math.max(0, TRACK_W - critX)} height={TRACK_H} rx={5} fill={colors.statusCriticalTint} />
      <Rect x={warnX - 1} y={5} width={2} height={TRACK_H + 4} fill={colors.statusWarn} />
      <Rect x={critX - 1} y={5} width={2} height={TRACK_H + 4} fill={colors.statusCritical} />
      <Circle cx={curX} cy={12} r={6} fill={colors.textPrimary} stroke={colors.bg} strokeWidth={2} />
    </Svg>
  );
}

function MetricCard({
  varKey, value, current, onChange, onRestore, colors,
}: {
  varKey: VarKey;
  value: MetricThreshold;
  current: number;
  onChange: (next: MetricThreshold) => void;
  onRestore: () => void;
  colors: ThemeColors;
}) {
  const m = METRICS[varKey];
  const styles = useMemo(() => cardStyles(colors), [colors]);
  const invalid = value.warn >= value.crit;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surfaceInput }]}>
            <Icon name={m.icon} size={16} color={colors.textSecondary} />
          </View>
          <Text style={styles.label}>{m.label}</Text>
        </View>
        <Text style={styles.currentValue}>{current} {m.unit}</Text>
      </View>

      <ThresholdTrack varKey={varKey} thresholds={value} current={current} colors={colors} />
      <View style={styles.legendRow}>
        <LegendDot color={colors.statusOk} label="Normal" colors={colors} />
        <LegendDot color={colors.statusWarn} label="Advertencia" colors={colors} />
        <LegendDot color={colors.statusCritical} label="Crítica" colors={colors} />
      </View>

      <View style={styles.inputsRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>Advertencia</Text>
          <TextInput
            value={String(value.warn)}
            onChangeText={(t) => onChange({ ...value, warn: Number(t.replace(/[^0-9.]/g, "")) || 0 })}
            keyboardType="numeric"
            style={[styles.input, { borderColor: colors.borderDefault, backgroundColor: colors.surfaceInput }]}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.inputLabel}>Crítica</Text>
          <TextInput
            value={String(value.crit)}
            onChangeText={(t) => onChange({ ...value, crit: Number(t.replace(/[^0-9.]/g, "")) || 0 })}
            keyboardType="numeric"
            style={[styles.input, { borderColor: colors.borderDefault, backgroundColor: colors.surfaceInput }]}
          />
        </View>
      </View>
      {invalid ? <Text style={styles.errorText}>El umbral crítico debe ser mayor al de advertencia.</Text> : null}

      <Pressable onPress={onRestore} style={styles.restoreBtn}>
        <Icon name="refresh-cw" size={13} color={colors.primary} />
        <Text style={[styles.restoreText, { color: colors.primary }]}>Restaurar recomendado</Text>
      </Pressable>
    </View>
  );
}

function LegendDot({ color, label, colors }: { color: string; label: string; colors: ThemeColors }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 11, color: colors.textSecondary }}>{label}</Text>
    </View>
  );
}

export default function UmbralesEditorScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos } = useAppData();
  const { siloId } = useLocalSearchParams<{ siloId: string }>();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const silo = silos.find((s) => s.id === Number(siloId));
  const [values, setValues] = useState<SiloThresholds>(RECOMMENDED);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!silo) return;
    loadThresholds().then((all) => {
      setValues(all[silo.id] ?? RECOMMENDED);
      setLoading(false);
    });
  }, [silo?.id]);

  if (!silo) return null;

  const currentBy: Record<VarKey, number> = { temp: silo.temp, hum: silo.hum, co2: silo.co2 };

  const handleSave = async () => {
    const hasInvalid = (Object.keys(values) as VarKey[]).some((k) => values[k].warn >= values[k].crit);
    if (hasInvalid) {
      Alert.alert("Revisá los umbrales", "El valor crítico debe ser mayor al de advertencia en todas las métricas.");
      return;
    }
    setSaving(true);
    try {
      await saveThresholdsForSilo(silo.id, values);
      Alert.alert("Guardado", "Los umbrales se guardaron en este dispositivo.");
    } finally {
      setSaving(false);
    }
  };

  const restoreAll = () => setValues(RECOMMENDED);

  return (
    <View style={styles.container}>
      <AuthHeader title="Umbrales de alerta" showBack onBack={() => router.back()} />
      {loading ? null : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.siloName}>{silo.name}</Text>
          <Text style={styles.siloMeta}>{silo.grain} · {silo.tons} t</Text>

          <View style={[styles.infoBox, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Icon name="info" size={15} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              Estos umbrales se guardan solo en este dispositivo por ahora. Todavía no se sincronizan con el servidor.
            </Text>
          </View>

          <View style={{ gap: 14 }}>
            {(["temp", "hum", "co2"] as VarKey[]).map((k) => (
              <MetricCard
                key={k}
                varKey={k}
                value={values[k]}
                current={currentBy[k]}
                onChange={(next) => setValues((v) => ({ ...v, [k]: next }))}
                onRestore={() => setValues((v) => ({ ...v, [k]: RECOMMENDED[k] }))}
                colors={colors}
              />
            ))}
          </View>

          <Pressable onPress={restoreAll} style={styles.restoreAllBtn}>
            <Text style={[styles.restoreAllText, { color: colors.textSecondary }]}>Restaurar todos los umbrales recomendados</Text>
          </Pressable>

          <Button variant="primary" fullWidth loading={saving} onPress={handleSave} style={{ marginTop: Spacing.md }}>
            Guardar umbrales
          </Button>
        </ScrollView>
      )}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: Spacing.md, paddingBottom: 40 },
    siloName: { color: c.textPrimary, fontSize: 20, fontWeight: "700" },
    siloMeta: { color: c.textSecondary, fontSize: 13, marginTop: 2, marginBottom: Spacing.md },
    infoBox: { flexDirection: "row", gap: 10, padding: 12, borderRadius: Radius.md, borderWidth: 1, marginBottom: Spacing.md },
    infoText: { flex: 1, fontSize: 12, lineHeight: 18, color: c.textSecondary },
    restoreAllBtn: { alignItems: "center", paddingVertical: 14 },
    restoreAllText: { fontSize: 13, fontWeight: "600" },
  });

const cardStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: { backgroundColor: c.surfaceCard, borderWidth: 1, borderColor: c.borderDefault, borderRadius: Radius.lg, padding: 14, gap: 10 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    iconWrap: { width: 28, height: 28, borderRadius: Radius.md, alignItems: "center", justifyContent: "center" },
    label: { fontSize: 13, fontWeight: "600", color: c.textPrimary },
    currentValue: { fontSize: 13, fontWeight: "700", color: c.textPrimary },
    legendRow: { flexDirection: "row", gap: 14 },
    inputsRow: { flexDirection: "row", gap: 10 },
    inputLabel: { fontSize: 11, fontWeight: "700", color: c.textSecondary, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 },
    input: { borderWidth: 1, borderRadius: Radius.md, padding: 10, fontSize: 14, color: c.textPrimary },
    errorText: { fontSize: 12, color: c.statusCritical },
    restoreBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
    restoreText: { fontSize: 12, fontWeight: "600" },
  });
