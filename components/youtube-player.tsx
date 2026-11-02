import React, { useEffect } from "react";
import { Linking, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import { Ionicons } from "@expo/vector-icons";
import { youtubeEmbedUrl, youtubeWatchUrl, type Lesson } from "@/lib/lessons";
import { COLORS } from "@/lib/study-utils";

export function YoutubePlayer({
  lesson,
  watched,
  onToggleWatched,
  onClose,
}: {
  lesson: Lesson | null;
  watched: boolean;
  onToggleWatched: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!lesson) return;
    activateKeepAwakeAsync("lesson-player").catch(() => undefined);
    return () => { deactivateKeepAwake("lesson-player").catch(() => undefined); };
  }, [lesson]);

  return (
    <Modal visible={lesson !== null} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="إغلاق الدرس" style={styles.closeButton}>
            <Ionicons name="close" size={22} color={COLORS.white} />
          </Pressable>
          <Text numberOfLines={2} style={styles.title}>{lesson?.title ?? ""}</Text>
        </View>

        <View style={styles.playerWrap}>
          {lesson ? (
            <WebView
              key={lesson.id}
              source={{ uri: youtubeEmbedUrl(lesson) }}
              style={styles.webview}
              allowsFullscreenVideo
              javaScriptEnabled
              domStorageEnabled
              mediaPlaybackRequiresUserAction={false}
              setSupportMultipleWindows={false}
            />
          ) : null}
        </View>

        {lesson ? (
          <View style={styles.footer}>
            <Text style={styles.channel}>{lesson.channel} • {lesson.subject}</Text>
            <View style={styles.actions}>
              <Pressable onPress={onToggleWatched} style={[styles.actionButton, watched && styles.actionButtonActive]}>
                <Ionicons name={watched ? "checkmark-circle" : "checkmark-circle-outline"} size={19} color={watched ? COLORS.white : COLORS.brand} />
                <Text style={[styles.actionText, watched && styles.actionTextActive]}>{watched ? "تمت المشاهدة" : "علّم كمشاهَد"}</Text>
              </Pressable>
              <Pressable onPress={() => Linking.openURL(youtubeWatchUrl(lesson)).catch(() => undefined)} style={styles.actionButton}>
                <Ionicons name="logo-youtube" size={19} color={COLORS.red} />
                <Text style={styles.actionText}>افتح في يوتيوب</Text>
              </Pressable>
            </View>
            <Text style={styles.note}>التشغيل يتم عبر يوتيوب ويحتاج اتصالاً بالإنترنت؛ قائمة الدروس نفسها محفوظة داخل التطبيق دائماً.</Text>
          </View>
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#122019", direction: "rtl" },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12, direction: "rtl" },
  closeButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" },
  title: { flex: 1, color: COLORS.white, fontSize: 15, fontWeight: "800", textAlign: "right", writingDirection: "rtl", lineHeight: 22 },
  playerWrap: { width: "100%", aspectRatio: 16 / 9, backgroundColor: "#000000" },
  webview: { flex: 1, backgroundColor: "#000000" },
  footer: { padding: 18, gap: 14 },
  channel: { color: "#C9D6CC", fontSize: 13, fontWeight: "700", textAlign: "right", writingDirection: "rtl" },
  actions: { flexDirection: "row", gap: 10, direction: "rtl" },
  actionButton: { flex: 1, minHeight: 50, borderRadius: 15, backgroundColor: COLORS.white, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, paddingHorizontal: 10 },
  actionButtonActive: { backgroundColor: COLORS.brand },
  actionText: { color: COLORS.ink, fontSize: 13, fontWeight: "800", writingDirection: "rtl" },
  actionTextActive: { color: COLORS.white },
  note: { color: "#93A89A", fontSize: 12, lineHeight: 19, textAlign: "right", writingDirection: "rtl" },
});
