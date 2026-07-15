import { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, LayoutChangeEvent } from "react-native";
import Svg, { Rect, Line, Polyline, Circle } from "react-native-svg";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemeColors, Radius, Spacing } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { siloApi } from "../../services/siloApi";
import { LecturaResponse } from "../../services/types";
import { Icon, IconName } from "../../components";

// El backend solo reconoce 24h/48h/7d (LecturaService.cs) — no se agrega 72h
// acá para no mandar un rango que el servidor ignoraría silenciosamente.
const RANGES = ["24h", "48h", "7d"] as const;
type Range = typeof RANGES[number];
type VarKey = "temp" | "hum" | "co2";

const CHART_W = 320;
const CHART_H = 140;
const PAGE_SIZE = 24;
const WEEKDAY = ["D", "L", "M", "M", "J", "V", "S"];

interface ChartPoint {
  hora: string;
  co2: number;
  temp: number;
  hum: number;
}

function bucketize(items: LecturaResponse[], range: Range): ChartPoint[] {
  const chrono = [...items].reverse();
  const bucketCount = 7;
  const size = Math.max(1, Math.ceil(chrono.length / bucketCount));
  const buckets: ChartPoint[] = [];

  for (let i = 0; i < chrono.length; i += size) {
    const slice = chrono.slice(i, i + size);
    if (slice.length === 0) continue;
    const avg = (sel: (r: LecturaResponse) => number) =>
      slice.reduce((s, r) => s + sel(r), 0) / slice.length;
    const last = slice[slice.length - 1];
    const date = new Date(last.timestamp);
    const hora = range === "7d" ? WEEKDAY[date.getDay()] : String(date.getHours()).padStart(2, "0");

    buckets.push({
      hora,
      co2: Math.round(avg((r) => r.co2)),
      temp: Math.round(avg((r) => r.temp) * 10) / 10,
      hum: Math.round(avg((r) => r.hum) * 10) / 10,
    });
  }

  return buckets.slice(-7);
}

const METRICS: Record<VarKey, {
  label: string; unit: string; icon: IconName;
  min: number; max: number; warn: number; crit: number;
}> = {
  temp: { label: "Temperatura", unit: "°C", icon: "thermometer", min: 15, max: 45, warn: 28, crit: 35 },
  hum: { label: "Humedad", unit: "%", icon: "droplet", min: 10, max: 30, warn: 16, crit: 20 },
  co2: { label: "CO₂", unit: "ppm", icon: "wind", min: 150, max: 1000, warn: 600, crit: 800 },
};

function toneOf(value: number, m: typeof METRICS[VarKey]): "ok" | "warn" | "critical" {
  if (value >= m.crit) return "critical";
  if (value >= m.warn) return "warn";
  return "ok";
}

function toneColorOf(tone: "ok" | "warn" | "critical", colors: ThemeColors) {
  return tone === "critical" ? colors.statusCritical : tone === "warn" ? colors.statusWarn : colors.statusOk;
}

function statusMsg(tone: "ok" | "warn" | "critical", label: string) {
  if (tone === "critical") return `${label} superó el límite crítico.`;
  if (tone === "warn") return `${label} está por encima del umbral de advertencia.`;
  return `${label} está dentro del rango normal.`;
}

function y(value: number, m: typeof METRICS[VarKey]) {
  const clamped = Math.max(m.min, Math.min(m.max, value));
  const pct = (clamped - m.min) / (m.max - m.min);
  return CHART_H - pct * CHART_H;
}

function ZoneChart({ points, varKey, colors }: { points: number[]; varKey: VarKey; colors: ThemeColors }) {
  const m = METRICS[varKey];
  const warnY = y(m.warn, m);
  const critY = y(m.crit, m);
  const stepX = points.length > 1 ? CHART_W / (points.length - 1) : 0;
  const coords = points.map((v, i) => `${i * stepX},${y(v, m)}`).join(" ");
  const last = points[points.length - 1] ?? m.min;
  const lastTone = toneOf(last, m);

  return (
    <Svg width={CHART_W} height={CHART_H}>
      {/* Zonas de fondo: verde (seguro) / ámbar (advertencia) / rojo (crítico) */}
      <Rect x={0} y={0} width={CHART_W} height={critY} fill={colors.statusCriticalTint} />
      <Rect x={0} y={critY} width={CHART_W} height={warnY - critY} fill={colors.statusWarnTint} />
      <Rect x={0} y={warnY} width={CHART_W} height={CHART_H - warnY} fill={colors.statusOkTint} />

      {/* Líneas de umbral */}
      <Line x1={0} y1={warnY} x2={CHART_W} y2={warnY} stroke={colors.statusWarn} strokeWidth={1} strokeDasharray="4,4" />
      <Line x1={0} y1={critY} x2={CHART_W} y2={critY} stroke={colors.statusCritical} strokeWidth={1} strokeDasharray="4,4" />

      {/* Línea de datos */}
      {points.length > 1 && (
        <Polyline points={coords} fill="none" stroke={colors.textPrimary} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      )}

      {/* Punto del valor actual */}
      {points.length > 0 && (
        <Circle cx={(points.length - 1) * stepX} cy={y(last, m)} r={5} fill={toneColorOf(lastTone, colors)} stroke={colors.bg} strokeWidth={2} />
      )}
    </Svg>
  );
}

function VariablePanel({
  varKey, points, items, onLayout,
}: {
  varKey: VarKey;
  points: number[];
  items: number[];
  onLayout: (e: LayoutChangeEvent) => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => panelStyles(colors), [colors]);
  const m = METRICS[varKey];
  const current = points[points.length - 1] ?? 0;
  const tone = toneOf(current, m);
  const toneColor = toneColorOf(tone, colors);
  const toneTint = tone === "critical" ? colors.statusCriticalTint : tone === "warn" ? colors.statusWarnTint : colors.statusOkTint;
  const toneLabel = tone === "critical" ? "Crítico" : tone === "warn" ? "Advertencia" : "Normal";

  const min = items.length ? Math.min(...items) : 0;
  const max = items.length ? Math.max(...items) : 0;
  const avg = items.length ? items.reduce((s, v) => s + v, 0) / items.length : 0;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

  return (
    <View style={styles.card} onLayout={onLayout}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: toneTint }]}>
            <Icon name={m.icon} size={16} color={toneColor} />
          </View>
          <View>
            <Text style={styles.label}>{m.label}</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {fmt(current)}<Text style={styles.unit}> {m.unit}</Text>
            </Text>
          </View>
        </View>
        <View style={[styles.toneChip, { backgroundColor: toneTint }]}>
          <Text style={[styles.toneChipText, { color: toneColor }]}>{toneLabel}</Text>
        </View>
      </View>

      <Text style={styles.statusMsg}>{statusMsg(tone, m.label)}</Text>

      <View style={styles.chartWrap}>
        <ZoneChart points={points} varKey={varKey} colors={colors} />
      </View>

      <View style={styles.legendRow}>
        <LegendDot color={colors.statusOk} label="Seguro" />
        <LegendDot color={colors.statusWarn} label="Advertencia" />
        <LegendDot color={colors.statusCritical} label="Crítico" />
      </View>

      <View style={styles.statsRow}>
        <Stat label="Mín" value={`${fmt(min)} ${m.unit}`} />
        <Stat label="Máx" value={`${fmt(max)} ${m.unit}`} />
        <Stat label="Prom" value={`${fmt(avg)} ${m.unit}`} />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 11, color: colors.textSecondary }}>{label}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ fontSize: 10, color: colors.textSecondary, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</Text>
      <Text style={{ fontSize: 14, color: colors.textPrimary, fontWeight: "700", marginTop: 2 }}>{value}</Text>
    </View>
  );
}

export default function HistorialScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, variable } = useLocalSearchParams<{ id: string; variable?: VarKey }>();
  const [range, setRange] = useState<Range>("48h");
  const [items, setItems] = useState<LecturaResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const panelY = useRef<Record<VarKey, number>>({ temp: 0, hum: 0, co2: 0 });
  const didScrollToVariable = useRef(false);

  const silo = silos.find((s) => s.id === Number(id));
  const siloName = silo?.name ?? `Silo ${id}`;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setPage(1);
    siloApi
      .getLecturas(Number(id), range, 1, PAGE_SIZE)
      .then((res) => {
        setItems(res.items);
        setTotalPages(res.totalPages);
        setTotalCount(res.totalCount);
      })
      .catch(() => {
        setItems([]);
        setTotalPages(1);
        setTotalCount(0);
      })
      .finally(() => setLoading(false));
  }, [id, range]);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await siloApi.getLecturas(Number(id), range, nextPage, PAGE_SIZE);
      setItems((prev) => [...prev, ...res.items]);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  const data = useMemo(() => bucketize(items, range), [items, range]);
  const tempPoints = data.map((d) => d.temp);
  const humPoints = data.map((d) => d.hum);
  const co2Points = data.map((d) => d.co2);
  const tempItems = items.map((r) => r.temp);
  const humItems = items.map((r) => r.hum);
  const co2Items = items.map((r) => r.co2);

  const handlePanelLayout = (key: VarKey) => (e: LayoutChangeEvent) => {
    panelY.current[key] = e.nativeEvent.layout.y;
    if (!didScrollToVariable.current && variable === key) {
      didScrollToVariable.current = true;
      setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, panelY.current[key] - 12), animated: true }), 200);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Historial — {siloName}</Text>
      </View>

      <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoBanner, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
          <Icon name="info" size={15} color={colors.textSecondary} />
          <Text style={[styles.infoBannerText, { color: colors.textSecondary }]}>
            Las zonas verde, ámbar y roja marcan el rango seguro, de advertencia y crítico para cada variable.
          </Text>
        </View>

        {/* Range selector */}
        <View style={styles.rangeRow}>
          {RANGES.map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRange(r)}
              style={[styles.rangeTab, { backgroundColor: range === r ? colors.actionPrimary : colors.surfaceCard, borderColor: range === r ? colors.actionPrimary : colors.borderDefault }]}
            >
              <Text style={[styles.rangeText, { color: range === r ? colors.actionPrimaryText : colors.textSecondary }]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", paddingVertical: 40 }}>Cargando…</Text>
        ) : data.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", paddingVertical: 40 }}>
            Todavía no hay datos para este período.
          </Text>
        ) : (
          <View style={{ gap: 16 }}>
            <VariablePanel varKey="temp" points={tempPoints} items={tempItems} onLayout={handlePanelLayout("temp")} />
            <VariablePanel varKey="hum" points={humPoints} items={humItems} onLayout={handlePanelLayout("hum")} />
            <VariablePanel varKey="co2" points={co2Points} items={co2Items} onLayout={handlePanelLayout("co2")} />
          </View>
        )}

        {/* Paginado real contra /api/silos/{id}/lecturas */}
        {totalCount > 0 && (
          <View style={styles.pagingBox}>
            <Text style={[styles.pagingText, { color: colors.textSecondary }]}>
              Mostrando {items.length} de {totalCount} lecturas (página {page} de {totalPages})
            </Text>
            {page < totalPages && (
              <TouchableOpacity
                onPress={loadMore}
                disabled={loadingMore}
                style={[styles.loadMoreBtn, { borderColor: colors.borderDefault, opacity: loadingMore ? 0.6 : 1 }]}
              >
                <Text style={[styles.loadMoreText, { color: colors.actionPrimary }]}>
                  {loadingMore ? "Cargando…" : "Cargar más lecturas"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8,
      borderBottomWidth: 1, borderBottomColor: c.borderDefault,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: c.textPrimary },

    scroll: { padding: 16, paddingBottom: 40 },

    infoBanner: {
      flexDirection: "row", alignItems: "flex-start", gap: 10,
      padding: 12, borderRadius: Radius.md, borderWidth: 1, marginBottom: 16,
    },
    infoBannerText: { flex: 1, fontSize: 12, lineHeight: 18 },

    rangeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
    rangeTab: {
      paddingHorizontal: 20, paddingVertical: 9,
      borderRadius: Radius.full, borderWidth: 1,
    },
    rangeText: { fontSize: 13, fontWeight: "600" },

    pagingBox: { alignItems: "center", gap: 10, paddingTop: 20 },
    pagingText: { fontSize: 12 },
    loadMoreBtn: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
    loadMoreText: { fontSize: 13, fontWeight: "600" },
  });

const panelStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surfaceCard, borderWidth: 1, borderColor: c.borderDefault,
      borderRadius: Radius.lg, padding: 14, gap: 12,
    },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    iconWrap: { width: 32, height: 32, borderRadius: Radius.md, alignItems: "center", justifyContent: "center" },
    label: { fontSize: 12, color: c.textSecondary, fontWeight: "600" },
    value: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
    unit: { fontSize: 12, fontWeight: "600", color: c.textSecondary },
    toneChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
    toneChipText: { fontSize: 11, fontWeight: "700" },
    statusMsg: { fontSize: 12, color: c.textSecondary, lineHeight: 18 },
    chartWrap: { alignItems: "center" },
    legendRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
    statsRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: c.borderDefault, paddingTop: 10 },
  });
