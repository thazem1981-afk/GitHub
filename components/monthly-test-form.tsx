import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheet, FieldInput, FieldLabel, Pill, PrimaryButton, TextButton } from "@/components/study-ui";
import { COLORS, monthKey, monthLabel, recentMonthKeys } from "@/lib/study-utils";
import type { MonthlyTest, Subject } from "@/lib/study-types";

export interface MonthlyTestFormValue {
  subjectId: string;
  monthKey: string;
  score: number;
  total: number;
  notes: string;
}

export function MonthlyTestForm({
  visible,
  test,
  subjects,
  onClose,
  onSave,
}: {
  visible: boolean;
  test?: MonthlyTest | null;
  subjects: Subject[];
  onClose: () => void;
  onSave: (value: MonthlyTestFormValue) => void;
}) {
  const [subjectId, setSubjectId] = useState(test ? test.subjectId : subjects[0]?.id ?? "");
  const [selectedMonth, setSelectedMonth] = useState(test?.monthKey ?? monthKey(new Date()));
  const [score, setScore] = useState(test ? String(test.score) : "");
  const [total, setTotal] = useState(test ? String(test.total) : "");
  const [notes, setNotes] = useState(test?.notes ?? "");
  const [error, setError] = useState("");

  const months = recentMonthKeys(8);
  const save = () => {
    const parsedScore = Number(score.replace(",", "."));
    const parsedTotal = Number(total.replace(",", "."));
    if (!subjectId) return setError("أضف مادة دراسية واخترها للاختبار.");
    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0) return setError("اكتب الدرجة الكلية للاختبار (رقم أكبر من صفر).");
    if (!Number.isFinite(parsedScore) || parsedScore < 0) return setError("اكتب الدرجة التي حصلت عليها.");
    if (parsedScore > parsedTotal) return setError("الدرجة لا يمكن أن تتجاوز الدرجة الكلية.");
    onSave({ subjectId, monthKey: selectedMonth, score: parsedScore, total: parsedTotal, notes: notes.trim() });
    onClose();
  };

  return (
    <BottomSheet visible={visible} title={test ? "تعديل اختبار الشهر" : "تسجيل اختبار شهر"} onClose={onClose}>
      <View style={styles.field}>
        <FieldLabel>المادة</FieldLabel>
        {test && !test.subjectId ? <Pill label="حُذفت مادة هذا الاختبار؛ اختر مادة للمتابعة." icon="information-circle-outline" /> : null}
        {subjects.length ? (
          <View style={styles.choiceList}>
            {subjects.map((subject) => (
              <Pressable key={subject.id} onPress={() => setSubjectId(subject.id)} style={[styles.choice, subjectId === subject.id && styles.choiceSelected]}>
                <View style={[styles.dot, { backgroundColor: subject.color }]} />
                <Text style={[styles.choiceText, subjectId === subject.id && styles.choiceTextSelected]}>{subject.name}</Text>
              </Pressable>
            ))}
          </View>
        ) : <Pill label="أضف مادة أولاً من تبويب المواد" icon="information-circle-outline" />}
      </View>

      <View style={styles.field}>
        <FieldLabel>شهر الاختبار</FieldLabel>
        <View style={styles.choiceList}>
          {months.map((key) => (
            <Pressable key={key} onPress={() => setSelectedMonth(key)} style={[styles.choice, selectedMonth === key && styles.choiceSelected]}>
              <Text style={[styles.choiceText, selectedMonth === key && styles.choiceTextSelected]}>{monthLabel(key)}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.scoreRow}>
        <View style={[styles.field, styles.scoreField]}>
          <FieldLabel>درجتك</FieldLabel>
          <FieldInput value={score} onChangeText={setScore} placeholder="مثال: ٢٨" keyboardType="decimal-pad" maxLength={6} />
        </View>
        <View style={[styles.field, styles.scoreField]}>
          <FieldLabel>الدرجة الكلية</FieldLabel>
          <FieldInput value={total} onChangeText={setTotal} placeholder="مثال: ٣٠" keyboardType="decimal-pad" maxLength={6} />
        </View>
      </View>

      <View style={styles.field}>
        <FieldLabel>ملاحظات المراجعة (اختياري)</FieldLabel>
        <FieldInput
          value={notes}
          onChangeText={setNotes}
          placeholder="ما الأخطاء التي وقعت فيها؟ وما الذي ستراجعه قبل الاختبار القادم؟"
          multiline
          maxLength={300}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label={test ? "حفظ التعديل" : "تسجيل الاختبار"} icon="checkmark" onPress={save} />
      <TextButton label="إلغاء" onPress={onClose} color={COLORS.muted} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  choiceList: { flexDirection: "row", flexWrap: "wrap", gap: 8, direction: "rtl" },
  choice: { minHeight: 40, flexDirection: "row", alignItems: "center", gap: 7, borderRadius: 14, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, direction: "rtl" },
  choiceSelected: { borderColor: COLORS.brand, backgroundColor: COLORS.brandSoft },
  choiceText: { color: COLORS.ink, fontSize: 13, fontWeight: "600", writingDirection: "rtl" },
  choiceTextSelected: { color: COLORS.brand, fontWeight: "800" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  scoreRow: { flexDirection: "row", gap: 10, direction: "rtl" },
  scoreField: { flex: 1 },
  error: { color: COLORS.red, fontSize: 13, textAlign: "right", writingDirection: "rtl" },
});
