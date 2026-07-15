import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { Icon, Tabs, ZoneChart } from "../../components";
import type { Silo } from "../../contexts/AppDataContext";

type Variable = "temp" | "hum" | "co2";

const TH: Record<Variable, { warn: number; crit: number }> = {
  temp: { warn: 28, crit: 35 },
  hum: { warn: 16, crit: 20 },
  co2: { warn: 600, crit: 800 },
};

const VCFG: Record<Variable, { label: string; icon: "thermometer" | "droplet" | "wind"; unit: string }> = {
  temp: { label: "Temperatura", icon: "thermometer", unit: "°C" },
  hum: { label: "Humedad", icon: "droplet", unit: "%" },
  co2: { label: "CO₂", icon: "wind", unit: "ppm" },
};

const RANGES = [
  { id: "24", label: "24h", hours: 24 },
  { id: "48", label: "48h", hours: 48 },
  { id: "72", label: "72h", hours: 72 },
  { id: "168", label: "7 días", hours: 168 },
];

/** Generador determinista (mismo silo -> misma curva) — portado de historial-screen.jsx. */
function rng(seed: number) {
  let s = ((seed % 2147483647) + 2147483647) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function genData(silo: Silo) {
  const r = rng(silo.id * 7919 + 42);
  const N = 169;
  function curve(end: number, range: number, shape: "exp" | "sig" | "linear", noise: number, daily: number) {
    const start = end - range;
    const arr: number[] = [];
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      let b: number;
      if (shape === "exp") b = start + range * Math.pow(t, 2.2);
      else if (shape === "sig") b = start + range / (1 + Math.exp(-10 * (t - 0.45)));
      else b = start + range * t;
      arr.push(+(b + (r() - 0.5) * 2 * noise + daily * Math.sin((i / 24) * Math.PI * 2 - 0.9)).toFixed(1));
    }
    arr[N - 1] = end;
    return arr;
  }
  const c = silo.status === "critical";
  const w = silo.status === "warn";
  return {
    temp: curve(silo.temp, c ? 16 : w ? 5 : 2, c ? "exp" : "linear", c ? 0.6 : 0.3, c ? 0.8 : 1.2),
    hum: curve(silo.hum, c ? 3 : w ? 3 : 1, "linear", 0.4, 0.3),
    co2: curve(silo.co2, c ? 400 : w ? 120 : 40, c ? "sig" : "linear", c ? 15 : 8, 5),
  };
}

function getVal(silo: Silo, v: Variable): number {
  return v === "temp" ? silo.temp : v === "hum" ? silo.hum : silo.co2;
}

function getTone(silo: Silo, v: Variable): "ok" | "warn" | "critical" {
  const val = getVal(silo, v);
  return val >= TH[v].crit ? "critical" : val >= TH[v].warn ? "warn" : "ok";
}

function statusMsg(tone: "ok" | "warn" | "critical", slice: number[], th: { warn: number; crit: number }): string {
  const len = slice.length;
  const critIdx = slice.findIndex((v) => v >= th.crit);
  const warnIdx = slice.findIndex((v) => v >= th.warn);
  if (tone === "critical" && critIdx >= 0 && critIdx < len - 1) return `Superó el límite hace ${len - 1 - critIdx}h`;
  if (tone === "warn" && warnIdx >= 0 && warnIdx < len - 1) return `En advertencia hace ${len - 1 - warnIdx}h`;
  if (tone === "ok") return "Dentro del rango seguro";
  return "";
}

function VariablePanel({ variable, silo, data, timeRangeHours, colors, styles }: {
  variable: Variable;
  silo: Silo;
  data: Record<Variable, number[]>;
  timeRangeHours: number;
  colors: ThemeColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const cfg = VCFG[variable];
  const th = TH[variable];
  const slice = data[variable].slice(168 - timeRangeHours);
  const cv = getVal(silo, variable);
  const tone = getTone(silo, variable);
  const hex = tone === "critical" ? colors.statusCritical : tone === "warn" ? colors.statusWarn : colors.statusOk;
  const msg = statusMsg(tone, slice, th);

  const mn = Math.min(...slice).toFixed(1);
  const mx = Math.max(...slice).toFixed(1);
  const avg = (slice.reduce((a, b) => a + b, 0) / slice.length).toFixed(1);
  const toneLabel = tone === "critical" ? "CRÍTICO" : tone === "warn" ? "ADVERTENCIA" : "OK";

  return (
    <View style={[styles.panel, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault, borderTopColor: hex }]}>
      <View style={styles.panelHeader}>
        <View style={{ gap: 6, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Icon name={cfg.icon} size={15} color={colors.textSecondary} />
            <Text style={[styles.panelLabel, { color: colors.textSecondary }]}>{cfg.label}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
            <View style={[styles.dot, { backgroundColor: hex }]} />
            <Text style={[styles.toneLabel, { color: hex }]}>{toneLabel}</Text>
            {msg ? <Text style={[styles.msg, { color: colors.textMuted }]}>· {msg}</Text> : null}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3, marginLeft: 12 }}>
          <Text style={[styles.panelValue, { color: colors.textPrimary }]}>{cv}</Text>
          <Text style={[styles.panelUnit, { color: colors.textSecondary }]}>{cfg.unit}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 8, paddingBottom: 4 }}>
        <ZoneChart slice={slice} warn={th.warn} crit={th.crit} timeRange={timeRangeHours} />
      </View>

      <View style={[styles.legendRow, { borderTopColor: colors.borderDefault, backgroundColor: colors.surfaceApp }]}>
        {([["Seguro", colors.statusOk], ["Advertencia", colors.statusWarn], ["Crítico", colors.statusCritical]] as [string, string][]).map(([l, cHex]) => (
          <View key={l} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: cHex, opacity: 0.7 }} />
            <Text style={[styles.legendText, { color: colors.textMuted }]}>{l}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.statsRow, { borderTopColor: colors.borderDefault }]}>
        {([["Mín", mn], ["Máx", mx], ["Prom", avg]] as [string, string][]).map(([label, val], i) => (
          <View key={label} style={[styles.statCol, i < 2 ? { borderRightWidth: 1, borderRightColor: colors.borderDefault } : null]}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {val}
              <Text style={[styles.statUnit, { color: colors.textSecondary }]}> {cfg.unit}</Text>
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HistorialScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, variable } = useLocalSearchParams<{ id: string; variable?: string }>();
  const [range, setRange] = useState<string>("48");

  const silo = silos.find((s) => s.id === Number(id));
  const data = useMemo(() => (silo ? genData(silo) : null), [silo?.id]);

  if (!silo || !data) return null;

  const timeRangeHours = RANGES.find((r) => r.id === range)?.hours ?? 48;
  const order: Variable[] = variable === "hum" ? ["hum", "temp", "co2"] : variable === "co2" ? ["co2", "temp", "hum"] : ["temp", "hum", "co2"];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>Historial de sensores</Text>
          <Text style={styles.headerSub} numberOfLines={1}>{silo.name} · {silo.grain}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Icon name="wifi" size={12} color={colors.textMuted} />
          <Text style={styles.lastSync}>{silo.lastUpdate}</Text>
        </View>
      </View>

      <View style={[styles.rangeWrap, { borderBottomColor: colors.borderDefault }]}>
        <Tabs variant="pill" fullWidth activeId={range} onChange={setRange} items={RANGES.map((r) => ({ id: r.id, label: r.label }))} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.hint, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
          <Icon name="info" size={14} color={colors.textMuted} />
          <Text style={[styles.hintText, { color: colors.textMuted }]}>
            Las bandas de color muestran las <Text style={{ color: colors.textSecondary, fontWeight: FontWeight.semibold }}>zonas segura, de advertencia y crítica</Text>. La línea es el recorrido del sensor en el período elegido.
          </Text>
        </View>

        {order.map((v) => (
          <VariablePanel key={v} variable={v} silo={silo} data={data} timeRangeHours={timeRangeHours} colors={colors} styles={styles} />
        ))}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingTop: 56,
      paddingBottom: 10,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.borderDefault,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary },
    headerSub: { fontSize: 12, color: c.textSecondary, marginTop: 1, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    lastSync: { fontSize: 11, color: c.textMuted, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    rangeWrap: { paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },

    scroll: { padding: 16, paddingTop: 14, gap: 14, paddingBottom: 32 },

    hint: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 10, borderRadius: Radius.md, borderWidth: 1, marginBottom: 14 },
    hintText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    panel: { borderRadius: Radius.lg, borderWidth: 1, borderTopWidth: 3, overflow: "hidden", marginBottom: 14 },
    panelHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", padding: 14, paddingBottom: 10 },
    panelLabel: { fontSize: 13, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), letterSpacing: 0.2 },
    dot: { width: 7, height: 7, borderRadius: 3.5 },
    toneLabel: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: 0.5 },
    msg: { fontSize: 11, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    panelValue: { fontSize: 30, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -1, lineHeight: 32 },
    panelUnit: { fontSize: 13, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },

    legendRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1 },
    legendText: { fontSize: 10, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    statsRow: { flexDirection: "row", borderTopWidth: 1 },
    statCol: { flex: 1, paddingVertical: 10, alignItems: "center" },
    statLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: fontFamilyForWeight(FontWeight.regular), marginBottom: 3 },
    statValue: { fontSize: 14, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.3 },
    statUnit: { fontSize: 11, fontWeight: FontWeight.regular, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  });
