import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ConfirmSheet } from "@/components/confirm-sheet";
import { TaskCard } from "@/components/task-card";
import { TaskForm } from "@/components/task-form";
import { StorageNotice } from "@/components/storage-notice";
import { Card, EmptyState, LoadingView, Page, PageHeader, PrimaryButton, SectionTitle } from "@/components/study-ui";
import { useStudyStore } from "@/hooks/use-study-store";
import { COLORS, dateKey, isOverdue, sortTasks, toArabicDigits } from "@/lib/study-utils";
import { tasksDueOn } from "@/lib/study-stats";
import type { StudyTask } from "@/lib/study-types";

const FILTERS = [
  { id: "open", label: "القادمة" },
  { id: "today", label: "اليوم" },
  { id: "overdue", label: "متأخرة" },
  { id: "done", label: "المنجزة" },
  { id: "all", label: "الكل" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

function matchesFilter(task: StudyTask, filter: FilterId, now: Date): boolean {
  switch (filter) {
    case "all": return true;
    case "done": return task.completedAt !== null;
    case "today": return tasksDueOn([task], now).length === 1;
    case "overdue": return isOverdue(task, now);
    default: return task.completedAt === null;
  }
}

export default function TasksScreen() {
  const router = useRouter();
  const { state, ready, addTask, updateTask, toggleTask, deleteTask } = useStudyStore();
  const [filter, setFilter] = useState<FilterId>("open");
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<StudyTask | null>(null);
  const [deleting, setDeleting] = useState<StudyTask | null>(null);
  const [newDueDate, setNewDueDate] = useState("");

  const filteredTasks = useMemo(() => {
    const now = new Date();
    return sortTasks(state.tasks.filter((task) => matchesFilter(task, filter, now)));
  }, [state.tasks, filter]);
  const startEdit = (task: StudyTask) => { setEditing(task); setFormVisible(true); };
  const startNew = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewDueDate(dateKey(tomorrow));
    setEditing(null);
    setFormVisible(true);
  };
  const closeForm = () => { setFormVisible(false); setEditing(null); };

  if (!ready) return <LoadingView />;

  return (
    <>
      <Page>
        <StorageNotice />
        <PageHeader title="المهام" subtitle="خطوة واضحة تقرّبك من هدفك" />
        <PrimaryButton label="مهمة جديدة" icon="add" onPress={startNew} />
        <View style={styles.filters}>
          {FILTERS.map((item) => {
            const selected = filter === item.id;
            const count = state.tasks.filter((task) => matchesFilter(task, item.id, new Date())).length;
            return (
              <Text key={item.id} onPress={() => setFilter(item.id)} style={[styles.filter, selected && styles.filterSelected]}>
                {item.label} · {toArabicDigits(count)}
              </Text>
            );
          })}
        </View>
        {ready && filteredTasks.length ? (
          <View style={styles.list}>
            <SectionTitle title={filter === "done" ? "ما أنجزته" : "الأولوية ثم الموعد"} />
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                subject={state.subjects.find((subject) => subject.id === task.subjectId)}
                onToggle={() => toggleTask(task.id)}
                onEdit={() => startEdit(task)}
                onDelete={() => setDeleting(task)}
              />
            ))}
          </View>
        ) : ready ? (
          <Card>
            <EmptyState
              icon={filter === "done" ? "checkmark-done-outline" : "list-outline"}
              title={filter === "done" ? "لم تنجز مهمة بعد" : filter === "today" ? "لا مهام لليوم" : filter === "overdue" ? "لا مهام متأخرة" : "مساحة لخطوتك التالية"}
              description={filter === "done" ? "عندما تتمّ مهمة، ستجدها هنا." : filter === "today" ? "ليس لديك مهمة مستحقة اليوم. راجع مهام الغد أو أضف مهمة جديدة." : filter === "overdue" ? "ممتاز — كل مهامك في موعدها." : state.subjects.length ? "أضف مهمة مرتبطة بمادة وحدد موعدها وأولويتها." : "ابدأ بإضافة مادة دراسية، ثم أنشئ المهمة الأولى."}
              action={!state.subjects.length ? <PrimaryButton label="إضافة مادة" icon="book-outline" onPress={() => router.push("/(tabs)/subjects" as never)} /> : undefined}
            />
          </Card>
        ) : null}
      </Page>

      <TaskForm
        key={formVisible ? editing?.id ?? "new-task" : "closed-task-form"}
        visible={formVisible}
        task={editing}
        subjects={state.subjects}
        initialDueDate={newDueDate}
        onClose={closeForm}
        onSave={(value) => editing ? updateTask(editing.id, value) : addTask(value)}
      />
      <ConfirmSheet
        visible={Boolean(deleting)}
        title="حذف المهمة؟"
        description={`سيُحذف «${deleting?.title ?? "المهمة"}» من قائمتك. تبقى جلسات المذاكرة محفوظة.`}
        onClose={() => setDeleting(null)}
        onConfirm={() => { if (deleting) deleteTask(deleting.id); setDeleting(null); }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: "row", backgroundColor: COLORS.surfaceAlt, borderRadius: 15, padding: 4, gap: 4, direction: "rtl" },
  filter: { flex: 1, textAlign: "center", color: COLORS.muted, paddingVertical: 11, borderRadius: 12, overflow: "hidden", fontSize: 12, fontWeight: "700", writingDirection: "rtl" },
  filterSelected: { color: COLORS.brand, backgroundColor: COLORS.surface, elevation: 1 },
  list: { gap: 11 },
});
