export const GRADES = [
  { id: "primary-1", label: "الأول الابتدائي" },
  { id: "primary-2", label: "الثاني الابتدائي" },
  { id: "primary-3", label: "الثالث الابتدائي" },
  { id: "primary-4", label: "الرابع الابتدائي" },
  { id: "primary-5", label: "الخامس الابتدائي" },
  { id: "primary-6", label: "السادس الابتدائي" },
  { id: "middle-1", label: "الأول المتوسط" },
  { id: "middle-2", label: "الثاني المتوسط" },
  { id: "middle-3", label: "الثالث المتوسط" },
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
}

export interface StudyState {
  version: 1;
  gradeId: GradeId | null;
  subjects: Subject[];
  tasks: StudyTask[];
  sessions: StudySession[];
}

export const EMPTY_STUDY_STATE: StudyState = {
  version: 1,
  gradeId: null,
  subjects: [],
  tasks: [],
  sessions: [],
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
