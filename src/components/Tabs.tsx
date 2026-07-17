/**
 * Tabs — barra de navegación. `underline` para secciones primarias
 * (Silo detail, Alertas, Historial, Pasaporte); `pill` para filtros secundarios.
 */
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';

export type TabItem = { id: string; label: string; count?: number };

type Variant = 'underline' | 'pill';

export function Tabs({
  items,
  activeId,
  onChange,
  variant = 'underline',
  fullWidth = false,
  style,
}: {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: Variant;
  fullWidth?: boolean;
  style?: ViewStyle;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const content = items.map((item) => {
    const active = item.id === activeId;
    if (variant === 'pill') {
      return (
        <Pressable
          key={item.id}
          onPress={() => onChange(item.id)}
          style={({ pressed }) => [
            styles.pill,
            active ? styles.pillActive : null,
            fullWidth ? { flex: 1 } : null,
            pressed ? { opacity: 0.85 } : null,
          ]}
        >
          <Text style={[styles.pillLabel, active ? styles.pillLabelActive : null]} numberOfLines={1}>
            {item.label}
          </Text>
        </Pressable>
      );
    }
    return (
      <Pressable
        key={item.id}
        onPress={() => onChange(item.id)}
        style={({ pressed }) => [styles.underlineTab, fullWidth ? { flex: 1 } : null, pressed ? { opacity: 0.85 } : null]}
      >
        <View style={styles.underlineLabelRow}>
          <Text style={[styles.underlineLabel, active ? styles.underlineLabelActive : null]} numberOfLines={1}>
            {item.label}
          </Text>
          {item.count !== undefined ? (
            <View style={[styles.badge, active ? styles.badgeActive : null]}>
              <Text style={[styles.badgeText, active ? styles.badgeTextActive : null]}>{item.count}</Text>
            </View>
          ) : null}
        </View>
        <View style={[styles.underlineBar, active ? { backgroundColor: colors.actionPrimary } : null]} />
      </Pressable>
    );
  });

  if (fullWidth) {
    return <View style={[variant === 'pill' ? styles.pillRow : styles.underlineRow, style]}>{content}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={style}
      contentContainerStyle={variant === 'pill' ? styles.pillRow : styles.underlineRow}
    >
      {content}
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    underlineRow: {
      flexDirection: 'row',
      gap: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: c.borderDefault,
    },
    underlineTab: {
      alignItems: 'center',
      paddingBottom: 0,
    },
    underlineLabelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 10,
      paddingHorizontal: 2,
    },
    underlineLabel: {
      fontSize: 14,
      color: c.textSecondary,
      fontWeight: FontWeight.medium,
      fontFamily: fontFamilyForWeight(FontWeight.medium),
    },
    underlineLabelActive: {
      color: c.textPrimary,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
    },
    underlineBar: {
      height: 2,
      borderRadius: 2,
      backgroundColor: 'transparent',
      width: '100%',
    },
    badge: {
      minWidth: 18,
      height: 18,
      borderRadius: Radius.full,
      backgroundColor: c.surfaceInput,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    badgeActive: {
      backgroundColor: c.greenTint,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      color: c.textMuted,
    },
    badgeTextActive: {
      color: c.actionPrimary,
    },
    pillRow: {
      flexDirection: 'row',
      gap: Spacing.xs,
    },
    pill: {
      paddingHorizontal: 13,
      paddingVertical: 8,
      borderRadius: Radius.full,
      backgroundColor: c.surfaceCard,
      borderWidth: 1,
      borderColor: c.borderDefault,
      alignItems: 'center',
    },
    pillActive: {
      backgroundColor: c.greenTint,
      borderColor: c.actionPrimary,
    },
    pillLabel: {
      fontSize: 12.5,
      color: c.textSecondary,
      fontWeight: FontWeight.medium,
      fontFamily: fontFamilyForWeight(FontWeight.medium),
    },
    pillLabelActive: {
      color: c.textPrimary,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
    },
  });

export default Tabs;
