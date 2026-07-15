/**
 * Sparkline — mini gráfico de línea sin ejes (tendencia de 7 días).
 * Autoescala al bounding box de `data`; opcional relleno con gradiente.
 */
import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

export function Sparkline({
  data,
  width = 64,
  height = 28,
  color,
  strokeWidth = 2,
  fill = false,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: boolean;
}) {
  const { colors } = useTheme();
  const strokeColor = color ?? colors.actionPrimary;

  if (!data || data.length < 2) {
    return <View style={{ width, height }} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (width - pad * 2) + pad;
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return [x, y];
  });

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const gid = `sparkline-${strokeColor.replace(/[^a-zA-Z0-9]/g, '')}`;
  const area = `${line} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {fill ? (
        <Defs>
          <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
      ) : null}
      {fill ? <Path d={area} fill={`url(#${gid})`} /> : null}
      <Path d={line} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default Sparkline;
