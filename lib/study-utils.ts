import {
  GRADES,
  PRIORITY_RANK,
  type MonthlyTest,
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
  return GRADES.find((grade) => grade.id === gradeId)?.label ?? "اختر صفك الدراسي";
}

/** Session length goals offered before starting, in minutes — longer options included on purpose. */
export const SESSION_GOALS_MINUTES = [15, 25, 45, 60, 90, 120] as const;

export const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
] as const;

/** "YYYY-MM" key for the month containing `date`. */
export function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Recent month keys, newest first — used to pick a monthly test's month. */
export function recentMonthKeys(count: number, now = new Date()): string[] {
  const keys: string[] = [];
  for (let offset = 0; offset < count; offset += 1) {
    keys.push(monthKey(new Date(now.getFullYear(), now.getMonth() - offset, 1)));
  }
  return keys;
}

export function monthLabel(key: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(key);
  if (!match) return key;
  return `${ARABIC_MONTHS[Number(match[2]) - 1]} ${toArabicDigits(match[1])}`;
}

export interface MonthlySummary {
  count: number;
  averagePercent: number | null;
  bestPercent: number | null;
}

export function summarizeMonthlyTests(tests: MonthlyTest[]): MonthlySummary {
  if (!tests.length) return { count: 0, averagePercent: null, bestPercent: null };
  const percents = tests.map((test) => (test.total > 0 ? (test.score / test.total) * 100 : 0));
  const average = percents.reduce((sum, value) => sum + value, 0) / percents.length;
  return {
    count: tests.length,
    averagePercent: Math.round(average),
    bestPercent: Math.round(Math.max(...percents)),
  };
}

export function groupTestsByMonth(tests: MonthlyTest[]): { monthKey: string; tests: MonthlyTest[] }[] {
  const groups = new Map<string, MonthlyTest[]>();
  for (const test of tests) {
    const list = groups.get(test.monthKey) ?? [];
    list.push(test);
    groups.set(test.monthKey, list);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, list]) => ({
      monthKey: key,
      tests: [...list].sort((a, b) => b.createdAt - a.createdAt),
    }));
}
