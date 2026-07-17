/**
 * OnboardingStepProgress — círculos numerados + líneas conectoras, con
 * caption. Usado en los sub-pasos de "Vincular lanza" (QR → WiFi → Asignación).
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

export function OnboardingStepProgress({
  step,
  total,
  caption,
}: {
  step: number;
  total: number;
  caption: string;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const items: React.ReactNode[] = [];
  for (let n = 1; n <= total; n++) {
    const filled = step >= n;
    items.push(
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
        <Text style={[styles.circleLabel, { color: filled ? '#FFFFFF' : colors.textSecondary }]}>{n}</Text>
      </View>
    );
    if (n < total) {
      const lineFilled = step > n;
      items.push(
        <View
          key={`l${n}`}
          style={[styles.line, { backgroundColor: lineFilled ? colors.actionPrimary : colors.surfaceInput }]}
        />
      );
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>{items}</View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    circle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleLabel: {
      fontSize: 12,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
    },
    line: {
      flex: 1,
      height: 2,
      borderRadius: 2,
    },
    caption: {
      fontSize: 12,
      color: c.textSecondary,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
  });

export default OnboardingStepProgress;
