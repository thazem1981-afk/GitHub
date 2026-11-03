import type { StudyState } from "./study-types";
import { isStudyState, normalizeStudyState } from "./study-schema";

/**
 * Manual backup export/import. The backup is a small JSON envelope around the
 * exact v1 study state, so a student can move or restore their data (it only
 * ever leaves the device when the student shares it themselves).
 */
export interface StudyBackup {
  app: "dars-study";
  kind: "backup";
  version: 1;
  exportedAt: string;
  state: StudyState;
}

export function createBackup(state: StudyState, now = new Date()): StudyBackup {
  if (!isStudyState(state)) throw new Error("Cannot back up invalid study data.");
  return {
    app: "dars-study",
    kind: "backup",
    version: 1,
    exportedAt: now.toISOString(),
    state,
  };
}

export function createBackupJson(state: StudyState, now = new Date()): string {
  return JSON.stringify(createBackup(state, now), null, 2);
}

/**
 * Parse backup text back into a validated, normalized state.
 * Accepts the envelope produced by createBackupJson, and also a bare stored
 * state (the raw AsyncStorage payload) for robustness. Throws on anything else,
 * so an invalid import can never replace good data.
 */
export function parseBackupJson(text: string): StudyState {
  const parsed: unknown = JSON.parse(text);
  if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
    const record = parsed as Record<string, unknown>;
    if (record.app === "dars-study" && record.kind === "backup") {
      if (record.version !== 1) throw new Error("Unsupported backup version.");
      if (!isStudyState(record.state)) throw new Error("Backup data did not match the supported schema.");
      return normalizeStudyState(record.state);
    }
  }
  if (isStudyState(parsed)) return normalizeStudyState(parsed);
  throw new Error("Backup data did not match the supported schema.");
}
