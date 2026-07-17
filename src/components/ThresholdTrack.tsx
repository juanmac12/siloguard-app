/**
 * ThresholdTrack — visualización read-only de umbrales: bandas de color +
 * marcas de advertencia/crítica + punto de lectura en vivo. Portado de
 * design_refs/screens/umbrales-screen.jsx.
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const fmt = (v: number, dec: number) => (dec === 0 ? String(Math.round(v)) : v.toFixed(dec));

export function ThresholdTrack({
  min,
  max,
  dec,
  unit,
  warn,
  crit,
  reading,
}: {
  min: number;
  max: number;
  dec: number;
  unit: string;
  warn: number;
  crit: number;
  reading?: number | null;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const toPct = (v: number) => ((clamp(v, min, max) - min) / (max - min)) * 100;
  const wp = toPct(warn);
  const cp = toPct(crit);
  const rp = reading != null ? toPct(reading) : null;
  const readingColor = reading == null ? undefined : reading >= crit ? colors.statusCritical : reading >= warn ? colors.statusWarn : colors.statusOk;

  const GAP = 16;
  const labelWp = clamp(wp, 2, cp - GAP);
  const labelCp = clamp(cp, wp + GAP, 97);
  const labelRp = rp != null ? clamp(rp, 4, 92) : 0;

  return (
    <View>
      <View style={styles.labelRow}>
        <Text style={[styles.tickLabel, { left: `${labelWp}%`, color: colors.statusWarn }]}>
          {fmt(warn, dec)} {unit}
        </Text>
        <Text style={[styles.tickLabel, { left: `${labelCp}%`, color: colors.statusCritical }]}>
          {fmt(crit, dec)} {unit}
        </Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.zone, { left: 0, width: `${wp}%`, backgroundColor: colors.statusOk, opacity: 0.3, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }]} />
        <View style={[styles.zone, { left: `${wp}%`, width: `${cp - wp}%`, backgroundColor: colors.statusWarn, opacity: 0.5 }]} />
        <View style={[styles.zone, { left: `${cp}%`, right: 0, width: undefined, backgroundColor: colors.statusCritical, opacity: 0.45, borderTopRightRadius: 5, borderBottomRightRadius: 5 }]} />

        <View style={[styles.tick, { left: `${wp}%`, backgroundColor: colors.statusWarn }]} />
        <View style={[styles.tick, { left: `${cp}%`, backgroundColor: colors.statusCritical }]} />

        {rp != null ? (
          <View
            style={[
              styles.readingDot,
              {
                left: `${rp}%`,
                backgroundColor: readingColor,
                borderColor: colors.bg,
              },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.readingRow}>
        {reading != null ? (
          <Text style={[styles.readingLabel, { left: `${labelRp}%`, color: readingColor }]}>
            ● {fmt(reading, dec)} {unit}
          </Text>
        ) : null}
      </View>

      <View style={styles.legend}>
        <LegendDot color={colors.statusOk} label="Normal" />
        <LegendDot color={colors.statusWarn} label="Advertencia" />
        <LegendDot color={colors.statusCritical} label="Crítica" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={legendStyles.legendItem}>
      <View style={[legendStyles.legendDot, { backgroundColor: color }]} />
      <Text style={[legendStyles.legendLabel, { color }]}>{label.toUpperCase()}</Text>
    </View>
  );
}

const legendStyles = StyleSheet.create({
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 9,
    fontWeight: FontWeight.semibold,
    fontFamily: fontFamilyForWeight(FontWeight.semibold),
    letterSpacing: 0.5,
  },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    labelRow: {
      height: 18,
      position: 'relative',
    },
    tickLabel: {
      position: 'absolute',
      bottom: 0,
      fontSize: 10,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
    },
    track: {
      height: 10,
      borderRadius: 5,
      backgroundColor: 'rgba(255,255,255,0.09)',
      marginTop: 8,
    },
    zone: {
      position: 'absolute',
      top: 0,
      bottom: 0,
    },
    tick: {
      position: 'absolute',
      top: -5,
      bottom: -5,
      width: 2.5,
      borderRadius: 2,
      marginLeft: -1.25,
    },
    readingDot: {
      position: 'absolute',
      top: -2,
      width: 14,
      height: 14,
      borderRadius: 7,
      marginLeft: -7,
      borderWidth: 2.5,
    },
    readingRow: {
      height: 16,
      position: 'relative',
      marginTop: 4,
    },
    readingLabel: {
      position: 'absolute',
      top: 0,
      fontSize: 10,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
    },
    legend: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 14,
      marginTop: 2,
    },
  });

export default ThresholdTrack;
