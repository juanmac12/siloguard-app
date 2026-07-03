/**
 * Input — campo con label arriba, focus ring verde, y estado de error.
 * Mantiene el patrón del DS: label bold tracked, superficie surface-2, borde hairline.
 */
import React, { useMemo, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
};

export function Input({ label, error, leadingIcon, style, onFocus, onBlur, ...rest }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const borderRef = useRef<View>(null);

  const borderColor = error ? colors.statusCritical : colors.borderDefault;

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View ref={borderRef} style={[styles.field, { borderColor }]}>
        {leadingIcon ? <View style={styles.leading}>{leadingIcon}</View> : null}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          onFocus={(e) => {
            borderRef.current?.setNativeProps({ style: { borderColor: colors.green } });
            onFocus?.(e);
          }}
          onBlur={(e) => {
            borderRef.current?.setNativeProps({ style: { borderColor: error ? colors.statusCritical : colors.borderDefault } });
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      gap: 6,
    },
    label: {
      color: c.textMuted,
      fontSize: 12,
      fontWeight: FontWeight.bold,
      letterSpacing: 0.3,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      backgroundColor: c.surfaceInput,
      borderRadius: Radius.md,
      borderWidth: 1,
      paddingHorizontal: 16,
    },
    leading: {
      marginRight: Spacing.sm,
    },
    input: {
      flex: 1,
      color: c.textPrimary,
      fontSize: 16,
      paddingVertical: 12,
    },
    error: {
      color: c.statusCritical,
      fontSize: 12,
      letterSpacing: 0.3,
    },
  });

export default Input;
