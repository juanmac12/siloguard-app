import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { useToast } from "../../components/Toast";
import { Icon, Button, Certificate, FakeQR, Modal, BottomSheet } from "../../components";
import type { IconName } from "../../components";

function ShareOption({ icon, label, sub, onPress, colors }: {
  icon: IconName; label: string; sub?: string; onPress: () => void; colors: ThemeColors;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.shareOption, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }, pressed ? { opacity: 0.85 } : null]}
    >
      <View style={[styles.shareIcon, { backgroundColor: colors.greenTint }]}>
        <Icon name={icon} size={17} color={colors.actionPrimary} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.shareLabel, { color: colors.textPrimary }]}>{label}</Text>
        {sub ? <Text style={[styles.shareSub, { color: colors.textSecondary }]} numberOfLines={1}>{sub}</Text> : null}
      </View>
    </Pressable>
  );
}

export default function LoteDetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { lotes, silos } = useAppData();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const styles2 = useMemo(() => makeStyles(colors), [colors]);
  const [showShare, setShowShare] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const lote = lotes.find((l) => l.id === Number(id));
  const silo = lote ? silos.find((s) => s.id === lote.siloId) : undefined;

  if (!lote) return null;

  const copyLink = () => {
    toast.addToast({ tone: "ok", title: "Link copiado", message: `siloguard.com/verify/${lote.codigo}` });
    setShowShare(false);
  };

  const openPdf = () => {
    toast.addToast({ tone: "info", title: "Generando PDF…", message: "El documento se descargará en breve." });
    setShowShare(false);
  };

  const openImage = () => {
    toast.addToast({ tone: "info", title: "Preparando imagen…", message: "Ideal para WhatsApp o email." });
    setShowShare(false);
  };

  return (
    <View style={styles2.container}>
      <View style={styles2.header}>
        <Pressable onPress={() => router.back()} style={styles2.backBtn}>
          <Icon name="chevron-left" size={22} color={colors.actionPrimary} />
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles2.headerTitle} numberOfLines={1}>Pasaporte de calidad</Text>
          <Text style={styles2.headerSub} numberOfLines={1}>{lote.name}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles2.scroll} showsVerticalScrollIndicator={false}>
        <Certificate lote={lote} silo={silo} onQRTap={() => setShowQR(true)} />
      </ScrollView>

      <View style={[styles2.footer, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg, paddingBottom: Spacing.md + insets.bottom }]}>
        <Button variant="primary" fullWidth onPress={() => setShowShare(true)}>Compartir certificado</Button>
      </View>

      <BottomSheet open={showShare} onClose={() => setShowShare(false)} title="Compartir certificado">
        <ShareOption icon="file-text" label="Descargar como PDF" sub="Documento listo para imprimir" onPress={openPdf} colors={colors} />
        <ShareOption icon="camera" label="Compartir como imagen" sub="Ideal para WhatsApp o email" onPress={openImage} colors={colors} />
        <ShareOption icon="link" label="Copiar link de verificación" sub={`siloguard.com/verify/${lote.codigo}`} onPress={copyLink} colors={colors} />
        <ShareOption icon="scan-qr" label="Ver QR grande" sub="Para mostrar o escanear en persona" onPress={() => { setShowShare(false); setShowQR(true); }} colors={colors} />
      </BottomSheet>

      <Modal open={showQR} onClose={() => setShowQR(false)} title="Verificación del lote" size="sm">
        <View style={{ alignItems: "center", gap: 14 }}>
          <FakeQR seed={lote.codigo} size={220} />
          <Text style={styles2.qrModalCode}>{lote.codigo}</Text>
          <Text style={styles2.qrModalHint}>
            Escaneá este código para verificar la autenticidad del certificado en siloguard.com/verify
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  shareOption: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: Radius.md, borderWidth: 1 },
  shareIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: "center", justifyContent: "center" },
  shareLabel: { fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  shareSub: { fontSize: 12, fontFamily: fontFamilyForWeight(FontWeight.regular) },
});

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
    headerTitle: { fontSize: 16, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: c.textPrimary },
    headerSub: { fontSize: 12, color: c.textSecondary, marginTop: 1, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    scroll: { padding: Spacing.md, paddingBottom: 24 },

    footer: { padding: Spacing.md, borderTopWidth: 1 },

    qrModalCode: { fontFamily: "monospace", fontSize: 13, color: c.textPrimary, fontWeight: FontWeight.semibold },
    qrModalHint: { color: c.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 19, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  });
