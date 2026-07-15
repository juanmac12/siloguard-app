/**
 * OfflineBanner — banner global de "sin conexión a internet".
 * TODO: hoy recibe `offline` por prop; cuando se integre @react-native-community/netinfo
 * (u otra detección real de conectividad) pasar el estado real desde el layout raíz.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Radius, ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

type Props = {
  offline: boolean;
  lastUpdateMinutes?: number;
};

export function OfflineBanner({ offline, lastUpdateMinutes }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!offline) return null;

  const stale = (lastUpdateMinutes ?? 0) >= 60;

  return (
    <View style={styles.wrap}>
      <Icon name="cloud-off" size={15} color={colors.statusWarn} />
      <Text style={styles.text}>
        Sin conexión a internet.
        {lastUpdateMinutes != null ? ` Últimos datos hace ${lastUpdateMinutes} min.` : ''}
        {stale ? ' Los datos pueden estar desactualizados.' : ''}
      </Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: c.statusWarnTint,
      borderBottomWidth: 1,
      borderBottomColor: c.statusWarn,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    text: {
      flex: 1,
      fontSize: 12,
      fontWeight: '600',
      color: c.statusWarn,
    },
  });

export default OfflineBanner;
