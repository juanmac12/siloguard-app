import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, FontSize, ThemeColors, Radius } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData, Lote } from "../../contexts/AppDataContext";
import { Icon, Input, ScoreRing } from "../../components";

const TABS = [
  { id: "activos", label: "Activos" },
  { id: "certificados", label: "Certificados" },
] as const;

type TabId = typeof TABS[number]["id"];

function LoteCard({ lote, colors, onPress }: { lote: Lote; colors: ThemeColors; onPress: () => void }) {
  const isMon = lote.status === "monitoring";
  return (
    <TouchableOpacity
      style={[cardStyles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <ScoreRing score={lote.score} size={52} stroke={4} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[cardStyles.cardTitle, { color: colors.textPrimary }]} numberOfLines={1}>{lote.name}</Text>
        <Text style={[cardStyles.cardMeta, { color: colors.textSecondary }]} numberOfLines={1}>
          {lote.siloName} · {lote.grain} · {lote.tons} t · {lote.days} días
        </Text>
        <View style={cardStyles.statusRow}>
          <View style={[cardStyles.dot, { backgroundColor: isMon ? colors.actionPrimary : colors.textMuted }]} />
          <Text style={[cardStyles.statusText, { color: isMon ? colors.actionPrimary : colors.textMuted }]}>
            {isMon ? "En monitoreo" : "Finalizado"}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={20} color={colors.textMuted} />
    </TouchableOpacity>
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

  const allLotes = lotes;
  const grains = useMemo(() => ["all", ...Array.from(new Set(allLotes.map((l) => l.grain)))], [allLotes]);

  const statusFilter = tab === "activos" ? "monitoring" : "finalized";
  const filtered = allLotes
    .filter((l) => l.status === statusFilter)
    .filter((l) => grainFilter === "all" || l.grain === grainFilter)
    .filter((l) => !query.trim() || l.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.score - a.score);

  const monCount = allLotes.filter((l) => l.status === "monitoring").length;
  const finCount = allLotes.filter((l) => l.status === "finalized").length;
  const counts: Record<TabId, number> = { activos: monCount, certificados: finCount };

  const emptyTitle = query
    ? "Sin resultados"
    : tab === "activos"
    ? "No hay lotes en monitoreo"
    : "Aún no hay certificados";
  const emptySub = query
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
        <Input
          placeholder="Buscar lote"
          value={query}
          onChangeText={setQuery}
          leadingIcon={<Icon name="search" size={16} color={colors.textMuted} />}
        />
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContent}>
          {TABS.map((t) => {
            const isActive = tab === t.id;
            const count = counts[t.id];
            return (
              <TouchableOpacity key={t.id} style={styles.tab} onPress={() => setTab(t.id)}>
                <View style={styles.tabInner}>
                  <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{t.label}</Text>
                  {count > 0 && (
                    <View style={[styles.badge, { backgroundColor: isActive ? colors.actionPrimary : colors.surfaceCard, borderColor: isActive ? colors.actionPrimary : colors.borderDefault }]}>
                      <Text style={[styles.badgeText, { color: isActive ? colors.actionPrimaryText : colors.textSecondary }]}>
                        {count}
                      </Text>
                    </View>
                  )}
                </View>
                {isActive && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={[styles.tabBorder, { backgroundColor: colors.borderDefault }]} />
      </View>

      {grains.length > 2 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.chipRow}>
          {grains.map((g) => {
            const active = grainFilter === g;
            return (
              <TouchableOpacity
                key={g}
                onPress={() => setGrainFilter(g)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? colors.greenTint : colors.surfaceCard, borderColor: active ? colors.actionPrimary : colors.borderDefault },
                ]}
              >
                <Text style={[styles.chipText, { color: active ? colors.textPrimary : colors.textSecondary, fontWeight: active ? "600" : "500" }]}>
                  {g === "all" ? "Todo grano" : g}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Icon name="clipboard" size={28} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>{emptyTitle}</Text>
            <Text style={styles.emptySubtitle}>{emptySub}</Text>
          </View>
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
  cardTitle: { fontSize: 15, fontWeight: "600", marginBottom: 3 },
  cardMeta: { fontSize: 12, marginBottom: 7 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: Spacing.md, paddingTop: 56, paddingBottom: Spacing.sm, backgroundColor: c.bg },
    headerTitle: { color: c.textPrimary, fontSize: 26, fontWeight: "700", letterSpacing: -0.3 },
    headerSub: { color: c.textSecondary, fontSize: 13, marginTop: 4 },

    searchWrap: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },

    tabScroll: { flexGrow: 0 },
    tabBorder: { height: 1 },
    tabContent: { paddingHorizontal: Spacing.md, flexDirection: "row" },
    tab: { marginRight: 20, paddingBottom: 10, paddingTop: 4, position: "relative" },
    tabInner: { flexDirection: "row", alignItems: "center", gap: 6 },
    tabText: { color: c.textSecondary, fontSize: FontSize.bodyMd, fontWeight: "500" },
    tabTextActive: { color: c.actionPrimary, fontWeight: "700" },
    tabIndicator: { position: "absolute", bottom: 0, left: 0, right: 0, height: 2, backgroundColor: c.actionPrimary, borderRadius: 2 },
    badge: { minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 5, borderWidth: 1, alignItems: "center", justifyContent: "center" },
    badgeText: { fontSize: 11, fontWeight: "700", lineHeight: 14 },

    chipRow: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: 6 },
    chip: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: Radius.full, borderWidth: 1, marginRight: 6 },
    chipText: { fontSize: 12.5 },

    scroll: { paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, paddingBottom: 40 },
    list: { gap: 8 },

    emptyContainer: { alignItems: "center", paddingTop: 64 },
    emptyIcon: {
      width: 72, height: 72, borderRadius: 36,
      backgroundColor: c.surfaceInput, borderWidth: 1.5, borderColor: c.borderDefault,
      alignItems: "center", justifyContent: "center", marginBottom: Spacing.md,
    },
    emptyTitle: { color: c.textPrimary, fontSize: 20, fontWeight: "700", marginBottom: Spacing.sm },
    emptySubtitle: { color: c.textSecondary, fontSize: FontSize.bodyMd, textAlign: "center", lineHeight: 22 },
  });
