import { useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, Modal, Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemeColors, Radius } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { ApiError } from "../../config/api";
import { Icon } from "../../components";

const GRAIN_TYPES = ["Soja", "Maíz", "Trigo", "Girasol", "Sorgo", "Cebada", "Otro"];
const STORAGE_TYPES = ["Silo fijo", "Silobolsa"];

interface FormState {
  name: string;
  grain: string;
  customGrain: string;
  storage: string;
  tons: string;
  acopio: string;
}

interface FormErrors {
  name?: string;
  grain?: string;
  acopio?: string;
  tons?: string;
}

export default function EditarSiloScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos, updateSilo, deleteSilo, notify } = useAppData();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, del } = useLocalSearchParams<{ id: string; del?: string }>();

  const silo = silos.find((s) => s.id === Number(id));

  const isCustomGrain = silo ? !GRAIN_TYPES.slice(0, -1).includes(silo.grain) : false;

  const [form, setForm] = useState<FormState>({
    name:        silo?.name ?? "",
    grain:       isCustomGrain ? "Otro" : (silo?.grain ?? "Soja"),
    customGrain: isCustomGrain ? (silo?.grain ?? "") : "",
    storage:     silo?.storage ?? "Silo fijo",
    tons:        String(silo?.tons ?? ""),
    acopio:      silo?.acopio ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleteModal, setDeleteModal] = useState(del === "1");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  if (!silo) return null;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) {
      e.name = "El nombre del silo no puede estar vacío";
    }
    if (form.grain === "Otro" && !form.customGrain.trim()) {
      e.grain = "Especificá el tipo de grano";
    }
    if (!form.acopio.trim()) {
      e.acopio = "La fecha de acopio no puede estar vacía";
    }
    const t = Number(form.tons);
    if (!form.tons.trim()) {
      e.tons = "El tonelaje no puede estar vacío";
    } else if (isNaN(t)) {
      e.tons = "Ingresá un número válido";
    } else if (t <= 0) {
      e.tons = t < 0 ? "El tonelaje no puede ser negativo" : "El tonelaje debe ser mayor a 0";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    const finalGrain = form.grain === "Otro" ? form.customGrain.trim() : form.grain;
    setSaving(true);
    try {
      await updateSilo(silo.id, {
        name: form.name.trim(),
        grain: finalGrain,
        storage: form.storage,
        tons: Number(form.tons),
        acopio: form.acopio.trim(),
      });
      router.back();
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "No se pudieron guardar los cambios.";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteSilo(silo.id);
      notify("Silo eliminado");
      router.replace("/(tabs)/dashboard" as any);
    } catch (error) {
      const msg = error instanceof ApiError ? error.message : "No se pudo eliminar el silo.";
      Alert.alert("Error", msg);
      setDeleting(false);
      setDeleteModal(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.borderDefault }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color={colors.actionPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Editar silo</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{silo.name}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Nombre */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: errors.name ? colors.statusCritical : colors.textSecondary }]}>Nombre del silo</Text>
            <TextInput
              value={form.name}
              onChangeText={set("name")}
              placeholder="Ej: Silo Norte"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.name ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
            />
            {errors.name ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.name}</Text> : null}
          </View>

          {/* Tipo de grano */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: errors.grain ? colors.statusCritical : colors.textSecondary }]}>Tipo de grano</Text>
            <View style={styles.chipWrap}>
              {GRAIN_TYPES.map((g) => (
                <Pressable key={g} onPress={() => { setForm((f) => ({ ...f, grain: g })); setErrors((e) => ({ ...e, grain: undefined })); }}
                  style={[styles.selectChip, {
                    backgroundColor: form.grain === g ? colors.actionPrimary : colors.surfaceInput,
                    borderColor: form.grain === g ? colors.actionPrimary : (errors.grain ? colors.statusCritical : colors.borderDefault),
                  }]}>
                  <Text style={[styles.selectChipText, { color: form.grain === g ? colors.actionPrimaryText : colors.textSecondary }]}>{g}</Text>
                </Pressable>
              ))}
            </View>
            {form.grain === "Otro" && (
              <TextInput
                value={form.customGrain}
                onChangeText={set("customGrain")}
                placeholder="Ej: Canola, Centeno…"
                placeholderTextColor={colors.textSecondary}
                style={[styles.input, { marginTop: 8, backgroundColor: colors.surfaceInput, borderColor: errors.grain ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
              />
            )}
            {errors.grain ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.grain}</Text> : null}
          </View>

          {/* Tipo de almacenamiento */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo de almacenamiento</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {STORAGE_TYPES.map((s) => (
                <Pressable key={s} onPress={() => setForm((f) => ({ ...f, storage: s }))}
                  style={[styles.storageChip, {
                    backgroundColor: form.storage === s ? colors.actionPrimary : colors.surfaceInput,
                    borderColor: form.storage === s ? colors.actionPrimary : colors.borderDefault,
                  }]}>
                  <Text style={[styles.storageChipText, { color: form.storage === s ? colors.actionPrimaryText : colors.textSecondary }]}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Tonelaje */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: errors.tons ? colors.statusCritical : colors.textSecondary }]}>Tonelaje estimado</Text>
            <TextInput
              value={form.tons}
              onChangeText={set("tons")}
              placeholder="Ej: 180"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.tons ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
            />
            {errors.tons ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.tons}</Text> : null}
          </View>

          {/* Fecha de acopio */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: errors.acopio ? colors.statusCritical : colors.textSecondary }]}>Fecha de acopio</Text>
            <TextInput
              value={form.acopio}
              onChangeText={set("acopio")}
              placeholder="Ej: 15 mar 2024"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.acopio ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
            />
            {errors.acopio ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.acopio}</Text> : null}
          </View>

          {/* Guardar */}
          <TouchableOpacity onPress={save} disabled={saving} style={[styles.primaryBtn, { backgroundColor: saving ? colors.surfaceInput : colors.actionPrimary }]}>
            <Icon name="check" size={18} color={saving ? colors.textSecondary : colors.actionPrimaryText} />
            <Text style={[styles.primaryBtnText, { color: saving ? colors.textSecondary : colors.actionPrimaryText }]}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </Text>
          </TouchableOpacity>

          {/* Separador + Eliminar */}
          <View style={[styles.deleteSeparator, { borderTopColor: colors.borderDefault }]} />
          <TouchableOpacity onPress={() => setDeleteModal(true)} style={[styles.deleteFullBtn, { borderColor: colors.statusCritical }]}>
            <Icon name="trash" size={16} color={colors.statusCritical} />
            <Text style={[styles.deleteBtnText, { color: colors.statusCritical }]}>Eliminar silo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Delete confirmation modal */}
      <Modal visible={deleteModal} transparent animationType="fade" onRequestClose={() => setDeleteModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setDeleteModal(false)} />
        <View style={styles.modalCenter}>
          <View style={[styles.modalCard, { backgroundColor: colors.surfaceCard, borderColor: colors.borderDefault }]}>
            <View style={[styles.modalIcon, { backgroundColor: colors.statusCriticalTint }]}>
              <Icon name="trash" size={24} color={colors.statusCritical} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>¿Eliminar {silo.name}?</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Esto eliminará el silo y todas sus alertas. No se puede deshacer.
            </Text>
            <TouchableOpacity onPress={confirmDelete} disabled={deleting} style={[styles.modalBtn, { backgroundColor: colors.statusCritical, opacity: deleting ? 0.6 : 1 }]}>
              <Text style={[styles.modalBtnText, { color: "#fff" }]}>{deleting ? "Eliminando…" : "Sí, eliminar"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDeleteModal(false)} style={styles.modalCancelBtn}>
              <Text style={[styles.modalCancelText, { color: colors.textSecondary }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: {
      flexDirection: "row", alignItems: "center",
      paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8, borderBottomWidth: 1,
    },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: "600" },
    headerSub: { fontSize: 12, marginTop: 1 },

    scroll: { padding: 16, paddingBottom: 40 },

    fieldGroup: { marginBottom: 16 },
    label: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
    input: { borderWidth: 1, borderRadius: Radius.md, padding: 12, fontSize: 15 },
    errorText: { fontSize: 12, marginTop: 5, fontWeight: "500" },

    chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    selectChip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6 },
    selectChipText: { fontSize: 13, fontWeight: "500" },

    storageChip: { flex: 1, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: "center" },
    storageChipText: { fontSize: 14, fontWeight: "600" },

    primaryBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
      borderRadius: Radius.md, paddingVertical: 14, marginBottom: 24,
    },
    primaryBtnText: { fontSize: 15, fontWeight: "700" },

    deleteSeparator: { borderTopWidth: 1, marginBottom: 16 },
    deleteFullBtn: {
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
      borderWidth: 1, borderRadius: Radius.md, paddingVertical: 14, marginBottom: 8,
    },
    deleteBtnText: { fontSize: 15, fontWeight: "600" },

    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
    modalCenter: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", padding: 24 },
    modalCard: { width: "100%", borderRadius: Radius.xl, borderWidth: 1, padding: 24, alignItems: "center" },
    modalIcon: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", marginBottom: 14 },
    modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8, textAlign: "center" },
    modalSub: { fontSize: 14, lineHeight: 22, textAlign: "center", marginBottom: 20 },
    modalBtn: { width: "100%", borderRadius: Radius.md, paddingVertical: 14, alignItems: "center", marginBottom: 8 },
    modalBtnText: { fontSize: 15, fontWeight: "700" },
    modalCancelBtn: { paddingVertical: 10 },
    modalCancelText: { fontSize: 14 },
  });
