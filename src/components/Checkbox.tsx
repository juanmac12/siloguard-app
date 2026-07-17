/**
 * Checkbox — control cuadrado. Relleno verde + check blanco al marcar;
 * borde hairline si no. `label` acepta string o nodo (para el patrón T&C con link).
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, FontWeight, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      style={[styles.row, disabled ? { opacity: 0.45 } : null]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: checked ? colors.actionPrimary : colors.borderDefault,
            backgroundColor: checked ? colors.actionPrimary : 'transparent',
          },
        ]}
      >
        {checked ? <Icon name="check" size={13} color={colors.actionPrimaryText} strokeWidth={3} /> : null}
      </View>
      {label ? (
        typeof label === 'string' ? (
          <Text style={[styles.label, { color: colors.textPrimary }]}>{label}</Text>
        ) : (
          <View style={styles.labelNode}>{label}</View>
        )
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: Radius.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  label: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: FontWeight.regular,
    fontFamily: fontFamilyForWeight(FontWeight.regular),
  },
  labelNode: {
    flex: 1,
  },
});

export default Checkbox;
