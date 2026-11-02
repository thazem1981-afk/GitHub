import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import { StudyStoreProvider } from "@/hooks/use-study-store";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StudyStoreProvider>
          {/* Default to hiding native headers so raw route segments don't appear (e.g. "(tabs)"). */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          {/* The app ships a light UI only (see app.config userInterfaceStyle), so the bar uses dark content. */}
          <StatusBar style="dark" />
        </StudyStoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
