/**
 * Banners de estados especiales — portados de estados-especiales.jsx.
 * No son pantallas propias: se superponen sobre Dashboard y Detalle de silo.
 * `OfflineBanner`: sin conexión a internet (celular). `DeviceOfflineBanner`:
 * la lanza de un silo no responde, con guía de diagnóstico colapsable.
 * `DisabledHint`: nota inline para acciones bloqueadas por falta de red.
 */
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

export function relTime(mins: number): string {
  if (mins < 60) return `hace ${mins} min`;
  const h = Math.round(mins / 60);
  return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`;
}

export function OfflineBanner({ minutesOffline = 12 }: { minutesOffline?: number }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const prolonged = minutesOffline >= 60;

  return (
    <View style={styles.offlineWrap}>
      <Icon name="wifi-off" size={16} color={colors.statusWarn} />
      <View style={styles.flex1}>
        <Text style={styles.offlineTitle}>Sin conexión a internet</Text>
        <Text style={styles.offlineBody}>
          Último dato recibido: {relTime(minutesOffline)}.{prolonged ? ' Los datos pueden estar desactualizados.' : ''}
        </Text>
      </View>
    </View>
  );
}

export function DisabledHint({ children }: { children?: React.ReactNode }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.hintRow}>
      <Icon name="wifi-off" size={12} color={colors.textMuted} />
      <Text style={styles.hintText}>{children ?? 'Requiere conexión'}</Text>
    </View>
  );
}

const DIAG_STEPS = [
  'Verificá que la lanza esté encendida y el LED verde parpadee.',
  'Asegurate de que el router WiFi del silo esté funcionando.',
  'Acercate al silo y verificá que la lanza esté correctamente clavada.',
  'Si el problema persiste, contactá a soporte técnico.',
];

export function DeviceOfflineBanner({
  minutesOffline = 12,
  onContactSupport,
}: {
  minutesOffline?: number;
  onContactSupport?: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [open, setOpen] = useState(false);
  const prolonged = minutesOffline >= 30;
  const tone = prolonged ? colors.statusCritical : colors.statusWarn;

  return (
    <View style={[styles.deviceWrap, { borderColor: tone, backgroundColor: prolonged ? 'rgba(239,68,68,0.07)' : 'rgba(234,179,8,0.07)' }]}>
      <View style={styles.deviceHeader}>
        <Icon name="cloud-off" size={18} color={tone} />
        <View style={styles.flex1}>
          <Text style={styles.deviceTitle}>La lanza no responde</Text>
          <Text style={styles.deviceBody}>Última señal recibida: {relTime(minutesOffline)}</Text>
        </View>
      </View>
      <Pressable onPress={() => setOpen((o) => !o)} style={[styles.deviceToggle, { borderTopColor: tone }]}>
        <Text style={[styles.deviceToggleLabel, { color: tone }]}>¿Qué puedo hacer?</Text>
        <Icon name="chevron-down" size={15} color={tone} />
      </Pressable>
      {open ? (
        <View style={styles.diagWrap}>
          {DIAG_STEPS.map((s, i) => (
            <View key={i} style={styles.diagRow}>
              <View style={[styles.diagBadge, { borderColor: tone }]}>
                <Text style={[styles.diagBadgeText, { color: tone }]}>{i + 1}</Text>
              </View>
              <Text style={styles.diagText}>{s}</Text>
            </View>
          ))}
          <Pressable onPress={onContactSupport} style={[styles.contactBtn, { borderColor: tone }]}>
            <Icon name="clipboard" size={14} color={tone} />
            <Text style={[styles.contactLabel, { color: tone }]}>Contactar soporte</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    flex1: { flex: 1, minWidth: 0 },
    offlineWrap: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.sm,
      padding: 11,
      backgroundColor: 'rgba(234,179,8,0.08)',
      borderWidth: 1,
      borderColor: c.statusWarn,
      borderRadius: Radius.lg,
    },
    offlineTitle: {
      fontSize: 13,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      color: c.textPrimary,
    },
    offlineBody: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 2,
      lineHeight: 16,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    hintRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
    },
    hintText: {
      fontSize: 11.5,
      color: c.textMuted,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    deviceWrap: {
      marginHorizontal: Spacing.md,
      marginBottom: Spacing.xs,
      borderWidth: 1,
      borderRadius: Radius.lg,
      overflow: 'hidden',
    },
    deviceHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
      padding: 13,
    },
    deviceTitle: {
      fontSize: 13.5,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      color: c.textPrimary,
    },
    deviceBody: {
      fontSize: 12,
      color: c.textSecondary,
      marginTop: 2,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    deviceToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderTopWidth: 1,
    },
    deviceToggleLabel: {
      fontSize: 12.5,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
    },
    diagWrap: {
      paddingHorizontal: 14,
      paddingBottom: 14,
      gap: 9,
    },
    diagRow: {
      flexDirection: 'row',
      gap: 9,
      alignItems: 'flex-start',
    },
    diagBadge: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1,
      backgroundColor: c.surfaceInput,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    diagBadgeText: {
      fontSize: 10,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
    },
    diagText: {
      flex: 1,
      fontSize: 12.5,
      color: c.textSecondary,
      lineHeight: 18,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    contactBtn: {
      marginTop: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: 10,
      backgroundColor: c.surfaceInput,
      borderWidth: 1,
      borderRadius: Radius.md,
    },
    contactLabel: {
      fontSize: 12.5,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
    },
  });

export default OfflineBanner;
