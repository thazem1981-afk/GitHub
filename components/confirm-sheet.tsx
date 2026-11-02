import React from "react";
import { StyleSheet, Text } from "react-native";
import { BottomSheet, PrimaryButton, SecondaryButton } from "@/components/study-ui";
import { COLORS } from "@/lib/study-utils";

export function ConfirmSheet({
  visible,
  title,
  description,
  confirmLabel = "حذف",
  onClose,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet visible={visible} title={title} onClose={onClose}>
      <Text style={styles.description}>{description}</Text>
      <PrimaryButton label={confirmLabel} icon="trash-outline" onPress={onConfirm} style={styles.deleteButton} />
      <SecondaryButton label="إبقاء العنصر" onPress={onClose} tone="neutral" />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  description: { color: COLORS.muted, fontSize: 14, lineHeight: 22, textAlign: "right", writingDirection: "rtl" },
  deleteButton: { backgroundColor: COLORS.red },
});
