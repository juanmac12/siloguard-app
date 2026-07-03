/**
 * ListItem — fila de silo (Default / Selected / Resolved).
 * Default: dot de estado. Selected: borde verde + tint. Resolved: check + opacidad.
 * Muestra título, subtítulo, score de salud /100 y chevron.
 */
import React from 'react';
import { Pressable, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, FontWeight } from '../constants/Theme';
import { Icon } from './Icon';
import { StatusDot, Tone } from './StatusBadge';

type State = 'default' | 'selected' | 'resolved';

export function ListItem({
  state = 'default',
  title,
  subtitle,
  score,
  value,
  valueUnit,
  tone = 'ok',
  onPress,
  style,
}: {
  state?: State;
  title: string;
  subtitle: string;
  score?: string | number;
  value?: string | number;
  valueUnit?: string;
  tone?: Tone;
  onPress?: () => void;
  style?: ViewStyle;
}) {
  const isSelected = state === 'selected';
  const isResolved = state === 'resolved';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: isSelected ? Colors.greenTint : Colors.surfaceCard,
          borderColor: isSelected ? Colors.green : Colors.borderDefault,
        },
        isResolved ? { opacity: 0.7 } : null,
        pressed ? { opacity: 0.85 } : null,
        style,
      ]}
    >
      <View style={styles.leading}>
        {isResolved ? (
          <Icon name="check-circle" size={20} color={Colors.green} />
        ) : (
          <StatusDot tone={tone} size={10} glow={tone === 'critical'} />
        )}
      </View>

      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      {value !== undefined ? (
        <View style={styles.scoreCol}>
          <Text style={[styles.score, isResolved ? { color: Colors.textMuted } : null]}>
            {value}
          </Text>
          {valueUnit ? <Text style={styles.scoreUnit}>{valueUnit}</Text> : null}
        </View>
      ) : score !== undefined ? (
        <View style={styles.scoreCol}>
          <Text style={[styles.score, isResolved ? { color: Colors.textMuted } : null]}>
            {score}
          </Text>
          <Text style={styles.scoreUnit}>/100</Text>
        </View>
      ) : null}

      <Icon name="chevron-right" size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  leading: {
    width: 20,
    alignItems: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: FontWeight.semibold,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  scoreCol: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  score: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.4,
  },
  scoreUnit: {
    color: Colors.textMuted,
    fontSize: 12,
  },
});

export default ListItem;
