import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { useToast } from "../../components/Toast";
import { Icon, Input, Button } from "../../components";

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const { colors } = useTheme();
  const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.greenTint,
          borderWidth: 2,
          borderColor: colors.actionPrimary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: size * 0.35, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: colors.actionPrimary, letterSpacing: -0.5 }}>
          {initials}
        </Text>
      </View>
      <View style={[styles.cameraBadge, { backgroundColor: colors.actionPrimary, borderColor: colors.bg }]}>
        <Icon name="camera" size={12} color="#000" />
      </View>
    </View>
  );
}

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, updateProfile } = useAppData();
  const toast = useToast();
  const styles2 = makeStyles(colors);

  const [f, setF] = useState({
    name: profile.name,
    phone: profile.phone,
    farmName: profile.farmName,
    farmLoc: profile.farmLoc,
    farmHa: String(profile.farmHa),
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof f) => (v: string) => setF((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({
        name: f.name.trim() || profile.name,
        phone: f.phone.trim() || undefined,
        farmName: f.farmName.trim() || profile.farmName,
        farmLoc: f.farmLoc.trim() || undefined,
        farmHa: Number(f.farmHa) || profile.farmHa,
      });
      toast.addToast({ tone: "ok", title: "Perfil actualizado" });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles2.container, { backgroundColor: colors.bg }]}>
      <View style={[styles2.header, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} style={styles2.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <Text style={[styles2.headerTitle, { color: colors.textPrimary }]}>Editar perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles2.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles2.avatarRow}>
          <Avatar name={f.name} size={80} />
        </View>

        <Text style={[styles2.sectionLabel, { color: colors.textSecondary }]}>DATOS PERSONALES</Text>
        <Input label="Nombre completo" value={f.name} onChangeText={set("name")} autoCapitalize="words" />
        <Input label="Email" value={profile.email} editable={false} />
        <Input label="Teléfono" value={f.phone} onChangeText={set("phone")} keyboardType="phone-pad" />

        <View style={{ height: 4 }} />

        <Text style={[styles2.sectionLabel, { color: colors.textSecondary }]}>MI CAMPO</Text>
        <Input label="Nombre del campo" value={f.farmName} onChangeText={set("farmName")} autoCapitalize="words" />
        <Input label="Ubicación" value={f.farmLoc} onChangeText={set("farmLoc")} autoCapitalize="words" />
        <Input label="Hectáreas" value={f.farmHa} onChangeText={set("farmHa")} keyboardType="numeric" />
      </ScrollView>

      <View style={[styles2.footer, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg }]}>
        <Button variant="primary" fullWidth loading={saving} onPress={save}>
          Guardar cambios
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 56, paddingBottom: 10, paddingRight: Spacing.md, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
    content: { padding: Spacing.md, gap: 16, paddingBottom: Spacing.xl },
    avatarRow: { alignItems: "center", paddingTop: 4, paddingBottom: 8 },
    sectionLabel: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: 0.6, textTransform: "uppercase", marginTop: 4, marginBottom: -4 },
    footer: { padding: Spacing.md, borderTopWidth: 1 },
  });
