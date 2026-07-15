import { useEffect, useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Pressable, Modal,
} from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spacing, ThemeColors, Radius, FontSize } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { siloApi } from "../../services/siloApi";
import { Icon, AlertCard, StatusBadge, Button, DeviceOfflineBanner } from "../../components";

// TODO: reemplazar por heartbeat real del dispositivo cuando el backend lo exponga.
// Por ahora el banner queda listo en UI pero oculto (siempre false).
const MOCK_DEVICE_OFFLINE = false;
const MOCK_DEVICE_OFFLINE_MINUTES = 0;

/* ── Sparkline con react-native-svg ── */
function Sparkline({ data, color = "#22C55E", height = 60 }: { data: number[]; color?: string; height?: number }) {
  const W = 280; const H = height;
  const mn = Math.min(...data); const mx = Math.max(...data);
  const rng = mx - mn || 1; const pad = H * 0.12;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - pad - ((v - mn) / rng) * (H - pad * 2),
  ]);
  const ln = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  return (
    <View>
      <Svg width="100%" height={height} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="spkGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={`${ln} L${W},${H} L0,${H} Z`} fill="url(#spkGrad)" />
        <Path d={ln} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <Circle key={i} cx={p[0]} cy={p[1]}
            r={i === data.length - 1 ? 4 : 2.5}
            fill={i === data.length - 1 ? color : "transparent"}
            stroke={i === data.length - 1 ? "none" : color} strokeWidth="1.5" />
        ))}
      </Svg>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 4 }}>
        {days.map((d, i) => (
          <Text key={i} style={{ fontSize: 10, color: i === days.length - 1 ? color : "#6B7280", fontWeight: i === days.length - 1 ? "700" : "400" }}>
            {d}
          </Text>
        ))}
      </View>
    </View>
  );
}

/* ── Sensor stat card ── */
function SensorCard({ kind, value, unit, label, tone, onPress, colors }: {
  kind: "temp" | "humidity" | "co2";
  value: number; unit: string; label: string;
  tone: "ok" | "warn" | "critical";
  onPress?: () => void;
  colors: ThemeColors;
}) {
  const icons = { temp: "thermometer", humidity: "droplet", co2: "wind" } as const;
  const toneColor = tone === "critical" ? colors.statusCritical : tone === "warn" ? colors.statusWarn : colors.statusOk;
  const toneTint  = tone === "critical" ? colors.statusCriticalTint : tone === "warn" ? colors.statusWarnTint : colors.statusOkTint;
  return (
    <Pressable onPress={onPress} style={[cardStyles.card, { backgroundColor: colors.surfaceCard, borderColor: tone !== "ok" ? toneColor : colors.borderDefault }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <View style={[cardStyles.iconWrap, { backgroundColor: toneTint }]}>
          <Icon name={icons[kind]} size={14} color={toneColor} />
        </View>
        <Text style={[cardStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
        <Text style={[cardStyles.value, { color: colors.textPrimary }]}>{value}</Text>
        <Text style={[cardStyles.unit, { color: colors.textSecondary }]}>{unit}</Text>
      </View>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: { flex: 1, borderRadius: Radius.lg, padding: 12, borderWidth: 1 },
  iconWrap: { width: 22, height: 22, borderRadius: 6, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 10, fontWeight: "600", letterSpacing: 0.3 },
  value: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5, lineHeight: 28 },
  unit: { fontSize: 12, marginBottom: 3 },
});

const LBL_STYLE = { fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.6, textTransform: "uppercase" as const, marginBottom: 8 };

const FORECAST = [
  { label: "Hoy",    temp: "32°C", icon: "☀️",  risk: "Riesgo Bajo",  riskColor: "#22C55E" },
  { label: "Mañana", temp: "28°C", icon: "⛅",  risk: "Riesgo Medio", riskColor: "#F59E0B" },
  { label: "Pasado", temp: "22°C", icon: "🌧️", risk: "Riesgo Bajo",  riskColor: "#22C55E" },
];

export default function SiloScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos, alerts, lotes, iniciarLote, finalizarLote, notify } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<"info" | "alertas">("info");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loteLoading, setLoteLoading] = useState(false);
  const [iniciarSheetOpen, setIniciarSheetOpen] = useState(false);
  const [finalizarConfirmOpen, setFinalizarConfirmOpen] = useState(false);

  const silo = silos.find((s) => s.id === Number(id));

  const [trend, setTrend] = useState<number[]>([]);
  useEffect(() => {
    if (!silo) return;
    siloApi
      .getLecturas(silo.id, "7d", 1, 7)
      .then((res) => setTrend(res.items.map((r) => r.temp).reverse()))
      .catch(() => setTrend([]));
  }, [silo?.id]);

  if (!silo) return null;

  const activeLote = lotes.find((l) => l.siloId === silo.id && l.status === "monitoring");

  const onIniciarLote = async () => {
    setLoteLoading(true);
    try {
      await iniciarLote(silo.id);
      notify("Lote iniciado — el silo está en monitoreo");
      setIniciarSheetOpen(false);
    } catch (e: any) {
      notify(e?.message ?? "No se pudo iniciar el lote");
    } finally {
      setLoteLoading(false);
    }
  };

  const onFinalizarLote = async () => {
    if (!activeLote) return;
    setLoteLoading(true);
    try {
      await finalizarLote(activeLote.id);
      notify("Lote finalizado — pasaporte generado");
      setFinalizarConfirmOpen(false);
    } catch (e: any) {
      notify(e?.message ?? "No se pudo finalizar el lote");
    } finally {
      setLoteLoading(false);
    }
  };

  const siloAlerts = alerts.filter((a) => a.siloId === silo.id);
  const sparklineData = trend.length >= 2 ? trend : [silo.temp, silo.temp];
  const tc = silo.status === "critical" ? colors.statusCritical : silo.status === "warn" ? colors.statusWarn : colors.actionPrimary;

  const tempTone = silo.temp > 35 ? "critical" : silo.temp > 28 ? "warn" : "ok";
  const humTone  = silo.hum  > 20 ? "critical" : silo.hum  > 16 ? "warn" : "ok";
  const co2Tone  = silo.co2  > 800 ? "critical" : silo.co2 > 600 ? "warn" : "ok";
  const badgeTone = silo.status === "critical" ? "critical" : silo.status === "warn" ? "warn" : "ok";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{silo.name}</Text>
          <Text style={styles.headerSub}>{silo.grain} · {silo.tons} t</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, position: "relative" }}>
          <StatusBadge tone={badgeTone} label={silo.status === "ok" ? "OK" : silo.status === "warn" ? "Advertencia" : "Crítico"} />
          <Pressable onPress={() => setMenuOpen(!menuOpen)} style={styles.iconBtn}>
            <Icon name="more-vertical" size={20} color={colors.textPrimary} />
          </Pressable>
          {menuOpen && (
            <View style={[styles.menu, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              <Pressable onPress={() => { setMenuOpen(false); router.push(`/editar-silo/${silo.id}` as any); }} style={styles.menuItem}>
                <Icon name="edit" size={16} color={colors.textSecondary} />
                <Text style={[styles.menuText, { color: colors.textPrimary }]}>Editar silo</Text>
              </Pressable>
              <View style={[styles.menuDivider, { backgroundColor: colors.borderDefault }]} />
              <Pressable onPress={() => { setMenuOpen(false); router.push(`/umbrales/${silo.id}` as any); }} style={styles.menuItem}>
                <Icon name="target" size={16} color={colors.textSecondary} />
                <Text style={[styles.menuText, { color: colors.textPrimary }]}>Configurar umbrales</Text>
              </Pressable>
              <View style={[styles.menuDivider, { backgroundColor: colors.borderDefault }]} />
              <Pressable onPress={() => { setMenuOpen(false); router.push(`/editar-silo/${silo.id}?del=1` as any); }} style={styles.menuItem}>
                <Icon name="trash" size={16} color={colors.statusCritical} />
                <Text style={[styles.menuText, { color: colors.statusCritical }]}>Eliminar silo</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Sensor grid */}
      <View style={styles.sensorRow}>
        <SensorCard kind="temp"     value={silo.temp} unit="°C"  label="Temp."   tone={tempTone} onPress={() => router.push({ pathname: "/historial/[id]", params: { id: String(silo.id), variable: "temp" } } as any)} colors={colors} />
        <SensorCard kind="humidity" value={silo.hum}  unit="%"   label="Humedad" tone={humTone}  onPress={() => router.push({ pathname: "/historial/[id]", params: { id: String(silo.id), variable: "hum" } } as any)} colors={colors} />
        <SensorCard kind="co2"      value={silo.co2}  unit="ppm" label="CO₂"     tone={co2Tone}  onPress={() => router.push({ pathname: "/historial/[id]", params: { id: String(silo.id), variable: "co2" } } as any)} colors={colors} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: colors.borderDefault }]}>
        {(["info", "alertas"] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={styles.tabItem}>
            <Text style={[styles.tabText, { color: tab === t ? colors.actionPrimary : colors.textSecondary }]}>
              {t === "info" ? "Información" : `Alertas${siloAlerts.length ? ` (${siloAlerts.length})` : ""}`}
            </Text>
            {tab === t && <View style={[styles.tabIndicator, { backgroundColor: colors.actionPrimary }]} />}
          </Pressable>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === "info" ? (
          <>
            {MOCK_DEVICE_OFFLINE && (
              <DeviceOfflineBanner offlineMinutes={MOCK_DEVICE_OFFLINE_MINUTES} siloId={silo.id} />
            )}

            {/* Pasaporte de calidad — iniciar / finalizar lote */}
            <Text style={[LBL_STYLE, { color: colors.textSecondary }]}>Pasaporte de calidad</Text>
            <View style={[styles.infoCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault, padding: 14, gap: 12, marginBottom: 16 }]}>
              {activeLote ? (
                <>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "600" }} numberOfLines={1}>Lote en monitoreo</Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 12, marginTop: 2 }} numberOfLines={1}>N° {activeLote.codigo} · {activeLote.days} días</Text>
                    </View>
                    <StatusBadge tone="ok" label="En monitoreo" />
                  </View>
                  <Button variant="secondary" fullWidth onPress={() => setFinalizarConfirmOpen(true)}>Finalizar y generar pasaporte</Button>
                </>
              ) : (
                <>
                  <Text style={{ color: colors.textSecondary, fontSize: 13, lineHeight: 19 }}>
                    Este silo no tiene un lote en monitoreo. Iniciá uno para generar su pasaporte de calidad.
                  </Text>
                  <Button variant="primary" fullWidth onPress={() => setIniciarSheetOpen(true)}>Iniciar lote</Button>
                </>
              )}
            </View>

            {/* Grain info */}
            <Text style={[LBL_STYLE, { color: colors.textSecondary }]}>Información del grano</Text>
            <View style={[styles.infoCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              {([["Tipo de grano", silo.grain], ["Tonelaje", `${silo.tons} t`], ["Fecha de acopio", silo.acopio]] as [string,string][]).map(([k, v], i, arr) => (
                <View key={k} style={[styles.infoRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault }]}>
                  <Text style={[styles.infoKey, { color: colors.textSecondary }]}>{k}</Text>
                  <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{v}</Text>
                </View>
              ))}
            </View>

            {/* Pronóstico */}
            <Text style={[LBL_STYLE, { color: colors.textSecondary, marginTop: 16 }]}>Pronóstico — próximos 3 días</Text>
            <View style={[styles.forecastCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              {FORECAST.map((f) => (
                <View key={f.label} style={styles.forecastCol}>
                  <Text style={[styles.forecastLabel, { color: colors.textSecondary }]}>{f.label}</Text>
                  <Text style={styles.forecastIcon}>{f.icon}</Text>
                  <Text style={[styles.forecastTemp, { color: colors.textPrimary }]}>{f.temp}</Text>
                  <Text style={[styles.forecastRisk, { color: f.riskColor }]}>{f.risk}</Text>
                </View>
              ))}
            </View>

            {/* 7-day chart */}
            <Text style={[LBL_STYLE, { color: colors.textSecondary, marginTop: 16 }]}>Temperatura — últimos 7 días</Text>
            <View style={[styles.chartCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <Text style={[styles.chartValue, { color: colors.textPrimary }]}>{silo.temp} °C</Text>
                <Text style={{ fontSize: 12, color: tc, fontWeight: "500" }}>
                  {silo.status === "critical" ? "↑ Crítico" : silo.status === "warn" ? "↑ Elevado" : "→ Estable"}
                </Text>
              </View>
              <Sparkline data={sparklineData} color={tc} />
              <Pressable onPress={() => router.push(`/historial/${silo.id}` as any)} style={[styles.histLink, { borderTopColor: colors.borderDefault }]}>
                <Text style={[styles.histLinkText, { color: colors.actionPrimary }]}>Ver historial completo</Text>
                <Icon name="chevron-right" size={14} color={colors.actionPrimary} />
              </Pressable>
            </View>
          </>
        ) : (
          siloAlerts.length === 0 ? (
            <View style={styles.emptyAlerts}>
              <Icon name="check-circle" size={36} color={colors.statusOk} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>Sin alertas</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>Este silo no tiene alertas registradas.</Text>
            </View>
          ) : (
            <View style={{ gap: 8 }}>
              {siloAlerts.map((a) => (
                <AlertCard
                  key={a.id}
                  variant={a.variant}
                  title={a.title}
                  silo={a.silo}
                  time={a.time}
                  description={a.desc}
                  onPress={a.status === "active" ? () => router.push(`/alerta/${a.id}` as any) : undefined}
                />
              ))}
            </View>
          )
        )}
      </ScrollView>

      {/* Iniciar lote — bottom sheet de confirmación */}
      <Modal visible={iniciarSheetOpen} transparent animationType="slide" onRequestClose={() => setIniciarSheetOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIniciarSheetOpen(false)} />
        <View style={[styles.sheet, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
          <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>Iniciar lote</Text>
          <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>
            Se va a monitorear este silo hasta que finalices el lote. El nombre y los promedios se calculan automáticamente.
          </Text>
          <View style={[styles.sheetInfoRow, { borderTopColor: colors.borderDefault }]}>
            <Text style={[styles.infoKey, { color: colors.textSecondary }]}>Silo</Text>
            <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{silo.name}</Text>
          </View>
          <View style={[styles.sheetInfoRow, { borderTopColor: colors.borderDefault }]}>
            <Text style={[styles.infoKey, { color: colors.textSecondary }]}>Grano</Text>
            <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{silo.grain}</Text>
          </View>
          <View style={[styles.sheetInfoRow, { borderTopColor: colors.borderDefault }]}>
            <Text style={[styles.infoKey, { color: colors.textSecondary }]}>Tonelaje</Text>
            <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{silo.tons} t</Text>
          </View>
          <Button variant="primary" fullWidth loading={loteLoading} onPress={onIniciarLote} style={{ marginTop: 16 }}>
            Iniciar monitoreo
          </Button>
          <TouchableOpacity onPress={() => setIniciarSheetOpen(false)} style={styles.modalCancelBtn}>
            <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Finalizar lote — confirmación centrada */}
      <Modal visible={finalizarConfirmOpen} transparent animationType="fade" onRequestClose={() => setFinalizarConfirmOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setFinalizarConfirmOpen(false)} />
        <View style={styles.modalCenter}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <View style={[styles.modalIcon, { backgroundColor: colors.statusWarnTint }]}>
              <Icon name="shield" size={24} color={colors.statusWarn} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Finalizar lote</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Se cerrará el seguimiento y se generará el pasaporte con el score histórico. Esta acción no se puede deshacer.
            </Text>
            <TouchableOpacity
              onPress={onFinalizarLote}
              disabled={loteLoading}
              style={[styles.modalBtn, { backgroundColor: colors.actionPrimary, opacity: loteLoading ? 0.6 : 1 }]}
            >
              <Text style={[styles.modalBtnText, { color: colors.actionPrimaryText }]}>
                {loteLoading ? "Finalizando…" : "Sí, finalizar lote"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setFinalizarConfirmOpen(false)} style={styles.modalCancelBtn}>
              <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingTop: 56, paddingBottom: 10, paddingHorizontal: 16,
      backgroundColor: c.bg, borderBottomWidth: 1, borderBottomColor: c.borderDefault,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: "600", color: c.textPrimary },
    headerSub: { fontSize: 12, color: c.textSecondary, marginTop: 1 },
    iconBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
    menu: {
      position: "absolute", top: 36, right: 0, zIndex: 100,
      borderRadius: Radius.lg, borderWidth: 1,
      shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 12,
      minWidth: 200, overflow: "hidden",
    },
    menuItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
    menuText: { fontSize: 14 },
    menuDivider: { height: 1 },

    sensorRow: { flexDirection: "row", gap: 8, padding: 12 },

    tabBar: { flexDirection: "row", borderBottomWidth: 1, paddingHorizontal: 16 },
    tabItem: { marginRight: 24, paddingBottom: 10, paddingTop: 4, position: "relative" },
    tabText: { fontSize: 14, fontWeight: "500" },
    tabIndicator: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, borderRadius: 2 },

    scroll: { padding: 16, paddingBottom: 40 },

    infoCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: "hidden", marginBottom: 4 },
    infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12 },
    infoKey: { fontSize: 14 },
    infoVal: { fontSize: 14, fontWeight: "600" },

    forecastCard: {
      borderRadius: Radius.lg, borderWidth: 1, padding: 14,
      flexDirection: "row", justifyContent: "space-around",
    },
    forecastCol: { alignItems: "center", gap: 4 },
    forecastLabel: { fontSize: 11, fontWeight: "600" },
    forecastIcon: { fontSize: 28 },
    forecastTemp: { fontSize: 16, fontWeight: "700" },
    forecastRisk: { fontSize: 11, fontWeight: "600" },

    chartCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    chartValue: { fontSize: 24, fontWeight: "700", letterSpacing: -0.5 },

    histLink: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
      borderTopWidth: 1, paddingVertical: 12, marginTop: 12,
    },
    histLinkText: { fontSize: 13, fontWeight: "600" },

    emptyAlerts: { alignItems: "center", paddingTop: 48, gap: 10 },
    emptyTitle: { fontSize: 17, fontWeight: "600" },
    emptySub: { fontSize: 13, textAlign: "center" },

    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
    sheet: {
      position: "absolute", left: 0, right: 0, bottom: 0,
      borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl,
      borderWidth: 1, borderBottomWidth: 0,
      padding: 20, paddingBottom: 36,
    },
    sheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 6 },
    sheetSub: { fontSize: 13, lineHeight: 19, marginBottom: 12 },
    sheetInfoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderTopWidth: 1 },

    modalCenter: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
    modalCard: { width: "100%", borderRadius: Radius.xl, borderWidth: 1, padding: 20, alignItems: "center", gap: 8 },
    modalIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 4 },
    modalTitle: { fontSize: 17, fontWeight: "700" },
    modalSub: { fontSize: 13, textAlign: "center", lineHeight: 19, marginBottom: 8 },
    modalBtn: { width: "100%", borderRadius: Radius.md, paddingVertical: 14, alignItems: "center" },
    modalBtnText: { fontSize: 15, fontWeight: "700" },
    modalCancelBtn: { paddingVertical: 12 },
    modalCancelText: { fontSize: 14, fontWeight: "600" },
  });
