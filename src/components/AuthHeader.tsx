/**
 * AuthHeader — cabecera simple para pantallas de auth/onboarding:
 * botón volver opcional + título.
 */
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

export function AuthHeader({
  title,
  showBack = true,
  onBack,
}: {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.bar}>
      {showBack ? (
        <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8} accessibilityLabel="Volver">
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.backBtn} />
      )}
      <Text style={styles.title} numberOfLines={1}>
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
    },
    title: {
      flex: 1,
      paddingLeft: 8,
      fontSize: 18,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
      color: c.textPrimary,
    },
  });

export default AuthHeader;
