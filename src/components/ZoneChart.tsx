/**
 * ZoneChart — gráfico de línea con bandas de fondo (segura/advertencia/crítica),
 * usado en Historial de sensores. Portado de design_refs/screens/historial-screen.jsx.
 */
import React from 'react';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

function niceScale(mn: number, mx: number) {
  if (mx - mn < 0.01) {
    mn -= 1;
    mx += 1;
  }
  const range = mx - mn;
  const rough = range / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const r = rough / mag;
  const step = r <= 1 ? mag : r <= 2 ? 2 * mag : r <= 5 ? 5 * mag : 10 * mag;
  return { min: Math.floor(mn / step) * step, max: Math.ceil(mx / step) * step };
}

function smooth(pts: [number, number][]): string {
  if (pts.length < 3) {
    return pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d +=
      ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}` +
      ` ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}` +
      ` ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

export function ZoneChart({
  slice,
  warn,
  crit,
  timeRange,
}: {
  slice: number[];
  warn: number;
  crit: number;
  timeRange: number;
}) {
  const { colors } = useTheme();
  const len = slice.length;

  const W = 340;
  const H = 108;
  const ml = 32;
  const mr = 6;
  const mt = 6;
  const mb = 20;
  const pw = W - ml - mr;
  const ph = H - mt - mb;

  const dataMn = Math.min(...slice);
  const dataMx = Math.max(...slice);
  const scMin = Math.min(dataMn, warn * 0.88);
  const scMax = Math.max(dataMx, crit * 1.06);
  const sc = niceScale(scMin, scMax);
  const yr = sc.max - sc.min || 1;

  const toX = (i: number) => ml + (i / (len - 1)) * pw;
  const toY = (v: number) => mt + (1 - (v - sc.min) / yr) * ph;

  const yBottom = mt + ph;
  const yTop = mt;
  const yWarn = Math.min(yBottom, Math.max(yTop, toY(warn)));
  const yCrit = Math.min(yBottom, Math.max(yTop, toY(crit)));

  const pts: [number, number][] = slice.map((v, i) => [toX(i), toY(v)]);
  const line = smooth(pts);
  const area = `${line} L${pts[len - 1][0].toFixed(1)},${yBottom} L${pts[0][0].toFixed(1)},${yBottom} Z`;

  const curVal = slice[len - 1];
  const tone = curVal >= crit ? colors.statusCritical : curVal >= warn ? colors.statusWarn : colors.statusOk;

  const critIdx = slice.findIndex((v) => v >= crit);
  const warnIdx = slice.findIndex((v) => v >= warn);
  const crossIdx = critIdx >= 0 ? critIdx : warnIdx >= 0 ? warnIdx : -1;

  const steps = timeRange === 24 ? [0, 6, 12, 18, 24] : timeRange === 48 ? [0, 12, 24, 36, 48] : timeRange === 72 ? [0, 24, 48, 72] : [0, 48, 96, 144, 168];
  const xLabels = steps.map((h) => ({
    x: toX(Math.round((h / timeRange) * (len - 1))),
    label: h === timeRange ? 'Ahora' : `${timeRange - h}h`,
  }));

  const yTickWarn = warn >= sc.min && warn <= sc.max;
  const yTickCrit = crit >= sc.min && crit <= sc.max;
  const gid = `zonechart-${Math.round(warn)}-${Math.round(crit)}`;

  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={tone} stopOpacity={0.25} />
          <Stop offset="100%" stopColor={tone} stopOpacity={0.02} />
        </LinearGradient>
      </Defs>

      {/* bandas de zona */}
      <Path d={`M${ml},${yWarn} h${pw} v${Math.max(0, yBottom - yWarn)} h${-pw} Z`} fill={colors.statusOk} opacity={0.08} />
      <Path d={`M${ml},${yCrit} h${pw} v${Math.max(0, yWarn - yCrit)} h${-pw} Z`} fill={colors.statusWarn} opacity={0.1} />
      <Path d={`M${ml},${yTop} h${pw} v${Math.max(0, yCrit - yTop)} h${-pw} Z`} fill={colors.statusCritical} opacity={0.1} />

      {yTickWarn ? <Line x1={ml} x2={W - mr} y1={yWarn} y2={yWarn} stroke={colors.statusWarn} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.55} /> : null}
      {yTickCrit ? <Line x1={ml} x2={W - mr} y1={yCrit} y2={yCrit} stroke={colors.statusCritical} strokeWidth={0.8} strokeDasharray="3 2" opacity={0.65} /> : null}

      {yTickWarn ? (
        <SvgText x={ml - 4} y={yWarn + 3.5} textAnchor="end" fontSize={9} fill={colors.statusWarn} opacity={0.85}>
          {warn}
        </SvgText>
      ) : null}
      {yTickCrit ? (
        <SvgText x={ml - 4} y={yCrit + 3.5} textAnchor="end" fontSize={9} fill={colors.statusCritical} opacity={0.9}>
          {crit}
        </SvgText>
      ) : null}

      {crossIdx > 0 && crossIdx < len - 1 ? (
        <Line x1={toX(crossIdx)} x2={toX(crossIdx)} y1={mt} y2={mt + ph} stroke={tone} strokeWidth={1} strokeDasharray="2 3" opacity={0.45} />
      ) : null}

      <Path d={area} fill={`url(#${gid})`} />
      <Path d={line} fill="none" stroke={tone} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={pts[len - 1][0]} cy={pts[len - 1][1]} r={4.5} fill={tone} stroke={colors.surfaceCard} strokeWidth={2} />

      {xLabels.map((xl, i) => (
        <SvgText
          key={i}
          x={xl.x}
          y={H - 4}
          textAnchor={i === xLabels.length - 1 ? 'end' : i === 0 ? 'start' : 'middle'}
          fontSize={9}
          fill={xl.label === 'Ahora' ? tone : colors.textMuted}
          fontWeight={xl.label === 'Ahora' ? '600' : '400'}
        >
          {xl.label}
        </SvgText>
      ))}
    </Svg>
  );
}

export default ZoneChart;
