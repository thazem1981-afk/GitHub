import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BottomSheet, FieldInput, FieldLabel, Pill, PrimaryButton, TextButton } from "@/components/study-ui";
import { COLORS, dateFromKey, dateKey, formatDate } from "@/lib/study-utils";
import { PRIORITY_LABEL, type StudyTask, type Subject, type TaskPriority } from "@/lib/study-types";

export function TaskForm({
  visible,
  task,
  subjects,
  initialDueDate,
  onClose,
  onSave,
}: {
  visible: boolean;
  task?: StudyTask | null;
  subjects: Subject[];
  initialDueDate: string;
  onClose: () => void;
  onSave: (value: { title: string; description: string; subjectId: string; dueAt: string; priority: TaskPriority }) => void;
}) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [subjectId, setSubjectId] = useState(task ? task.subjectId : subjects[0]?.id ?? "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? "medium");
  const [dateValue, setDateValue] = useState(task?.dueAt ? dateKey(new Date(task.dueAt)) : initialDueDate);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [error, setError] = useState("");

  const selectedDate = useMemo(() => dateFromKey(dateValue) ?? new Date(2000, 0, 1), [dateValue]);
  const save = () => {
    const cleanTitle = title.trim();
    const parsedDate = dateFromKey(dateValue);
    if (!cleanTitle) return setError("اكتب عنوان المهمة أولاً.");
    if (!subjectId) return setError("أضف مادة دراسية واخترها للمهمة.");
    if (!parsedDate) return setError("اختر موعداً بصيغة سنة-شهر-يوم.");
    onSave({ title: cleanTitle, description: description.trim(), subjectId, dueAt: parsedDate.toISOString(), priority });
    onClose();
  };

  return (
    <BottomSheet visible={visible} title={task ? "تعديل المهمة" : "مهمة جديدة"} onClose={onClose}>
      <View style={styles.field}>
        <FieldLabel>عنوان المهمة</FieldLabel>
        <FieldInput value={title} onChangeText={setTitle} placeholder="مثال: مراجعة درس الكسور" maxLength={90} returnKeyType="next" />
      </View>
      <View style={styles.field}>
        <FieldLabel>الوصف (اختياري)</FieldLabel>
        <FieldInput value={description} onChangeText={setDescription} placeholder="أضف تفصيلاً يساعدك على البدء" multiline maxLength={300} />
      </View>
      <View style={styles.field}>
        <FieldLabel>المادة</FieldLabel>
        {task && !task.subjectId ? <Pill label="حُذفت مادة هذه المهمة؛ اختر مادة للمتابعة." icon="information-circle-outline" /> : null}
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
        <FieldLabel>الموعد النهائي</FieldLabel>
        {Platform.OS === "web" ? (
          <FieldInput value={dateValue} onChangeText={setDateValue} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" maxLength={10} />
        ) : (
          <>
            <Pressable onPress={() => setPickerVisible((current) => !current)} style={styles.dateButton}>
              <Text style={styles.dateText}>{formatDate(selectedDate.toISOString())}</Text>
              <Text style={styles.dateFull}>{dateValue}</Text>
            </Pressable>
            {pickerVisible ? (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "compact" : "default"}
                onChange={(event, date) => {
                  if (event.type === "set" && date) setDateValue(dateKey(date));
                  if (Platform.OS === "android" || event.type !== "set") setPickerVisible(false);
                }}
              />
            ) : null}
          </>
        )}
      </View>
      <View style={styles.field}>
        <FieldLabel>الأولوية</FieldLabel>
        <View style={styles.priorityRow}>
          {(["high", "medium", "low"] as const).map((value) => {
            const selected = priority === value;
            const tone = value === "high" ? COLORS.red : value === "medium" ? COLORS.amber : COLORS.brand;
            return (
              <Pressable key={value} onPress={() => setPriority(value)} style={[styles.priorityChip, selected && { borderColor: tone, backgroundColor: value === "high" ? COLORS.redSoft : value === "medium" ? COLORS.amberSoft : COLORS.brandSoft }]}>
                <Text style={[styles.priorityText, { color: tone }]}>{PRIORITY_LABEL[value]}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton label={task ? "حفظ التعديل" : "إضافة المهمة"} icon="checkmark" onPress={save} />
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
  dateButton: { minHeight: 52, borderRadius: 15, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.line, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", direction: "rtl" },
  dateText: { color: COLORS.ink, fontSize: 14, fontWeight: "700", writingDirection: "rtl" },
  dateFull: { color: COLORS.muted, fontSize: 12 },
  priorityRow: { flexDirection: "row", gap: 8, direction: "rtl" },
  priorityChip: { flex: 1, minHeight: 43, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, alignItems: "center", justifyContent: "center" },
  priorityText: { fontSize: 13, fontWeight: "800", writingDirection: "rtl" },
  error: { color: COLORS.red, fontSize: 13, textAlign: "right", writingDirection: "rtl" },
});
