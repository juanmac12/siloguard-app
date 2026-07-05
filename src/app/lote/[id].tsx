import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Pressable, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Spacing, ThemeColors, Radius } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { Icon, Button, StatusBadge, ScoreRing } from "../../components";

const MONO = Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" });

function CertRow({ icon, label, value, colors, last }: {
  icon: Parameters<typeof Icon>[0]["name"]; label: string; value: string | number; colors: ThemeColors; last?: boolean;
}) {
  return (
    <View style={[styles.certRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault }]}>
      <View style={styles.certRowLabel}>
        <Icon name={icon} size={14} color={colors.textMuted} />
        <Text style={{ color: colors.textSecondary, fontSize: 12.5 }}>{label}</Text>
      </View>
      <Text style={{ color: colors.textPrimary, fontSize: 13.5, fontWeight: "600", flexShrink: 1, textAlign: "right" }} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function Corner({ pos, colors }: { pos: "tl" | "tr" | "bl" | "br"; colors: ThemeColors }) {
  const size = 16;
  const base = { position: "absolute" as const, width: size, height: size, borderColor: colors.actionPrimary, opacity: 0.55 };
  const styleByPos = {
    tl: { ...base, top: 6, left: 6, borderTopWidth: 1.5, borderLeftWidth: 1.5 },
    tr: { ...base, top: 6, right: 6, borderTopWidth: 1.5, borderRightWidth: 1.5 },
    bl: { ...base, bottom: 6, left: 6, borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
    br: { ...base, bottom: 6, right: 6, borderBottomWidth: 1.5, borderRightWidth: 1.5 },
  } as const;
  return <View style={styleByPos[pos]} />;
}

function FakeQR({ seed, size = 120 }: { seed: string; size?: number }) {
  const N = 15;
  const cell = size / N;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const rnd = (i: number) => {
    const x = Math.sin((h + i) * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const isFinder = (x: number, y: number) => (x < 4 && y < 4) || (x >= N - 4 && y < 4) || (x < 4 && y >= N - 4);
  const cells: React.ReactNode[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (isFinder(x, y)) continue;
      if (rnd(y * N + x) > 0.55) {
        cells.push(<View key={`${x}-${y}`} style={{ position: "absolute", left: x * cell, top: y * cell, width: cell, height: cell, backgroundColor: "#0A0A0A" }} />);
      }
    }
  }
  const Finder = ({ cx, cy }: { cx: number; cy: number }) => (
    <View style={{ position: "absolute", left: cx * cell, top: cy * cell, width: cell * 4, height: cell * 4, backgroundColor: "#0A0A0A", borderWidth: cell * 0.8, borderColor: "#fff" }} />
  );
  return (
    <View style={{ width: size, height: size, backgroundColor: "#fff", borderRadius: 8, padding: size * 0.06 }}>
      <View style={{ width: "100%", height: "100%" }}>
        {cells}
        <Finder cx={0} cy={0} />
        <Finder cx={N - 4} cy={0} />
        <Finder cx={0} cy={N - 4} />
      </View>
    </View>
  );
}

function ShareOption({ icon, label, sub, onPress, colors }: {
  icon: Parameters<typeof Icon>[0]["name"]; label: string; sub?: string; onPress: () => void; colors: ThemeColors;
}) {
  return (
    <TouchableOpacity
      style={[styles.shareOption, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.shareIcon, { backgroundColor: colors.greenTint }]}>
        <Icon name={icon} size={17} color={colors.actionPrimary} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "600" }}>{label}</Text>
        {sub && <Text style={{ color: colors.textSecondary, fontSize: 12 }} numberOfLines={1}>{sub}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export default function LoteDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lotes } = useAppData();
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles2 = useMemo(() => makeStyles(colors), [colors]);
  const [showShare, setShowShare] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const lote = useMemo(() => lotes.find((l) => l.id === Number(id)), [lotes, id]);

  if (!lote) return null;
  const isMon = lote.status === "monitoring";

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShare(false);
    }, 1200);
  };

  return (
    <View style={styles2.container}>
      <View style={styles2.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles2.backBtn}>
          <Icon name="chevron-left" size={22} color={colors.actionPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles2.headerTitle} numberOfLines={1}>Pasaporte de Calidad</Text>
          <Text style={styles2.headerSub} numberOfLines={1}>{lote.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles2.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles2.cert, { backgroundColor: colors.specBg, borderColor: colors.borderDefault }]}>
          <Corner pos="tl" colors={colors} />
          <Corner pos="tr" colors={colors} />
          <Corner pos="bl" colors={colors} />
          <Corner pos="br" colors={colors} />

          <View style={[styles2.certHeader, { borderBottomColor: colors.borderDefault }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="shield" size={18} color={colors.actionPrimary} />
              <Text style={{ color: colors.textPrimary, fontSize: 13, fontWeight: "700" }}>SiloGuard</Text>
            </View>
            <Text style={styles2.certEyebrow}>CERTIFICADO DE CALIDAD</Text>
            <Text style={{ fontFamily: MONO, fontSize: 10, color: colors.textMuted }}>N° {lote.codigo}</Text>
            <StatusBadge tone={isMon ? "ok" : "resolved"} label={isMon ? "En monitoreo" : "Finalizado"} style={{ marginTop: 4 }} />
          </View>

          <View style={styles2.scoreBlock}>
            <Text style={styles2.scoreLabel}>SCORE HISTÓRICO</Text>
            <ScoreRing score={lote.score} size={132} stroke={9} showLabel />
          </View>

          <View>
            <CertRow icon="home" label="Silo de origen" value={lote.siloName} colors={colors} />
            <CertRow icon="clipboard" label="Grano y tonelaje" value={`${lote.grain} · ${lote.tons} t`} colors={colors} />
            <CertRow icon="clock" label="Período monitoreado" value={lote.end ? `${lote.start} – ${lote.end}` : `${lote.start} – en curso`} colors={colors} />
            <CertRow icon="target" label="Días bajo monitoreo" value={`${lote.days} días`} colors={colors} />
            <CertRow icon="check-circle" label="Alertas resueltas" value={lote.alertsResolved} colors={colors} />
            <CertRow icon="wind" label="CO₂ promedio" value={`${lote.avg.co2} ppm`} colors={colors} />
            <CertRow icon="thermometer" label="Temp. promedio" value={`${lote.avg.temp}°C`} colors={colors} />
            <CertRow icon="droplet" label="Humedad promedio" value={`${lote.avg.hum}%`} colors={colors} last />
          </View>

          <View style={[styles2.qrRow, { borderTopColor: colors.borderDefault }]}>
            <TouchableOpacity onPress={() => setShowQR(true)}>
              <FakeQR seed={lote.codigo} size={64} />
            </TouchableOpacity>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={styles2.qrLabel}>HASH DE VERIFICACIÓN</Text>
              <Text style={{ fontFamily: MONO, fontSize: 12, color: colors.textPrimary, marginBottom: 5 }} numberOfLines={1}>{lote.codigo}</Text>
              <TouchableOpacity onPress={() => setShowQR(true)} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Text style={{ color: colors.actionPrimary, fontSize: 12, fontWeight: "600" }}>Ampliar QR</Text>
                <Icon name="chevron-right" size={13} color={colors.actionPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles2.signature, { borderTopColor: colors.borderDefault }]}>
            <Text style={styles2.signatureText}>
              Emitido y verificado digitalmente por SiloGuard.{"\n"}Escaneá el QR para validar su autenticidad.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles2.footer, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg }]}>
        <Button variant="primary" fullWidth onPress={() => setShowShare(true)}>Compartir certificado</Button>
      </View>

      <Modal visible={showShare} transparent animationType="slide" onRequestClose={() => setShowShare(false)}>
        <Pressable style={styles2.backdrop} onPress={() => setShowShare(false)}>
          <Pressable style={[styles2.sheet, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Text style={styles2.sheetTitle}>Compartir certificado</Text>
            <View style={{ gap: 8 }}>
              <ShareOption icon="file-text" label="Descargar como PDF" sub="Documento listo para imprimir" onPress={() => setShowShare(false)} colors={colors} />
              <ShareOption icon="camera" label="Compartir como imagen" sub="Ideal para WhatsApp o email" onPress={() => setShowShare(false)} colors={colors} />
              <ShareOption icon="link" label={copied ? "¡Link copiado!" : "Copiar link de verificación"} sub={`siloguard.com/verify/${lote.codigo}`} onPress={copyLink} colors={colors} />
              <ShareOption icon="scan-qr" label="Ver QR grande" sub="Para mostrar o escanear en persona" onPress={() => { setShowShare(false); setShowQR(true); }} colors={colors} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={showQR} transparent animationType="fade" onRequestClose={() => setShowQR(false)}>
        <Pressable style={styles2.backdrop} onPress={() => setShowQR(false)}>
          <Pressable style={[styles2.qrModal, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Text style={styles2.sheetTitle}>Verificación del lote</Text>
            <View style={{ alignItems: "center", gap: 14, paddingVertical: 8 }}>
              <FakeQR seed={lote.codigo} size={220} />
              <Text style={{ fontFamily: MONO, fontSize: 13, color: colors.textPrimary, fontWeight: "600" }}>{lote.codigo}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 19 }}>
                Escaneá este código para verificar la autenticidad del certificado en siloguard.com/verify
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  certRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingVertical: 11 },
  certRowLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  shareOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: Radius.md, borderWidth: 1 },
  shareIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: "center", justifyContent: "center" },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingTop: 56, paddingBottom: 10, paddingHorizontal: 16,
      backgroundColor: c.bg, borderBottomWidth: 1, borderBottomColor: c.borderDefault,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 16, fontWeight: "700", color: c.textPrimary },
    headerSub: { fontSize: 12, color: c.textSecondary, marginTop: 1 },

    scroll: { padding: Spacing.md, paddingBottom: 24 },

    cert: { borderRadius: Radius.lg, borderWidth: 1, padding: 20, paddingTop: 24, position: "relative" },
    certHeader: { alignItems: "center", gap: 8, paddingBottom: 16, borderBottomWidth: 1 },
    certEyebrow: { fontSize: 10.5, fontWeight: "700", letterSpacing: 3, color: c.textSecondary },

    scoreBlock: { alignItems: "center", paddingVertical: 20, gap: 8 },
    scoreLabel: { fontSize: 10, fontWeight: "600", letterSpacing: 2, color: c.textMuted },

    qrRow: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
    qrLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5, color: c.textMuted, marginBottom: 3 },

    signature: { marginTop: 18, paddingTop: 14, borderTopWidth: 1, alignItems: "center" },
    signatureText: { fontSize: 10.5, color: c.textMuted, lineHeight: 15, textAlign: "center" },

    footer: { padding: Spacing.md, borderTopWidth: 1 },

    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
    sheet: { borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, borderWidth: 1, borderBottomWidth: 0, padding: 20, paddingBottom: 32 },
    sheetTitle: { color: c.textPrimary, fontSize: 16, fontWeight: "700", marginBottom: 14 },
    qrModal: { margin: 24, borderRadius: Radius.lg, borderWidth: 1, padding: 20, alignSelf: "center" },
  });
