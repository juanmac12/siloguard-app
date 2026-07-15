/**
 * Toggle — switch controlado. Track pasa de gris a verde; thumb se desliza.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

type Size = 'sm' | 'md';

const DIMS: Record<Size, { w: number; h: number; thumb: number; pad: number }> = {
  md: { w: 48, h: 28, thumb: 22, pad: 3 },
  sm: { w: 36, h: 20, thumb: 16, pad: 2 },
};

export function Toggle({
  checked,
  onChange,
  size = 'md',
  label,
  labelPosition = 'right',
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  size?: Size;
  label?: string;
  labelPosition?: 'left' | 'right';
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  const d = DIMS[size];
  const anim = useRef(new Animated.Value(checked ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: checked ? 1 : 0, duration: 150, useNativeDriver: false }).start();
  }, [checked, anim]);

  const track = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.surfaceInput, colors.actionPrimary] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, d.w - d.thumb - d.pad * 2] });

  const switchEl = (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={[
        styles.track,
        { width: d.w, height: d.h, borderRadius: d.h / 2, padding: d.pad },
        disabled ? { opacity: 0.4 } : null,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: track, borderRadius: d.h / 2 }]} />
      <Animated.View
        style={[
          styles.thumb,
          {
            width: d.thumb,
            height: d.thumb,
            borderRadius: d.thumb / 2,
            transform: [{ translateX }],
          },
        ]}
      />
    </Pressable>
  );

  if (!label) return switchEl;

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={[styles.row, labelPosition === 'left' ? { flexDirection: 'row-reverse' } : null]}
    >
      {switchEl}
      <Text style={[styles.label, { color: colors.textPrimary }, disabled ? { opacity: 0.4 } : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: FontWeight.medium,
    fontFamily: fontFamilyForWeight(FontWeight.medium),
  },
});

export default Toggle;
