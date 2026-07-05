/**
 * ScoreRing — anillo circular de score (0-100), usado en las cards de lote
 * y en el certificado del Pasaporte de Calidad.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

export type ScoreTone = 'ok' | 'warn' | 'critical';

export function scoreTone(score: number): ScoreTone {
  return score >= 85 ? 'ok' : score >= 65 ? 'warn' : 'critical';
}

export function scoreToneLabel(tone: ScoreTone): string {
  return tone === 'ok' ? 'Óptimo' : tone === 'warn' ? 'Regular' : 'Bajo';
}

type Props = {
  score: number;
  size?: number;
  stroke?: number;
  showLabel?: boolean;
};

export function ScoreRing({ score, size = 52, stroke = 4, showLabel = false }: Props) {
  const { colors } = useTheme();
  const tone = scoreTone(score);
  const color = tone === 'ok' ? colors.statusOk : tone === 'warn' ? colors.statusWarn : colors.statusCritical;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - score / 100);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.borderDefault} strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.center]}>
        <Text style={[styles.score, { fontSize: size * 0.32, color: colors.textPrimary }]}>{score}</Text>
        {showLabel && (
          <Text style={[styles.label, { fontSize: Math.max(size * 0.11, 9), color }]}>
            {scoreToneLabel(tone).toUpperCase()}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  score: { fontWeight: '700', letterSpacing: -0.5 },
  label: { fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
});

export default ScoreRing;
