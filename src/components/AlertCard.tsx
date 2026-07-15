/**
 * AlertCard — tarjeta de alerta (Crítica / Advertencia / Resuelta).
 * Accent bar a la izquierda, icon badge, status pill, título, silo y descripción.
 * La resuelta baja opacidad. Es presionable para ir al detalle.
 */
import React, { useMemo } from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon, IconName } from './Icon';

type Variant = 'critical' | 'warning' | 'resolved';

export function AlertCard({
  variant,
  title,
  silo,
  time,
  description,
  onPress,
  style,
}: {
  variant: Variant;
  title: string;
  silo: string;
  time: string;
  description: string;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const VARIANTS: Record<
    Variant,
    { color: string; tint: string; icon: IconName; label: string }
  > = {
    critical: {
      color: colors.statusCritical,
      tint: colors.statusCriticalTint,
      icon: 'alert-triangle',
      label: 'CRÍTICA',
    },
    warning: {
      color: colors.statusWarn,
      tint: colors.statusWarnTint,
      icon: 'alert-triangle',
      label: 'ADVERTENCIA',
    },
    resolved: {
      color: colors.textSecondary,
      tint: 'rgba(107,114,128,0.15)',
      icon: 'check-circle',
      label: 'RESUELTA',
    },
  };

  const v = VARIANTS[variant];
  const isResolved = variant === 'resolved';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isResolved ? { opacity: 0.72 } : null,
        pressed ? { opacity: isResolved ? 0.6 : 0.85 } : null,
        style,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: v.color }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.iconBadge, { backgroundColor: v.tint }]}>
            <Icon name={v.icon} size={20} color={v.color} />
          </View>
          <View style={styles.metaCol}>
            <View style={styles.pillRow}>
              <View style={[styles.pill, { backgroundColor: v.tint }]}>
                <View style={[styles.pillDot, { backgroundColor: v.color }]} />
                <Text style={[styles.pillText, { color: v.color }]}>{v.label}</Text>
              </View>
              <Text style={styles.time}>{time}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.silo}>{silo}</Text>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: c.surfaceCard,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: c.borderDefault,
      overflow: 'hidden',
    },
    accent: {
      width: 3,
    },
    body: {
      flex: 1,
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    topRow: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    iconBadge: {
      width: 40,
      height: 40,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    metaCol: {
      flex: 1,
      gap: 4,
    },
    pillRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: Radius.full,
    },
    pillDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    pillText: {
      fontSize: 10,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      letterSpacing: 0.4,
    },
    time: {
      color: c.textMuted,
      fontSize: 12,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    title: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
    },
    silo: {
      color: c.textMuted,
      fontSize: 12,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    description: {
      color: c.textMuted,
      fontSize: 14,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
      lineHeight: 22,
    },
  });

export default AlertCard;
