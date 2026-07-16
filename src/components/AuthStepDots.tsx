/**
 * AuthStepDots — indicador de progreso reutilizable del onboarding/auth.
 * El dot activo se estira a 20px en verde; los demás quedan chicos en border-strong.
 * Consolida los dots que register / vincular-lanza / TutorialCard reimplementaban.
 */
import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

type Props = {
  total: number;
  active: number;
};

export function AuthStepDots({ total, active }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                width: isActive ? 20 : 6,
                backgroundColor: isActive ? colors.actionPrimary : colors.borderStrong,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const makeStyles = (_c: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 16,
    },
    dot: {
      height: 6,
      borderRadius: 999,
    },
  });

export default AuthStepDots;
