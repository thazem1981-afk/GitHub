import { describe, expect, it } from "vitest";
import {
  dateFromKey,
  elapsedMilliseconds,
  groupTestsByMonth,
  monthKey,
  monthLabel,
  recentMonthKeys,
  sortTasks,
  summarizeMonthlyTests,
} from "../lib/study-utils";
import type { MonthlyTest, StudySession, StudyTask } from "../lib/study-types";

function task(id: string, priority: StudyTask["priority"], dueAt: string): StudyTask {
  return { id, title: id, description: "", subjectId: "subject-1", dueAt, priority, completedAt: null, createdAt: 1 };
}

describe("study utilities", () => {
  it("sorts tasks by priority before deadline", () => {
    const tasks = [
      task("low-soon", "low", "2026-11-01T09:00:00.000Z"),
      task("medium-soon", "medium", "2026-11-01T09:00:00.000Z"),
      task("high-later", "high", "2026-11-03T09:00:00.000Z"),
      task("high-soon", "high", "2026-11-02T09:00:00.000Z"),
    ];
    expect(sortTasks(tasks).map((item) => item.id)).toEqual(["high-soon", "high-later", "medium-soon", "low-soon"]);
  });

  it("rejects impossible calendar dates but accepts leap days", () => {
    expect(dateFromKey("2026-02-30")).toBeNull();
    expect(dateFromKey("2024-02-29")).not.toBeNull();
    expect(dateFromKey("2026/11/01")).toBeNull();
  });

  it("counts elapsed time for running sessions and retains paused time", () => {
    const running: StudySession = {
      id: "session-running",
      subjectId: null,
      taskId: null,
      status: "running",
      startedAt: 1_000,
      elapsedMs: 2_000,
      finishedAt: null,
      createdAt: 1_000,
    };
    const paused: StudySession = { ...running, id: "session-paused", status: "paused", startedAt: null };
    expect(elapsedMilliseconds(running, 4_500)).toBe(5_500);
    expect(elapsedMilliseconds(paused, 99_000)).toBe(2_000);
  });

  it("builds month keys and Arabic month labels", () => {
    expect(monthKey(new Date(2026, 10, 2))).toBe("2026-11");
    expect(monthLabel("2026-11")).toBe("نوفمبر ٢٠٢٦");
    expect(monthLabel("not-a-month")).toBe("not-a-month");
    expect(recentMonthKeys(3, new Date(2026, 0, 15))).toEqual(["2026-01", "2025-12", "2025-11"]);
  });

  it("summarizes monthly tests and groups them newest month first", () => {
    const test = (id: string, key: string, score: number, total: number, createdAt: number): MonthlyTest => ({
      id, subjectId: "subject-1", monthKey: key, score, total, notes: "", createdAt,
    });
    const tests = [
      test("oct-low", "2026-10", 10, 20, 1),
      test("nov-high", "2026-11", 19, 20, 3),
      test("nov-mid", "2026-11", 15, 20, 2),
    ];
    const summary = summarizeMonthlyTests(tests.filter((item) => item.monthKey === "2026-11"));
    expect(summary).toEqual({ count: 2, averagePercent: 85, bestPercent: 95 });
    expect(summarizeMonthlyTests([])).toEqual({ count: 0, averagePercent: null, bestPercent: null });
    const groups = groupTestsByMonth(tests);
    expect(groups.map((group) => group.monthKey)).toEqual(["2026-11", "2026-10"]);
    expect(groups[0].tests.map((item) => item.id)).toEqual(["nov-high", "nov-mid"]);
  });
});
