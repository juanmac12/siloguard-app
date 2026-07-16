import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { siloApi } from "../../services/siloApi";
import type { LecturaResponse } from "../../services/types";
import { Icon, Tabs, ZoneChart, EmptyState } from "../../components";
import type { Silo, SiloThresholds, ThresholdPair } from "../../contexts/AppDataContext";

type Variable = "temp" | "hum" | "co2";
type Series = Record<Variable, number[]>;

const VCFG: Record<Variable, { label: string; icon: "thermometer" | "droplet" | "wind"; unit: string }> = {
  temp: { label: "Temperatura", icon: "thermometer", unit: "°C" },
  hum: { label: "Humedad", icon: "droplet", unit: "%" },
  co2: { label: "CO₂", icon: "wind", unit: "ppm" },
};

/** 168 horas + la actual: la serie completa que se pide una vez y se recorta por rango. */
const N = 169;

const RANGES = [
  { id: "24", label: "24h", hours: 24 },
  { id: "48", label: "48h", hours: 48 },
  { id: "72", label: "72h", hours: 72 },
  { id: "168", label: "7 días", hours: 168 },
];

/**
 * Lleva las lecturas de la API a una serie horaria de 169 puntos (vieja → nueva).
 * Los huecos se rellenan con el último valor conocido: el sensor puede saltear
 * una hora y el gráfico necesita la grilla completa.
 */
function toHourly(items: LecturaResponse[]): Series | null {
  if (items.length === 0) return null;

  // La API devuelve de la más nueva a la más vieja.
  const chrono = [...items].reverse();
  const endMs = new Date(chrono[chrono.length - 1].timestamp).getTime();

  const acc = Array.from({ length: N }, () => ({ temp: 0, hum: 0, co2: 0, n: 0 }));
  chrono.forEach((r) => {
    const hoursAgo = Math.round((endMs - new Date(r.timestamp).getTime()) / 3_600_000);
    const i = N - 1 - hoursAgo;
    if (i < 0 || i >= N) return;
    acc[i].temp += r.temp;
    acc[i].hum += r.hum;
    acc[i].co2 += r.co2;
    acc[i].n += 1;
  });

  const first = acc.find((b) => b.n > 0);
  if (!first) return null;

  const out: Series = { temp: [], hum: [], co2: [] };
  let last = { temp: first.temp / first.n, hum: first.hum / first.n, co2: first.co2 / first.n };
  for (const b of acc) {
    if (b.n > 0) last = { temp: b.temp / b.n, hum: b.hum / b.n, co2: b.co2 / b.n };
    out.temp.push(Math.round(last.temp * 10) / 10);
    out.hum.push(Math.round(last.hum * 10) / 10);
    out.co2.push(Math.round(last.co2));
  }
  return out;
}

function getVal(silo: Silo, v: Variable): number {
  return v === "temp" ? silo.temp : v === "hum" ? silo.hum : silo.co2;
}

function getTone(silo: Silo, v: Variable, th: ThresholdPair): "ok" | "warn" | "critical" {
  const val = getVal(silo, v);
  return val >= th.crit ? "critical" : val >= th.warn ? "warn" : "ok";
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

function VariablePanel({ variable, silo, data, thresholds, timeRangeHours, colors, styles }: {
  variable: Variable;
  silo: Silo;
  data: Series;
  thresholds: SiloThresholds;
  timeRangeHours: number;
  colors: ThemeColors;
  styles: ReturnType<typeof makeStyles>;
}) {
  const cfg = VCFG[variable];
  const th = thresholds[variable];
  const slice = data[variable].slice(N - 1 - timeRangeHours);
  const cv = getVal(silo, variable);
  const tone = getTone(silo, variable, th);
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
  const { silos, thresholdsFor } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, variable } = useLocalSearchParams<{ id: string; variable?: string }>();
  const [range, setRange] = useState<string>("48");

  const silo = silos.find((s) => s.id === Number(id));

  const [data, setData] = useState<Series | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "empty">("loading");
  useEffect(() => {
    if (!silo) return;
    let alive = true;
    setState("loading");
    // Se piden los 7 días una sola vez y cada rango se recorta acá. Además de
    // ahorrar requests al cambiar de tab, hace que 72h funcione: la API solo
    // acepta 24h/48h/7d.
    siloApi
      .getLecturas(silo.id, "7d", 1, 200)
      .then((res) => {
        if (!alive) return;
        const hourly = toHourly(res.items);
        setData(hourly);
        setState(hourly ? "ready" : "empty");
      })
      .catch(() => {
        if (!alive) return;
        setData(null);
        setState("empty");
      });
    return () => {
      alive = false;
    };
  }, [silo?.id]);

  if (!silo) return null;

  const thresholds = thresholdsFor(silo.id);
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

        {state === "loading" ? (
          <ActivityIndicator color={colors.actionPrimary} style={{ marginTop: 32 }} />
        ) : !data ? (
          <EmptyState
            variant="empty"
            size="sm"
            title="Sin lecturas todavía"
            body="Cuando la lanza mande datos, vas a ver el historial acá."
          />
        ) : (
          order.map((v) => (
            <VariablePanel key={v} variable={v} silo={silo} data={data} thresholds={thresholds} timeRangeHours={timeRangeHours} colors={colors} styles={styles} />
          ))
        )}
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
