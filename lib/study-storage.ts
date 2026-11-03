import AsyncStorage from "@react-native-async-storage/async-storage";
import { EMPTY_STUDY_STATE, type StudyState } from "@/lib/study-types";
import { isStudyState, parseStoredState } from "@/lib/study-schema";

const STORAGE_KEY = "dars.study.state.v1";
/** Previous good save, kept so a corrupted main copy can be recovered instead of losing the student's data. */
const BACKUP_STORAGE_KEY = "dars.study.state.v1.backup";

export async function loadStudyState(): Promise<StudyState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_STUDY_STATE;

  try {
    return parseStoredState(raw);
  } catch (mainError) {
    // Main copy is corrupted or fails validation: fall back to the safety copy.
    const backupRaw = await AsyncStorage.getItem(BACKUP_STORAGE_KEY).catch(() => null);
    if (backupRaw) {
      try {
        return parseStoredState(backupRaw);
      } catch {
        // Safety copy is unusable too — surface the original failure.
      }
    }
    throw mainError;
  }
}

export async function saveStudyState(state: StudyState): Promise<void> {
  if (!isStudyState(state)) throw new Error("Refusing to save invalid study data.");
  const nextRaw = JSON.stringify(state);
  // Keep the previous copy as a safety net before overwriting it (best effort only).
  try {
    const currentRaw = await AsyncStorage.getItem(STORAGE_KEY);
    if (currentRaw && currentRaw !== nextRaw) {
      await AsyncStorage.setItem(BACKUP_STORAGE_KEY, currentRaw);
    }
  } catch {
    // A failed safety copy must never block the real save.
  }
  await AsyncStorage.setItem(STORAGE_KEY, nextRaw);
}
