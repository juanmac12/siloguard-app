import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { Icon, Toggle } from "../../components";
import type { IconName } from "../../components";

function NRow({ icon, label, desc, checked, onChange, last = false, disabled = false, colors }: {
  icon: IconName; label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void;
  last?: boolean; disabled?: boolean; colors: ThemeColors;
}) {
  return (
    <View style={[styles.nrow, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault }]}>
      <Icon name={icon} size={20} color={colors.textSecondary} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.nrowLabel, { color: colors.textPrimary }]}>{label}</Text>
        {desc ? <Text style={[styles.nrowDesc, { color: colors.textMuted }]}>{desc}</Text> : null}
      </View>
      <Toggle checked={checked} onChange={onChange} size="sm" disabled={disabled} />
    </View>
  );
}

function SCard({ label, children, colors }: { label: string; children: React.ReactNode; colors: ThemeColors }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>{children}</View>
    </View>
  );
}

export default function NotificacionesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { notificationSettings, updateNotificationSettings } = useAppData();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Notificaciones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SCard label="ALERTAS" colors={colors}>
          <NRow icon="alert-triangle" label="Alertas críticas" desc="Siempre activas — Requerido" checked disabled onChange={() => {}} colors={colors} />
          <NRow
            icon="trending-up"
            label="Advertencias"
            desc="Lecturas por encima del umbral"
            checked={notificationSettings.warning}
            onChange={(v) => updateNotificationSettings({ warning: v })}
            last
            colors={colors}
          />
        </SCard>

        <SCard label="RESUMEN SEMANAL" colors={colors}>
          <NRow
            icon="clock"
            label="Recibir resumen semanal"
            desc="Todos los lunes a las 8:00 AM"
            checked={notificationSettings.weeklySummary}
            onChange={(v) => updateNotificationSettings({ weeklySummary: v })}
            last
            colors={colors}
          />
        </SCard>

        <SCard label="SILENCIO NOCTURNO" colors={colors}>
          <NRow
            icon="moon"
            label="Silenciar de noche"
            desc="Las alertas críticas se envían siempre."
            checked={notificationSettings.nightSilence}
            onChange={(v) => updateNotificationSettings({ nightSilence: v })}
            colors={colors}
          />
          {notificationSettings.nightSilence && (
            <View style={[styles.timeRow, { borderTopColor: colors.borderDefault }]}>
              <Icon name="clock" size={18} color={colors.textSecondary} />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>De</Text>
              <View style={[styles.timePill, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}>
                <Text style={[styles.timePillText, { color: colors.textPrimary }]}>{notificationSettings.nightStart}</Text>
              </View>
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>a</Text>
              <View style={[styles.timePill, { backgroundColor: colors.surfaceInput, borderColor: colors.borderDefault }]}>
                <Text style={[styles.timePillText, { color: colors.textPrimary }]}>{notificationSettings.nightEnd}</Text>
              </View>
            </View>
          )}
          <View style={[styles.permRow, { borderTopColor: colors.borderDefault }]}>
            <Icon name="smartphone" size={18} color={colors.textSecondary} />
            <Text style={[styles.permText, { color: colors.textMuted }]}>
              Permisos de notificaciones: <Text style={{ color: colors.statusOk, fontWeight: FontWeight.bold }}>Activados</Text>
            </Text>
          </View>
        </SCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 56, paddingBottom: 10, paddingRight: Spacing.md, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  content: { padding: Spacing.md, paddingBottom: Spacing.xl },
  cardLabel: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8, marginLeft: 2 },
  card: { borderRadius: Radius.lg, borderWidth: 1, paddingHorizontal: 14, overflow: "hidden", marginBottom: 14 },
  nrow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  nrowLabel: { fontSize: 15, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },
  nrowDesc: { fontSize: 12, marginTop: 2, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, borderTopWidth: 1 },
  timeText: { fontSize: 13, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  timePill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.md, borderWidth: 1 },
  timePillText: { fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  permRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, borderTopWidth: 1 },
  permText: { fontSize: 12, flex: 1, fontFamily: fontFamilyForWeight(FontWeight.regular) },
});
