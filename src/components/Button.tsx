/**
 * Button — el CTA verde sólido de la marca es `primary`.
 * `secondary` es superficie con borde; `ghost` es solo texto; `danger` es rojo.
 * Tamaños sm (36) / md (44) / lg (48, default).
 */
import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Radius, Spacing, FontWeight, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  style?: ViewStyle;
};

const SIZES: Record<Size, { height: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { height: 36, paddingHorizontal: 14, fontSize: 12 },
  md: { height: 44, paddingHorizontal: 18, fontSize: 14 },
  lg: { height: 48, paddingHorizontal: 22, fontSize: 14 },
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  disabled = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  style,
}: Props) {
  const { colors } = useTheme();
  const reducedMotion = useReducedMotion();
  const s = SIZES[size];

  const variantStyle: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: colors.actionPrimary },
    secondary: {
      backgroundColor: colors.surfaceCard,
      borderWidth: 1,
      borderColor: colors.borderDefault,
    },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: colors.statusCritical },
  };

  const textColor: Record<Variant, string> = {
    primary: colors.actionPrimaryText,
    secondary: colors.textPrimary,
    ghost: colors.textLink,
    danger: '#FFFFFF',
  };

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.paddingHorizontal,
          width: fullWidth ? '100%' : undefined,
        },
        variantStyle[variant],
        pressed && !disabled
          ? reducedMotion
            ? { opacity: 0.85 }
            : { transform: [{ scale: 0.985 }], opacity: 0.92 }
          : null,
        disabled ? { opacity: 0.4 } : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} size="small" />
      ) : (
        <>
          {leadingIcon}
          <Text style={[styles.label, { color: textColor[variant], fontSize: s.fontSize }]}>
            {children}
          </Text>
          {trailingIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
  },
  label: {
    fontWeight: FontWeight.bold,
    fontFamily: fontFamilyForWeight(FontWeight.bold),
    letterSpacing: 0.3,
  },
});

export default Button;
