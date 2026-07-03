/**
 * Pantalla de showcase del Design System.
 * Copiala a app/ds-showcase.tsx y navegá a /ds-showcase en Expo Go
 * para ver todos los componentes aplicados en el móvil.
 */
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Type, FontWeight } from '../constants/Theme';
import {
  Button,
  Input,
  Icon,
  StatusBadge,
  SensorStat,
  AlertCard,
  ListItem,
  NavBar,
  StepDots,
  TabKey,
} from '../components';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.overline}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export default function DsShowcase() {
  const [tab, setTab] = useState<TabKey>('dashboard');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.h1}>SiloGuard DS</Text>
        <Text style={styles.sub}>Design System aplicado · React Native</Text>

        <Section title="BUTTONS">
          <Button onPress={() => {}}>Encender aireación</Button>
          <Button variant="secondary" onPress={() => {}}>Marcar resuelta</Button>
          <Button variant="ghost" onPress={() => {}}>Ver detalle</Button>
          <Button variant="danger" onPress={() => {}}>Eliminar silo</Button>
          <Button disabled onPress={() => {}}>Deshabilitado</Button>
        </Section>

        <Section title="INPUTS">
          <Input label="Nombre del silo" placeholder="Silo Norte" />
          <Input label="Email" placeholder="tu@email.com" keyboardType="email-address" />
          <Input
            label="Capacidad"
            placeholder="380"
            error="Ingresá un número válido"
          />
        </Section>

        <Section title="STATUS BADGES">
          <View style={styles.row}>
            <StatusBadge tone="ok" />
            <StatusBadge tone="warn" />
            <StatusBadge tone="critical" />
          </View>
          <View style={styles.row}>
            <StatusBadge tone="resolved" />
            <StatusBadge tone="info" />
          </View>
        </Section>

        <Section title="SENSOR STATS">
          <View style={styles.row}>
            <SensorStat kind="co2" value={850} tone="ok" />
            <SensorStat kind="temp" value={24} tone="ok" />
            <SensorStat kind="humidity" value={62} tone="warn" />
          </View>
        </Section>

        <Section title="ALERT CARDS">
          <AlertCard
            variant="critical"
            title="Fermentación detectada"
            silo="Silobolsa A3 · zona inferior"
            time="hace 12 min"
            description="El CO₂ subió 38% en 6 horas."
          />
          <AlertCard
            variant="warning"
            title="Calentamiento leve"
            silo="Silo Sur · zona central"
            time="hace 2 h"
            description="Temperatura subiendo: +3°C en 12 hs."
          />
          <AlertCard
            variant="resolved"
            title="Calentamiento controlado"
            silo="Silo Norte"
            time="ayer"
            description="Aireación encendida 4 h · valores normalizados"
          />
        </Section>

        <Section title="LIST ITEMS">
          <ListItem state="default" title="Silo Sur" subtitle="Maíz · 210 tn · hace 5 min" score={67} tone="warn" />
          <ListItem state="selected" title="Silo Norte" subtitle="Soja · 380 tn · hace 2 min" score={94} tone="ok" />
          <ListItem state="resolved" title="Silo Oeste" subtitle="Temporada cerrada" score="—" />
        </Section>

        <Section title="STEP DOTS">
          <StepDots total={5} active={1} />
        </Section>

        <Section title="ICONS">
          <View style={styles.iconGrid}>
            {(['home', 'bell', 'clipboard', 'user', 'alert-triangle', 'check-circle',
               'scan-qr', 'wifi', 'thermometer', 'droplet', 'wind', 'clock'] as const).map((n) => (
              <View key={n} style={styles.iconCell}>
                <Icon name={n} size={24} color={Colors.textPrimary} />
              </View>
            ))}
          </View>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>

      <NavBar active={tab} onChange={setTab} badges={{ alertas: 3 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  h1: {
    ...Type.h1,
    color: Colors.textPrimary,
  },
  sub: {
    ...Type.body,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  overline: {
    ...Type.overline,
    color: Colors.textMuted,
  },
  sectionBody: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  iconCell: {
    width: 44,
    height: 44,
    backgroundColor: Colors.surfaceCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
