import { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemeColors, Radius, Spacing } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { siloApi } from "../../services/siloApi";
import { LecturaResponse } from "../../services/types";
import { Icon } from "../../components";

const RANGES = ["24h", "48h", "7d"] as const;
type Range = typeof RANGES[number];

const CHART_H = 140;
const BAR_W   = 7;

// Tamaño de página real contra la API — el usuario pagina de a 24 lecturas con
// "Cargar más lecturas", en vez de traer todo el rango de una sola vez.
const PAGE_SIZE = 24;
const WEEKDAY = ["D", "L", "M", "M", "J", "V", "S"];

interface ChartPoint {
  hora: string;
  co2: number;
  temp: number;
  hum: number;
}

// Las lecturas vienen del backend ordenadas de más reciente a más vieja y con cadencia
// horaria; acá se agrupan en 7 baldes (promediando) para que el bar chart no se sature.
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

function norm(val: number, min: number, max: number): number {
  return Math.max(6, Math.min(CHART_H, ((val - min) / (max - min)) * CHART_H));
}

const CO2_COLOR  = "#22C55E";
const TEMP_COLOR = "#F59E0B";
const HUM_COLOR  = "#3B82F6";

function BarChart({ data, colors }: { data: ChartPoint[]; colors: ThemeColors }) {
  return (
    <View>
      <Text style={{ fontSize: 10, color: colors.textSecondary, marginBottom: 6 }}>CO₂ (ppm)</Text>

      <View style={{ flexDirection: "row", alignItems: "flex-end", height: CHART_H, gap: 6 }}>
        {data.map((d, i) => {
          const hCo2  = norm(d.co2,  150, 1000);
          const hTemp = norm(d.temp,  15,  45);
          const hHum  = norm(d.hum,   10,  25);
          return (
            <View key={i} style={{ flex: 1, alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2, height: CHART_H }}>
                <View style={{ width: BAR_W, height: hCo2,  backgroundColor: CO2_COLOR,  borderRadius: 3 }} />
                <View style={{ width: BAR_W, height: hTemp, backgroundColor: TEMP_COLOR, borderRadius: 3 }} />
                <View style={{ width: BAR_W, height: hHum,  backgroundColor: HUM_COLOR,  borderRadius: 3 }} />
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
        {data.map((d, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 9, color: colors.textSecondary }}>
              {d.hora}{d.hora.length <= 2 && !WEEKDAY.includes(d.hora) ? "h" : ""}
            </Text>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 10 }}>
        {[
          { color: CO2_COLOR,  label: "CO₂ (ppm)" },
          { color: TEMP_COLOR, label: "Temp (°C)" },
          { color: HUM_COLOR,  label: "Humedad (%)" },
        ].map((l) => (
          <View key={l.label} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <View style={{ width: 10, height: 4, borderRadius: 2, backgroundColor: l.color }} />
            <Text style={{ fontSize: 11, color: colors.textSecondary }}>{l.label}</Text>
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const [range, setRange] = useState<Range>("24h");
  const [items, setItems] = useState<LecturaResponse[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const silo = silos.find((s) => s.id === Number(id));
  const siloName = silo?.name ?? `Silo ${id}`;

  // Cambiar de rango reinicia la paginación: se vuelve a pedir la página 1.
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

  const avgCo2  = items.length ? Math.round(items.reduce((s, d) => s + d.co2, 0) / items.length) : 0;
  const maxTemp = items.length ? Math.max(...items.map((d) => d.temp)) : 0;
  const avgHum  = items.length ? (items.reduce((s, d) => s + d.hum, 0) / items.length).toFixed(1) : "0.0";

  const STATS = [
    { label: "CO₂ prom.", value: String(avgCo2), unit: "ppm",     trendColor: CO2_COLOR },
    { label: "Temp máx.", value: `${maxTemp}°`,  unit: "celsius", trendColor: colors.textSecondary },
    { label: "Hum prom.", value: avgHum,         unit: "%",       trendColor: TEMP_COLOR },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Historial — {siloName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

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

        {/* Bar chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
          {loading ? (
            <Text style={{ color: colors.textSecondary, textAlign: "center", paddingVertical: 40 }}>Cargando…</Text>
          ) : data.length === 0 ? (
            <Text style={{ color: colors.textSecondary, textAlign: "center", paddingVertical: 40 }}>
              Todavía no hay datos para este período.
            </Text>
          ) : (
            <BarChart data={data} colors={colors} />
          )}
        </View>

        {/* Summary stats */}
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Resumen últimas {range}</Text>
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{s.value}</Text>
              <Text style={[styles.statUnit, { color: colors.textSecondary }]}>{s.unit}</Text>
            </View>
          ))}
        </View>

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

    rangeRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
    rangeTab: {
      paddingHorizontal: 20, paddingVertical: 9,
      borderRadius: Radius.full, borderWidth: 1,
    },
    rangeText: { fontSize: 13, fontWeight: "600" },

    chartCard: {
      borderRadius: Radius.lg, borderWidth: 1,
      padding: 14, marginBottom: 20,
    },

    sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
    statsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
    statCard: {
      flex: 1, borderRadius: Radius.lg, borderWidth: 1, padding: 10,
    },
    statLabel: { fontSize: 10, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
    statUnit: { fontSize: 10, marginBottom: 4 },

    pagingBox: { alignItems: "center", gap: 10, paddingTop: 4 },
    pagingText: { fontSize: 12 },
    loadMoreBtn: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 20, paddingVertical: 10 },
    loadMoreText: { fontSize: 13, fontWeight: "600" },
  });
