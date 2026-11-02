import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ConfirmSheet } from "@/components/confirm-sheet";
import { StorageNotice } from "@/components/storage-notice";
import { SubjectForm } from "@/components/subject-form";
import { Card, EmptyState, IconButton, LoadingView, Page, PageHeader, PrimaryButton } from "@/components/study-ui";
import { useStudyStore } from "@/hooks/use-study-store";
import { COLORS, toArabicDigits } from "@/lib/study-utils";
import type { Subject } from "@/lib/study-types";

export default function SubjectsScreen() {
  const { state, ready, addSubject, updateSubject, deleteSubject } = useStudyStore();
  const [formVisible, setFormVisible] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [deleting, setDeleting] = useState<Subject | null>(null);
  const closeForm = () => { setFormVisible(false); setEditing(null); };

  if (!ready) return <LoadingView />;

  return (
    <>
      <Page>
        <StorageNotice />
        <PageHeader title="المواد" subtitle="موادك مرتبة في مكان واحد" />
        <PrimaryButton label="إضافة مادة" icon="add" onPress={() => { setEditing(null); setFormVisible(true); }} />
        {state.subjects.length ? (
          <View style={styles.list}>
            {state.subjects.map((subject) => {
              const taskCount = state.tasks.filter((task) => task.subjectId === subject.id && task.completedAt === null).length;
              const doneCount = state.tasks.filter((task) => task.subjectId === subject.id && task.completedAt !== null).length;
              const sessionCount = state.sessions.filter((session) => session.subjectId === subject.id).length;
              return (
                <Card key={subject.id} style={styles.subjectCard}>
                  <View style={[styles.colorRail, { backgroundColor: subject.color }]} />
                  <View style={styles.subjectContent}>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <Text style={styles.subjectMeta}>{toArabicDigits(taskCount)} مهام قادمة · {toArabicDigits(doneCount)} منجزة</Text>
                    <View style={styles.sessionsRow}>
                      <Ionicons name="time-outline" size={14} color={COLORS.muted} />
                      <Text style={styles.sessionText}>{toArabicDigits(sessionCount)} جلسات مذاكرة</Text>
                    </View>
                  </View>
                  <View style={styles.actions}>
                    <IconButton icon="create-outline" label={`تعديل ${subject.name}`} onPress={() => { setEditing(subject); setFormVisible(true); }} tone="neutral" size={39} />
                    <IconButton icon="trash-outline" label={`حذف ${subject.name}`} onPress={() => setDeleting(subject)} tone="danger" size={39} />
                  </View>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card>
            <EmptyState icon="library-outline" title="أضف أول مادة" description="اجمع مهامك وجلساتك تحت موادك الدراسية." action={<PrimaryButton label="إضافة مادة" icon="add" onPress={() => setFormVisible(true)} />} />
          </Card>
        )}
      </Page>
      <SubjectForm
        key={formVisible ? editing?.id ?? "new-subject" : "closed-subject-form"}
        visible={formVisible}
        subject={editing}
        onClose={closeForm}
        onSave={(value) => editing ? updateSubject(editing.id, value) : addSubject(value)}
      />
      <ConfirmSheet
        visible={Boolean(deleting)}
        title="حذف المادة؟"
        description={`ستُحذف مادة «${deleting?.name ?? "المادة"}». تبقى المهام والجلسات كما هي وتُفصل عن المادة.`}
        onClose={() => setDeleting(null)}
        onConfirm={() => { if (deleting) deleteSubject(deleting.id); setDeleting(null); }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: { gap: 11 },
  subjectCard: { flexDirection: "row", alignItems: "center", direction: "rtl", gap: 13, padding: 14 },
  colorRail: { width: 5, height: 61, borderRadius: 8 },
  subjectContent: { flex: 1, alignItems: "flex-start", gap: 5 },
  subjectName: { color: COLORS.ink, fontSize: 17, fontWeight: "900", textAlign: "right", writingDirection: "rtl" },
  subjectMeta: { color: COLORS.muted, fontSize: 12, textAlign: "right", writingDirection: "rtl" },
  sessionsRow: { flexDirection: "row", alignItems: "center", gap: 4, direction: "rtl" },
  sessionText: { color: COLORS.muted, fontSize: 11, writingDirection: "rtl" },
  actions: { gap: 7 },
});
