import { describe, expect, it } from "vitest";
import { createBackup, createBackupJson, parseBackupJson } from "../lib/study-backup";
import { parseStoredState } from "../lib/study-schema";
import { EMPTY_STUDY_STATE, type StudyState } from "../lib/study-types";

const sampleState: StudyState = {
  version: 1,
  gradeId: "primary-4",
  subjects: [{ id: "s1", name: "الرياضيات", color: "#31584A", createdAt: 1 }],
  tasks: [{
    id: "t1", title: "واجب", description: "", subjectId: "s1",
    dueAt: "2026-11-04T09:00:00.000Z", priority: "high", completedAt: null, createdAt: 2,
  }],
  sessions: [],
  monthlyTests: [{ id: "m1", subjectId: "s1", monthKey: "2026-11", score: 18, total: 20, notes: "", createdAt: 3 }],
  watchedLessonIds: ["p4-ma-1"],
};

describe("study backup", () => {
  it("round-trips a state through the backup envelope", () => {
    const json = createBackupJson(sampleState, new Date("2026-11-03T10:00:00.000Z"));
    expect(parseBackupJson(json)).toEqual(sampleState);
    const backup = createBackup(sampleState, new Date("2026-11-03T10:00:00.000Z"));
    expect(backup.app).toBe("dars-study");
    expect(backup.exportedAt).toBe("2026-11-03T10:00:00.000Z");
  });

  it("accepts a bare stored state and fills defaults for newer fields", () => {
    const legacy = { version: 1, gradeId: null, subjects: [], tasks: [], sessions: [] };
    expect(parseBackupJson(JSON.stringify(legacy))).toEqual(EMPTY_STUDY_STATE);
    expect(parseStoredState(JSON.stringify(legacy))).toEqual(EMPTY_STUDY_STATE);
  });

  it("rejects corrupted text, wrong envelopes and invalid states", () => {
    expect(() => parseBackupJson("not json")).toThrow();
    expect(() => parseBackupJson(JSON.stringify({ app: "other", kind: "backup", version: 1, state: sampleState }))).toThrow();
    expect(() => parseBackupJson(JSON.stringify({ app: "dars-study", kind: "backup", version: 2, state: sampleState }))).toThrow();
    expect(() => parseBackupJson(JSON.stringify({ ...sampleState, gradeId: "grade-99" }))).toThrow();
    expect(() => parseBackupJson(JSON.stringify({ ...sampleState, tasks: [{ id: "x" }] }))).toThrow();
    expect(() => createBackupJson({ ...sampleState, subjects: [{ id: "s1" }] } as unknown as StudyState)).toThrow();
  });

  it("rejects a monthly test whose score exceeds its total", () => {
    const bad = { ...sampleState, monthlyTests: [{ id: "m1", subjectId: "s1", monthKey: "2026-11", score: 25, total: 20, notes: "", createdAt: 3 }] };
    expect(() => parseStoredState(JSON.stringify(bad))).toThrow();
  });
});
