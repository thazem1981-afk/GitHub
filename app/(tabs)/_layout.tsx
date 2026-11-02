import React from "react";
import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { COLORS } from "@/lib/study-utils";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 9 : Math.max(insets.bottom, 9);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: COLORS.brand,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", marginTop: 2, writingDirection: "rtl" },
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 58 + bottomPadding,
          paddingTop: 7,
          paddingBottom: bottomPadding,
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.line,
          borderTopWidth: 1,
          direction: "rtl",
          elevation: 8,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "الملخص", tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="lessons" options={{ title: "الدروس", tabBarIcon: ({ color, size }) => <Ionicons name="play-circle-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="tasks" options={{ title: "المهام", tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="timer" options={{ title: "جلسة", tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="tests" options={{ title: "الاختبارات", tabBarIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="subjects" options={{ title: "المواد", tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
