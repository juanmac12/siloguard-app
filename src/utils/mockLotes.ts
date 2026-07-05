/**
 * Lote — mock del Pasaporte de Calidad, generado a partir de los silos reales
 * (no hay entidad "Lote" en el backend todavía; esto es solo la vitrina de consulta).
 * Determinístico por silo.id: la misma app siempre muestra los mismos lotes.
 */
import { Silo } from '../contexts/AppDataContext';

export interface Lote {
  id: string;
  siloId: number;
  siloName: string;
  name: string;
  grain: string;
  tons: number;
  start: string;
  end: string | null;
  days: number;
  status: 'monitoring' | 'finalized';
  score: number;
  alertsResolved: number;
  avg: { co2: number; temp: number; hum: number };
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function seededInt(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  const r = x - Math.floor(x);
  return min + Math.floor(r * (max - min + 1));
}

function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

function scoreForStatus(status: Silo['status'], seed: number): number {
  if (status === 'critical') return seededInt(seed, 52, 64);
  if (status === 'warn') return seededInt(seed, 65, 84);
  return seededInt(seed, 85, 97);
}

export function buildLotesFromSilos(silos: Silo[]): Lote[] {
  const now = new Date();
  return silos.map((s, i) => {
    const finalized = i % 3 === 2;
    const days = seededInt(s.id * 7 + 3, 30, 150);
    const start = new Date(now);
    start.setDate(start.getDate() - (finalized ? days + seededInt(s.id, 5, 20) : days));
    const end = finalized ? new Date(start) : null;
    if (end) end.setDate(end.getDate() + days);
    const score = scoreForStatus(finalized ? 'ok' : s.status, s.id * 13 + 1);

    return {
      id: `SG-${start.getFullYear()}-${s.id.toString(16).toUpperCase().padStart(4, '0')}`,
      siloId: s.id,
      siloName: s.name,
      name: `Lote ${s.grain} ${s.name.replace(/^Silo\s*/i, '')}`.trim(),
      grain: s.grain,
      tons: s.tons,
      start: formatDate(start),
      end: end ? formatDate(end) : null,
      days,
      status: finalized ? 'finalized' : 'monitoring',
      score,
      alertsResolved: seededInt(s.id * 5 + 2, 0, 4),
      avg: { co2: s.co2, temp: s.temp, hum: s.hum },
    };
  });
}
