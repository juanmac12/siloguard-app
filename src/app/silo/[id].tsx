import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { useDeviceState } from "../../hooks/useDeviceState";
import { useToast } from "../../components/Toast";
import {
  Icon,
  AlertCard,
  StatusBadge,
  SensorStat,
  Tabs,
  EmptyState,
  Sparkline,
  LoteStatusCard,
  DeviceOfflineBanner,
  BottomSheet,
  Button,
} from "../../components";

const LBL_STYLE = {
  fontSize: 11,
  fontWeight: FontWeight.bold,
  fontFamily: fontFamilyForWeight(FontWeight.bold),
  letterSpacing: 0.6,
  textTransform: "uppercase" as const,
  marginBottom: 8,
};

const FORECAST = [
  { label: "Hoy", temp: "32°C", icon: "☀️", risk: "Bajo", riskColor: "ok" as const },
  { label: "Mañana", temp: "28°C", icon: "⛅", risk: "Medio", riskColor: "warn" as const },
  { label: "Pasado", temp: "22°C", icon: "🌧️", risk: "Bajo", riskColor: "ok" as const },
];

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
function todayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function toneFor(value: number, warn: number, crit: number): "ok" | "warn" | "critical" {
  return value >= crit ? "critical" : value >= warn ? "warn" : "ok";
}

export default function SiloScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { silos, alerts, lotes, iniciarLote, finalizarLote, thresholdsFor } = useAppData();
  const toast = useToast();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<"info" | "alertas">("info");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loteLoading, setLoteLoading] = useState(false);
  const [iniciarSheetOpen, setIniciarSheetOpen] = useState(false);
  const [loteName, setLoteName] = useState("");

  const silo = silos.find((s) => s.id === Number(id));
  const device = useDeviceState(silo?.lastSignalAt);
  const deviceOffline = device.state !== "ok";

  if (!silo) return null;

  const activeLote = lotes.find((l) => l.siloId === silo.id && l.status === "monitoring");
  const siloAlerts = alerts.filter((a) => a.siloId === silo.id);
  const th = thresholdsFor(silo.id);

  const tempTone = toneFor(silo.temp, th.temp.warn, th.temp.crit);
  const humTone = toneFor(silo.hum, th.hum.warn, th.hum.crit);
  const co2Tone = toneFor(silo.co2, th.co2.warn, th.co2.crit);
  const badgeTone = silo.status === "critical" ? "critical" : silo.status === "warn" ? "warn" : "ok";
  const tc = silo.status === "critical" ? colors.statusCritical : silo.status === "warn" ? colors.statusWarn : colors.actionPrimary;

  const goHistorial = (variable: "temp" | "hum" | "co2") => router.push(`/historial/${silo.id}?variable=${variable}` as any);

  const openIniciarSheet = () => {
    setMenuOpen(false);
    setLoteName(`Lote ${silo.grain} ${silo.name.replace(/^Silo\s*/i, "")}`.trim());
    setIniciarSheetOpen(true);
  };

  const onConfirmIniciarLote = async () => {
    setLoteLoading(true);
    try {
      await iniciarLote(silo.id, loteName);
      setIniciarSheetOpen(false);
      toast.addToast({ tone: "ok", title: "Lote iniciado", message: "El silo está en monitoreo." });
    } finally {
      setLoteLoading(false);
    }
  };

  const onFinalizarLote = async () => {
    if (!activeLote) return;
    setMenuOpen(false);
    setLoteLoading(true);
    try {
      await finalizarLote(activeLote.id);
      toast.addToast({ tone: "ok", title: "Lote finalizado", message: "Pasaporte de calidad generado." });
    } finally {
      setLoteLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>{silo.name}</Text>
          <Text style={styles.headerSub}>{silo.grain} · {silo.tons} t</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, position: "relative" }}>
          <StatusBadge tone={badgeTone} label={silo.status === "ok" ? "OK" : silo.status === "warn" ? "Advertencia" : "Crítico"} />
          <Pressable onPress={() => setMenuOpen((o) => !o)} style={styles.iconBtn}>
            <Icon name="more-vertical" size={20} color={colors.textPrimary} />
          </Pressable>
          {menuOpen && (
            <>
              <Pressable style={styles.menuScrim} onPress={() => setMenuOpen(false)} />
              <View style={[styles.menu, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
                <Pressable onPress={() => { setMenuOpen(false); router.push(`/editar-silo/${silo.id}` as any); }} style={[styles.menuItem, { borderBottomColor: colors.borderDefault }]}>
                  <Icon name="edit" size={16} color={colors.textSecondary} />
                  <Text style={[styles.menuText, { color: colors.textPrimary }]}>Editar silo</Text>
                </Pressable>
                <Pressable onPress={() => { setMenuOpen(false); router.push(`/umbrales/${silo.id}` as any); }} style={[styles.menuItem, { borderBottomColor: colors.borderDefault }]}>
                  <Icon name="target" size={16} color={colors.textSecondary} />
                  <Text style={[styles.menuText, { color: colors.textPrimary }]}>Configurar umbrales</Text>
                </Pressable>
                {activeLote ? (
                  <Pressable onPress={onFinalizarLote} style={[styles.menuItem, { borderBottomColor: colors.borderDefault }]}>
                    <Icon name="check-circle" size={16} color={colors.actionPrimary} />
                    <Text style={[styles.menuText, { color: colors.textPrimary }]}>Finalizar lote</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={openIniciarSheet} style={[styles.menuItem, { borderBottomColor: colors.borderDefault }]}>
                    <Icon name="plus-circle" size={16} color={colors.textSecondary} />
                    <Text style={[styles.menuText, { color: colors.textPrimary }]}>Iniciar lote</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => { setMenuOpen(false); router.push(`/editar-silo/${silo.id}?del=1` as any); }} style={styles.menuItem}>
                  <Icon name="trash" size={16} color={colors.statusCritical} />
                  <Text style={[styles.menuText, { color: colors.statusCritical }]}>Eliminar silo</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>

      {deviceOffline && (
        <View style={{ paddingTop: 12 }}>
          <DeviceOfflineBanner
            minutesOffline={device.minutesSinceSignal}
            onContactSupport={() => router.push("/contacto-tecnico" as any)}
          />
        </View>
      )}

      <View style={{ paddingTop: deviceOffline ? 4 : 12 }}>
        <LoteStatusCard
          lote={activeLote}
          disabled={loteLoading}
          onIniciar={openIniciarSheet}
          onVerPasaporte={() => activeLote && router.push(`/lote/${activeLote.id}` as any)}
        />
      </View>

      {/* Sensor grid */}
      <View style={styles.sensorRow}>
        <Pressable style={{ flex: 1, height: 92 }} onPress={() => goHistorial("temp")}>
          <SensorStat kind="temp" value={silo.temp} tone={tempTone} />
        </Pressable>
        <Pressable style={{ flex: 1, height: 92 }} onPress={() => goHistorial("hum")}>
          <SensorStat kind="humidity" value={silo.hum} tone={humTone} />
        </Pressable>
        <Pressable style={{ flex: 1, height: 92 }} onPress={() => goHistorial("co2")}>
          <SensorStat kind="co2" value={silo.co2} tone={co2Tone} />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={{ paddingHorizontal: Spacing.md, marginTop: Spacing.sm }}>
        <Tabs
          variant="underline"
          activeId={tab}
          onChange={(t) => setTab(t as "info" | "alertas")}
          items={[
            { id: "info", label: "Información" },
            { id: "alertas", label: siloAlerts.length ? `Alertas (${siloAlerts.length})` : "Alertas" },
          ]}
        />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]} showsVerticalScrollIndicator={false}>
        {tab === "info" ? (
          <>
            <Text style={[LBL_STYLE, { color: colors.textSecondary }]}>Información del grano</Text>
            <View style={[styles.infoCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              {([["Tipo de grano", silo.grain], ["Tonelaje", `${silo.tons} t`], ["Fecha de acopio", silo.acopio]] as [string, string][]).map(([k, v], i, arr) => (
                <View key={k} style={[styles.infoRow, i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault }]}>
                  <Text style={[styles.infoKey, { color: colors.textSecondary }]}>{k}</Text>
                  <Text style={[styles.infoVal, { color: colors.textPrimary }]}>{v}</Text>
                </View>
              ))}
            </View>

            <Text style={[LBL_STYLE, { color: colors.textSecondary, marginTop: 16 }]}>Pronóstico — próximos 3 días</Text>
            <View style={[styles.forecastCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              {FORECAST.map((f) => (
                <View key={f.label} style={styles.forecastCol}>
                  <Text style={[styles.forecastLabel, { color: colors.textMuted }]}>{f.label}</Text>
                  <Text style={styles.forecastIcon}>{f.icon}</Text>
                  <Text style={[styles.forecastTemp, { color: colors.textPrimary }]}>{f.temp}</Text>
                  <Text style={[styles.forecastRisk, { color: f.riskColor === "warn" ? colors.statusWarn : colors.statusOk }]}>Riesgo {f.risk}</Text>
                </View>
              ))}
            </View>

            <Text style={[LBL_STYLE, { color: colors.textSecondary, marginTop: 16 }]}>Temperatura — últimos 7 días</Text>
            <View style={[styles.chartCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <Text style={[styles.chartValue, { color: colors.textPrimary }]}>{silo.temp} °C</Text>
                <Text style={{ fontSize: 12, color: tc, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) }}>
                  {silo.status === "critical" ? "↑ Crítico" : silo.status === "warn" ? "↑ Elevado" : "→ Estable"}
                </Text>
              </View>
              <Sparkline data={silo.trend} color={tc} width={280} height={60} fill />
              <Pressable onPress={() => goHistorial("temp")} style={[styles.histLink, { borderTopColor: colors.borderDefault }]}>
                <Text style={[styles.histLinkText, { color: colors.actionPrimary }]}>Ver historial completo</Text>
                <Icon name="chevron-right" size={14} color={colors.actionPrimary} />
              </Pressable>
            </View>
          </>
        ) : siloAlerts.length === 0 ? (
          <EmptyState variant="no-alerts" size="sm" title="Sin alertas" body="Este silo no tiene alertas registradas." />
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
                estimate={a.estimate}
                action={a.action}
                onPress={() => router.push(`/alerta/${a.id}` as any)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <BottomSheet
        open={iniciarSheetOpen}
        onClose={() => setIniciarSheetOpen(false)}
        title="Iniciar nuevo lote"
        actions={[
          <Button key="ok" variant="primary" fullWidth onPress={onConfirmIniciarLote} disabled={!loteName.trim()} loading={loteLoading}>
            Iniciar monitoreo
          </Button>,
        ]}
      >
        <Text style={[styles.sheetSub, { color: colors.textSecondary }]}>
          Se inicia el seguimiento de calidad de <Text style={{ fontWeight: FontWeight.semibold }}>{silo.name}</Text> con los datos
          actuales del silo. Al finalizar, se emitirá el certificado.
        </Text>
        <View>
          <Text style={[LBL_STYLE, { color: colors.textSecondary, marginBottom: 6 }]}>Nombre del lote</Text>
          <TextInput
            value={loteName}
            onChangeText={setLoteName}
            placeholder="Ej: Lote Soja Norte"
            placeholderTextColor={colors.textMuted}
            style={[styles.sheetInput, { backgroundColor: colors.surfaceInput, borderColor: colors.actionPrimary, color: colors.textPrimary }]}
          />
        </View>
        <View style={[styles.sheetInfoCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
          <View style={[styles.sheetInfoRow, { borderBottomColor: colors.borderDefault }]}>
            <Icon name="clipboard" size={15} color={colors.textSecondary} />
            <Text style={[styles.sheetInfoLabel, { color: colors.textSecondary }]}>Grano y tonelaje</Text>
            <Text style={[styles.sheetInfoValue, { color: colors.textPrimary }]}>{silo.grain} · {silo.tons} t</Text>
          </View>
          <View style={styles.sheetInfoRow}>
            <Icon name="clock" size={15} color={colors.textSecondary} />
            <Text style={[styles.sheetInfoLabel, { color: colors.textSecondary }]}>Inicio de monitoreo</Text>
            <Text style={[styles.sheetInfoValue, { color: colors.textPrimary }]}>{todayStr()}</Text>
          </View>
        </View>
      </BottomSheet>
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
      paddingHorizontal: 16,
      backgroundColor: c.bg,
      borderBottomWidth: 1,
      borderBottomColor: c.borderDefault,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), color: c.textPrimary },
    headerSub: { fontSize: 12, color: c.textSecondary, marginTop: 1, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    iconBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
    menuScrim: { position: "absolute", top: -1000, left: -1000, right: -1000, bottom: -1000, zIndex: 90 },
    menu: {
      position: "absolute",
      top: 36,
      right: 0,
      zIndex: 100,
      borderRadius: Radius.lg,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 12,
      minWidth: 210,
      overflow: "hidden",
    },
    menuItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomWidth: 1 },
    menuText: { fontSize: 14, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    sensorRow: { flexDirection: "row", gap: 8, paddingHorizontal: Spacing.md, paddingTop: 12, paddingBottom: 12 },

    scroll: { padding: 16, paddingBottom: 40 },

    infoCard: { borderRadius: Radius.lg, borderWidth: 1, overflow: "hidden" },
    infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, paddingVertical: 12 },
    infoKey: { fontSize: 14, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    infoVal: { fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },

    forecastCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 14, flexDirection: "row", justifyContent: "space-around" },
    forecastCol: { alignItems: "center", gap: 4 },
    forecastLabel: { fontSize: 11, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    forecastIcon: { fontSize: 22 },
    forecastTemp: { fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
    forecastRisk: { fontSize: 10, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), marginTop: 4 },

    chartCard: { borderRadius: Radius.lg, borderWidth: 1, padding: 14 },
    chartValue: { fontSize: 24, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.5 },

    histLink: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderTopWidth: 1, paddingVertical: 12, marginTop: 12 },
    histLinkText: { fontSize: 13, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },

    sheetSub: { fontSize: 14, lineHeight: 20, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    sheetInput: { borderWidth: 1, borderRadius: Radius.md, padding: 12, fontSize: 15, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    sheetInfoCard: { borderRadius: Radius.lg, borderWidth: 1, paddingHorizontal: 12 },
    sheetInfoRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, borderBottomWidth: 1 },
    sheetInfoLabel: { flex: 1, fontSize: 13, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    sheetInfoValue: { fontSize: 13, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  });
