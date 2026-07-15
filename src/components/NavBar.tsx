/**
 * NavBar — barra de tabs inferior (Dashboard / Alertas / Pasaporte / Perfil).
 * El tab activo va en verde. Alertas puede mostrar un badge con conteo.
 */
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Spacing, FontWeight, fontFamilyForWeight } from '../constants/Theme';
import { Icon, IconName } from './Icon';

export type TabKey = 'dashboard' | 'alertas' | 'pasaporte' | 'perfil';

const TABS: { key: TabKey; icon: IconName; label: string }[] = [
  { key: 'dashboard', icon: 'home', label: 'Dashboard' },
  { key: 'alertas', icon: 'bell', label: 'Alertas' },
  { key: 'pasaporte', icon: 'clipboard', label: 'Pasaporte' },
  { key: 'perfil', icon: 'user', label: 'Perfil' },
];

export function NavBar({
  active,
  onChange,
  badges = {},
}: {
  active: TabKey;
  onChange?: (key: TabKey) => void;
  badges?: Partial<Record<TabKey, number>>;
}) {
  return (
    <View style={styles.bar}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const color = isActive ? Colors.green : Colors.textMuted;
        const count = badges[tab.key];
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange?.(tab.key)}
            style={styles.tab}
          >
            <View>
              <Icon name={tab.icon} size={24} color={color} />
              {count ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, { color }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * StepDots — indicador de progreso del onboarding.
 * El dot activo se estira; los pasados quedan verdes.
 */
export function StepDots({
  total,
  active,
}: {
  total: number;
  active: number;
}) {
  return (
    <View style={dotStyles.wrap}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active;
        const isPast = i <= active;
        return (
          <View
            key={i}
            style={[
              dotStyles.dot,
              {
                width: isActive ? 20 : 4,
                backgroundColor: isPast ? Colors.green : Colors.border,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: FontWeight.medium,
    fontFamily: fontFamilyForWeight(FontWeight.medium),
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.statusCritical,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FontWeight.bold,
    fontFamily: fontFamilyForWeight(FontWeight.bold),
  },
});

const dotStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
});

export default NavBar;
