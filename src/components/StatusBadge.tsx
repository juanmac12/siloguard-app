/**
 * StatusBadge — píldora de estado de salud del grano (dot + label).
 * StatusDot — el punto solo, para listas compactas. El crítico lleva glow.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Radius, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

export type Tone = 'ok' | 'warn' | 'critical' | 'resolved' | 'info';

const toneMap = (c: ThemeColors): Record<Tone, { color: string; tint: string; label: string }> => ({
  ok: { color: c.statusOk, tint: c.statusOkTint, label: 'OK' },
  warn: { color: c.statusWarn, tint: c.statusWarnTint, label: 'Advertencia' },
  critical: { color: c.statusCritical, tint: c.statusCriticalTint, label: 'Crítica' },
  resolved: { color: c.textSecondary, tint: 'rgba(107,114,128,0.15)', label: 'Resuelta' },
  info: { color: c.statusInfo, tint: c.statusInfoTint, label: 'Info' },
});

export function StatusBadge({
  tone,
  label,
  style,
}: {
  tone: Tone;
  label?: string;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const t = toneMap(colors)[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.tint }, style]}>
      <View style={[styles.dot, { backgroundColor: t.color }]} />
      <Text style={[styles.label, { color: t.color }]}>
        {(label ?? t.label).toUpperCase()}
      </Text>
    </View>
  );
}

export function StatusDot({
  tone,
  size = 10,
  glow = false,
}: {
  tone: Tone;
  size?: number;
  glow?: boolean;
}) {
  const { colors } = useTheme();
  const t = toneMap(colors)[tone];
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: t.color,
        },
        glow
          ? {
              shadowColor: t.color,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 6,
              elevation: 4,
            }
          : null,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: FontWeight.bold,
    fontFamily: fontFamilyForWeight(FontWeight.bold),
    letterSpacing: 0.4,
  },
});

export default StatusBadge;
