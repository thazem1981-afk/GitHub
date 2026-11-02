import {
  PRIORITY_RANK,
  type StudySession,
  type StudyTask,
} from "./study-types";

export const COLORS = {
  background: "#F7F5EF",
  surface: "#FFFDF9",
  surfaceAlt: "#F0EEE7",
  ink: "#24332D",
  muted: "#77827B",
  line: "#E7E4DB",
  brand: "#31584A",
  brandDark: "#274638",
  brandSoft: "#E6EEE8",
  sage: "#A9BCA8",
  amber: "#D29B43",
  amberSoft: "#F8EEDB",
  red: "#B85F53",
  redSoft: "#F7E8E4",
  white: "#FFFFFF",
};

export const SUBJECT_COLORS = [
  "#31584A",
  "#677C9A",
  "#B48042",
  "#8B668E",
  "#4C8790",
  "#B56555",
];

export function makeId(prefix = "item"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toArabicDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]);
}

export function sortTasks(tasks: StudyTask[]): StudyTask[] {
  return [...tasks].sort((a, b) => {
    const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
  });
}

export function elapsedMilliseconds(session: StudySession, now = Date.now()): number {
  const liveDelta = session.status === "running" && session.startedAt !== null
    ? Math.max(0, now - session.startedAt)
    : 0;
  return Math.max(0, session.elapsedMs + liveDelta);
}

export function formatClock(milliseconds: number): string {
  const totalSeconds = Math.floor(Math.max(0, milliseconds) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const raw = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return toArabicDigits(raw);
}

export function formatDuration(milliseconds: number): string {
  const totalMinutes = Math.floor(Math.max(0, milliseconds) / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${toArabicDigits(minutes)} دقيقة`;
  if (minutes === 0) return `${toArabicDigits(hours)} ساعة`;
  return `${toArabicDigits(hours)} س ${toArabicDigits(minutes)} د`;
}

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 23, 59, 0, 0);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDateKey(isoDate: string): string {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? dateKey(new Date()) : dateKey(date);
}

export function formatDate(isoDate: string, now = new Date()): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "موعد غير محدد";
  if (dateKey(date) === dateKey(now)) return "اليوم";
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  if (dateKey(date) === dateKey(tomorrow)) return "غداً";
  try {
    return new Intl.DateTimeFormat("ar", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return toArabicDigits(dateKey(date));
  }
}

export function isOverdue(task: StudyTask, now = new Date()): boolean {
  return task.completedAt === null && new Date(task.dueAt).getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

export function gradeLabel(gradeId: string | null): string {
  if (!gradeId) return "اختر صفك الدراسي";
  const labels: Record<string, string> = {
    "primary-1": "الأول الابتدائي",
    "primary-2": "الثاني الابتدائي",
    "primary-3": "الثالث الابتدائي",
    "primary-4": "الرابع الابتدائي",
    "primary-5": "الخامس الابتدائي",
    "primary-6": "السادس الابتدائي",
    "middle-1": "الأول المتوسط",
    "middle-2": "الثاني المتوسط",
    "middle-3": "الثالث المتوسط",
  };
  return labels[gradeId] ?? "اختر صفك الدراسي";
}
