import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Spacing, ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { useToast } from "../../components/Toast";
import { Icon, Input, Button } from "../../components";

function PasswordField({ label, value, onChangeText, error, colors }: {
  label: string; value: string; onChangeText: (v: string) => void; error?: string; colors: ThemeColors;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      error={error}
      trailingIcon={
        <Pressable onPress={() => setVisible((v) => !v)} hitSlop={8}>
          <Icon name={visible ? "eye-off" : "eye"} size={18} color={colors.textSecondary} />
        </Pressable>
      }
    />
  );
}

export default function CambiarPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { changePassword } = useAppData();
  const toast = useToast();

  const [current, setCurrent] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; nueva?: string; confirm?: string }>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!current) e.current = "Ingresá tu contraseña actual.";
    if (nueva.length < 8) e.nueva = "La contraseña nueva debe tener al menos 8 caracteres.";
    else if (nueva === current) e.nueva = "La contraseña nueva debe ser distinta a la actual.";
    if (confirm !== nueva) e.confirm = "Las contraseñas no coinciden.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await changePassword(current, nueva);
      toast.addToast({ tone: "ok", title: "Contraseña cambiada", message: "Tu contraseña se actualizó correctamente." });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Cambiar contraseña</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={[styles.hintCard, { backgroundColor: colors.greenTint, borderColor: "rgba(34,197,94,0.2)" }]}>
          <Icon name="shield" size={18} color={colors.actionPrimary} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Por seguridad, necesitamos tu contraseña actual para confirmar el cambio.
          </Text>
        </View>

        <PasswordField
          label="Contraseña actual"
          value={current}
          onChangeText={(v) => { setCurrent(v); setErrors((e) => ({ ...e, current: undefined })); }}
          error={errors.current}
          colors={colors}
        />
        <PasswordField
          label="Contraseña nueva"
          value={nueva}
          onChangeText={(v) => { setNueva(v); setErrors((e) => ({ ...e, nueva: undefined })); }}
          error={errors.nueva}
          colors={colors}
        />
        <PasswordField
          label="Repetir contraseña nueva"
          value={confirm}
          onChangeText={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: undefined })); }}
          error={errors.confirm}
          colors={colors}
        />

        <Text style={[styles.requisitos, { color: colors.textSecondary }]}>
          Mínimo 8 caracteres. Después del cambio, seguís logueado en este dispositivo.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.borderDefault, backgroundColor: colors.bg }]}>
        <Button variant="primary" fullWidth loading={saving} onPress={save}>
          Cambiar contraseña
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 4, paddingTop: 56, paddingBottom: 10, paddingRight: Spacing.md, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
  content: { padding: Spacing.md, gap: 16, paddingBottom: Spacing.xl },
  hintCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: Radius.md, borderWidth: 1 },
  hintText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  requisitos: { fontSize: 12, lineHeight: 18, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  footer: { padding: Spacing.md, borderTopWidth: 1 },
});
