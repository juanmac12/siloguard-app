/**
 * LoteStatusCard — card de estado del lote en Detalle de silo: punto de
 * entrada al ciclo de vida (iniciar / ver pasaporte). Portado de pasaporte-screens.jsx.
 */
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';
import { ScoreRing } from './ScoreRing';
import { Button } from './Button';
import type { Lote } from '../contexts/AppDataContext';

export function LoteStatusCard({
  lote,
  onIniciar,
  onVerPasaporte,
}: {
  lote: Lote | null | undefined;
  onIniciar: () => void;
  onVerPasaporte: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!lote) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconBox}>
          <Icon name="clipboard" size={18} color={colors.textMuted} />
        </View>
        <View style={styles.emptyTextCol}>
          <Text style={styles.emptyTitle}>Sin lote iniciado</Text>
          <Text style={styles.emptyBody}>Iniciá el seguimiento de este acopio para emitir su certificado de calidad.</Text>
        </View>
        <Button variant="secondary" size="sm" onPress={onIniciar}>
          Iniciar lote
        </Button>
      </View>
    );
  }

  const isMon = lote.status === 'monitoring';

  return (
    <Pressable onPress={onVerPasaporte} style={({ pressed }) => [styles.card, pressed ? { opacity: 0.9 } : null]}>
      <ScoreRing score={lote.score} size={44} stroke={4} />
      <View style={styles.textCol}>
        <View style={styles.statusRow}>
          <View style={[styles.dot, { backgroundColor: isMon ? colors.actionPrimary : colors.textMuted }]} />
          <Text style={[styles.statusLabel, { color: isMon ? colors.actionPrimary : colors.textMuted }]}>
            {isMon ? `En monitoreo · día ${lote.days}` : 'Certificado emitido'}
          </Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {lote.name}
        </Text>
      </View>
      <View style={styles.cta}>
        <Text style={styles.ctaLabel}>Pasaporte</Text>
        <Icon name="chevron-right" size={14} color={colors.actionPrimary} />
      </View>
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    emptyCard: {
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.xs,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: c.surfaceCard,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: c.borderStrong,
      borderRadius: Radius.lg,
    },
    emptyIconBox: {
      width: 38,
      height: 38,
      borderRadius: Radius.md,
      backgroundColor: c.surfaceInput,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTextCol: {
      flex: 1,
      gap: 2,
    },
    emptyTitle: {
      fontSize: 13.5,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      color: c.textPrimary,
    },
    emptyBody: {
      fontSize: 12,
      color: c.textSecondary,
      lineHeight: 17,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    card: {
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.xs,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: c.surfaceCard,
      borderWidth: 1,
      borderColor: c.borderDefault,
      borderRadius: Radius.lg,
    },
    textCol: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusLabel: {
      fontSize: 11,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      letterSpacing: 0.5,
    },
    name: {
      fontSize: 13.5,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      color: c.textPrimary,
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    ctaLabel: {
      fontSize: 12.5,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      color: c.actionPrimary,
    },
  });

export default LoteStatusCard;
