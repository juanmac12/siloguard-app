/**
 * Certificate — certificado de calidad del Pasaporte (pantalla Detalle de lote).
 * Marca + folio, score central, ledger de datos, QR + hash, firma.
 * Portado de pasaporte-screens.jsx.
 */
import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon, IconName } from './Icon';
import { StatusBadge } from './StatusBadge';
import { ScoreRing, scoreTone, scoreToneLabel } from './ScoreRing';
import { FakeQR } from './FakeQR';
import type { Lote, Silo } from '../contexts/AppDataContext';

const MONO = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });

function CertRow({ icon, label, value, last }: { icon?: IconName; label: string; value: React.ReactNode; last?: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={[styles.row, last ? { borderBottomWidth: 0 } : null]}>
      <View style={styles.rowLabel}>
        {icon ? <Icon name={icon} size={14} color={colors.textMuted} /> : null}
        <Text style={styles.rowLabelText}>{label}</Text>
      </View>
      <Text style={styles.rowValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

function Corner({ pos }: { pos: 'tl' | 'tr' | 'bl' | 'br' }) {
  const { colors } = useTheme();
  const base = { position: 'absolute' as const, width: 16, height: 16, borderColor: colors.actionPrimary, opacity: 0.55 };
  const styleByPos: Record<string, any> = {
    tl: { ...base, top: 6, left: 6, borderTopWidth: 1.5, borderLeftWidth: 1.5 },
    tr: { ...base, top: 6, right: 6, borderTopWidth: 1.5, borderRightWidth: 1.5 },
    bl: { ...base, bottom: 6, left: 6, borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
    br: { ...base, bottom: 6, right: 6, borderBottomWidth: 1.5, borderRightWidth: 1.5 },
  };
  return <View style={styleByPos[pos]} />;
}

export function Certificate({ lote, silo, onQRTap }: { lote: Lote; silo?: Silo; onQRTap?: () => void }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const isMon = lote.status === 'monitoring';
  const tone = scoreTone(lote.score);

  return (
    <View style={styles.card}>
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Icon name="shield" size={18} color={colors.actionPrimary} />
          <Text style={styles.brand}>SiloGuard</Text>
        </View>
        <Text style={styles.headerLabel}>CERTIFICADO DE CALIDAD</Text>
        <Text style={styles.folio}>N° {lote.id}</Text>
        <StatusBadge tone={isMon ? 'ok' : 'resolved'} label={isMon ? 'En monitoreo' : 'Finalizado'} style={{ marginTop: 2, alignSelf: 'center' }} />
      </View>

      <View style={styles.scoreWrap}>
        <Text style={styles.scoreLabel}>SCORE HISTÓRICO</Text>
        <ScoreRing score={lote.score} size={132} stroke={9} showLabel />
      </View>

      <View style={styles.ledger}>
        {silo ? <CertRow icon="home" label="Silo de origen" value={silo.name} /> : null}
        <CertRow icon="clipboard" label="Grano y tonelaje" value={`${lote.grain} · ${lote.tons} t`} />
        <CertRow icon="clock" label="Período monitoreado" value={lote.end ? `${lote.start} – ${lote.end}` : `${lote.start} – en curso`} />
        <CertRow icon="target" label="Días bajo monitoreo" value={`${lote.days} días`} />
        <CertRow icon="check-circle" label="Alertas resueltas" value={String(lote.alertsResolved)} />
        <CertRow icon="wind" label="CO₂ promedio" value={`${lote.avg.co2} ppm`} />
        <CertRow icon="thermometer" label="Temp. promedio" value={`${lote.avg.temp}°C`} />
        <CertRow icon="droplet" label="Humedad promedio" value={`${lote.avg.hum}%`} last />
      </View>

      <View style={styles.qrRow}>
        <Pressable onPress={onQRTap} accessibilityLabel="Ampliar código QR">
          <FakeQR seed={lote.id} size={64} />
        </Pressable>
        <View style={styles.qrTextCol}>
          <Text style={styles.qrLabel}>HASH DE VERIFICACIÓN</Text>
          <Text style={styles.qrHash} numberOfLines={1}>
            {lote.id}
          </Text>
          <Pressable onPress={onQRTap} style={styles.qrLink}>
            <Text style={styles.qrLinkLabel}>Ampliar QR</Text>
            <Icon name="chevron-right" size={13} color={colors.actionPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.signature}>
        <Text style={styles.signatureText}>
          Emitido y verificado digitalmente por SiloGuard.{'\n'}Escaneá el QR para validar su autenticidad.
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.borderDefault,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      paddingTop: 24,
      position: 'relative',
    },
    header: {
      alignItems: 'center',
      gap: 8,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: c.borderDefault,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    brand: {
      fontSize: 13,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      color: c.textPrimary,
    },
    headerLabel: {
      fontSize: 10.5,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      letterSpacing: 2,
      color: c.textSecondary,
    },
    folio: {
      fontSize: 10,
      color: c.textMuted,
      fontFamily: MONO,
    },
    scoreWrap: {
      alignItems: 'center',
      gap: 8,
      paddingVertical: 20,
    },
    scoreLabel: {
      fontSize: 10,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      letterSpacing: 2,
      color: c.textMuted,
    },
    ledger: {
      paddingVertical: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: c.borderDefault,
    },
    rowLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    rowLabelText: {
      fontSize: 12.5,
      color: c.textSecondary,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    rowValue: {
      fontSize: 13.5,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      color: c.textPrimary,
      textAlign: 'right',
      flexShrink: 1,
    },
    qrRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: c.borderDefault,
    },
    qrTextCol: {
      flex: 1,
      minWidth: 0,
    },
    qrLabel: {
      fontSize: 11,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      letterSpacing: 0.5,
      color: c.textMuted,
      marginBottom: 3,
    },
    qrHash: {
      fontSize: 12,
      color: c.textPrimary,
      fontFamily: MONO,
      marginBottom: 5,
    },
    qrLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    qrLinkLabel: {
      fontSize: 12,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      color: c.actionPrimary,
    },
    signature: {
      marginTop: 18,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: c.borderDefault,
      alignItems: 'center',
    },
    signatureText: {
      fontSize: 10.5,
      color: c.textMuted,
      lineHeight: 16,
      textAlign: 'center',
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
  });

export default Certificate;
