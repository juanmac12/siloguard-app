/**
 * AuthHeader — barra superior compartida del flujo de auth/onboarding.
 * Back-arrow opcional + título. Reemplaza los headers inline que cada
 * pantalla (register / verificar-email / vincular lanza) reimplementaba.
 */
import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Radius, Type, ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export function AuthHeader({ title, showBack = true, onBack }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.bar}>
      {showBack ? (
        <Pressable
          onPress={onBack}
          accessibilityLabel="Volver"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
        >
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </Pressable>
      ) : null}
      <Text style={[styles.title, showBack ? styles.titleWithBack : styles.titleNoBack]}>
        {title}
      </Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    bar: {
      height: 54,
      paddingHorizontal: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      backgroundColor: c.surfaceCard,
      borderBottomWidth: 1,
      borderBottomColor: c.borderDefault,
    },
    backBtn: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Radius.md,
    },
    title: {
      color: c.textPrimary,
      fontSize: Type.h3.fontSize,
      lineHeight: Type.h3.lineHeight,
      fontWeight: Type.h3.fontWeight,
    },
    titleWithBack: { paddingLeft: 8 },
    titleNoBack: { paddingLeft: 12 },
  });

export default AuthHeader;
