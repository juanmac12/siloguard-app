import { useMemo } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ThemeColors, Radius, Spacing } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { AuthHeader, Icon, EmptyState } from "../../components";

export default function UmbralesSiloPickerScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <AuthHeader title="Umbrales de alerta" showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sub}>Elegí el silo cuyos umbrales querés configurar.</Text>

        {silos.length === 0 ? (
          <EmptyState icon="target" title="No tenés silos todavía" subtitle="Agregá un silo para poder configurar sus umbrales." />
        ) : (
          <View style={{ gap: 8 }}>
            {silos.map((s) => {
              const toneColor =
                s.status === "critical" ? colors.statusCritical : s.status === "warn" ? colors.statusWarn : colors.statusOk;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => router.push(`/umbrales/${s.id}` as any)}
                  style={[styles.row, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}
                >
                  <View style={[styles.dot, { backgroundColor: toneColor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{s.name}</Text>
                    <Text style={[styles.rowMeta, { color: colors.textSecondary }]}>{s.grain} · {s.tons} t</Text>
                  </View>
                  <Icon name="chevron-right" size={18} color={colors.textSecondary} />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: Spacing.md, paddingBottom: 40 },
    sub: { color: c.textSecondary, fontSize: 13, marginBottom: Spacing.md, lineHeight: 19 },
    row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: Radius.lg, borderWidth: 1 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    rowTitle: { fontSize: 15, fontWeight: "600" },
    rowMeta: { fontSize: 12, marginTop: 2 },
  });
