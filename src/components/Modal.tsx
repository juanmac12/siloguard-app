/**
 * Modal — overlay centrado (confirmaciones, QR ampliado). Anima fade+scale
 * de entrada/salida; backdrop y botón ✕ cierran salvo `preventClose`.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Modal as RNModal, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

type Size = 'sm' | 'md' | 'lg';

const MAX_WIDTH: Record<Size, number> = { sm: 340, md: 420, lg: 520 };

export function Modal({
  open,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  preventClose = false,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode[];
  size?: Size;
  preventClose?: boolean;
}) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: open ? 1 : 0, duration: 180, useNativeDriver: true }).start();
  }, [open, anim]);

  if (!open) return null;

  const close = () => {
    if (!preventClose) onClose();
  };

  return (
    <RNModal visible={open} transparent animationType="none" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Animated.View
          style={[
            styles.backdropFill,
            {
              opacity: anim,
            },
          ]}
        />
      </Pressable>
      <View style={styles.centerWrap} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.card,
            {
              maxWidth: MAX_WIDTH[size],
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderDefault,
              opacity: anim,
              transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }],
            },
          ]}
        >
          {title ? (
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
                {title}
              </Text>
              {!preventClose ? (
                <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
                  <Icon name="x" size={18} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
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
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: FontWeight.semibold,
    fontFamily: fontFamilyForWeight(FontWeight.semibold),
  },
  closeBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
});

export default Modal;
