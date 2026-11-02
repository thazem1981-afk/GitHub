import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  EMPTY_STUDY_STATE,
  GRADES,
  type MonthlyTest,
  type StudySession,
  type StudyState,
  type StudyTask,
  type Subject,
} from "@/lib/study-types";

const STORAGE_KEY = "dars.study.state.v1";
const GRADE_IDS = new Set<string>(GRADES.map((grade) => grade.id));
const PRIORITIES = new Set(["high", "medium", "low"]);
const SESSION_STATUSES = new Set(["running", "paused", "completed"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonemptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value);
}

function isSubject(value: unknown): value is Subject {
  if (!isRecord(value)) return false;
  return isNonemptyString(value.id)
    && isNonemptyString(value.name)
    && value.name.length <= 40
    && typeof value.color === "string"
    && /^#[\da-f]{6}$/i.test(value.color)
    && isFiniteNumber(value.createdAt);
}

function isStudyTask(value: unknown): value is StudyTask {
  if (!isRecord(value)) return false;
  return isNonemptyString(value.id)
    && isNonemptyString(value.title)
    && value.title.length <= 90
    && typeof value.description === "string"
    && value.description.length <= 300
    && typeof value.subjectId === "string"
    && typeof value.dueAt === "string"
    && Number.isFinite(Date.parse(value.dueAt))
    && typeof value.priority === "string"
    && PRIORITIES.has(value.priority)
    && isNullableNumber(value.completedAt)
    && isFiniteNumber(value.createdAt);
}

function isStudySession(value: unknown): value is StudySession {
  if (!isRecord(value)) return false;
  if (!isNonemptyString(value.id)
    || !(value.subjectId === null || isNonemptyString(value.subjectId))
    || !(value.taskId === null || isNonemptyString(value.taskId))
    || typeof value.status !== "string"
    || !SESSION_STATUSES.has(value.status)
    || !isNullableNumber(value.startedAt)
    || !isFiniteNumber(value.elapsedMs)
    || value.elapsedMs < 0
    || !isNullableNumber(value.finishedAt)
    || !isFiniteNumber(value.createdAt)
    || !(value.goalMs === undefined || value.goalMs === null || (isFiniteNumber(value.goalMs) && value.goalMs > 0))) return false;

  if (value.status === "running") return value.startedAt !== null && value.finishedAt === null;
  if (value.status === "paused") return value.startedAt === null && value.finishedAt === null;
  return value.status === "completed" && value.startedAt === null && value.finishedAt !== null;
}

function isMonthlyTest(value: unknown): value is MonthlyTest {
  if (!isRecord(value)) return false;
  return isNonemptyString(value.id)
    && typeof value.subjectId === "string"
    && typeof value.monthKey === "string"
    && /^\d{4}-(0[1-9]|1[0-2])$/.test(value.monthKey)
    && isFiniteNumber(value.score)
    && value.score >= 0
    && isFiniteNumber(value.total)
    && value.total > 0
    && value.score <= value.total
    && typeof value.notes === "string"
    && value.notes.length <= 300
    && isFiniteNumber(value.createdAt);
}

function isStudyState(value: unknown): value is StudyState {
  if (!isRecord(value)) return false;
  return value.version === 1
    && (value.gradeId === null || (typeof value.gradeId === "string" && GRADE_IDS.has(value.gradeId)))
    && Array.isArray(value.subjects)
    && value.subjects.every(isSubject)
    && Array.isArray(value.tasks)
    && value.tasks.every(isStudyTask)
    && Array.isArray(value.sessions)
    && value.sessions.every(isStudySession)
    // Fields added after the first release: older saves may not have them yet.
    && (value.monthlyTests === undefined || (Array.isArray(value.monthlyTests) && value.monthlyTests.every(isMonthlyTest)))
    && (value.watchedLessonIds === undefined || (Array.isArray(value.watchedLessonIds) && value.watchedLessonIds.every((id) => typeof id === "string")));
}

export async function loadStudyState(): Promise<StudyState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_STUDY_STATE;

  const parsed: unknown = JSON.parse(raw);
  if (!isStudyState(parsed)) {
    throw new Error("Saved study data did not match the supported schema.");
  }
  return {
    ...EMPTY_STUDY_STATE,
    ...parsed,
    subjects: parsed.subjects,
    tasks: parsed.tasks,
    sessions: parsed.sessions,
    monthlyTests: parsed.monthlyTests ?? [],
    watchedLessonIds: parsed.watchedLessonIds ?? [],
  };
}

export async function saveStudyState(state: StudyState): Promise<void> {
  if (!isStudyState(state)) throw new Error("Refusing to save invalid study data.");
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
