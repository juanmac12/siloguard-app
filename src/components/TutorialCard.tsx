/**
 * TutorialCard — card del walkthrough post-onboarding (spotlight sobre el dashboard).
 * Icono en círculo, título, descripción, AuthStepDots y botón de avance.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Radius, Shadows, ThemeColors } from '../constants/Theme';
import { useTheme } from '../contexts/ThemeContext';
import { Icon, IconName } from './Icon';
import { Button } from './Button';
import { AuthStepDots } from './AuthStepDots';

type Props = {
  icon: IconName;
  title: string;
  desc: string;
  step: number;
  total: number;
  buttonLabel: string;
  onNext: () => void;
};

export function TutorialCard({ icon, title, desc, step, total, buttonLabel, onNext }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={26} color={colors.green} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      <AuthStepDots total={total} active={step} />
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
      paddingTop: 24,
      paddingHorizontal: 20,
      paddingBottom: 20,
      alignItems: 'center',
      gap: 14,
      ...Shadows.lg,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 999,
      backgroundColor: c.greenTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: { fontSize: 19, fontWeight: '700', color: c.textPrimary, textAlign: 'center' },
    desc: { fontSize: 14, lineHeight: 21, color: c.textSecondary, textAlign: 'center' },
  });

export default TutorialCard;
