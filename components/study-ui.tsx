import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/lib/study-utils";

export function Page({
  children,
  contentContainerStyle,
  scroll = true,
}: {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  scroll?: boolean;
}) {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      {scroll ? (
        <ScrollView
          style={styles.page}
          contentContainerStyle={[styles.pageContent, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : <View style={styles.page}>{children}</View>}
    </SafeAreaView>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.pageHeader}>
      <View style={styles.headerText}>
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionTitleRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} style={styles.linkButton}>
          <Text style={styles.linkText}>{actionLabel}</Text>
          <Ionicons name="chevron-back" size={15} color={COLORS.brand} />
        </Pressable>
      ) : null}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={19} color={COLORS.white} /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({
  label,
  onPress,
  icon,
  tone = "brand",
  style,
}: {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  tone?: "brand" | "danger" | "neutral";
  style?: ViewStyle;
}) {
  const color = tone === "danger" ? COLORS.red : tone === "neutral" ? COLORS.ink : COLORS.brand;
  const background = tone === "danger" ? COLORS.redSoft : tone === "neutral" ? COLORS.surfaceAlt : COLORS.brandSoft;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.secondaryButton, { backgroundColor: background }, pressed && styles.pressed, style]}>
      {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
      <Text style={[styles.secondaryButtonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  tone = "brand",
  size = 42,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  label: string;
  tone?: "brand" | "danger" | "neutral";
  size?: number;
}) {
  const color = tone === "danger" ? COLORS.red : tone === "neutral" ? COLORS.muted : COLORS.brand;
  const backgroundColor = tone === "danger" ? COLORS.redSoft : tone === "neutral" ? COLORS.surfaceAlt : COLORS.brandSoft;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.iconButton, { width: size, height: size, backgroundColor }, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

export function Pill({
  label,
  color = COLORS.brand,
  background = COLORS.brandSoft,
  icon,
}: {
  label: string;
  color?: string;
  background?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: background }]}>
      {icon ? <Ionicons name={icon} size={13} color={color} /> : null}
      <Text style={[styles.pillText, { color }]}>{label}</Text>
    </View>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export function FieldInput({
  style,
  multiline,
  ...props
}: TextInputProps) {
  return (
    <TextInput
      {...props}
      multiline={multiline}
      placeholderTextColor={COLORS.muted}
      textAlign="right"
      style={[styles.input, multiline && styles.multilineInput, style]}
    />
  );
}

export function BottomSheet({
  visible,
  title,
  onClose,
  children,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.modalRoot}>
        <Pressable accessibilityRole="button" accessibilityLabel="إغلاق" onPress={onClose} style={styles.backdrop} />
        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <IconButton icon="close" label="إغلاق" onPress={onClose} tone="neutral" size={36} />
          </View>
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetBody}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export function LoadingView() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color={COLORS.brand} size="large" />
      <Text style={styles.loadingText}>نجهّز دفتر دَرْس…</Text>
    </View>
  );
}

export function EmptyState({
  icon = "book-outline",
  title,
  description,
  action,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={COLORS.brand} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? <Text style={styles.emptyDescription}>{description}</Text> : null}
      {action ? <View style={styles.emptyAction}>{action}</View> : null}
    </View>
  );
}

export function TextButton({
  label,
  onPress,
  color = COLORS.brand,
}: {
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}>
      <Text style={[styles.textButtonLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background, direction: "rtl" },
  page: { flex: 1, backgroundColor: COLORS.background, direction: "rtl" },
  pageContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28, gap: 22 },
  pageHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, direction: "rtl" },
  headerText: { flex: 1, gap: 5, alignItems: "flex-start" },
  pageTitle: { color: COLORS.ink, fontSize: 26, fontWeight: "800", writingDirection: "rtl", textAlign: "right" },
  pageSubtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 21, writingDirection: "rtl", textAlign: "right" },
  card: { backgroundColor: COLORS.surface, borderRadius: 22, borderColor: COLORS.line, borderWidth: 1, padding: 16, gap: 12 },
  sectionTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", direction: "rtl" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.ink, writingDirection: "rtl", textAlign: "right" },
  linkButton: { flexDirection: "row", alignItems: "center", gap: 3 },
  linkText: { color: COLORS.brand, fontSize: 13, fontWeight: "700", writingDirection: "rtl" },
  primaryButton: { minHeight: 52, borderRadius: 17, backgroundColor: COLORS.brand, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  primaryButtonText: { color: COLORS.white, fontSize: 15, fontWeight: "800", writingDirection: "rtl" },
  secondaryButton: { minHeight: 46, borderRadius: 15, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  secondaryButtonText: { fontSize: 14, fontWeight: "700", writingDirection: "rtl" },
  iconButton: { borderRadius: 15, alignItems: "center", justifyContent: "center" },
  pill: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 30, paddingHorizontal: 10, paddingVertical: 6, alignSelf: "flex-start" },
  pillText: { fontSize: 12, fontWeight: "700", writingDirection: "rtl" },
  fieldLabel: { color: COLORS.ink, fontSize: 14, fontWeight: "700", textAlign: "right", writingDirection: "rtl" },
  input: { minHeight: 50, borderRadius: 15, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.surface, paddingHorizontal: 14, color: COLORS.ink, fontSize: 15, writingDirection: "rtl", textAlign: "right" },
  multilineInput: { minHeight: 92, paddingTop: 13, textAlignVertical: "top" },
  modalRoot: { flex: 1, justifyContent: "flex-end", direction: "rtl" },
  backdrop: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "rgba(22,35,29,0.36)" },
  sheet: { maxHeight: "90%", backgroundColor: COLORS.background, borderTopLeftRadius: 26, borderTopRightRadius: 26, overflow: "hidden", paddingTop: 10, direction: "rtl" },
  sheetHandle: { alignSelf: "center", width: 40, height: 5, borderRadius: 8, backgroundColor: "#D4D2CA", marginBottom: 12 },
  sheetHeader: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: COLORS.line, direction: "rtl" },
  sheetTitle: { color: COLORS.ink, fontSize: 19, fontWeight: "800", writingDirection: "rtl", textAlign: "right" },
  sheetScroll: { flexShrink: 1 },
  sheetBody: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 22, gap: 16 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: COLORS.background },
  loadingText: { color: COLORS.muted, fontSize: 14, writingDirection: "rtl" },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 24, gap: 10 },
  emptyIcon: { width: 60, height: 60, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.brandSoft },
  emptyTitle: { color: COLORS.ink, fontSize: 16, fontWeight: "800", textAlign: "center", writingDirection: "rtl" },
  emptyDescription: { color: COLORS.muted, fontSize: 13, lineHeight: 20, textAlign: "center", writingDirection: "rtl", maxWidth: 260 },
  emptyAction: { marginTop: 6, width: "100%" },
  textButton: { minHeight: 40, alignItems: "center", justifyContent: "center", paddingHorizontal: 12 },
  textButtonLabel: { fontWeight: "700", fontSize: 14, writingDirection: "rtl" },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  disabledButton: { opacity: 0.45 },
});
