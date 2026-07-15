/**
 * EmptyState — placeholder compartido para listas/paneles vacíos.
 * Icono en círculo + título + subtítulo, con acción opcional.
 * Reemplaza los empty-states hand-rolled de pasaporte / alertas / historial / silo.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Radius, Type, ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon, IconName } from './Icon';
import { Button } from './Button';

type Props = {
  icon: IconName;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={28} color={colors.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {actionLabel && onAction ? (
        <Button variant="secondary" onPress={onAction} style={styles.action}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 32,
      gap: 8,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 999,
      backgroundColor: c.surfaceInput,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: Type.h3.fontSize,
      fontWeight: '600',
      color: c.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: Type.body.fontSize,
      lineHeight: Type.body.lineHeight,
      color: c.textSecondary,
      textAlign: 'center',
    },
    action: { marginTop: 12 },
  });

export default EmptyState;
