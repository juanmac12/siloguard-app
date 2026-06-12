import { View, Text, StyleSheet } from "react-native";
import { Colors, FontSize } from "../../constants/Theme";

export default function PasaporteScreen() {
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { color: Colors.text, fontSize: FontSize.headingXl, fontWeight: "700" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  emoji: { fontSize: 48, marginBottom: 12 },
  text: { color: Colors.textMuted, fontSize: FontSize.bodyLg },
});
