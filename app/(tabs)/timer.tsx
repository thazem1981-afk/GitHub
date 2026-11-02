import React, { useEffect, useMemo, useState } from "react";
import { AppState, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheet, Card, EmptyState, LoadingView, Page, PageHeader, PrimaryButton, SecondaryButton } from "@/components/study-ui";
import { StorageNotice } from "@/components/storage-notice";
import { useStudyStore } from "@/hooks/use-study-store";
import { COLORS, elapsedMilliseconds, formatClock, formatDate, formatDuration } from "@/lib/study-utils";

export default function TimerScreen() {
  const { state, ready, startSession, pauseSession, resumeSession, finishSession } = useStudyStore();
  const [tick, setTick] = useState(0);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [picker, setPicker] = useState<"subject" | "task" | null>(null);
  const activeSession = state.sessions.find((session) => session.status !== "completed") ?? null;
  const isRunning = activeSession?.status === "running";
  const elapsed = activeSession ? elapsedMilliseconds(activeSession, tick) : 0;
  const selectedSubjectId = activeSession ? activeSession.subjectId : subjectId;
  const selectedTaskId = activeSession ? activeSession.taskId : taskId;
  const selectedSubject = state.subjects.find((subject) => subject.id === selectedSubjectId);
  const selectedTask = state.tasks.find((task) => task.id === selectedTaskId);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isRunning, activeSession?.id]);
  useEffect(() => {
    const subscription = AppState.addEventListener("change", () => setTick(Date.now()));
    return () => subscription.remove();
  }, []);

  const history = useMemo(() => state.sessions.filter((session) => session.status === "completed").sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0)).slice(0, 8), [state.sessions]);
  const start = () => {
    setTick(Date.now());
    startSession(subjectId, taskId);
  };
  const finish = () => {
    if (!activeSession) return;
    finishSession(activeSession.id);
    setTaskId(null);
    setSubjectId(null);
  };

  if (!ready) return <LoadingView />;

  return (
    <>
      <Page contentContainerStyle={styles.pageContent}>
        <StorageNotice />
        <PageHeader title="جلسة مذاكرة" subtitle="ركّز في خطوتك الحالية، والباقي ينتظر" />

        <Card style={styles.timerCard}>
          <View style={styles.timerOrb}>
            <Ionicons name="hourglass-outline" size={23} color={COLORS.brand} />
          </View>
          <Text style={styles.timerCaption}>{activeSession ? activeSession.status === "paused" ? "الجلسة متوقفة مؤقتاً" : "وقت التركيز" : "على مهل… خذ نفساً وابدأ"}</Text>
          <Text style={styles.timerDigits} accessibilityLabel={`الوقت ${formatClock(elapsed)}`}>{formatClock(elapsed)}</Text>
          <Text style={styles.timerDetail}>{formatDuration(elapsed)} من المذاكرة</Text>
          <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${Math.min(100, Math.max(7, (elapsed / (25 * 60_000)) * 100))}%` }]} /></View>
          <Text style={styles.focusHint}>كل دقيقة تركيز تُحسب لك</Text>
        </Card>

        <View style={styles.linkSection}>
          <Text style={styles.sectionTitle}>اربط جلستك (اختياري)</Text>
          <SelectionRow
            icon="book-outline"
            title="المادة"
            value={selectedSubject?.name ?? "بدون مادة"}
            color={selectedSubject?.color}
            disabled={Boolean(activeSession)}
            onPress={() => setPicker("subject")}
          />
          <SelectionRow
            icon="list-outline"
            title="المهمة"
            value={selectedTask?.title ?? "بدون مهمة"}
            disabled={Boolean(activeSession)}
            onPress={() => setPicker("task")}
          />
          {activeSession && selectedSubject ? <Text style={styles.linkNote}>ارتباط الجلسة محفوظ ولا يمكن تغييره أثناءها.</Text> : null}
        </View>

        {!activeSession ? (
          <PrimaryButton label="بدء جلسة" icon="play" onPress={start} style={styles.mainButton} />
        ) : activeSession.status === "running" ? (
          <View style={styles.controlRow}>
            <SecondaryButton label="إيقاف مؤقت" icon="pause" onPress={() => pauseSession(activeSession.id)} style={styles.controlButton} />
            <SecondaryButton label="إنهاء الجلسة" icon="stop" onPress={finish} tone="danger" style={styles.controlButton} />
          </View>
        ) : (
          <View style={styles.controlRow}>
            <PrimaryButton label="استئناف" icon="play" onPress={() => { setTick(Date.now()); resumeSession(activeSession.id); }} style={styles.controlButton} />
            <SecondaryButton label="إنهاء الجلسة" icon="stop" onPress={finish} tone="danger" style={styles.controlButton} />
          </View>
        )}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>جلساتك السابقة</Text>
          {history.length ? history.map((session) => {
            const subject = state.subjects.find((item) => item.id === session.subjectId);
            const task = state.tasks.find((item) => item.id === session.taskId);
            return (
              <Card key={session.id} style={styles.historyCard}>
                <View style={styles.historyIcon}><Ionicons name="checkmark" size={18} color={COLORS.brand} /></View>
                <View style={styles.historyText}>
                  <Text style={styles.historyTitle}>{subject?.name ?? task?.title ?? "جلسة مستقلة"}</Text>
                  <Text style={styles.historyDate}>{formatDate(new Date(session.finishedAt ?? session.createdAt).toISOString())}</Text>
                </View>
                <Text style={styles.historyDuration}>{formatDuration(session.elapsedMs)}</Text>
              </Card>
            );
          }) : (
            <Card><EmptyState icon="time-outline" title="ستظهر جلساتك هنا" description="ابدأ جلسة قصيرة، وسيسجل دَرْس وقت مذاكرتك تلقائياً." /></Card>
          )}
        </View>
      </Page>

      <BottomSheet visible={picker === "subject"} title="اختر مادة" onClose={() => setPicker(null)}>
        <PickOption title="بدون مادة" selected={!subjectId} onPress={() => { setSubjectId(null); setTaskId(null); setPicker(null); }} />
        {state.subjects.map((subject) => (
          <PickOption key={subject.id} title={subject.name} selected={subjectId === subject.id} color={subject.color} onPress={() => { setSubjectId(subject.id); setTaskId(null); setPicker(null); }} />
        ))}
        {!state.subjects.length ? <Text style={styles.noOptions}>يمكنك اختيار مادة لاحقاً من تبويب المواد.</Text> : null}
      </BottomSheet>

      <BottomSheet visible={picker === "task"} title="اختر مهمة" onClose={() => setPicker(null)}>
        <PickOption title="بدون مهمة" selected={!taskId} onPress={() => { setTaskId(null); setPicker(null); }} />
        {state.tasks.map((task) => (
          <PickOption key={task.id} title={task.title} subtitle={state.subjects.find((subject) => subject.id === task.subjectId)?.name ?? "بدون مادة"} selected={taskId === task.id} onPress={() => { setTaskId(task.id); setSubjectId(task.subjectId || null); setPicker(null); }} />
        ))}
        {!state.tasks.length ? <Text style={styles.noOptions}>أضف مهمة من تبويب المهام لتربطها بجلسة.</Text> : null}
      </BottomSheet>
    </>
  );
}

function SelectionRow({
  icon,
  title,
  value,
  color,
  disabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  color?: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.selectRow, disabled && styles.disabled]}>
      <View style={[styles.selectionIcon, { backgroundColor: color ? `${color}18` : COLORS.brandSoft }]}><Ionicons name={icon} size={18} color={color ?? COLORS.brand} /></View>
      <View style={styles.selectionText}>
        <Text style={styles.selectionTitle}>{title}</Text>
        <Text numberOfLines={1} style={styles.selectionValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-back" size={18} color={COLORS.muted} />
    </Pressable>
  );
}

function PickOption({
  title,
  subtitle,
  color,
  selected,
  onPress,
}: {
  title: string;
  subtitle?: string;
  color?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.pickOption, selected && styles.pickSelected]}>
      <View style={[styles.pickDot, { backgroundColor: color ?? (selected ? COLORS.brand : COLORS.surfaceAlt) }]} />
      <View style={styles.pickText}>
        <Text style={[styles.pickTitle, selected && styles.pickTitleSelected]}>{title}</Text>
        {subtitle ? <Text style={styles.pickSubtitle}>{subtitle}</Text> : null}
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={19} color={COLORS.brand} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pageContent: { paddingBottom: 26 },
  timerCard: { alignItems: "center", paddingHorizontal: 20, paddingVertical: 24, gap: 10 },
  timerOrb: { width: 50, height: 50, borderRadius: 18, backgroundColor: COLORS.brandSoft, alignItems: "center", justifyContent: "center" },
  timerCaption: { color: COLORS.muted, fontSize: 13, fontWeight: "700", writingDirection: "rtl", textAlign: "center" },
  timerDigits: { color: COLORS.brand, fontSize: 45, fontWeight: "800", letterSpacing: 1, fontVariant: ["tabular-nums"], writingDirection: "ltr" },
  timerDetail: { color: COLORS.ink, fontSize: 13, fontWeight: "700", writingDirection: "rtl" },
  progressTrack: { height: 6, width: "100%", backgroundColor: COLORS.brandSoft, borderRadius: 8, overflow: "hidden", marginTop: 5 },
  progressFill: { height: "100%", backgroundColor: COLORS.brand, borderRadius: 8 },
  focusHint: { color: COLORS.muted, fontSize: 12, writingDirection: "rtl" },
  linkSection: { gap: 10 },
  sectionTitle: { color: COLORS.ink, fontSize: 17, fontWeight: "800", textAlign: "right", writingDirection: "rtl" },
  selectRow: { minHeight: 65, borderRadius: 17, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.line, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 11, direction: "rtl" },
  disabled: { opacity: 0.7 },
  selectionIcon: { width: 37, height: 37, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  selectionText: { flex: 1, gap: 3, alignItems: "flex-start" },
  selectionTitle: { color: COLORS.muted, fontSize: 11, fontWeight: "700", writingDirection: "rtl" },
  selectionValue: { color: COLORS.ink, fontSize: 14, fontWeight: "800", textAlign: "right", writingDirection: "rtl" },
  linkNote: { color: COLORS.muted, fontSize: 11, textAlign: "right", writingDirection: "rtl" },
  mainButton: { minHeight: 58 },
  controlRow: { flexDirection: "row", gap: 10, direction: "rtl" },
  controlButton: { flex: 1, minHeight: 54 },
  historySection: { gap: 11 },
  historyCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 13, direction: "rtl" },
  historyIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: COLORS.brandSoft, alignItems: "center", justifyContent: "center" },
  historyText: { flex: 1, gap: 3, alignItems: "flex-start" },
  historyTitle: { color: COLORS.ink, fontSize: 13, fontWeight: "800", writingDirection: "rtl", textAlign: "right" },
  historyDate: { color: COLORS.muted, fontSize: 11, writingDirection: "rtl" },
  historyDuration: { color: COLORS.brand, fontSize: 13, fontWeight: "800", writingDirection: "rtl" },
  pickOption: { minHeight: 58, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.line, borderRadius: 15, paddingHorizontal: 13, direction: "rtl" },
  pickSelected: { borderColor: COLORS.brand, backgroundColor: COLORS.brandSoft },
  pickDot: { width: 12, height: 12, borderRadius: 6 },
  pickText: { flex: 1, gap: 3, alignItems: "flex-start" },
  pickTitle: { color: COLORS.ink, fontSize: 14, fontWeight: "700", textAlign: "right", writingDirection: "rtl" },
  pickTitleSelected: { color: COLORS.brand, fontWeight: "900" },
  pickSubtitle: { color: COLORS.muted, fontSize: 11, textAlign: "right", writingDirection: "rtl" },
  noOptions: { color: COLORS.muted, fontSize: 13, textAlign: "center", writingDirection: "rtl", paddingVertical: 10 },
});
