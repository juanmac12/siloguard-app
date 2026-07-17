import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { AuthHeader, Button, Icon, Input } from "../components";
import { FontWeight, ThemeColors, fontFamilyForWeight } from "../constants/Theme";

export default function RecuperarScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!email.trim() || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <AuthHeader title="Recuperar contraseña" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {!sent ? (
          <>
            <Text style={styles.desc}>Ingresá el email con el que te registraste y te enviamos un enlace para crear una nueva contraseña.</Text>
            <Input
              label="EMAIL"
              placeholder="tu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            <View style={styles.submitWrap}>
              <Button variant="primary" fullWidth disabled={!email.trim()} loading={loading} onPress={submit}>
                {loading ? "Enviando…" : "Enviar enlace"}
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.sentWrap}>
            <View style={styles.iconCircle}>
              <Icon name="check-circle" size={34} color={colors.actionPrimary} />
            </View>
            <Text style={styles.sentTitle}>Revisá tu bandeja de entrada</Text>
            <Text style={styles.sentDesc}>Si existe una cuenta con ese email, vas a recibir un enlace para crear una nueva contraseña.</Text>
            <Button variant="ghost" onPress={() => router.replace("/login")}>
              Volver a iniciar sesión
            </Button>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bg },
    scroll: { padding: 24, paddingTop: 28, flexGrow: 1, gap: 16 },
    desc: { fontSize: 14, lineHeight: 21, color: c.textSecondary, marginBottom: 4, fontFamily: fontFamilyForWeight(FontWeight.regular) },
    submitWrap: { marginTop: 8 },
    sentWrap: { flex: 1, alignItems: "center", justifyContent: "center", gap: 20, paddingVertical: 40 },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.greenTint,
      alignItems: "center",
      justifyContent: "center",
    },
    sentTitle: { fontSize: 20, fontWeight: FontWeight.bold, fontFamily: fontFamilyForWeight(FontWeight.bold), color: c.textPrimary, textAlign: "center" },
    sentDesc: { maxWidth: 270, fontSize: 14, color: c.textSecondary, textAlign: "center", fontFamily: fontFamilyForWeight(FontWeight.regular) },
  });
