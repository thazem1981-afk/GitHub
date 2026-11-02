import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GradePicker } from "@/components/grade-picker";
import { TaskCard } from "@/components/task-card";
import { StorageNotice } from "@/components/storage-notice";
import { Card, EmptyState, IconButton, LoadingView, Page, PageHeader, Pill, PrimaryButton, SecondaryButton, SectionTitle } from "@/components/study-ui";
import { useStudyStore } from "@/hooks/use-study-store";
import { COLORS, elapsedMilliseconds, formatClock, formatDuration, gradeLabel, sortTasks, toArabicDigits } from "@/lib/study-utils";

export default function DashboardScreen() {
  const router = useRouter();
  const { state, ready, setGrade, toggleTask, pauseSession, resumeSession, finishSession } = useStudyStore();
  const [gradePicker, setGradePicker] = useState(false);
  const [clock, setClock] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const openTasks = useMemo(() => sortTasks(state.tasks.filter((task) => task.completedAt === null)), [state.tasks]);
  const recentCompleted = useMemo(() => state.tasks
    .filter((task) => task.completedAt !== null)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
    .slice(0, 2), [state.tasks]);
  const doneCount = state.tasks.filter((task) => task.completedAt !== null).length;
  const activeSession = state.sessions.find((session) => session.status !== "completed") ?? null;
  const activeElapsed = activeSession ? elapsedMilliseconds(activeSession, clock) : 0;
  const activeSubject = activeSession ? state.subjects.find((subject) => subject.id === activeSession.subjectId) : undefined;
  const totalStudyTime = state.sessions.reduce((sum, session) => sum + elapsedMilliseconds(session, clock), 0);
  const hour = clock ? new Date(clock).getHours() : 12;
  const greeting = hour < 12 ? "صباح الخير" : hour < 18 ? "أهلاً بك" : "مساء الخير";

  if (!ready) return <LoadingView />;

  return (
    <>
      <Page>
        <StorageNotice />
        <PageHeader
          title="دَرْس"
          subtitle={`${greeting}، ${gradeLabel(state.gradeId)}`}
          right={<IconButton icon="settings-outline" label="تغيير الصف الدراسي" onPress={() => setGradePicker(true)} tone="neutral" />}
        />

        <Card style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.heroMark}><Ionicons name="book-outline" size={22} color={COLORS.brand} /></View>
            <Pill label="دفتر يومك" color={COLORS.white} background="rgba(255,255,255,0.16)" />
          </View>
          <Text style={styles.heroTitle}>ابدأ بخطوة صغيرة</Text>
          <Text style={styles.heroBody}>رتّب وقتك، وأنجز مهمة واحدة في كل مرة.</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={18} color={COLORS.white} />
              <Text style={styles.timeValue}>{formatDuration(totalStudyTime)}</Text>
            </View>
            <PrimaryButton label="ابدأ جلسة" icon="play" onPress={() => router.push("/(tabs)/timer" as never)} style={styles.heroButton} />
          </View>
        </Card>

        {activeSession ? (
          <Card style={styles.liveCard}>
            <View style={styles.liveTop}>
              <View style={styles.liveMark}><Ionicons name={activeSession.status === "running" ? "timer-outline" : "pause-circle-outline"} size={21} color={COLORS.brand} /></View>
              <View style={styles.liveText}>
                <Text style={styles.liveTitle}>{activeSession.status === "running" ? "جلسة مذاكرة جارية الآن" : "جلسة متوقفة مؤقتاً"}</Text>
                <Text style={styles.liveSubject}>{activeSubject?.name ?? "جلسة مستقلة"}{activeSession.goalMs ? ` • الهدف ${formatDuration(activeSession.goalMs)}` : ""}</Text>
              </View>
              <Text style={styles.liveClock}>{formatClock(activeElapsed)}</Text>
            </View>
            <View style={styles.liveActions}>
              {activeSession.status === "running" ? (
                <SecondaryButton label="إيقاف مؤقت" icon="pause" onPress={() => pauseSession(activeSession.id)} style={styles.liveButton} />
              ) : (
                <SecondaryButton label="استئناف" icon="play" onPress={() => resumeSession(activeSession.id)} style={styles.liveButton} />
              )}
              <SecondaryButton label="إنهاء الجلسة" icon="stop" tone="danger" onPress={() => finishSession(activeSession.id)} style={styles.liveButton} />
              <SecondaryButton label="فتح المؤقّت" icon="time-outline" tone="neutral" onPress={() => router.push("/(tabs)/timer" as never)} style={styles.liveButton} />
            </View>
          </Card>
        ) : null}

        <View style={styles.quickStats}>
          <QuickStat icon="book-outline" value={toArabicDigits(state.subjects.length)} label="مواد" />
          <View style={styles.statDivider} />
          <QuickStat icon="hourglass-outline" value={toArabicDigits(state.sessions.length)} label="جلسات" />
          <View style={styles.statDivider} />
          <QuickStat icon="checkmark-circle-outline" value={toArabicDigits(doneCount)} label="منجزة" />
        </View>

        <View style={styles.section}>
          <SectionTitle title="المهام القادمة" actionLabel="كل المهام" onAction={() => router.push("/(tabs)/tasks" as never)} />
          {openTasks.length ? (
            <View style={styles.list}>
              {openTasks.slice(0, 3).map((task) => (
                <TaskCard key={task.id} task={task} subject={state.subjects.find((subject) => subject.id === task.subjectId)} compact onToggle={() => toggleTask(task.id)} />
              ))}
            </View>
          ) : (
            <Card>
              <EmptyState icon="checkmark-done-outline" title="لا توجد مهام قادمة" description="أضف مهمة بسيطة لتبدأ بها، أو خذ وقتاً للراحة." />
            </Card>
          )}
        </View>

        {recentCompleted.length ? (
          <View style={styles.section}>
            <SectionTitle title="آخر ما أنجزت" />
            <View style={styles.list}>
              {recentCompleted.map((task) => (
                <TaskCard key={task.id} task={task} subject={state.subjects.find((subject) => subject.id === task.subjectId)} compact onToggle={() => toggleTask(task.id)} />
              ))}
            </View>
          </View>
        ) : null}
      </Page>

      <GradePicker
        visible={gradePicker || (ready && !state.gradeId)}
        selectedId={state.gradeId}
        required={!state.gradeId}
        onClose={() => setGradePicker(false)}
        onSelect={(gradeId) => { setGrade(gradeId); setGradePicker(false); }}
      />
    </>
  );
}

function QuickStat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={18} color={COLORS.brand} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: COLORS.brand, borderColor: COLORS.brand, padding: 20, gap: 11, overflow: "hidden" },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", direction: "rtl" },
  heroMark: { width: 40, height: 40, borderRadius: 14, backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" },
  heroTitle: { color: COLORS.white, fontSize: 23, fontWeight: "900", writingDirection: "rtl", textAlign: "right", marginTop: 2 },
  heroBody: { color: "#E3EBE4", fontSize: 14, lineHeight: 21, textAlign: "right", writingDirection: "rtl" },
  timeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 5, direction: "rtl" },
  timeBadge: { flexDirection: "row", alignItems: "center", gap: 7 },
  timeValue: { color: COLORS.white, fontSize: 14, fontWeight: "800", writingDirection: "rtl" },
  heroButton: { backgroundColor: COLORS.white, minHeight: 44, borderRadius: 14, paddingHorizontal: 16 },
  liveCard: { gap: 13 },
  liveTop: { flexDirection: "row", alignItems: "center", gap: 11, direction: "rtl" },
  liveMark: { width: 42, height: 42, borderRadius: 14, backgroundColor: COLORS.brandSoft, alignItems: "center", justifyContent: "center" },
  liveText: { flex: 1, gap: 3, alignItems: "flex-start" },
  liveTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "800", textAlign: "right", writingDirection: "rtl" },
  liveSubject: { color: COLORS.muted, fontSize: 12, writingDirection: "rtl" },
  liveClock: { color: COLORS.brand, fontSize: 19, fontWeight: "800", fontVariant: ["tabular-nums"], writingDirection: "ltr" },
  liveActions: { flexDirection: "row", gap: 8, direction: "rtl" },
  liveButton: { flex: 1, minHeight: 44, paddingHorizontal: 6 },
  quickStats: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, paddingVertical: 15, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-around", direction: "rtl" },
  statItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  statValue: { color: COLORS.ink, fontSize: 17, fontWeight: "900" },
  statLabel: { color: COLORS.muted, fontSize: 12, writingDirection: "rtl" },
  statDivider: { width: 1, height: 25, backgroundColor: COLORS.line },
  section: { gap: 12 },
  list: { gap: 9 },
});
