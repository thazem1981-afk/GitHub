import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card, IconButton, Pill } from "@/components/study-ui";
import { COLORS, formatDate, isOverdue } from "@/lib/study-utils";
import { PRIORITY_LABEL, type StudyTask, type Subject } from "@/lib/study-types";

export function TaskCard({
  task,
  subject,
  onToggle,
  onEdit,
  onDelete,
  compact = false,
}: {
  task: StudyTask;
  subject?: Subject;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}) {
  const completed = task.completedAt !== null;
  const overdue = isOverdue(task);
  const priorityColor = task.priority === "high" ? COLORS.red : task.priority === "medium" ? COLORS.amber : COLORS.brand;
  const priorityBackground = task.priority === "high" ? COLORS.redSoft : task.priority === "medium" ? COLORS.amberSoft : COLORS.brandSoft;
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Pressable onPress={onToggle} accessibilityRole="checkbox" accessibilityState={{ checked: completed }} accessibilityLabel={completed ? "إلغاء إنجاز المهمة" : "إنجاز المهمة"} style={[styles.check, completed && styles.checked]}>
          {completed ? <Text style={styles.checkmark}>✓</Text> : null}
        </Pressable>
        <View style={styles.content}>
          <Text numberOfLines={compact ? 1 : 2} style={[styles.title, completed && styles.completedTitle]}>{task.title}</Text>
          {!compact && task.description ? <Text numberOfLines={2} style={styles.description}>{task.description}</Text> : null}
          <View style={styles.meta}>
            {subject ? <Pill label={subject.name} color={subject.color} background={`${subject.color}18`} /> : <Pill label="مادة محذوفة" color={COLORS.muted} background={COLORS.surfaceAlt} />}
            <Pill label={PRIORITY_LABEL[task.priority]} color={priorityColor} background={priorityBackground} />
          </View>
          <Text style={[styles.date, overdue && !completed && styles.overdue]}>
            {completed ? "مكتملة" : overdue ? "متأخرة · " : "الموعد · "}{!completed ? formatDate(task.dueAt) : ""}
          </Text>
        </View>
        {!compact && (onEdit || onDelete) ? (
          <View style={styles.actions}>
            {onEdit ? <IconButton icon="create-outline" label="تعديل المهمة" size={38} onPress={onEdit} tone="neutral" /> : null}
            {onDelete ? <IconButton icon="trash-outline" label="حذف المهمة" size={38} onPress={onDelete} tone="danger" /> : null}
          </View>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 14, borderRadius: 19 },
  top: { flexDirection: "row", alignItems: "flex-start", gap: 11, direction: "rtl" },
  check: { width: 25, height: 25, borderRadius: 9, borderWidth: 1.6, borderColor: COLORS.sage, marginTop: 1, alignItems: "center", justifyContent: "center" },
  checked: { borderColor: COLORS.brand, backgroundColor: COLORS.brand },
  checkmark: { color: COLORS.white, fontWeight: "900", fontSize: 15, lineHeight: 17 },
  content: { flex: 1, gap: 7, alignItems: "flex-start" },
  title: { color: COLORS.ink, fontSize: 15, fontWeight: "800", textAlign: "right", writingDirection: "rtl", lineHeight: 22 },
  completedTitle: { color: COLORS.muted, textDecorationLine: "line-through" },
  description: { color: COLORS.muted, fontSize: 12, lineHeight: 18, textAlign: "right", writingDirection: "rtl" },
  meta: { flexDirection: "row", flexWrap: "wrap", gap: 6, direction: "rtl" },
  date: { color: COLORS.muted, fontSize: 12, writingDirection: "rtl" },
  overdue: { color: COLORS.red, fontWeight: "800" },
  actions: { gap: 7, alignItems: "center" },
});
