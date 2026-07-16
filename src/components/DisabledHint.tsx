/**
 * DisabledHint — leyenda inline para acciones bloqueadas por falta de conexión.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

export function DisabledHint({ label = 'Requiere conexión' }: { label?: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.wrap}>
      <Icon name="wifi-off" size={12} color={colors.textSecondary} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    text: { fontSize: 11, color: c.textSecondary, fontStyle: 'italic' },
  });

export default DisabledHint;
