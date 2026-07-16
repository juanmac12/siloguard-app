import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppData } from "../../contexts/AppDataContext";
import { Icon } from "../../components";
import { FontWeight, fontFamilyForWeight } from "../../constants/Theme";

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { alerts } = useAppData();
  const activeAlerts = alerts.filter((a) => a.status === "active").length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 76 + insets.bottom,
          paddingBottom: 12 + insets.bottom,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: FontWeight.semibold,
          fontFamily: fontFamilyForWeight(FontWeight.semibold),
        },
        tabBarBadgeStyle: {
          backgroundColor: "#EF4444",
          color: "#fff",
          fontSize: 10,
          fontWeight: FontWeight.bold,
          fontFamily: fontFamilyForWeight(FontWeight.bold),
          minWidth: 18,
          height: 18,
          borderRadius: 9,
          lineHeight: 18,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Icon name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color }) => <Icon name="bell" size={22} color={color} />,
          tabBarBadge: activeAlerts > 0 ? activeAlerts : undefined,
        }}
      />
      <Tabs.Screen
        name="pasaporte"
        options={{
          title: "Pasaporte",
          tabBarIcon: ({ color }) => <Icon name="clipboard" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => <Icon name="user" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
