import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  EMPTY_STUDY_STATE,
  type GradeId,
  type MonthlyTest,
  type StudySession,
  type StudyState,
  type StudyTask,
  type Subject,
} from "@/lib/study-types";
import { elapsedMilliseconds, makeId } from "@/lib/study-utils";
import { loadStudyState, saveStudyState } from "@/lib/study-storage";

interface SubjectInput {
  name: string;
  color: string;
}

interface TaskInput {
  title: string;
  description: string;
  subjectId: string;
  dueAt: string;
  priority: StudyTask["priority"];
}

interface MonthlyTestInput {
  subjectId: string;
  monthKey: string;
  score: number;
  total: number;
  notes: string;
}

interface StudyStoreValue {
  state: StudyState;
  ready: boolean;
  persistenceError: string | null;
  setGrade: (gradeId: GradeId) => void;
  addSubject: (input: SubjectInput) => void;
  updateSubject: (id: string, input: SubjectInput) => void;
  deleteSubject: (id: string) => void;
  addTask: (input: TaskInput) => void;
  updateTask: (id: string, input: TaskInput) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  startSession: (subjectId: string | null, taskId: string | null, goalMs?: number | null) => void;
  pauseSession: (id: string) => void;
  resumeSession: (id: string) => void;
  finishSession: (id: string) => void;
  addMonthlyTest: (input: MonthlyTestInput) => void;
  updateMonthlyTest: (id: string, input: MonthlyTestInput) => void;
  deleteMonthlyTest: (id: string) => void;
  toggleLessonWatched: (lessonId: string) => void;
}

const StudyStoreContext = createContext<StudyStoreValue | null>(null);
const LOAD_ERROR = "تعذر قراءة البيانات المحفوظة محلياً؛ لن تُستبدل النسخة الموجودة تلقائياً.";
const SAVE_ERROR = "تعذر حفظ التغييرات على هذا الجهاز؛ قد لا تبقى بعد إغلاق التطبيق.";

export function StudyStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StudyState>(EMPTY_STUDY_STATE);
  const [ready, setReady] = useState(false);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const stateRef = useRef<StudyState>(EMPTY_STUDY_STATE);
  const storageReadyRef = useRef(false);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let active = true;
    loadStudyState().then((loaded) => {
      if (!active) return;
      stateRef.current = loaded;
      storageReadyRef.current = true;
      setState(loaded);
    }).catch(() => {
      if (active) setPersistenceError(LOAD_ERROR);
    }).finally(() => {
      if (active) setReady(true);
    });
    return () => { active = false; };
  }, []);

  const commit = useCallback((mutate: (current: StudyState) => StudyState) => {
    const next = mutate(stateRef.current);
    if (next === stateRef.current) return;
    stateRef.current = next;
    setState(next);

    if (!storageReadyRef.current) {
      setPersistenceError((current) => current ?? LOAD_ERROR);
      return;
    }

    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => saveStudyState(next))
      .then(() => setPersistenceError(null))
      .catch(() => setPersistenceError(SAVE_ERROR));
  }, []);

  const setGrade = useCallback((gradeId: GradeId) => {
    commit((current) => ({ ...current, gradeId }));
  }, [commit]);

  const addSubject = useCallback((input: SubjectInput) => {
    const subject: Subject = { id: makeId("subject"), ...input, createdAt: Date.now() };
    commit((current) => ({ ...current, subjects: [subject, ...current.subjects] }));
  }, [commit]);

  const updateSubject = useCallback((id: string, input: SubjectInput) => {
    commit((current) => ({
      ...current,
      subjects: current.subjects.map((subject) => subject.id === id ? { ...subject, ...input } : subject),
    }));
  }, [commit]);

  const deleteSubject = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      subjects: current.subjects.filter((subject) => subject.id !== id),
      tasks: current.tasks.map((task) => task.subjectId === id ? { ...task, subjectId: "" } : task),
      sessions: current.sessions.map((session) => session.subjectId === id ? { ...session, subjectId: null } : session),
      monthlyTests: current.monthlyTests.map((test) => test.subjectId === id ? { ...test, subjectId: "" } : test),
    }));
  }, [commit]);

  const addTask = useCallback((input: TaskInput) => {
    const task: StudyTask = {
      id: makeId("task"),
      ...input,
      completedAt: null,
      createdAt: Date.now(),
    };
    commit((current) => ({ ...current, tasks: [task, ...current.tasks] }));
  }, [commit]);

  const updateTask = useCallback((id: string, input: TaskInput) => {
    commit((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === id ? { ...task, ...input } : task),
    }));
  }, [commit]);

  const toggleTask = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      tasks: current.tasks.map((task) => task.id === id
        ? { ...task, completedAt: task.completedAt === null ? Date.now() : null }
        : task),
    }));
  }, [commit]);

  const deleteTask = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
      sessions: current.sessions.map((session) => session.taskId === id ? { ...session, taskId: null } : session),
    }));
  }, [commit]);

  const startSession = useCallback((subjectId: string | null, taskId: string | null, goalMs: number | null = null) => {
    const now = Date.now();
    const session: StudySession = {
      id: makeId("session"),
      subjectId,
      taskId,
      status: "running",
      startedAt: now,
      elapsedMs: 0,
      finishedAt: null,
      createdAt: now,
      goalMs,
    };
    commit((current) => {
      if (current.sessions.some((item) => item.status !== "completed")) return current;
      return { ...current, sessions: [session, ...current.sessions] };
    });
  }, [commit]);

  const pauseSession = useCallback((id: string) => {
    const now = Date.now();
    commit((current) => ({
      ...current,
      sessions: current.sessions.map((session) => session.id === id && session.status === "running"
        ? { ...session, elapsedMs: elapsedMilliseconds(session, now), status: "paused", startedAt: null }
        : session),
    }));
  }, [commit]);

  const resumeSession = useCallback((id: string) => {
    const now = Date.now();
    commit((current) => {
      if (current.sessions.some((session) => session.status === "running")) return current;
      return {
        ...current,
        sessions: current.sessions.map((session) => session.id === id && session.status === "paused"
          ? { ...session, status: "running", startedAt: now }
          : session),
      };
    });
  }, [commit]);

  const finishSession = useCallback((id: string) => {
    const now = Date.now();
    commit((current) => ({
      ...current,
      sessions: current.sessions.map((session) => session.id === id && session.status !== "completed"
        ? {
          ...session,
          elapsedMs: elapsedMilliseconds(session, now),
          status: "completed",
          startedAt: null,
          finishedAt: now,
        }
        : session),
    }));
  }, [commit]);

  const addMonthlyTest = useCallback((input: MonthlyTestInput) => {
    const test: MonthlyTest = { id: makeId("test"), ...input, createdAt: Date.now() };
    commit((current) => ({ ...current, monthlyTests: [test, ...current.monthlyTests] }));
  }, [commit]);

  const updateMonthlyTest = useCallback((id: string, input: MonthlyTestInput) => {
    commit((current) => ({
      ...current,
      monthlyTests: current.monthlyTests.map((test) => test.id === id ? { ...test, ...input } : test),
    }));
  }, [commit]);

  const deleteMonthlyTest = useCallback((id: string) => {
    commit((current) => ({
      ...current,
      monthlyTests: current.monthlyTests.filter((test) => test.id !== id),
    }));
  }, [commit]);

  const toggleLessonWatched = useCallback((lessonId: string) => {
    commit((current) => ({
      ...current,
      watchedLessonIds: current.watchedLessonIds.includes(lessonId)
        ? current.watchedLessonIds.filter((id) => id !== lessonId)
        : [lessonId, ...current.watchedLessonIds],
    }));
  }, [commit]);

  const value: StudyStoreValue = {
    state,
    ready,
    persistenceError,
    setGrade,
    addSubject,
    updateSubject,
    deleteSubject,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    startSession,
    pauseSession,
    resumeSession,
    finishSession,
    addMonthlyTest,
    updateMonthlyTest,
    deleteMonthlyTest,
    toggleLessonWatched,
  };

  return <StudyStoreContext.Provider value={value}>{children}</StudyStoreContext.Provider>;
}

export function useStudyStore(): StudyStoreValue {
  const value = useContext(StudyStoreContext);
  if (!value) throw new Error("useStudyStore must be used within StudyStoreProvider");
  return value;
}
