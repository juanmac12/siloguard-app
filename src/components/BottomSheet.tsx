/**
 * BottomSheet — hoja inferior animada (mobile-first). Resolución de alerta,
 * iniciar/finalizar lote, eliminar silo, compartir, etc.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  actions,
  preventClose = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  preventClose?: boolean;
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: open ? 1 : 0, duration: 220, useNativeDriver: true }).start();
  }, [open, anim]);

  if (!open) return null;

  const close = () => {
    if (!preventClose) onClose();
  };

  return (
    <RNModal visible={open} transparent animationType="none" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Animated.View style={[styles.backdropFill, { opacity: anim }]} />
      </Pressable>
      <View style={styles.wrap} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderDefault,
              paddingBottom: Spacing.lg + insets.bottom,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] }) }],
            },
          ]}
        >
          <View style={styles.handle} />
          {title ? (
            <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
              {title}
            </Text>
          ) : null}
          <View style={styles.body}>{children}</View>
          {actions && actions.length ? <View style={styles.actions}>{actions}</View> : null}
        </Animated.View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopWidth: 1,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: FontWeight.semibold,
    fontFamily: fontFamilyForWeight(FontWeight.semibold),
    marginBottom: Spacing.md,
  },
  body: {
    gap: Spacing.md,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
});

export default BottomSheet;
