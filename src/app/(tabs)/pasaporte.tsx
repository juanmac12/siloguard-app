import { useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData, Lote } from "../../contexts/AppDataContext";
import { EmptyState, Icon, Input, ScoreRing, Tabs, TabItem } from "../../components";

const TABS: TabItem[] = [
  { id: "activos", label: "Activos" },
  { id: "certificados", label: "Certificados" },
];

type TabId = "activos" | "certificados";

function LoteCard({ lote, colors, onPress }: { lote: Lote; colors: ThemeColors; onPress: () => void }) {
  const isMon = lote.status === "monitoring";
  return (
    <Pressable style={[cardStyles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]} onPress={onPress}>
      <ScoreRing score={lote.score} size={52} stroke={4} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[cardStyles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>
          {lote.name}
        </Text>
        <Text style={[cardStyles.cardMeta, { color: colors.textSecondary }]} numberOfLines={1}>
          {lote.siloName} · {lote.grain} · {lote.tons} t · {lote.days} días
        </Text>
        <View style={cardStyles.statusRow}>
          <View style={[cardStyles.dot, { backgroundColor: isMon ? colors.actionPrimary : colors.textMuted }]} />
          <Text style={[cardStyles.statusText, { color: isMon ? colors.actionPrimary : colors.textMuted }]}>{isMon ? "En monitoreo" : "Finalizado"}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

export default function PasaporteScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { lotes } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [tab, setTab] = useState<TabId>("activos");
  const [query, setQuery] = useState("");
  const [grainFilter, setGrainFilter] = useState<string>("all");

  const grains = useMemo(() => ["all", ...Array.from(new Set(lotes.map((l) => l.grain)))], [lotes]);

  const statusFilter = tab === "activos" ? "monitoring" : "finalized";
  const filtered = lotes
    .filter((l) => l.status === statusFilter)
    .filter((l) => grainFilter === "all" || l.grain === grainFilter)
    .filter((l) => !query.trim() || l.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.score - a.score);

  const monCount = lotes.filter((l) => l.status === "monitoring").length;
  const finCount = lotes.filter((l) => l.status === "finalized").length;
  const tabsWithCounts: TabItem[] = TABS.map((t) => ({ ...t, count: t.id === "activos" ? monCount : finCount }));

  const emptyTitle = query ? "Sin resultados" : tab === "activos" ? "No hay lotes en monitoreo" : "Aún no hay certificados";
  const emptyBody = query
    ? `Ningún lote coincide con "${query}".`
    : tab === "activos"
      ? "Iniciá un lote desde el detalle de un silo."
      : "Los certificados aparecen acá cuando se finaliza un lote.";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pasaporte de Calidad</Text>
        <Text style={styles.headerSub}>Certificados de calidad por lote</Text>
      </View>

      <View style={styles.searchWrap}>
        <Input placeholder="Buscar lote" value={query} onChangeText={setQuery} leadingIcon={<Icon name="search" size={16} color={colors.textMuted} />} />
      </View>

      <View style={styles.tabsWrap}>
        <Tabs items={tabsWithCounts} activeId={tab} onChange={(id) => setTab(id as TabId)} />
      </View>

      {grains.length > 2 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.chipRow}>
          {grains.map((g) => {
            const active = grainFilter === g;
            return (
              <Pressable
                key={g}
                onPress={() => setGrainFilter(g)}
                style={[styles.chip, { backgroundColor: active ? colors.greenTint : colors.surfaceCard, borderColor: active ? colors.actionPrimary : colors.borderDefault }]}
              >
                <Text style={[styles.chipText, { color: active ? colors.textPrimary : colors.textSecondary, fontWeight: active ? FontWeight.semibold : FontWeight.medium }]}>
                  {g === "all" ? "Todo grano" : g}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <EmptyState variant="empty" size="sm" title={emptyTitle} body={emptyBody} />
        ) : (
          <View style={styles.list}>
            {filtered.map((lote) => (
              <LoteCard key={lote.id} lote={lote} colors={colors} onPress={() => router.push(`/lote/${lote.id}` as any)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: Radius.lg, borderWidth: 1 },
  cardTitle: { fontSize: 15, fontWeight: FontWeight.semibold, marginBottom: 3, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  cardMeta: { fontSize: 12, marginBottom: 7, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: FontWeight.bold, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: fontFamilyForWeight(FontWeight.bold) },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.sm },
    headerTitle: { color: c.textPrimary, fontSize: 26, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: -0.3 },
    headerSub: { color: c.textSecondary, fontSize: 13, marginTop: 4, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    searchWrap: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
    tabsWrap: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
    chipRow: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 6 },
    chip: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: Radius.full, borderWidth: 1, marginRight: 6 },
    chipText: { fontSize: 12.5, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: 40 },
    list: { gap: 8 },
  });
