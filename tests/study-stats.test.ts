import { describe, expect, it } from "vitest";
import {
  goalProgress,
  studyStreakDays,
  studyTimeInLastDays,
  studyTimeOnDay,
  taskProgress,
  tasksDueOn,
  tasksDueWithin,
} from "../lib/study-stats";
import type { StudySession, StudyTask } from "../lib/study-types";

function completedSession(id: string, finishedAt: number, elapsedMs: number): StudySession {
  return {
    id,
    subjectId: null,
    taskId: null,
    status: "completed",
    startedAt: null,
    elapsedMs,
    finishedAt,
    createdAt: finishedAt - elapsedMs,
  };
}

function task(id: string, dueAt: string, completedAt: number | null = null): StudyTask {
  return { id, title: id, description: "", subjectId: "s1", dueAt, priority: "medium", completedAt, createdAt: 1 };
}

// Local noon on 2026-11-03, plus the two days before it.
const nov3 = new Date(2026, 10, 3, 12).getTime();
const nov2 = new Date(2026, 10, 2, 12).getTime();
const nov1 = new Date(2026, 10, 1, 12).getTime();
const oct30 = new Date(2026, 9, 30, 12).getTime();

describe("study statistics", () => {
  it("counts a streak of consecutive days ending today", () => {
    const sessions = [
      completedSession("a", nov3, 60_000),
      completedSession("b", nov2, 60_000),
      completedSession("c", nov1, 60_000),
    ];
    expect(studyStreakDays(sessions, new Date(2026, 10, 3, 18))).toBe(3);
  });

  it("keeps yesterday's streak alive before today's first session, and breaks it after a gap", () => {
    const sessions = [completedSession("a", nov2, 60_000), completedSession("b", nov1, 60_000)];
    expect(studyStreakDays(sessions, new Date(2026, 10, 3, 9))).toBe(2);
    const gapped = [completedSession("a", nov3, 60_000), completedSession("b", oct30, 60_000)];
    expect(studyStreakDays(gapped, new Date(2026, 10, 3, 18))).toBe(1);
    expect(studyStreakDays([], new Date(2026, 10, 3, 18))).toBe(0);
  });

  it("sums study time per day and over the last 7 days", () => {
    const sessions = [
      completedSession("a", nov3, 30 * 60_000),
      completedSession("b", nov2, 45 * 60_000),
      completedSession("c", oct30, 90 * 60_000),
    ];
    const now = new Date(2026, 10, 3, 18);
    expect(studyTimeOnDay(sessions, new Date(2026, 10, 3), now.getTime())).toBe(30 * 60_000);
    expect(studyTimeInLastDays(sessions, 7, now)).toBe((30 + 45 + 90) * 60_000);
    expect(studyTimeInLastDays(sessions, 2, now)).toBe((30 + 45) * 60_000);
  });

  it("reports task progress with a rounded percent and null when empty", () => {
    const tasks = [task("a", "2026-11-03"), task("b", "2026-11-03", 5), task("c", "2026-11-04", 6)];
    expect(taskProgress(tasks)).toEqual({ total: 3, done: 2, percent: 67 });
    expect(taskProgress([])).toEqual({ total: 0, done: 0, percent: null });
  });

  it("measures goal progress capped at 1 and null without a goal", () => {
    const base = completedSession("a", nov3, 30 * 60_000);
    expect(goalProgress({ ...base, goalMs: 60 * 60_000 }, nov3)).toBe(0.5);
    expect(goalProgress({ ...base, goalMs: 10 * 60_000 }, nov3)).toBe(1);
    expect(goalProgress(base, nov3)).toBeNull();
  });

  it("selects open tasks due today and within a week", () => {
    const tasks = [
      task("today", "2026-11-03T09:00:00"),
      task("done-today", "2026-11-03T09:00:00", 7),
      task("friday", "2026-11-06T09:00:00"),
      task("late", "2026-11-01T09:00:00"),
      task("far", "2026-12-01T09:00:00"),
    ];
    const now = new Date(2026, 10, 3, 12);
    expect(tasksDueOn(tasks, now).map((item) => item.id)).toEqual(["today"]);
    expect(tasksDueWithin(tasks, 7, now).map((item) => item.id)).toEqual(["today", "friday"]);
  });
});
