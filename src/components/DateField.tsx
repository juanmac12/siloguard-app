/**
 * DateField — campo de fecha con picker nativo (Fecha de acopio).
 * Muestra el valor formateado "dd mmm aaaa" y abre el date picker del
 * sistema al tocar. Reemplaza el input de texto libre que tenía Expo
 * frente al date picker del prototipo de referencia.
 */
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatDateEs(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

/** Parsea "dd mmm aaaa" (español) a Date; si no matchea, devuelve hoy. */
export function parseDateEs(s: string): Date {
  const m = s.trim().match(/^(\d{1,2})\s+([a-zA-Zé]{3,})\s+(\d{4})$/);
  if (m) {
    const day = Number(m[1]);
    const mesIdx = MESES.indexOf(m[2].toLowerCase().slice(0, 3));
    const year = Number(m[3]);
    if (mesIdx >= 0) return new Date(year, mesIdx, day);
  }
  return new Date();
}

export function DateField({
  label,
  value,
  onChange,
  error,
  maximumDate,
}: {
  label?: string;
  value: string;
  onChange: (formatted: string) => void;
  error?: string;
  maximumDate?: Date;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [open, setOpen] = useState(false);

  const dateValue = value ? parseDateEs(value) : new Date();

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setOpen(false);
    if (event.type === 'dismissed' || !selected) return;
    onChange(formatDateEs(selected));
  };

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: error ? colors.statusCritical : colors.textMuted }]}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={[styles.field, { backgroundColor: colors.surfaceInput, borderColor: error ? colors.statusCritical : colors.borderDefault }]}
      >
        <Icon name="clock" size={16} color={colors.textMuted} />
        <Text style={[styles.value, { color: value ? colors.textPrimary : colors.textMuted }]}>
          {value || 'Seleccioná una fecha'}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {open ? (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={maximumDate}
          onChange={onPickerChange}
        />
      ) : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { gap: 6 },
    label: {
      fontSize: 11,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      borderWidth: 1,
      borderRadius: Radius.md,
      paddingHorizontal: 12,
      paddingVertical: 12,
    },
    value: {
      fontSize: 15,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
    error: {
      fontSize: 12,
      marginTop: -1,
      fontWeight: FontWeight.medium,
      fontFamily: fontFamilyForWeight(FontWeight.medium),
      color: c.statusCritical,
    },
  });

export default DateField;
