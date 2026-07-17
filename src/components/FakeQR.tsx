/**
 * FakeQR — pseudo-QR determinístico (no decodificable), placeholder visual
 * para el Pasaporte de Calidad. Portado de pasaporte-screens.jsx.
 */
import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

export function FakeQR({ seed, size = 72 }: { seed: string; size?: number }) {
  const N = 21;
  const cell = size / N;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const rnd = (i: number) => {
    const x = Math.sin((h + i) * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const isFinder = (x: number, y: number) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);

  const modules: [number, number][] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (isFinder(x, y)) continue;
      if (rnd(y * N + x) > 0.56) modules.push([x, y]);
    }
  }

  const Finder = ({ cx, cy }: { cx: number; cy: number }) => (
    <>
      <Rect x={cx * cell} y={cy * cell} width={cell * 7} height={cell * 7} fill="#0A0A0A" />
      <Rect x={(cx + 1) * cell} y={(cy + 1) * cell} width={cell * 5} height={cell * 5} fill="#FFFFFF" />
      <Rect x={(cx + 2) * cell} y={(cy + 2) * cell} width={cell * 3} height={cell * 3} fill="#0A0A0A" />
    </>
  );

  return (
    <View style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: size * 0.09, alignSelf: 'flex-start' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {modules.map(([x, y], i) => (
          <Rect key={i} x={x * cell} y={y * cell} width={cell} height={cell} fill="#0A0A0A" />
        ))}
        <Finder cx={0} cy={0} />
        <Finder cx={N - 7} cy={0} />
        <Finder cx={0} cy={N - 7} />
      </Svg>
    </View>
  );
}

export default FakeQR;
