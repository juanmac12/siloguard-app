import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Spacing, FontSize, ThemeColors, Radius, FontWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { Icon } from "../../components";
import type { IconName } from "../../components";

interface NSettings {
  warning: boolean;
  weeklySummary: boolean;
  nightSilence: boolean;
  nightStart: string;
  nightEnd: string;
}

const INIT: NSettings = {
  warning: true,
  weeklySummary: true,
  nightSilence: false,
  nightStart: "22:00",
  nightEnd: "07:00",
};

function NRow({
  icon,
  label,
  desc,
  checked,
  onChange,
  last = false,
  disabled = false,
  colors,
}: {
  icon: IconName;
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
  disabled?: boolean;
  colors: ThemeColors;
}) {
  return (
    <View
      style={[
        styles.nrow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
        disabled && { opacity: 0.5 },
      ]}
    >
      <Icon name={icon} size={20} color={colors.textSecondary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.nrowLabel, { color: colors.textPrimary }]}>{label}</Text>
        {desc ? (
          <Text style={[styles.nrowDesc, { color: colors.textSecondary }]}>{desc}</Text>
        ) : null}
      </View>
      <Switch
        value={checked}
        onValueChange={disabled ? undefined : onChange}
        disabled={disabled}
        trackColor={{ false: colors.borderDefault, true: colors.actionPrimary }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

function SCard({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ThemeColors;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export default function NotificacionesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [settings, setSettings] = useState<NSettings>(INIT);

  const set = (k: keyof NSettings, v: boolean) =>
    setSettings((prev) => ({ ...prev, [k]: v }));

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Notificaciones
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <SCard label="ALERTAS" colors={colors}>
          <NRow
            icon="alert-triangle"
            label="Alertas críticas"
            desc="Siempre activas — Requerido"
            checked={true}
            onChange={() => {}}
            disabled={true}
            colors={colors}
          />
          <NRow
            icon="trending-up"
            label="Advertencias"
            desc="Lecturas por encima del umbral"
            checked={settings.warning}
            onChange={(v) => set("warning", v)}
            last
            colors={colors}
          />
        </SCard>

        <SCard label="RESUMEN SEMANAL" colors={colors}>
          <NRow
            icon="clock"
            label="Recibir resumen semanal"
            desc="Todos los lunes a las 8:00 AM"
            checked={settings.weeklySummary}
            onChange={(v) => set("weeklySummary", v)}
            last
            colors={colors}
          />
        </SCard>

        <SCard label="SILENCIO NOCTURNO" colors={colors}>
          <NRow
            icon="moon"
            label="Silenciar de noche"
            desc="Las alertas críticas se envían siempre, incluso en horario de silencio."
            checked={settings.nightSilence}
            onChange={(v) => set("nightSilence", v)}
            colors={colors}
          />
          {settings.nightSilence && (
            <View
              style={[
                styles.timeRow,
                { borderTopColor: colors.borderDefault },
              ]}
            >
              <Icon name="clock" size={18} color={colors.textSecondary} />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>De</Text>
              <View
                style={[
                  styles.timePill,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: colors.borderDefault,
                  },
                ]}
              >
                <Text style={[styles.timePillText, { color: colors.textPrimary }]}>
                  {settings.nightStart}
                </Text>
              </View>
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>a</Text>
              <View
                style={[
                  styles.timePill,
                  {
                    backgroundColor: colors.surfaceInput,
                    borderColor: colors.borderDefault,
                  },
                ]}
              >
                <Text style={[styles.timePillText, { color: colors.textPrimary }]}>
                  {settings.nightEnd}
                </Text>
              </View>
            </View>
          )}
          <View
            style={[
              styles.permRow,
              { borderTopColor: colors.borderDefault },
            ]}
          >
            <Icon name="smartphone" size={18} color={colors.textSecondary} />
            <Text style={[styles.permText, { color: colors.textSecondary }]}>
              Permisos de notificaciones:{" "}
              <Text style={{ color: colors.statusOk, fontWeight: "700" }}>Activados</Text>
            </Text>
          </View>
        </SCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 56,
    paddingBottom: 10,
    paddingRight: Spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: FontSize.bodyLg,
    fontWeight: "600",
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: 14,
    overflow: "hidden",
    marginBottom: 14,
  },
  nrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  nrowLabel: {
    fontSize: FontSize.bodyMd + 1,
    fontWeight: FontWeight.medium as any,
  },
  nrowDesc: {
    fontSize: FontSize.bodySm,
    marginTop: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  timeText: {
    fontSize: FontSize.bodySm,
  },
  timePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  timePillText: {
    fontSize: FontSize.bodyMd,
    fontWeight: "600",
  },
  permRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  permText: {
    fontSize: FontSize.bodySm,
    flex: 1,
  },
});
