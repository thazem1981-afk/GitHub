import type { StudySession, StudyTask } from "./study-types";
import { dateKey, elapsedMilliseconds } from "./study-utils";

/**
 * Motivational study statistics — pure functions over the saved state.
 * A session's study time is attributed to a single day: the day it finished
 * (completed sessions), or the day it was created (still-open sessions).
 */
export function sessionDayKey(session: StudySession): string {
  const stamp = session.finishedAt ?? session.createdAt;
  return dateKey(new Date(stamp));
}

/** Set of day keys (YYYY-MM-DD) with at least one session that has real elapsed time. */
export function activeDayKeys(sessions: StudySession[], now = Date.now()): Set<string> {
  const keys = new Set<string>();
  for (const session of sessions) {
    if (elapsedMilliseconds(session, now) > 0) keys.add(sessionDayKey(session));
  }
  return keys;
}

/**
 * Consecutive study days ending today. If nothing was studied yet today the
 * streak is counted back from yesterday, so an unstarted morning does not
 * wipe out an ongoing streak.
 */
export function studyStreakDays(sessions: StudySession[], now = new Date()): number {
  const keys = activeDayKeys(sessions, now.getTime());
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!keys.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (keys.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Total study milliseconds attributed to one calendar day. */
export function studyTimeOnDay(sessions: StudySession[], day: Date, now = Date.now()): number {
  const key = dateKey(day);
  return sessions.reduce(
    (sum, session) => (sessionDayKey(session) === key ? sum + elapsedMilliseconds(session, now) : sum),
    0,
  );
}

/** Total study milliseconds over the last `days` days, including today. */
export function studyTimeInLastDays(sessions: StudySession[], days: number, now = new Date()): number {
  let total = 0;
  for (let offset = 0; offset < days; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - offset);
    total += studyTimeOnDay(sessions, day, now.getTime());
  }
  return total;
}

export interface TaskProgress {
  total: number;
  done: number;
  /** 0–100, or null when there are no tasks yet. */
  percent: number | null;
}

export function taskProgress(tasks: StudyTask[]): TaskProgress {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completedAt !== null).length;
  return { total, done, percent: total === 0 ? null : Math.round((done / total) * 100) };
}

/** Progress of a session toward its goal: 0–1, or null when the session has no goal. */
export function goalProgress(session: StudySession, now = Date.now()): number | null {
  if (!session.goalMs || session.goalMs <= 0) return null;
  return Math.min(1, elapsedMilliseconds(session, now) / session.goalMs);
}

/** Open tasks due on the given day, in the order given. */
export function tasksDueOn(tasks: StudyTask[], day: Date): StudyTask[] {
  const key = dateKey(day);
  return tasks.filter((task) => task.completedAt === null && dateKey(new Date(task.dueAt)) === key);
}

/** Open tasks due within the next `days` days (today included), in the order given. */
export function tasksDueWithin(tasks: StudyTask[], days: number, now = new Date()): StudyTask[] {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = start + days * 24 * 60 * 60 * 1000;
  return tasks.filter((task) => {
    if (task.completedAt !== null) return false;
    const due = new Date(task.dueAt).getTime();
    return due >= start && due < end;
  });
}
