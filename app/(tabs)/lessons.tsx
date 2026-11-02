import React, { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GradePicker } from "@/components/grade-picker";
import { LessonCard } from "@/components/lesson-card";
import { StorageNotice } from "@/components/storage-notice";
import { Card, EmptyState, IconButton, LoadingView, Page, PageHeader, PrimaryButton } from "@/components/study-ui";
import { YoutubePlayer } from "@/components/youtube-player";
import { useStudyStore } from "@/hooks/use-study-store";
import { CURRICULUM_SUBJECTS, lessonsFor, lessonsForGrade, youtubeSearchUrl, type Lesson } from "@/lib/lessons";
import { COLORS, gradeLabel, toArabicDigits } from "@/lib/study-utils";

export default function LessonsScreen() {
  const { state, ready, setGrade, toggleLessonWatched } = useStudyStore();
  const [gradePicker, setGradePicker] = useState(false);
  const [subject, setSubject] = useState<string | null>(null);
  const [playing, setPlaying] = useState<Lesson | null>(null);

  const gradeId = state.gradeId;
  const subjects = useMemo(() => (gradeId ? CURRICULUM_SUBJECTS[gradeId] : []), [gradeId]);
  const activeSubject = subject && subjects.includes(subject) ? subject : subjects[0] ?? null;
  const gradeLessons = useMemo(() => lessonsForGrade(gradeId), [gradeId]);
  const visibleLessons = useMemo(() => lessonsFor(gradeId, activeSubject), [gradeId, activeSubject]);
  const watchedCount = gradeLessons.filter((lesson) => state.watchedLessonIds.includes(lesson.id)).length;

  if (!ready) return <LoadingView />;

  return (
    <>
      <Page>
        <StorageNotice />
        <PageHeader
          title="الدروس"
          subtitle={gradeId ? `فيديوهات يوتيوب لمنهج ${gradeLabel(gradeId)} — متاحة دائماً داخل التطبيق` : "اختر صفك الدراسي لعرض دروس منهجك"}
          right={<IconButton icon="settings-outline" label="تغيير الصف الدراسي" onPress={() => setGradePicker(true)} tone="neutral" />}
        />

        {!gradeId ? (
          <Card>
            <EmptyState
              icon="school-outline"
              title="لم تختر صفك بعد"
              description="اختر الصف الدراسي أولاً، وستظهر هنا دروس المنهج المصري الخاصة به على شكل فيديوهات يوتيوب."
              action={<PrimaryButton label="اختيار الصف الدراسي" icon="school-outline" onPress={() => setGradePicker(true)} />}
            />
          </Card>
        ) : (
          <>
            {gradeLessons.length ? (
              <View style={styles.progressRow}>
                <Ionicons name="checkmark-circle-outline" size={17} color={COLORS.brand} />
                <Text style={styles.progressText}>
                  شاهدت {toArabicDigits(watchedCount)} من {toArabicDigits(gradeLessons.length)} دروساً متاحاً لصفك حتى الآن — والكتالوج يكبر تباعاً.
                </Text>
              </View>
            ) : null}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} style={styles.chipsScroll}>
              {subjects.map((item) => {
                const selected = item === activeSubject;
                return (
                  <Pressable key={item} onPress={() => setSubject(item)} style={[styles.chip, selected && styles.chipSelected]}>
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {visibleLessons.length ? (
              <View style={styles.list}>
                {visibleLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    watched={state.watchedLessonIds.includes(lesson.id)}
                    onPlay={() => setPlaying(lesson)}
                    onToggleWatched={() => toggleLessonWatched(lesson.id)}
                  />
                ))}
              </View>
            ) : (
              <Card>
                <EmptyState
                  icon="logo-youtube"
                  title="دروس هذه المادة تُجهَّز الآن"
                  description="كتالوج الفيديوهات الموثقة لهذه المادة لم يكتمل بعد. في هذه الأثناء يمكنك البحث مباشرة في يوتيوب عن شرح المادة لصفك."
                  action={(
                    <PrimaryButton
                      label="ابحث في يوتيوب"
                      icon="search-outline"
                      onPress={() => { if (activeSubject) Linking.openURL(youtubeSearchUrl(gradeLabel(gradeId), activeSubject)).catch(() => undefined); }}
                    />
                  )}
                />
              </Card>
            )}
          </>
        )}
      </Page>

      <YoutubePlayer
        lesson={playing}
        watched={playing ? state.watchedLessonIds.includes(playing.id) : false}
        onToggleWatched={() => { if (playing) toggleLessonWatched(playing.id); }}
        onClose={() => setPlaying(null)}
      />

      <GradePicker
        visible={gradePicker}
        selectedId={state.gradeId}
        onClose={() => setGradePicker(false)}
        onSelect={(nextGradeId) => { setGrade(nextGradeId); setSubject(null); setGradePicker(false); }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  progressRow: { flexDirection: "row", alignItems: "center", gap: 7, direction: "rtl" },
  progressText: { flex: 1, color: COLORS.muted, fontSize: 12, lineHeight: 18, textAlign: "right", writingDirection: "rtl" },
  chipsScroll: { marginHorizontal: -20 },
  chips: { paddingHorizontal: 20, gap: 8, direction: "rtl" },
  chip: { borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, borderRadius: 30, paddingHorizontal: 14, paddingVertical: 9 },
  chipSelected: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  chipText: { color: COLORS.ink, fontSize: 13, fontWeight: "700", writingDirection: "rtl" },
  chipTextSelected: { color: COLORS.white },
  list: { gap: 12 },
});
