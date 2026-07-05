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
import { ApiError } from "../../config/api";
import { perfilApi } from "../../services/perfilApi";
import { Icon } from "../../components";

function PasswordField({
  label,
  value,
  onChange,
  error,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  colors: ThemeColors;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={{ position: "relative", justifyContent: "center" }}>
        <TextInput
          value={value}
          onChangeText={onChange}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          style={[
            styles.input,
            {
              backgroundColor: colors.surfaceInput,
              borderColor: error ? colors.statusCritical : colors.borderDefault,
              color: colors.textPrimary,
            },
          ]}
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity
          onPress={() => setVisible((v) => !v)}
          style={styles.eyeBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: FontSize.bodySm, color: colors.textSecondary }}>
            {visible ? "Ocultar" : "Ver"}
          </Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={[styles.fieldError, { color: colors.statusCritical }]}>{error}</Text>
      ) : null}
    </View>
  );
}

export default function CambiarPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [current, setCurrent] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ current?: string; nueva?: string; confirm?: string }>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      await perfilApi.cambiarPassword(current, nueva);
      setSaved(true);
      Alert.alert("Listo", "Tu contraseña se cambió correctamente.");
      setTimeout(() => router.back(), 600);
    } catch (error) {
      if (error instanceof ApiError) {
        // 409 → contraseña actual incorrecta; 400 → validación del backend
        if (error.statusCode === 409) {
          setErrors({ current: error.message });
        } else {
          const firstFieldError = error.errors ? Object.values(error.errors)[0]?.[0] : undefined;
          Alert.alert("Error", firstFieldError ?? error.message);
        }
      } else {
        Alert.alert("Error", "No se pudo cambiar la contraseña. Intentá de nuevo.");
      }
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Cambiar contraseña</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.hintCard, { backgroundColor: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.2)" }]}>
          <Icon name="shield" size={18} color={colors.actionPrimary} />
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Por seguridad, necesitamos tu contraseña actual para confirmar el cambio.
          </Text>
        </View>

        <PasswordField
          label="Contraseña actual"
          value={current}
          onChange={(v) => { setCurrent(v); setErrors((e) => ({ ...e, current: undefined })); }}
          error={errors.current}
          colors={colors}
        />
        <PasswordField
          label="Contraseña nueva"
          value={nueva}
          onChange={(v) => { setNueva(v); setErrors((e) => ({ ...e, nueva: undefined })); }}
          error={errors.nueva}
          colors={colors}
        />
        <PasswordField
          label="Repetir contraseña nueva"
          value={confirm}
          onChange={(v) => { setConfirm(v); setErrors((e) => ({ ...e, confirm: undefined })); }}
          error={errors.confirm}
          colors={colors}
        />

        <Text style={[styles.requisitos, { color: colors.textSecondary }]}>
          Mínimo 8 caracteres. Después del cambio, seguís logueado en este dispositivo.
        </Text>
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
            {saved ? "✓ Contraseña cambiada" : saving ? "Cambiando…" : "Cambiar contraseña"}
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
  hintCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  hintText: {
    flex: 1,
    fontSize: FontSize.bodySm,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: FontSize.bodySm,
    fontWeight: FontWeight.medium as any,
  },
  fieldError: {
    fontSize: FontSize.bodySm,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingRight: 64,
    fontSize: FontSize.bodyMd,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
  },
  requisitos: {
    fontSize: FontSize.bodySm,
    lineHeight: 18,
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
