/**
 * TutorialCard — tarjeta flotante del overlay de tutorial (spotlight sobre
 * el mini-dashboard): icono, título, descripción, dots de paso y CTA.
 */
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Radius, Spacing, FontWeight, ThemeColors, fontFamilyForWeight, Shadows } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon, IconName } from './Icon';
import { StepDots } from './NavBar';
import { Button } from './Button';

export function TutorialCard({
  icon,
  title,
  desc,
  step,
  total,
  buttonLabel = 'Siguiente',
  onNext,
}: {
  icon: IconName;
  title: string;
  desc: string;
  step: number;
  total: number;
  buttonLabel?: string;
  onNext: () => void;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={26} color={colors.actionPrimary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <StepDots total={total} active={step} />
      <Button variant="primary" fullWidth onPress={onNext}>
        {buttonLabel}
      </Button>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surfaceCard,
      borderWidth: 1,
      borderColor: c.borderDefault,
      borderRadius: Radius.lg,
      padding: Spacing.lg,
      paddingTop: 24,
      alignItems: 'center',
      gap: Spacing.md,
      ...Shadows.lg,
    },
    iconBox: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.greenTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 19,
      fontWeight: FontWeight.bold,
      fontFamily: fontFamilyForWeight(FontWeight.bold),
      color: c.textPrimary,
      textAlign: 'center',
    },
    desc: {
      fontSize: 14,
      lineHeight: 21,
      color: c.textSecondary,
      fontFamily: fontFamilyForWeight(FontWeight.regular),
      textAlign: 'center',
    },
  });

export default TutorialCard;
