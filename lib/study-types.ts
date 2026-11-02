export const GRADES = [
  { id: "primary-1", label: "الأول الابتدائي", stage: "الابتدائي" },
  { id: "primary-2", label: "الثاني الابتدائي", stage: "الابتدائي" },
  { id: "primary-3", label: "الثالث الابتدائي", stage: "الابتدائي" },
  { id: "primary-4", label: "الرابع الابتدائي", stage: "الابتدائي" },
  { id: "primary-5", label: "الخامس الابتدائي", stage: "الابتدائي" },
  { id: "primary-6", label: "السادس الابتدائي", stage: "الابتدائي" },
  { id: "middle-1", label: "الأول الإعدادي", stage: "الإعدادي" },
  { id: "middle-2", label: "الثاني الإعدادي", stage: "الإعدادي" },
  { id: "middle-3", label: "الثالث الإعدادي", stage: "الإعدادي" },
  { id: "secondary-1", label: "الأول الثانوي", stage: "الثانوي" },
  { id: "secondary-2", label: "الثاني الثانوي", stage: "الثانوي" },
  { id: "secondary-3", label: "الثالث الثانوي", stage: "الثانوي" },
] as const;

export type GradeId = (typeof GRADES)[number]["id"];
export type TaskPriority = "high" | "medium" | "low";
export type SessionStatus = "running" | "paused" | "completed";

export interface Subject {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface StudyTask {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  dueAt: string;
  priority: TaskPriority;
  completedAt: number | null;
  createdAt: number;
}

export interface StudySession {
  id: string;
  subjectId: string | null;
  taskId: string | null;
  status: SessionStatus;
  startedAt: number | null;
  elapsedMs: number;
  finishedAt: number | null;
  createdAt: number;
  /** Optional session goal chosen before starting; absent in older saved sessions. */
  goalMs?: number | null;
}

export interface MonthlyTest {
  id: string;
  subjectId: string;
  /** Calendar month the school test belongs to, formatted "YYYY-MM". */
  monthKey: string;
  score: number;
  total: number;
  notes: string;
  createdAt: number;
}

export interface StudyState {
  version: 1;
  gradeId: GradeId | null;
  subjects: Subject[];
  tasks: StudyTask[];
  sessions: StudySession[];
  monthlyTests: MonthlyTest[];
  watchedLessonIds: string[];
}

export const EMPTY_STUDY_STATE: StudyState = {
  version: 1,
  gradeId: null,
  subjects: [],
  tasks: [],
  sessions: [],
  monthlyTests: [],
  watchedLessonIds: [],
};

export const PRIORITY_RANK: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
};
