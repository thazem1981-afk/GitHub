import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStudyStore } from "@/hooks/use-study-store";
import { COLORS } from "@/lib/study-utils";

export function StorageNotice() {
  const { persistenceError } = useStudyStore();
  if (!persistenceError) return null;

  return (
    <View accessibilityRole="alert" style={styles.notice}>
      <Ionicons name="warning-outline" size={19} color={COLORS.red} />
      <Text style={styles.message}>{persistenceError}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: { marginHorizontal: 20, marginTop: 8, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "#EBCAC4", backgroundColor: COLORS.redSoft, flexDirection: "row", alignItems: "center", gap: 9, direction: "rtl" },
  message: { flex: 1, color: COLORS.red, fontSize: 12, lineHeight: 18, textAlign: "right", writingDirection: "rtl" },
});
