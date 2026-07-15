/**
 * OnboardingStepProgress — círculos numerados + conector + caption.
 * Usado en "Vincular lanza": trata QR + WiFi como paso 1 y datos del silo como paso 2.
 * `step` es 1-based.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Type, ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  step: number; // 1-based
  total: number;
  caption?: string;
};

export function OnboardingStepProgress({ step, total, caption }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const nodes: React.ReactNode[] = [];
  for (let n = 1; n <= total; n++) {
    const filled = step >= n;
    nodes.push(
      <View
        key={`c${n}`}
        style={[
          styles.circle,
          {
            backgroundColor: filled ? colors.actionPrimary : colors.surfaceInput,
            borderColor: filled ? colors.actionPrimary : colors.borderDefault,
          },
        ]}
      >
        <Text style={[styles.circleText, { color: filled ? '#FFFFFF' : colors.textSecondary }]}>
          {n}
        </Text>
      </View>
    );
    if (n < total) {
      const lineFilled = step > n;
      nodes.push(
        <View
          key={`l${n}`}
          style={[
            styles.line,
            { backgroundColor: lineFilled ? colors.actionPrimary : colors.surfaceInput },
          ]}
        />
      );
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>{nodes}</View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 999,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleText: { fontSize: 12, fontWeight: '700', lineHeight: 14 },
    line: { flex: 1, height: 2, borderRadius: 2 },
    caption: {
      fontSize: Type.caption.fontSize,
      color: c.textSecondary,
    },
  });

export default OnboardingStepProgress;
