import { Tabs } from "expo-router";
import { Text } from "react-native";
import { Colors } from "../../constants/Theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 76,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>⌂</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: "Alertas",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>⊙</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="pasaporte"
        options={{
          title: "Pasaporte",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>▤</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>◉</Text>
          ),
        }}
      />
    </Tabs>
  );
}
