import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontSize, ThemeColors } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";

export default function PasaporteScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pasaporte</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.emoji}>▤</Text>
        <Text style={styles.text}>Próximamente</Text>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16,
      backgroundColor: c.surface, borderBottomWidth: 1, borderBottomColor: c.border,
    },
    headerTitle: { color: c.text, fontSize: FontSize.headingXl, fontWeight: "700" },
    content: { flex: 1, justifyContent: "center", alignItems: "center" },
    emoji: { fontSize: 48, marginBottom: 12, color: c.textMuted },
    text: { color: c.textMuted, fontSize: FontSize.bodyLg },
  });
