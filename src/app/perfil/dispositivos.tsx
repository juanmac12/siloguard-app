import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, FontSize, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { formatRelativeTime } from "../../utils/relativeTime";
import { Icon } from "../../components";
import type { Device } from "../../mock/seed";

function batteryColor(pct: number, colors: ThemeColors): string {
  if (pct > 50) return colors.statusOk;
  if (pct > 20) return colors.statusWarn;
  return colors.statusCritical;
}

function DeviceCard({
  device,
  siloName,
  last,
  colors,
}: {
  device: Device;
  siloName: string;
  last: boolean;
  colors: ThemeColors;
}) {
  const online = device.status === "online";
  const bc = batteryColor(device.battery, colors);

  return (
    <View style={[styles.dcard, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderDefault }]}>
      <View style={[styles.deviceIcon, { backgroundColor: online ? "rgba(34,197,94,0.12)" : colors.surfaceInput }]}>
        <Icon name="wifi" size={20} color={online ? colors.actionPrimary : colors.textSecondary} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={styles.deviceNameRow}>
          <Text style={[styles.deviceName, { color: colors.textPrimary }]}>{device.name}</Text>
          <View style={[styles.statusDot, { backgroundColor: online ? colors.statusOk : colors.textSecondary }]} />
        </View>
        <Text style={[styles.deviceMeta, { color: colors.textSecondary }]}>{siloName} · {formatRelativeTime(device.lastSync)}</Text>
      </View>

      <View style={styles.batteryCol}>
        <Text style={[styles.batteryPct, { color: bc }]}>{device.battery}%</Text>
        <Text style={[styles.batteryLabel, { color: colors.textSecondary }]}>Batería</Text>
      </View>
    </View>
  );
}

export default function DispositivosScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { devices, silos } = useAppData();

  const siloNameFor = (siloId: number | null) => silos.find((s) => s.id === siloId)?.name ?? "Sin asignar";
  const onlineCount = devices.filter((d) => d.status === "online").length;
  const offlineCount = devices.length - onlineCount;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Mis dispositivos</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }]}>
            <Text style={[styles.summaryValue, { color: colors.actionPrimary }]}>{onlineCount}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Online</Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>{offlineCount}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Offline</Text>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DISPOSITIVOS</Text>
        <View style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
          {devices.map((d, i) => (
            <DeviceCard key={d.id} device={d} siloName={siloNameFor(d.siloId)} last={i === devices.length - 1} colors={colors} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}
          activeOpacity={0.7}
          onPress={() => router.push("/vincular-lanza" as any)}
        >
          <Icon name="plus-circle" size={18} color={colors.actionPrimary} />
          <Text style={[styles.addBtnText, { color: colors.actionPrimary }]}>Vincular nueva lanza</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 56, paddingBottom: 10, paddingRight: Spacing.md, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: FontSize.bodyLg, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  content: { padding: Spacing.md, gap: 14, paddingBottom: Spacing.xl },
  summaryRow: { flexDirection: "row", gap: 8 },
  summaryChip: { flex: 1, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 10, paddingHorizontal: 12, alignItems: "center" },
  summaryValue: { fontSize: 22, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold) },
  summaryLabel: { fontSize: 10, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold), letterSpacing: 0.5, textTransform: "uppercase", marginTop: 4 },
  sectionLabel: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: 0.6, textTransform: "uppercase", marginBottom: -6 },
  card: { borderRadius: Radius.lg, borderWidth: 1, paddingHorizontal: 14, overflow: "hidden" },
  dcard: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  deviceIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  deviceNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  deviceName: { fontSize: FontSize.bodyMd + 1, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  deviceMeta: { fontSize: FontSize.bodySm, marginTop: 2, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  batteryCol: { alignItems: "flex-end", gap: 2 },
  batteryPct: { fontSize: FontSize.bodySm + 1, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold) },
  batteryLabel: { fontSize: 10, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 48, borderRadius: Radius.md, borderWidth: 1 },
  addBtnText: { fontSize: FontSize.bodyMd, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
});
