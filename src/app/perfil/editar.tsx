import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Spacing, FontSize, ThemeColors, Radius, FontWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { ApiError } from "../../config/api";
import { Icon } from "../../components";

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <View style={{ position: "relative", width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "rgba(34,197,94,0.12)",
          borderWidth: 2,
          borderColor: "#22C55E",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: size * 0.35, fontWeight: "700", color: "#22C55E" }}>
          {initials}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: "#22C55E",
          borderWidth: 2,
          borderColor: "#0A0A0A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="camera" size={13} color="#000" />
      </View>
    </View>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "default",
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "default" | "email-address" | "phone-pad" | "numeric";
  colors: ThemeColors;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={type}
        autoCapitalize={type === "default" ? "words" : "none"}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceInput,
            borderColor: colors.borderDefault,
            color: colors.textPrimary,
          },
        ]}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );
}

export default function EditarPerfilScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, updateProfile } = useAppData();

  const [f, setF] = useState({
    name:     profile.name,
    email:    profile.email,
    phone:    profile.phone,
    farmName: profile.farmName,
    farmLoc:  profile.farmLoc,
    farmHa:   String(profile.farmHa),
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof f, v: string) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      // El email no se puede editar desde acá: la cuenta se identifica por el email
      // con el que te registraste en el backend.
      await updateProfile({
        name:     f.name.trim() || profile.name,
        phone:    f.phone.trim() || undefined,
        farmName: f.farmName.trim() || profile.farmName,
        farmLoc:  f.farmLoc.trim() || undefined,
        farmHa:   Number(f.farmHa) || profile.farmHa,
      });
      setSaved(true);
      setTimeout(() => router.back(), 600);
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "No se pudieron guardar los cambios.";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Editar perfil</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarRow}>
          <Avatar name={f.name} size={80} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          DATOS PERSONALES
        </Text>
        <Field label="Nombre completo" value={f.name}  onChange={(v) => set("name", v)}  colors={colors} />
        <Field label="Email"           value={f.email} onChange={(v) => set("email", v)} type="email-address" colors={colors} />
        <Field label="Teléfono"        value={f.phone} onChange={(v) => set("phone", v)} type="phone-pad" colors={colors} />

        <View style={{ height: 4 }} />

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>MI CAMPO</Text>
        <Field label="Nombre del campo" value={f.farmName} onChange={(v) => set("farmName", v)} colors={colors} />
        <Field label="Ubicación"        value={f.farmLoc}  onChange={(v) => set("farmLoc", v)}  colors={colors} />
        <Field label="Hectáreas"        value={f.farmHa}   onChange={(v) => set("farmHa", v)}   type="numeric" colors={colors} />
      </ScrollView>

      {/* Footer action */}
      <View style={[styles.footer, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg }]}>
        <TouchableOpacity
          onPress={saved || saving ? undefined : save}
          style={[
            styles.saveBtn,
            { backgroundColor: saved ? colors.statusOk : colors.actionPrimary },
            (saved || saving) && { opacity: 0.85 },
          ]}
          activeOpacity={0.85}
        >
          <Text style={[styles.saveBtnText, { color: colors.actionPrimaryText }]}>
            {saved ? "✓ Guardado" : saving ? "Guardando…" : "Guardar cambios"}
          </Text>
        </TouchableOpacity>
      </View>
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
    gap: 16,
    paddingBottom: Spacing.xl,
  },
  avatarRow: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: 4,
    marginBottom: -4,
  },
  fieldLabel: {
    fontSize: FontSize.bodySm,
    fontWeight: FontWeight.medium as any,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    fontSize: FontSize.bodyMd,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  saveBtn: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    fontSize: FontSize.bodyMd,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
