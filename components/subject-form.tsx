import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheet, FieldInput, FieldLabel, PrimaryButton, TextButton } from "@/components/study-ui";
import { COLORS, SUBJECT_COLORS } from "@/lib/study-utils";
import type { Subject } from "@/lib/study-types";

export function SubjectForm({
  visible,
  subject,
  onClose,
  onSave,
}: {
  visible: boolean;
  subject?: Subject | null;
  onClose: () => void;
  onSave: (value: { name: string; color: string }) => void;
}) {
  const [name, setName] = useState(subject?.name ?? "");
  const [color, setColor] = useState(subject?.color ?? SUBJECT_COLORS[0]);
  const [error, setError] = useState("");

  const save = () => {
    const cleanName = name.trim();
    if (!cleanName) {
      setError("اكتب اسم المادة أولاً.");
      return;
    }
    onSave({ name: cleanName, color });
    onClose();
  };

  return (
    <BottomSheet visible={visible} title={subject ? "تعديل المادة" : "مادة جديدة"} onClose={onClose}>
      <View style={styles.field}>
        <FieldLabel>اسم المادة</FieldLabel>
        <FieldInput value={name} onChangeText={setName} placeholder="مثال: العلوم" maxLength={40} returnKeyType="done" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.field}>
        <FieldLabel>لون المادة</FieldLabel>
        <View style={styles.colors}>
          {SUBJECT_COLORS.map((option) => (
            <Pressable key={option} onPress={() => setColor(option)} accessibilityRole="button" accessibilityLabel="اختيار لون المادة" style={[styles.swatch, { backgroundColor: option }, color === option && styles.swatchSelected]}>
              {color === option ? <View style={styles.swatchInner} /> : null}
            </Pressable>
          ))}
        </View>
      </View>
      <PrimaryButton label={subject ? "حفظ التعديل" : "إضافة المادة"} icon="checkmark" onPress={save} />
      <TextButton label="إلغاء" onPress={onClose} color={COLORS.muted} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  colors: { flexDirection: "row", gap: 12, paddingVertical: 5, direction: "rtl" },
  swatch: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "transparent" },
  swatchSelected: { borderColor: COLORS.ink },
  swatchInner: { width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.white },
  error: { color: COLORS.red, fontSize: 13, textAlign: "right", writingDirection: "rtl" },
});
