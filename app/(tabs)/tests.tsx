import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ConfirmSheet } from "@/components/confirm-sheet";
import { MonthlyTestForm, type MonthlyTestFormValue } from "@/components/monthly-test-form";
import { StorageNotice } from "@/components/storage-notice";
import { Card, EmptyState, IconButton, LoadingView, Page, PageHeader, Pill, PrimaryButton } from "@/components/study-ui";
import { useStudyStore } from "@/hooks/use-study-store";
import type { MonthlyTest } from "@/lib/study-types";
import { COLORS, groupTestsByMonth, monthKey, monthLabel, summarizeMonthlyTests, toArabicDigits } from "@/lib/study-utils";

export default function MonthlyTestsScreen() {
  const { state, ready, addMonthlyTest, updateMonthlyTest, deleteMonthlyTest } = useStudyStore();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MonthlyTest | null>(null);
  const [deleting, setDeleting] = useState<MonthlyTest | null>(null);

  const groups = useMemo(() => groupTestsByMonth(state.monthlyTests), [state.monthlyTests]);
  const currentMonthTests = useMemo(
    () => state.monthlyTests.filter((test) => test.monthKey === monthKey(new Date())),
    [state.monthlyTests],
  );
  const currentSummary = summarizeMonthlyTests(currentMonthTests);

  if (!ready) return <LoadingView />;

  const openNew = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (test: MonthlyTest) => { setEditing(test); setFormOpen(true); };
  const save = (value: MonthlyTestFormValue) => {
    if (editing) updateMonthlyTest(editing.id, value);
    else addMonthlyTest(value);
  };

  return (
    <>
      <Page>
        <StorageNotice />
        <PageHeader
          title="اختبارات الشهر"
          subtitle="سجّل نتيجة كل اختبار شهري وراجِع أخطاءك وملاحظاتك قبل الاختبار التالي"
          right={<IconButton icon="add" label="تسجيل اختبار شهر" onPress={openNew} />}
        />

        {currentSummary.count ? (
          <Card style={styles.summaryCard}>
            <View style={styles.summaryTop}>
              <Text style={styles.summaryTitle}>هذا الشهر — {monthLabel(monthKey(new Date()))}</Text>
              <Pill label={`${toArabicDigits(currentSummary.count)} اختبار`} icon="clipboard-outline" />
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>{currentSummary.averagePercent !== null ? `${toArabicDigits(currentSummary.averagePercent)}٪` : "—"}</Text>
                <Text style={styles.summaryLabel}>متوسط النتائج</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>{currentSummary.bestPercent !== null ? `${toArabicDigits(currentSummary.bestPercent)}٪` : "—"}</Text>
                <Text style={styles.summaryLabel}>أفضل نتيجة</Text>
              </View>
            </View>
          </Card>
        ) : null}

        {groups.length ? groups.map((group) => {
          const summary = summarizeMonthlyTests(group.tests);
          return (
            <View key={group.monthKey} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{monthLabel(group.monthKey)}</Text>
                <Text style={styles.groupMeta}>
                  {toArabicDigits(summary.count)} اختبار{summary.averagePercent !== null ? ` • المتوسط ${toArabicDigits(summary.averagePercent)}٪` : ""}
                </Text>
              </View>
              <View style={styles.list}>
                {group.tests.map((test) => {
                  const subject = state.subjects.find((item) => item.id === test.subjectId);
                  const percent = Math.round((test.score / test.total) * 100);
                  return (
                    <Card key={test.id} style={styles.testCard}>
                      <View style={styles.testTop}>
                        <View style={[styles.subjectDot, { backgroundColor: subject?.color ?? COLORS.sage }]} />
                        <Text style={styles.subjectName}>{subject?.name ?? "مادة محذوفة"}</Text>
                        <Pill
                          label={`${toArabicDigits(percent)}٪`}
                          color={percent >= 85 ? COLORS.brand : percent >= 60 ? COLORS.amber : COLORS.red}
                          background={percent >= 85 ? COLORS.brandSoft : percent >= 60 ? COLORS.amberSoft : COLORS.redSoft}
                        />
                      </View>
                      <Text style={styles.scoreLine}>
                        الدرجة: {toArabicDigits(test.score)} من {toArabicDigits(test.total)}
                      </Text>
                      {test.notes ? (
                        <View style={styles.notesBox}>
                          <Text style={styles.notesLabel}>ملاحظات المراجعة</Text>
                          <Text style={styles.notesText}>{test.notes}</Text>
                        </View>
                      ) : null}
                      <View style={styles.actions}>
                        <IconButton icon="create-outline" label="تعديل الاختبار" tone="neutral" size={38} onPress={() => openEdit(test)} />
                        <IconButton icon="trash-outline" label="حذف الاختبار" tone="danger" size={38} onPress={() => setDeleting(test)} />
                      </View>
                    </Card>
                  );
                })}
              </View>
            </View>
          );
        }) : (
          <Card>
            <EmptyState
              icon="clipboard-outline"
              title="لا توجد اختبارات مسجلة بعد"
              description="بعد كل اختبار شهري في المدرسة، سجّل درجتك وملاحظاتك هنا لتراجع أخطاءك وتتابع تقدمك شهراً بعد شهر."
              action={<PrimaryButton label="تسجيل أول اختبار" icon="add" onPress={openNew} />}
            />
          </Card>
        )}
      </Page>

      {formOpen ? (
        <MonthlyTestForm
          visible
          test={editing}
          subjects={state.subjects}
          onClose={() => setFormOpen(false)}
          onSave={save}
        />
      ) : null}

      <ConfirmSheet
        visible={deleting !== null}
        title="حذف اختبار الشهر؟"
        description="سيُحذف سجل هذا الاختبار وملاحظات مراجعته نهائياً من الجهاز."
        onClose={() => setDeleting(null)}
        onConfirm={() => { if (deleting) deleteMonthlyTest(deleting.id); setDeleting(null); }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  summaryCard: { backgroundColor: COLORS.brandSoft, borderColor: COLORS.brandSoft, gap: 14 },
  summaryTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", direction: "rtl" },
  summaryTitle: { color: COLORS.brandDark, fontSize: 15, fontWeight: "800", writingDirection: "rtl" },
  summaryStats: { flexDirection: "row", alignItems: "center", justifyContent: "space-around", direction: "rtl" },
  summaryStat: { alignItems: "center", gap: 3 },
  summaryValue: { color: COLORS.brand, fontSize: 24, fontWeight: "900" },
  summaryLabel: { color: COLORS.muted, fontSize: 12, writingDirection: "rtl" },
  statDivider: { width: 1, height: 34, backgroundColor: COLORS.line },
  group: { gap: 11 },
  groupHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", direction: "rtl" },
  groupTitle: { color: COLORS.ink, fontSize: 17, fontWeight: "800", writingDirection: "rtl" },
  groupMeta: { color: COLORS.muted, fontSize: 12, writingDirection: "rtl" },
  list: { gap: 9 },
  testCard: { gap: 9 },
  testTop: { flexDirection: "row", alignItems: "center", gap: 8, direction: "rtl" },
  subjectDot: { width: 10, height: 10, borderRadius: 5 },
  subjectName: { flex: 1, color: COLORS.ink, fontSize: 14, fontWeight: "800", textAlign: "right", writingDirection: "rtl" },
  scoreLine: { color: COLORS.ink, fontSize: 13, fontWeight: "700", textAlign: "right", writingDirection: "rtl" },
  notesBox: { backgroundColor: COLORS.surfaceAlt, borderRadius: 13, padding: 11, gap: 4 },
  notesLabel: { color: COLORS.muted, fontSize: 11, fontWeight: "700", writingDirection: "rtl" },
  notesText: { color: COLORS.ink, fontSize: 13, lineHeight: 20, textAlign: "right", writingDirection: "rtl" },
  actions: { flexDirection: "row", gap: 8, justifyContent: "flex-start", direction: "rtl" },
});
