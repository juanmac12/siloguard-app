/**
 * EmptyState — panel centrado para listas vacías, offline, error de servidor
 * y "todo en orden". Icono + título + cuerpo con defaults por variante,
 * todos sobreescribibles; `action` acepta cualquier nodo (típicamente un Button sm).
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon, IconName } from './Icon';

export type EmptyStateVariant = 'empty' | 'offline' | 'error' | 'no-alerts';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_DEFAULTS: Record<EmptyStateVariant, { icon: IconName; title: string; body: string }> = {
  empty: { icon: 'inbox', title: 'Nada por acá', body: 'Todavía no hay elementos para mostrar.' },
  offline: { icon: 'cloud-off', title: 'Sin conexión', body: 'No pudimos cargar los datos. Revisá tu conexión.' },
  error: { icon: 'alert-triangle', title: 'Algo salió mal', body: 'Ocurrió un error inesperado. Probá de nuevo.' },
  'no-alerts': { icon: 'check-circle', title: 'Todo en orden', body: 'No hay alertas activas en este momento.' },
};

const SIZE_ICON: Record<Size, number> = { sm: 40, md: 52, lg: 64 };

export function EmptyState({
  variant = 'empty',
  size = 'md',
  title,
  body,
  action,
}: {
  variant?: EmptyStateVariant;
  size?: Size;
  title?: string;
  body?: string;
  action?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const d = VARIANT_DEFAULTS[variant];
  const iconBoxSize = SIZE_ICON[size];
  const iconColor = variant === 'no-alerts' ? colors.statusOk : colors.textMuted;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.iconBox,
          {
            width: iconBoxSize,
            height: iconBoxSize,
            borderRadius: iconBoxSize / 2,
            backgroundColor: variant === 'no-alerts' ? colors.statusOkTint : colors.surfaceInput,
          },
        ]}
      >
        <Icon name={d.icon} size={iconBoxSize * 0.46} color={iconColor} />
      </View>
      <Text style={styles.title}>{title ?? d.title}</Text>
      <Text style={styles.body}>{body ?? d.body}</Text>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.xl,
      paddingHorizontal: Spacing.lg,
      gap: Spacing.sm,
    },
    iconBox: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xs,
    },
    title: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      textAlign: 'center',
    },
    body: {
      color: c.textMuted,
      fontSize: 13,
      lineHeight: 19,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
      textAlign: 'center',
      maxWidth: 280,
    },
    action: {
      marginTop: Spacing.sm,
    },
  });

export default EmptyState;
