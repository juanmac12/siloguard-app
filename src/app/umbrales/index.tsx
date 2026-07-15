import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { EmptyState } from "../../components";

/** Sin silo preseleccionado: entra al primero. El selector vive dentro de [siloId]. */
export default function UmbralesIndexScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { silos } = useAppData();

  useEffect(() => {
    if (silos.length) router.replace(`/umbrales/${silos[0].id}` as any);
  }, [silos]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {silos.length === 0 ? (
        <EmptyState variant="empty" title="Sin silos" body="Agregá un silo para configurar sus umbrales de alerta." />
      ) : null}
    </View>
  );
}
