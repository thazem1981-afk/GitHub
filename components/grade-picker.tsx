import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheet, Pill } from "@/components/study-ui";
import { COLORS } from "@/lib/study-utils";
import { GRADES, type GradeId } from "@/lib/study-types";

export function GradePicker({
  visible,
  selectedId,
  onSelect,
  onClose,
  required = false,
}: {
  visible: boolean;
  selectedId: GradeId | null;
  onSelect: (gradeId: GradeId) => void;
  onClose: () => void;
  required?: boolean;
}) {
  return (
    <BottomSheet
      visible={visible}
      title="اختر صفك الدراسي"
      onClose={required ? () => undefined : onClose}
    >
      <Text style={styles.description}>نرتّب لك دفتر مذاكرتك على مرحلتك.</Text>
      <Pill label="المرحلة الابتدائية" icon="school-outline" />
      <View style={styles.list}>
        {GRADES.slice(0, 6).map((grade) => (
          <GradeOption key={grade.id} label={grade.label} selected={selectedId === grade.id} onPress={() => onSelect(grade.id)} />
        ))}
      </View>
      <Pill label="المرحلة المتوسطة" icon="school-outline" />
      <View style={styles.list}>
        {GRADES.slice(6).map((grade) => (
          <GradeOption key={grade.id} label={grade.label} selected={selectedId === grade.id} onPress={() => onSelect(grade.id)} />
        ))}
      </View>
    </BottomSheet>
  );
}

function GradeOption({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.option, selected && styles.selected]}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  description: { color: COLORS.muted, textAlign: "right", writingDirection: "rtl", fontSize: 14, lineHeight: 21, marginBottom: 2 },
  list: { gap: 8 },
  option: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: COLORS.line, borderRadius: 16, paddingHorizontal: 15, backgroundColor: COLORS.surface, direction: "rtl" },
  selected: { borderColor: COLORS.brand, backgroundColor: COLORS.brandSoft },
  optionText: { flex: 1, color: COLORS.ink, fontSize: 15, fontWeight: "600", textAlign: "right", writingDirection: "rtl" },
  optionTextSelected: { color: COLORS.brand, fontWeight: "800" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.muted, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: COLORS.brand },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.brand },
});
