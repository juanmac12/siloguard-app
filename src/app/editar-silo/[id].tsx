import { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ThemeColors, Radius, FontWeight, fontFamilyForWeight } from "../../constants/Theme";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { useToast } from "../../components/Toast";
import { Icon, Button, BottomSheet, DateField } from "../../components";

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
  const { silos, updateSilo, deleteSilo } = useAppData();
  const toast = useToast();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id, del } = useLocalSearchParams<{ id: string; del?: string }>();

  const silo = silos.find((s) => s.id === Number(id));
  const isCustomGrain = silo ? !GRAIN_TYPES.slice(0, -1).includes(silo.grain) : false;

  const initial: FormState = {
    name: silo?.name ?? "",
    grain: isCustomGrain ? "Otro" : (silo?.grain ?? "Soja"),
    customGrain: isCustomGrain ? (silo?.grain ?? "") : "",
    storage: silo?.storage ?? "Silo fijo",
    tons: String(silo?.tons ?? ""),
    acopio: silo?.acopio ?? "",
  };

  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [deleteSheet, setDeleteSheet] = useState(del === "1");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (key: keyof FormState) => (val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  if (!silo) return null;

  const isDirty =
    form.name !== initial.name ||
    form.grain !== initial.grain ||
    form.customGrain !== initial.customGrain ||
    form.storage !== initial.storage ||
    form.tons !== initial.tons ||
    form.acopio !== initial.acopio;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "El nombre del silo no puede estar vacío";
    if (form.grain === "Otro" && !form.customGrain.trim()) e.grain = "Especificá el tipo de grano";
    if (!form.acopio.trim()) e.acopio = "La fecha de acopio no puede estar vacía";
    const t = Number(form.tons);
    if (!form.tons.trim()) e.tons = "El tonelaje no puede estar vacío";
    else if (isNaN(t)) e.tons = "Ingresá un número válido";
    else if (t <= 0) e.tons = t < 0 ? "El tonelaje no puede ser negativo" : "El tonelaje debe ser mayor a 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!isDirty || !validate()) return;
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
      toast.addToast({ tone: "ok", title: "Cambios guardados" });
      router.back();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteSilo(silo.id);
      toast.addToast({ tone: "ok", title: "Silo eliminado" });
      router.replace("/(tabs)/dashboard" as any);
    } finally {
      setDeleting(false);
      setDeleteSheet(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
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
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: errors.name ? colors.statusCritical : colors.textSecondary }]}>Nombre del silo</Text>
            <TextInput
              value={form.name}
              onChangeText={set("name")}
              placeholder="Ej: Silo Norte"
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.name ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
            />
            {errors.name ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.name}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: errors.grain ? colors.statusCritical : colors.textSecondary }]}>Tipo de grano</Text>
            <View style={styles.chipWrap}>
              {GRAIN_TYPES.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => { setForm((f) => ({ ...f, grain: g })); setErrors((e) => ({ ...e, grain: undefined })); }}
                  style={[styles.selectChip, {
                    backgroundColor: form.grain === g ? colors.actionPrimary : colors.surfaceInput,
                    borderColor: form.grain === g ? colors.actionPrimary : (errors.grain ? colors.statusCritical : colors.borderDefault),
                  }]}
                >
                  <Text style={[styles.selectChipText, { color: form.grain === g ? colors.actionPrimaryText : colors.textSecondary }]}>{g}</Text>
                </Pressable>
              ))}
            </View>
            {form.grain === "Otro" && (
              <TextInput
                value={form.customGrain}
                onChangeText={set("customGrain")}
                placeholder="Ej: Canola, Centeno…"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, { marginTop: 8, backgroundColor: colors.surfaceInput, borderColor: errors.grain ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
              />
            )}
            {errors.grain ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.grain}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Tipo de almacenamiento</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {STORAGE_TYPES.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setForm((f) => ({ ...f, storage: s }))}
                  style={[styles.storageChip, {
                    backgroundColor: form.storage === s ? colors.actionPrimary : colors.surfaceInput,
                    borderColor: form.storage === s ? colors.actionPrimary : colors.borderDefault,
                  }]}
                >
                  <Text style={[styles.storageChipText, { color: form.storage === s ? colors.actionPrimaryText : colors.textSecondary }]}>{s}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: errors.tons ? colors.statusCritical : colors.textSecondary }]}>Tonelaje estimado</Text>
            <TextInput
              value={form.tons}
              onChangeText={set("tons")}
              placeholder="Ej: 180"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: colors.surfaceInput, borderColor: errors.tons ? colors.statusCritical : colors.borderDefault, color: colors.textPrimary }]}
            />
            {errors.tons ? <Text style={[styles.errorText, { color: colors.statusCritical }]}>{errors.tons}</Text> : null}
          </View>

          <View style={styles.fieldGroup}>
            <DateField label="Fecha de acopio" value={form.acopio} onChange={set("acopio")} error={errors.acopio} maximumDate={new Date()} />
          </View>

          <Button variant="primary" fullWidth loading={saving} disabled={!isDirty} onPress={save} style={{ marginBottom: 24 }}>
            Guardar cambios
          </Button>

          <View style={[styles.deleteSeparator, { borderTopColor: colors.borderDefault }]} />
          <Text style={[styles.dangerLabel, { color: colors.textMuted }]}>ZONA DE PELIGRO</Text>
          <TouchableOpacity onPress={() => setDeleteSheet(true)} style={[styles.deleteFullBtn, { borderColor: colors.statusCritical }]}>
            <Icon name="trash" size={16} color={colors.statusCritical} />
            <Text style={[styles.deleteBtnText, { color: colors.statusCritical }]}>Eliminar silo</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <BottomSheet
        open={deleteSheet}
        onClose={() => setDeleteSheet(false)}
        title={`¿Eliminar ${silo.name}?`}
        actions={[
          <Button key="ok" variant="danger" fullWidth loading={deleting} onPress={confirmDelete}>
            Sí, eliminar
          </Button>,
          <Button key="no" variant="ghost" fullWidth onPress={() => setDeleteSheet(false)}>
            Cancelar
          </Button>,
        ]}
      >
        <Text style={styles.deleteSheetBody}>Esto eliminará el silo y todas sus alertas. No se puede deshacer.</Text>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    header: { flexDirection: "row", alignItems: "center", paddingTop: 56, paddingBottom: 10, paddingHorizontal: 8, borderBottomWidth: 1 },
    backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 17, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },
    headerSub: { fontSize: 12, marginTop: 1, fontFamily: fontFamilyForWeight(FontWeight.regular) },

    scroll: { padding: 16, paddingBottom: 40 },

    fieldGroup: { marginBottom: 16 },
    label: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
    input: { borderWidth: 1, borderRadius: Radius.md, padding: 12, fontSize: 15, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    errorText: { fontSize: 12, marginTop: 5, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },

    chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    selectChip: { borderWidth: 1, borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6 },
    selectChipText: { fontSize: 13, fontWeight: FontWeight.medium, fontFamily: fontFamilyForWeight(FontWeight.medium) },

    storageChip: { flex: 1, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 12, alignItems: "center" },
    storageChipText: { fontSize: 14, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },

    deleteSeparator: { borderTopWidth: 1, marginBottom: 12 },
    dangerLabel: { fontSize: 11, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), letterSpacing: 0.6, marginBottom: 10 },
    deleteFullBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1, borderRadius: Radius.md, paddingVertical: 14, marginBottom: 8 },
    deleteBtnText: { fontSize: 15, fontWeight: FontWeight.semibold, fontFamily: fontFamilyForWeight(FontWeight.semibold) },

    deleteSheetBody: { fontSize: 14, lineHeight: 21, color: c.textSecondary, fontFamily: fontFamilyForWeight(FontWeight.regular) },
  });
