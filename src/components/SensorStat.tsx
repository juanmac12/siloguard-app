/**
 * SensorStat — tile de lectura de sensor (CO₂ / temperatura / humedad).
 * Muestra label, valor grande, unidad, y un icono con tono según estado.
 * Contenido centrado; label y value van a una sola línea (sin adjustsFontSizeToFit:
 * en Android esa prop puede reportar mal el alto medido del texto y solapar
 * el contenido siguiente). valueRow evita alignItems:'baseline' (otro disparador
 * conocido de colapso de altura en Android con hijos de fontSize distinto) y la
 * card tiene un height fijo (no minHeight: en Android un minHeight aplicado
 * post-medición no siempre dispara un re-layout del padre, y la fila de
 * sensores queda con la altura vieja mientras la card pinta más alta —
 * exactamente el corte que reportó el usuario en la 3ª ronda de testing).
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon, IconName } from './Icon';
import { Tone } from './StatusBadge';

type Kind = 'co2' | 'temp' | 'humidity';

const KINDS: Record<Kind, { icon: IconName; label: string; unit: string }> = {
  co2: { icon: 'wind', label: 'CO₂', unit: 'ppm' },
  temp: { icon: 'thermometer', label: 'Temp', unit: '°C' },
  humidity: { icon: 'droplet', label: 'Humedad', unit: '%' },
};

export function SensorStat({
  kind,
  value,
  tone = 'ok',
  style,
}: {
  kind: Kind;
  value: string | number;
  tone?: Tone;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const k = KINDS[kind];

  const TONE_COLOR: Record<Tone, string> = {
    ok: colors.statusOk,
    warn: colors.statusWarn,
    critical: colors.statusCritical,
    resolved: colors.textSecondary,
    info: colors.statusInfo,
  };
  const color = TONE_COLOR[tone];

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <Icon name={k.icon} size={16} color={color} />
        <Text style={styles.label} numberOfLines={1}>
          {k.label.toUpperCase()}
        </Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.unit}>{k.unit}</Text>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      flex: 1,
      height: 92,
      backgroundColor: c.surfaceCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: c.borderDefault,
      padding: Spacing.md,
      gap: Spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      maxWidth: '100%',
    },
    label: {
      color: c.textMuted,
      fontSize: 11,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      letterSpacing: 0.4,
      flexShrink: 1,
    },
    valueRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 4,
    },
    value: {
      color: c.textPrimary,
      fontSize: 28,
      lineHeight: 32,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      letterSpacing: -0.5,
      includeFontPadding: false,
    },
    unit: {
      color: c.textMuted,
      fontSize: 12,
      lineHeight: 16,
      marginBottom: 3,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
      includeFontPadding: false,
    },
  });

export default SensorStat;
