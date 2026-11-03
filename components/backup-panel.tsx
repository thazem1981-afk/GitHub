import React, { useState } from "react";
import { Share, StyleSheet, Text, View } from "react-native";
import { BottomSheet, Card, FieldInput, PrimaryButton, SecondaryButton, SectionTitle } from "@/components/study-ui";
import { useStudyStore } from "@/hooks/use-study-store";
import { COLORS } from "@/lib/study-utils";

/**
 * Manual backup: export the whole study state as JSON through the system
 * share sheet, and import a previously exported backup by pasting its text.
 * Import is validated against the v1 schema before anything is replaced.
 */
export function BackupPanel() {
  const { exportBackup, importBackup } = useStudyStore();
  const [importVisible, setImportVisible] = useState(false);
  const [importText, setImportText] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageIsError, setMessageIsError] = useState(false);

  const share = () => {
    Share.share({ message: exportBackup() }).catch(() => undefined);
  };

  const attemptImport = () => {
    if (!importText.trim()) {
      setMessage("الصق نص النسخة الاحتياطية أولاً.");
      setMessageIsError(true);
      return;
    }
    setConfirming(true);
  };

  const runImport = () => {
    setConfirming(false);
    const ok = importBackup(importText);
    if (ok) {
      setImportText("");
      setImportVisible(false);
      setMessage("تمت استعادة النسخة الاحتياطية بنجاح.");
      setMessageIsError(false);
    } else {
      setMessage("النص الملصوق ليس نسخة احتياطية صالحة من «دَرْس»؛ لم يتغيّر أي شيء.");
      setMessageIsError(true);
    }
  };

  return (
    <View style={styles.wrap}>
      <SectionTitle title="النسخ الاحتياطي" />
      <Card style={styles.card}>
        <Text style={styles.body}>
          بياناتك محفوظة على هذا الجهاز فقط. صدّر نسخة احتياطية واحتفظ بها في مكان آمن، وستتمكن من استعادتها إذا غيّرت هاتفك أو حُذف التطبيق.
        </Text>
        <View style={styles.actions}>
          <SecondaryButton label="تصدير نسخة" icon="share-outline" onPress={share} style={styles.button} />
          <SecondaryButton label={importVisible ? "إخفاء الاستيراد" : "استيراد نسخة"} icon="download-outline" tone="neutral" onPress={() => setImportVisible((value) => !value)} style={styles.button} />
        </View>
        {importVisible ? (
          <>
            <FieldInput
              multiline
              value={importText}
              onChangeText={setImportText}
              placeholder="الصق هنا نص النسخة الاحتياطية كاملاً…"
              style={styles.input}
            />
            <SecondaryButton label="استعادة من النص الملصوق" icon="checkmark-circle-outline" onPress={attemptImport} />
          </>
        ) : null}
        {message ? (
          <Text style={[styles.message, messageIsError && styles.messageError]}>{message}</Text>
        ) : null}
      </Card>

      <BottomSheet visible={confirming} title="استبدال بياناتك الحالية؟" onClose={() => setConfirming(false)}>
        <Text style={styles.body}>
          ستُستبدل كل بياناتك الحالية (المواد والمهام والجلسات والاختبارات) بمحتوى النسخة الاحتياطية. تُحفظ نسخة أمان من بياناتك الحالية تلقائياً قبل الاستبدال.
        </Text>
        <PrimaryButton label="استبدال واستعادة" icon="checkmark-circle-outline" onPress={runImport} />
        <SecondaryButton label="إلغاء" onPress={() => setConfirming(false)} tone="neutral" />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  card: { gap: 12 },
  body: { color: COLORS.muted, fontSize: 13, lineHeight: 20, textAlign: "right", writingDirection: "rtl" },
  actions: { flexDirection: "row", gap: 8, direction: "rtl" },
  button: { flex: 1, minHeight: 44, paddingHorizontal: 6 },
  input: { minHeight: 110, textAlignVertical: "top", writingDirection: "ltr" },
  message: { color: COLORS.brand, fontSize: 12, fontWeight: "700", textAlign: "right", writingDirection: "rtl" },
  messageError: { color: COLORS.red },
});
