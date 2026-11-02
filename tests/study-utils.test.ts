import { describe, expect, it } from "vitest";
import { dateFromKey, elapsedMilliseconds, sortTasks } from "../lib/study-utils";
import type { StudySession, StudyTask } from "../lib/study-types";

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
});
