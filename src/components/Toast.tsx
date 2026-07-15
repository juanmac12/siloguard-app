/**
 * Toast — notificación efímera en contexto (ok / warn / critical / info).
 * `useToast().addToast({ tone, title, message, duration })` la encola.
 * Máx. 3 visibles (FIFO), duración default 4 s (0 = persistente), tap para descartar.
 * `Toast` también se exporta standalone (sin provider) para specs estáticos.
 */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Icon, IconName } from './Icon';

export type ToastTone = 'ok' | 'warn' | 'critical' | 'info';

export type ToastInput = {
  tone?: ToastTone;
  title: string;
  message?: string;
  duration?: number;
};

type ToastItem = ToastInput & { id: number; tone: ToastTone };

type ToastContextValue = {
  addToast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx ?? { addToast: (input: ToastInput) => {} };
}

const DEFAULT_DURATION = 4000;
const MAX_STACK = 3;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      const duration = input.duration ?? DEFAULT_DURATION;
      const item: ToastItem = { ...input, id, tone: input.tone ?? 'ok' };
      setItems((prev) => [...prev.slice(-(MAX_STACK - 1)), item]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.stack} pointerEvents="box-none">
        {items.map((item) => (
          <ToastAnimated key={item.id} item={item} onDismiss={() => dismiss(item.id)} styles={styles} colors={colors} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

const TONE_ICON: Record<ToastTone, IconName> = {
  ok: 'check-circle',
  warn: 'alert-triangle',
  critical: 'alert-triangle',
  info: 'info',
};

function toneColorFor(colors: ThemeColors, tone: ToastTone): string {
  return tone === 'critical' ? colors.statusCritical : tone === 'warn' ? colors.statusWarn : tone === 'info' ? colors.statusInfo : colors.statusOk;
}

/** Presentational — usable standalone (specs, previews) sin ToastProvider. */
export function Toast({
  tone = 'ok',
  title,
  message,
  onDismiss,
}: {
  tone?: ToastTone;
  title: string;
  message?: string;
  onDismiss?: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const color = toneColorFor(colors, tone);

  return (
    <View style={[styles.card, { borderColor: color }]}>
      <Pressable style={styles.cardBody} onPress={onDismiss}>
        <Icon name={TONE_ICON[tone]} size={18} color={color} />
        <View style={styles.textCol}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </Pressable>
    </View>
  );
}

function ToastAnimated({
  item,
  onDismiss,
  styles,
  colors,
}: {
  item: ToastItem;
  onDismiss: () => void;
  styles: ReturnType<typeof makeStyles>;
  colors: ThemeColors;
}) {
  const reducedMotion = useReducedMotion();
  const anim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: reducedMotion ? 0 : 200, useNativeDriver: true }).start();
  }, [anim, reducedMotion]);

  const color = toneColorFor(colors, item.tone);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: color,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
        },
      ]}
    >
      <Pressable style={styles.cardBody} onPress={onDismiss}>
        <Icon name={TONE_ICON[item.tone]} size={18} color={color} />
        <View style={styles.textCol}>
          <Text style={styles.title}>{item.title}</Text>
          {item.message ? <Text style={styles.message}>{item.message}</Text> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    stack: {
      position: 'absolute',
      left: Spacing.md,
      right: Spacing.md,
      bottom: Spacing.xl,
      gap: Spacing.sm,
    },
    card: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderRadius: Radius.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
    cardBody: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
      padding: Spacing.md,
    },
    textCol: {
      flex: 1,
      gap: 2,
    },
    title: {
      color: c.textPrimary,
      fontSize: 13.5,
      fontWeight: FontWeight.semibold,
      fontFamily: fontFamilyForWeight(FontWeight.semibold),
    },
    message: {
      color: c.textSecondary,
      fontSize: 12,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
    },
  });

export default ToastProvider;
