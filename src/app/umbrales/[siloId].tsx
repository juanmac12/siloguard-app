import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData, SiloThresholds, ThresholdPair } from "../../contexts/AppDataContext";
import { useToast } from "../../components/Toast";
import { Icon, Button, ThresholdTrack, BottomSheet, Checkbox } from "../../components";
import type { IconName } from "../../components";

type MetricKey = "co2" | "temp" | "hum";

const METRICS: { key: MetricKey; icon: IconName; label: string; unit: string; min: number; max: number; step: number; dec: number }[] = [
  { key: "co2", icon: "wind", label: "CO₂", unit: "ppm", min: 300, max: 5000, step: 50, dec: 0 },
  { key: "temp", icon: "thermometer", label: "Temperatura", unit: "°C", min: 15, max: 60, step: 0.5, dec: 1 },
  { key: "hum", icon: "droplet", label: "Humedad", unit: "%", min: 10, max: 100, step: 0.5, dec: 1 },
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const snap = (v: number, step: number) => Math.round(v / step) * step;
const fmt = (v: number, dec: number) => (dec === 0 ? String(Math.round(v)) : v.toFixed(dec));

function ThresholdInput({ label, value, unit, color, min, max, step, dec, onChange, colors }: {
  label: string; value: number; unit: string; color: string; min: number; max: number; step: number; dec: number;
  onChange: (v: number) => void; colors: ThemeColors;
}) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");
  const inputRef = useRef<TextInput>(null);
  const disp = fmt(value, dec);

  const startEdit = () => {
    setRaw(disp);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commit = () => {
    const n = parseFloat(raw.replace(",", "."));
    if (!isNaN(n)) onChange(clamp(snap(n, step), min, max));
    setEditing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={[iStyles.label, { color: colors.textMuted }]}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
        {editing ? (
          <TextInput
            ref={inputRef}
            value={raw}
            onChangeText={setRaw}
            onBlur={commit}
            onSubmitEditing={commit}
            keyboardType="numeric"
            selectTextOnFocus
            style={[iStyles.box, { color, borderColor: color, borderWidth: 1.5, backgroundColor: colors.surfaceInput }]}
          />
        ) : (
          <Pressable onPress={startEdit} style={[iStyles.box, { borderColor: colors.borderDefault, borderWidth: 1.5, backgroundColor: colors.surfaceInput }]}>
            <Text style={{ color, fontSize: 17, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold) }}>{disp}</Text>
          </Pressable>
        )}
        <Text style={{ color: colors.textMuted, fontSize: 12, fontFamily: fontFamilyForWeight(FontWeight.regular) }}>{unit}</Text>
      </View>
    </View>
  );
}

const iStyles = StyleSheet.create({
  label: { fontSize: 10, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 5 },
  box: { width: 68, height: 38, borderRadius: Radius.md, alignItems: "center", justifyContent: "center" },
});

function MetricCard({ metric, thresholds, reading, recommended, grain, onChange, onReset, colors }: {
  metric: typeof METRICS[number];
  thresholds: ThresholdPair;
  reading: number;
  recommended: ThresholdPair;
  grain: string;
  onChange: (next: ThresholdPair) => void;
  onReset: () => void;
  colors: ThemeColors;
}) {
  const { warn, crit } = thresholds;
  const readingTone = reading >= crit ? "critical" : reading >= warn ? "warn" : "ok";
  const readingColor = readingTone === "critical" ? colors.statusCritical : readingTone === "warn" ? colors.statusWarn : colors.statusOk;
  const readingTint = readingTone === "critical" ? colors.statusCriticalTint : readingTone === "warn" ? colors.statusWarnTint : colors.statusOkTint;

  const warnLow = warn < recommended.warn * 0.75;
  const critHigh = crit > recommended.crit * 1.5;

  return (
    <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Icon name={metric.icon} size={20} color={colors.textSecondary} />
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>{metric.label}</Text>
        <View style={{ flex: 1 }} />
        <View style={[styles.readingChip, { backgroundColor: readingTint, borderColor: readingColor }]}>
          <View style={[styles.readingDot, { backgroundColor: readingColor }]} />
          <Text style={[styles.readingText, { color: readingColor }]}>{fmt(reading, metric.dec)} {metric.unit}</Text>
        </View>
      </View>

      <ThresholdTrack min={metric.min} max={metric.max} dec={metric.dec} unit={metric.unit} warn={warn} crit={crit} reading={reading} />

      <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
        <ThresholdInput
          label="Advertencia" value={warn} unit={metric.unit} color={colors.statusWarn}
          min={metric.min} max={metric.max} step={metric.step} dec={metric.dec}
          onChange={(v) => onChange({ warn: clamp(v, metric.min, crit - metric.step), crit })}
          colors={colors}
        />
        <View style={[styles.divider, { backgroundColor: colors.borderDefault }]} />
        <ThresholdInput
          label="Crítica" value={crit} unit={metric.unit} color={colors.statusCritical}
          min={metric.min} max={metric.max} step={metric.step} dec={metric.dec}
          onChange={(v) => onChange({ warn, crit: clamp(v, warn + metric.step, metric.max) })}
          colors={colors}
        />
      </View>

      {warnLow ? (
        <View style={[styles.warnBox, { backgroundColor: colors.statusWarnTint, borderColor: colors.statusWarn }]}>
          <Icon name="alert-triangle" size={13} color={colors.statusWarn} />
          <Text style={[styles.warnText, { color: colors.statusWarn }]}>El umbral de advertencia es bajo para {grain}. Pueden generarse alertas prematuras.</Text>
        </View>
      ) : null}
      {critHigh ? (
        <View style={[styles.warnBox, { backgroundColor: colors.statusWarnTint, borderColor: colors.statusWarn }]}>
          <Icon name="alert-triangle" size={13} color={colors.statusWarn} />
          <Text style={[styles.warnText, { color: colors.statusWarn }]}>El umbral crítico está muy por encima del recomendado. Puede demorar la detección de problemas.</Text>
        </View>
      ) : null}

      <Pressable onPress={onReset} style={styles.resetRow}>
        <Icon name="refresh-cw" size={11} color={colors.textMuted} />
        <Text style={[styles.resetText, { color: colors.textMuted }]}>Restaurar recomendado</Text>
      </Pressable>
    </View>
  );
}

export default function UmbralesSiloScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos, thresholdsFor, recommendedFor, setSiloThresholds, applyThresholdsToOthers } = useAppData();
  const toast = useToast();
  const styles2 = useMemo(() => makeStyles(colors), [colors]);
  const { siloId } = useLocalSearchParams<{ siloId: string }>();

  const [grainFilter, setGrainFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number>(Number(siloId));
  const [pending, setPending] = useState<SiloThresholds>(() => thresholdsFor(Number(siloId)));
  const [saving, setSaving] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [applyTo, setApplyTo] = useState<number[]>([]);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    setSelectedId(Number(siloId));
    setPending(thresholdsFor(Number(siloId)));
  }, [siloId]);

  const selectedSilo = silos.find((s) => s.id === selectedId);
  const grains = useMemo(() => Array.from(new Set(silos.map((s) => s.grain))).sort(), [silos]);
  const filteredSilos = grainFilter ? silos.filter((s) => s.grain === grainFilter) : silos;

  if (!selectedSilo) return null;

  const committed = thresholdsFor(selectedId);
  const hasChanges = JSON.stringify(pending) !== JSON.stringify(committed);
  const recommended = recommendedFor(selectedSilo.grain);
  const otherSame = silos.filter((s) => s.id !== selectedId && s.grain === selectedSilo.grain);

  const selectSilo = (id: number) => {
    router.setParams({ siloId: String(id) } as any);
  };

  const onGrainFilter = (g: string | null) => {
    setGrainFilter(g);
    const first = g ? silos.find((s) => s.grain === g) : silos[0];
    if (first) selectSilo(first.id);
  };

  const updateMetric = (key: MetricKey, next: ThresholdPair) => setPending((p) => ({ ...p, [key]: next }));

  const resetMetric = (key: MetricKey) => setPending((p) => ({ ...p, [key]: { ...recommended[key] } }));

  const restoreAll = () => setPending({ co2: { ...recommended.co2 }, temp: { ...recommended.temp }, hum: { ...recommended.hum } });

  const save = async () => {
    setSaving(true);
    try {
      await setSiloThresholds(selectedId, pending);
      toast.addToast({ tone: "ok", title: "Umbrales guardados", message: `${selectedSilo.name} actualizado.` });
    } finally {
      setSaving(false);
    }
  };

  const openApply = () => {
    setApplyTo(otherSame.map((s) => s.id));
    setShowApply(true);
  };

  const toggleApply = (id: number) => setApplyTo((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const doApply = async () => {
    setApplying(true);
    try {
      await setSiloThresholds(selectedId, pending);
      await applyThresholdsToOthers(selectedId, applyTo);
      toast.addToast({ tone: "ok", title: `Aplicado a ${applyTo.length} silo${applyTo.length !== 1 ? "s" : ""}` });
      setShowApply(false);
    } finally {
      setApplying(false);
    }
  };

  const readings: Record<MetricKey, number> = { co2: selectedSilo.co2, temp: selectedSilo.temp, hum: selectedSilo.hum };

  return (
    <View style={styles2.container}>
      <View style={[styles2.header, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} style={styles2.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <Text style={styles2.headerTitle}>Umbrales de alerta</Text>
      </View>

      <View style={styles2.filters}>
        <Text style={styles2.filterLabel}>TIPO DE GRANO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
          <Pressable onPress={() => onGrainFilter(null)} style={[styles2.chip, grainFilter === null ? styles2.chipActive : null]}>
            <Text style={[styles2.chipText, grainFilter === null ? styles2.chipTextActive : null]}>Todos</Text>
          </Pressable>
          {grains.map((g) => (
            <Pressable key={g} onPress={() => onGrainFilter(g)} style={[styles2.chip, grainFilter === g ? styles2.chipActive : null]}>
              <Text style={[styles2.chipText, grainFilter === g ? styles2.chipTextActive : null]}>{g}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={[styles2.filterLabel, { marginTop: 10 }]}>SILO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {filteredSilos.map((s) => {
            const dotColor = s.status === "critical" ? colors.statusCritical : s.status === "warn" ? colors.statusWarn : colors.statusOk;
            const active = s.id === selectedId;
            return (
              <Pressable key={s.id} onPress={() => selectSilo(s.id)} style={[styles2.siloChip, active ? styles2.siloChipActive : null]}>
                <View style={[styles2.siloDot, { backgroundColor: dotColor }]} />
                <Text style={[styles2.siloChipText, active ? styles2.siloChipTextActive : null]}>{s.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles2.metaRow, { borderBottomColor: colors.borderDefault }]}>
          <Text style={styles2.metaText}>{selectedSilo.grain} · {selectedSilo.tons} t · {selectedSilo.storage}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles2.scroll} showsVerticalScrollIndicator={false}>
        {METRICS.map((m) => (
          <MetricCard
            key={m.key}
            metric={m}
            thresholds={pending[m.key]}
            reading={readings[m.key]}
            recommended={recommended[m.key]}
            grain={selectedSilo.grain}
            onChange={(next) => updateMetric(m.key, next)}
            onReset={() => resetMetric(m.key)}
            colors={colors}
          />
        ))}

        <Button
          variant="ghost"
          fullWidth
          leadingIcon={<Icon name="refresh-cw" size={14} color={colors.textLink} />}
          onPress={restoreAll}
          style={{ marginTop: 4 }}
        >
          Restaurar todos los valores recomendados
        </Button>

        {otherSame.length > 0 ? (
          <Pressable onPress={openApply} style={[styles2.applyBtn, { backgroundColor: colors.greenTint, borderColor: colors.actionPrimary }]}>
            <Icon name="copy" size={15} color={colors.actionPrimary} />
            <Text style={styles2.applyText}>Aplicar a otros silos de {selectedSilo.grain} ({otherSame.length})</Text>
          </Pressable>
        ) : null}
      </ScrollView>

      <View style={[styles2.footer, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg }]}>
        <Button variant="primary" fullWidth loading={saving} disabled={!hasChanges} onPress={save}>
          Guardar
        </Button>
      </View>

      <BottomSheet
        open={showApply}
        onClose={() => setShowApply(false)}
        title="Aplicar a otros silos"
        actions={[
          <Button key="ok" variant="primary" fullWidth loading={applying} disabled={applyTo.length === 0} onPress={doApply}>
            Aplicar a {applyTo.length} silo{applyTo.length !== 1 ? "s" : ""}
          </Button>,
          <Button key="cancel" variant="ghost" fullWidth onPress={() => setShowApply(false)}>
            Cancelar
          </Button>,
        ]}
      >
        <Text style={styles2.applySheetIntro}>
          Copiá los umbrales de <Text style={{ color: colors.textPrimary, fontWeight: FontWeight.semibold }}>{selectedSilo.name}</Text> a estos silos de{" "}
          <Text style={{ color: colors.textPrimary, fontWeight: FontWeight.semibold }}>{selectedSilo.grain}</Text>:
        </Text>
        <View style={{ gap: 4 }}>
          {otherSame.map((s) => (
            <Checkbox
              key={s.id}
              checked={applyTo.includes(s.id)}
              onChange={() => toggleApply(s.id)}
              label={`${s.name} — ${s.grain} · ${s.tons} t`}
            />
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md, gap: Spacing.md, marginBottom: Spacing.sm },
  cardTitle: { fontSize: 15, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  readingChip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 3, borderRadius: Radius.full, borderWidth: 1 },
  readingDot: { width: 6, height: 6, borderRadius: 3 },
  readingText: { fontSize: 12, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  divider: { width: 1, alignSelf: "stretch", marginHorizontal: 10 },
  warnBox: { flexDirection: "row", gap: 7, padding: 9, borderRadius: 8, borderWidth: 1, alignItems: "flex-start" },
  warnText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  resetRow: { flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-end", marginTop: -4 },
  resetText: { fontSize: 12, fontFamily: fontFamilyForWeight(FontWeight.regular) },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary },

    filters: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm },
    filterLabel: { fontSize: 10, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), letterSpacing: 0.6, color: c.textMuted, marginBottom: 7 },
    chip: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full, backgroundColor: c.surfaceInput, borderWidth: 1, borderColor: c.borderDefault },
    chipActive: { backgroundColor: c.greenTint, borderColor: c.actionPrimary },
    chipText: { fontSize: 12, color: c.textMuted, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    chipTextActive: { color: c.actionPrimary, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },

    siloChip: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 13, paddingVertical: 7, borderRadius: Radius.full, backgroundColor: c.surfaceCard, borderWidth: 1, borderColor: c.borderDefault },
    siloChipActive: { backgroundColor: c.greenTint, borderColor: c.actionPrimary },
    siloDot: { width: 7, height: 7, borderRadius: 3.5 },
    siloChipText: { fontSize: 13, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    siloChipTextActive: { color: c.actionPrimary, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },

    metaRow: { paddingVertical: 10, marginTop: 10, borderBottomWidth: 1 },
    metaText: { fontSize: 12, color: c.textMuted, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    scroll: { padding: Spacing.md, paddingBottom: 24, gap: 4 },

    applyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: 12, borderRadius: Radius.md, borderWidth: 1, marginTop: 4 },
    applyText: { fontSize: 14, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium), color: c.actionPrimary },

    footer: { padding: Spacing.md, borderTopWidth: 1 },

    applySheetIntro: { fontSize: 13, color: c.textSecondary, lineHeight: 20, fontFamily: fontFamilyForWeight(FontWeight.regular), marginBottom: 4 },
  });
