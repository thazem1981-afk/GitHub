import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { youtubeThumbnailUrl, type Lesson } from "@/lib/lessons";
import { COLORS } from "@/lib/study-utils";

export function LessonCard({
  lesson,
  watched,
  onPlay,
  onToggleWatched,
}: {
  lesson: Lesson;
  watched: boolean;
  onPlay: () => void;
  onToggleWatched: () => void;
}) {
  const thumbnail = youtubeThumbnailUrl(lesson);
  return (
    <View style={styles.card}>
      <Pressable onPress={onPlay} accessibilityRole="button" accessibilityLabel={`تشغيل درس ${lesson.title}`} style={styles.thumbWrap}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.thumb} resizeMode="cover" />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Ionicons name="albums-outline" size={30} color={COLORS.brand} />
          </View>
        )}
        <View style={styles.playBadge}>
          <Ionicons name="play" size={17} color={COLORS.white} />
        </View>
        <View style={styles.kindBadge}>
          <Text style={styles.kindText}>{lesson.kind === "playlist" ? "قائمة تشغيل" : "فيديو"}</Text>
        </View>
      </Pressable>

      <View style={styles.body}>
        <Pressable onPress={onPlay} style={styles.textWrap}>
          <Text numberOfLines={2} style={styles.title}>{lesson.title}</Text>
          <Text numberOfLines={1} style={styles.channel}>{lesson.channel}</Text>
        </Pressable>
        <Pressable
          onPress={onToggleWatched}
          accessibilityRole="button"
          accessibilityLabel={watched ? "إلغاء علامة المشاهدة" : "تعليم كمشاهَد"}
          hitSlop={6}
          style={[styles.watchButton, watched && styles.watchButtonActive]}
        >
          <Ionicons name={watched ? "checkmark-circle" : "checkmark-circle-outline"} size={22} color={watched ? COLORS.brand : COLORS.muted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.line, borderRadius: 20, overflow: "hidden" },
  thumbWrap: { width: "100%", aspectRatio: 16 / 9, backgroundColor: COLORS.surfaceAlt },
  thumb: { width: "100%", height: "100%" },
  thumbPlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: COLORS.brandSoft },
  playBadge: { position: "absolute", bottom: 10, insetInlineStart: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(18,32,25,0.82)", alignItems: "center", justifyContent: "center" },
  kindBadge: { position: "absolute", top: 10, insetInlineEnd: 10, backgroundColor: "rgba(18,32,25,0.82)", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 },
  kindText: { color: COLORS.white, fontSize: 11, fontWeight: "700", writingDirection: "rtl" },
  body: { flexDirection: "row", alignItems: "center", gap: 10, padding: 13, direction: "rtl" },
  textWrap: { flex: 1, gap: 4, alignItems: "flex-start" },
  title: { color: COLORS.ink, fontSize: 14, fontWeight: "800", textAlign: "right", writingDirection: "rtl", lineHeight: 20 },
  channel: { color: COLORS.muted, fontSize: 12, writingDirection: "rtl" },
  watchButton: { width: 40, height: 40, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surfaceAlt },
  watchButtonActive: { backgroundColor: COLORS.brandSoft },
});
