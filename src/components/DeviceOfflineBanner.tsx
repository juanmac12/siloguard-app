/**
 * DeviceOfflineBanner — "la lanza no responde" a nivel de un silo puntual.
 * TODO: hoy recibe `offlineMinutes` por prop (mock/derivado de lastUpdate);
 * cuando el backend exponga heartbeat real del dispositivo, calcular desde ahí.
 */
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Radius, ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';
import { Button } from './Button';

const DIAG_STEPS = [
  'Revisá que la lanza tenga batería o esté conectada a la fuente.',
  'Verificá que la lanza siga dentro del rango de la red WiFi del campo.',
  'Reiniciá la lanza: mantené presionado el botón lateral 5 segundos.',
  'Si el problema persiste, contactá a soporte técnico.',
];

type Props = {
  offlineMinutes: number;
  siloId: number;
};

export function DeviceOfflineBanner({ offlineMinutes, siloId }: Props) {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [expanded, setExpanded] = useState(false);

  const critical = offlineMinutes >= 30;
  const tone = critical ? colors.statusCritical : colors.statusWarn;
  const toneTint = critical ? colors.statusCriticalTint : colors.statusWarnTint;

  return (
    <View style={[styles.card, { backgroundColor: toneTint, borderColor: tone }]}>
      <View style={styles.header}>
        <Icon name="wifi-off" size={18} color={tone} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: tone }]}>La lanza no responde</Text>
          <Text style={styles.sub}>Última señal recibida hace {offlineMinutes} min.</Text>
        </View>
      </View>

      <Pressable onPress={() => setExpanded((v) => !v)} style={styles.toggle}>
        <Text style={styles.toggleText}>¿Qué puedo hacer?</Text>
        <Icon name={expanded ? 'chevron-down' : 'chevron-right'} size={14} color={colors.textSecondary} />
      </Pressable>

      {expanded && (
        <View style={styles.steps}>
          {DIAG_STEPS.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <Text style={styles.stepNum}>{i + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      <Button variant="secondary" fullWidth onPress={() => router.push(`/contacto-tecnico?siloId=${siloId}` as any)} style={{ marginTop: 10 }}>
        Contactar soporte
      </Button>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: { borderRadius: Radius.lg, borderWidth: 1, padding: 14, marginBottom: 14 },
    header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
    title: { fontSize: 14, fontWeight: '700' },
    sub: { fontSize: 12, color: c.textSecondary, marginTop: 2 },
    toggle: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
    toggleText: { fontSize: 12, fontWeight: '600', color: c.textSecondary },
    steps: { marginTop: 10, gap: 8 },
    stepRow: { flexDirection: 'row', gap: 8 },
    stepNum: { fontSize: 12, fontWeight: '700', color: c.textSecondary, width: 16 },
    stepText: { flex: 1, fontSize: 12, lineHeight: 18, color: c.textSecondary },
  });

export default DeviceOfflineBanner;
