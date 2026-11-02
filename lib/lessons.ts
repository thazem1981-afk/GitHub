import type { GradeId } from "./study-types";

/**
 * Lessons are YouTube videos/playlists from the Egyptian curriculum.
 * The catalog ships inside the app, so the lesson list is always available;
 * playback itself streams from YouTube and needs an internet connection.
 * Every entry's ID was verified against a real YouTube page before inclusion.
 */
export interface Lesson {
  id: string;
  gradeId: GradeId;
  subject: string;
  title: string;
  kind: "video" | "playlist";
  youtubeId: string;
  channel: string;
}

/** School subjects of the Egyptian curriculum for each grade. */
export const CURRICULUM_SUBJECTS: Record<GradeId, string[]> = {
  "primary-1": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "اكتشف", "التربية الدينية"],
  "primary-2": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "اكتشف", "التربية الدينية"],
  "primary-3": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "اكتشف", "التربية الدينية"],
  "primary-4": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "العلوم", "الدراسات الاجتماعية", "تكنولوجيا المعلومات", "التربية الدينية"],
  "primary-5": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "العلوم", "الدراسات الاجتماعية", "تكنولوجيا المعلومات", "التربية الدينية"],
  "primary-6": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "العلوم", "الدراسات الاجتماعية", "تكنولوجيا المعلومات", "التربية الدينية"],
  "middle-1": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "العلوم", "الدراسات الاجتماعية", "الحاسب الآلي", "التربية الدينية"],
  "middle-2": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "العلوم", "الدراسات الاجتماعية", "الحاسب الآلي", "التربية الدينية"],
  "middle-3": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "العلوم", "الدراسات الاجتماعية", "الحاسب الآلي", "التربية الدينية", "مراجعات شاملة"],
  "secondary-1": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "الفيزياء", "الكيمياء", "الأحياء", "التاريخ", "الجغرافيا"],
  "secondary-2": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "الفيزياء", "الكيمياء", "الأحياء", "التاريخ", "الجغرافيا"],
  "secondary-3": ["اللغة العربية", "الرياضيات", "اللغة الإنجليزية", "الفيزياء", "الكيمياء", "الأحياء", "التاريخ", "الجغرافيا"],
};

export const LESSONS: Lesson[] = [
  // ── الأول الابتدائي ─────────────────────────────
  { id: "p1-ar-1", gradeId: "primary-1", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLBPFQF_rzX-xTCJsmNEZ7_MT58iiEc-4p", title: "شرح ومراجعات اللغة العربية — الترم الأول (كتاب الأضواء)", channel: "سلسلة الأضواء" },
  { id: "p1-ar-2", gradeId: "primary-1", subject: "اللغة العربية", kind: "video", youtubeId: "-zFZMFsqbds", title: "شرح نشيد «لوحتي الجديدة» — الدرس ١٤", channel: "المدرسة التعليمية" },
  { id: "p1-ma-1", gradeId: "primary-1", subject: "الرياضيات", kind: "video", youtubeId: "T0JFl75SGC4", title: "مراجعة رياضيات الترم الأول كاملة في فيديو واحد — ملخص كل الوحدات", channel: "فهّمني ابتدائي" },
  { id: "p1-ma-2", gradeId: "primary-1", subject: "الرياضيات", kind: "playlist", youtubeId: "PLpGe15-fYjXMD78YPpIypyMVBmq9Iy6ml", title: "(لغات) Math — المنهج الجديد — الترم الثاني", channel: "يوتيوب" },
  // ── الثاني الابتدائي ────────────────────────────
  { id: "p2-ar-1", gradeId: "primary-2", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLYJOJWW5sCowv_nlhgJlA5S1uMj8XR7xn", title: "اللغة العربية — الفصل الدراسي الثاني", channel: "يوتيوب" },
  { id: "p2-ma-1", gradeId: "primary-2", subject: "الرياضيات", kind: "playlist", youtubeId: "PLYGJU1U6eacMIbaW0HvGAI2uY1-E_gVTr", title: "رياضيات الصف الثاني الابتدائي — الترم الأول", channel: "مستر محمد إبراهيم" },
  { id: "p2-ma-2", gradeId: "primary-2", subject: "الرياضيات", kind: "playlist", youtubeId: "PLjRKmbB1zsyza0tcXg4SMEdLxpERxblud", title: "حساب الصف الثاني الابتدائي — الترم الثاني", channel: "يوتيوب" },
  // ── الثالث الابتدائي ────────────────────────────
  { id: "p3-ar-1", gradeId: "primary-3", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLAcLeRlFh4zipB_HpdtaBewu2Af7Kknu6", title: "دروس اللغة العربية — الترم الأول", channel: "يوتيوب" },
  { id: "p3-ma-1", gradeId: "primary-3", subject: "الرياضيات", kind: "playlist", youtubeId: "PLLOsv5ykak0p4Yx9tjg69gMoz4cVbgwzw", title: "رياضيات الصف الثالث الابتدائي — الترم الأول — شرح وحل كتاب المدرسة", channel: "يوتيوب" },
  { id: "p3-ma-2", gradeId: "primary-3", subject: "الرياضيات", kind: "playlist", youtubeId: "PLpGe15-fYjXNRpS6YgxZ4_99L2cDwxFRB", title: "(لغات) Math — المنهج الجديد — الترم الأول", channel: "يوتيوب" },
  // ── الرابع الابتدائي ────────────────────────────
  { id: "p4-ar-1", gradeId: "primary-4", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLZpdfXc71P-RGZJpqwWqY1LoXROLQgEo0", title: "مقاطع اللغة العربية — المنهج الجديد", channel: "يوتيوب" },
  { id: "p4-ar-2", gradeId: "primary-4", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLBPFQF_rzX-xoB3HuZlp-S_mQWHdK5y_r", title: "شرح ومراجعات اللغة العربية — الترم الأول (كتاب الأضواء)", channel: "سلسلة الأضواء" },
  { id: "p4-ma-1", gradeId: "primary-4", subject: "الرياضيات", kind: "playlist", youtubeId: "PLYGJU1U6eacO9cUEks7iXA4lScffMRh1H", title: "رياضيات الصف الرابع الابتدائي — الترم الأول", channel: "مستر محمد إبراهيم" },
  { id: "p4-ma-2", gradeId: "primary-4", subject: "الرياضيات", kind: "playlist", youtubeId: "PLbqcG4v9ulx90c5YEfDxLxMXtMvJFBnjn", title: "رياضيات الصف الرابع الابتدائي — الترم الأول ٢٠٢٦", channel: "يوتيوب" },
  { id: "p4-ma-3", gradeId: "primary-4", subject: "الرياضيات", kind: "video", youtubeId: "ig4UF6FQ4l0", title: "قياس العالم من حولي (١) — الرياضيات", channel: "قناة مدرستنا الرسمية" },
  { id: "p4-sc-1", gradeId: "primary-4", subject: "العلوم", kind: "video", youtubeId: "xQHahGWAusM", title: "شرح علوم المنهج الجديد — «الطبيعة من حولنا» — الجزء الأول", channel: "علوم ابتدائي مع مس أميرة" },
  { id: "p4-sc-2", gradeId: "primary-4", subject: "العلوم", kind: "playlist", youtubeId: "PLOkMqdYLCRFQ", title: "(لغات) Science — ساينس رابعة ابتدائي — الترم الأول — المنهج الجديد", channel: "يوتيوب" },
  // ── الخامس الابتدائي ────────────────────────────
  { id: "p5-ar-1", gradeId: "primary-5", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLc7MnwfUc8L8", title: "حل كتاب المدرسة — لغة عربية الصف الخامس — الترم الأول — المنهج الجديد", channel: "يوتيوب" },
  { id: "p5-ar-2", gradeId: "primary-5", subject: "اللغة العربية", kind: "video", youtubeId: "hwFMULgRjI8", title: "سليمان والهدهد — اللغة العربية", channel: "قناة مدرستنا الرسمية" },
  { id: "p5-ma-1", gradeId: "primary-5", subject: "الرياضيات", kind: "playlist", youtubeId: "PLlezLtJP2Mgd2d4Kkuu38I3dXpDzrm1Ww", title: "دروس رياضيات الصف الخامس الابتدائي — الترم الأول", channel: "يوتيوب" },
  { id: "p5-en-1", gradeId: "primary-5", subject: "اللغة الإنجليزية", kind: "video", youtubeId: "1d0CaXTXddQ", title: "General Revision — مراجعة اللغة الإنجليزية — الجزء الأول", channel: "قناة مدرستنا الرسمية" },
  // ── السادس الابتدائي ────────────────────────────
  { id: "p6-ma-1", gradeId: "primary-6", subject: "الرياضيات", kind: "playlist", youtubeId: "PLVct09GerDLY", title: "رياضيات الصف السادس الابتدائي — ترم أول", channel: "مستر محمد إبراهيم" },
  { id: "p6-ma-2", gradeId: "primary-6", subject: "الرياضيات", kind: "playlist", youtubeId: "PLviltU25cUnLrS8AopJoPbQKTbxIkz9q9", title: "شرح منهج الرياضيات — الترم الأول — سلاح التلميذ كامل", channel: "يوتيوب" },
  { id: "p6-ma-3", gradeId: "primary-6", subject: "الرياضيات", kind: "playlist", youtubeId: "PLiPiTN71c6KjIQnlB6kJt3B7Uqyz_0eEf", title: "دروس رياضيات الصف السادس الابتدائي — ترم أول", channel: "يوتيوب" },
  // ── الأول الإعدادي ──────────────────────────────
  { id: "m1-ar-1", gradeId: "middle-1", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLyoCzR3ujHw-bmfHlCcEjjtYqm0qTpWHf", title: "دروس اللغة العربية — الترم الأول — المنهج الجديد", channel: "يوتيوب" },
  { id: "m1-ar-2", gradeId: "middle-1", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLnPzDeB7tOBZ1I3LbYgqtdB6dKzUpPjU1", title: "اللغة العربية — الترم الأول (العربي في الجيب)", channel: "مستر أحمد حنفي" },
  { id: "m1-ma-1", gradeId: "middle-1", subject: "الرياضيات", kind: "playlist", youtubeId: "PLlqM7BIRXOWf1-8jXwH4uNhVbpAYgYrf8", title: "شرح ومراجعات الجبر — ترم ثاني — المنهج كامل", channel: "مقهى الرياضيات" },
  { id: "m1-ma-2", gradeId: "middle-1", subject: "الرياضيات", kind: "playlist", youtubeId: "PLlqM7BIRXOWdG68lu0g-326YX1ERCLE3m", title: "شرح ومراجعات الهندسة — ترم ثاني — المنهج كامل", channel: "مقهى الرياضيات" },
  { id: "m1-sc-1", gradeId: "middle-1", subject: "العلوم", kind: "playlist", youtubeId: "PLAH7BHgh4ZI0FoKKPyjJN3pqecxcfrzOW", title: "علوم أولى إعدادي — الترم الأول — المنهج الجديد", channel: "يوتيوب" },
  { id: "m1-sc-2", gradeId: "middle-1", subject: "العلوم", kind: "playlist", youtubeId: "PLYnr6kMElNH0ExU4QmYiAcVjZkBfICFci", title: "شرح علوم الصف الأول الإعدادي", channel: "نادي العلوم — أ/ راندا حسن" },
  // ── الثاني الإعدادي ─────────────────────────────
  { id: "m2-ar-1", gradeId: "middle-2", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLh4AHUFUSQWCzbEUJA0vz3E3DmOUtxkUL", title: "اللغة العربية — شرح ومراجعات — الفصل الدراسي الأول", channel: "يوتيوب" },
  { id: "m2-ar-2", gradeId: "middle-2", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLmO7YhDrrq7CiWba-UojmGk6aClB2nmUu", title: "لغة عربية — نصوص ونحو", channel: "ذاكرلي عربي" },
  { id: "m2-ma-1", gradeId: "middle-2", subject: "الرياضيات", kind: "playlist", youtubeId: "PL80afcx0qvRpxMBfJx-dej2zr7Jd5vpW5", title: "رياضيات الصف الثاني الإعدادي — الترم الأول — المنهج الجديد", channel: "عبقرينو الرياضيات — م. إبراهيم حربي" },
  { id: "m2-ma-2", gradeId: "middle-2", subject: "الرياضيات", kind: "playlist", youtubeId: "PLpRREFCtC0vlb-BUFGJLz7k4tGOUDftSF", title: "شرح رياضيات تانية إعدادي — الترم الثاني — جبر وهندسة كامل", channel: "يوتيوب" },
  { id: "m2-sc-1", gradeId: "middle-2", subject: "العلوم", kind: "playlist", youtubeId: "PLYnr6kMElNH0dae71knJe5AsLhdPmotp5", title: "شرح علوم الصف الثاني الإعدادي", channel: "نادي العلوم — أ/ راندا حسن" },
  { id: "m2-sc-2", gradeId: "middle-2", subject: "العلوم", kind: "playlist", youtubeId: "PLjiemGPAg89zAMwJquxcPeiFJLJCwH0YR", title: "(لغات) Science — شرح منهج ساينس الصف الثاني الإعدادي — الترم الثاني", channel: "دكتور ساينس" },
  { id: "m2-so-1", gradeId: "middle-2", subject: "الدراسات الاجتماعية", kind: "playlist", youtubeId: "PLXTqE5gJamgw", title: "دراسات اجتماعية الصف الثاني الإعدادي — شرح ومراجعات — ترم أول", channel: "ولاء السروجي" },
  // ── الثالث الإعدادي ─────────────────────────────
  { id: "m3-ar-1", gradeId: "middle-3", subject: "اللغة العربية", kind: "video", youtubeId: "QX_wLpsWC0g", title: "شرح درس «قصة أثر» والمنادي والمضاف — ترم أول", channel: "قناة مدرستنا الرسمية" },
  { id: "m3-ar-2", gradeId: "middle-3", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLvsMJ1HHONsrq3ygDlZDQo98X0y6DHiAx", title: "دروس اللغة العربية — الفصل الدراسي الثاني", channel: "يوتيوب" },
  { id: "m3-ar-3", gradeId: "middle-3", subject: "اللغة العربية", kind: "playlist", youtubeId: "PLM4AXzhQVQH0", title: "اللغة العربية — المنهج الجديد — شرح ومراجعة شاملة", channel: "مستر محمود الصغير" },
  { id: "m3-ma-1", gradeId: "middle-3", subject: "الرياضيات", kind: "playlist", youtubeId: "PLlqM7BIRXOWf71cspmeAO_Gb8WWPEzevs", title: "شرح ومراجعات الجبر — ترم أول — المنهج كامل", channel: "مقهى الرياضيات" },
  { id: "m3-ma-2", gradeId: "middle-3", subject: "الرياضيات", kind: "playlist", youtubeId: "PLlqM7BIRXOWdu4wf0bSXU1KZli49no4TD", title: "شرح ومراجعات هندسة وحساب مثلثات — ترم أول — المنهج كامل", channel: "مقهى الرياضيات" },
  { id: "m3-sc-1", gradeId: "middle-3", subject: "العلوم", kind: "playlist", youtubeId: "PLku2qhOA5YyoFgykygb772IgXwrWcpcDL", title: "مادة العلوم للصف الثالث الإعدادي", channel: "مستر أحمد عطية" },
  { id: "m3-rv-1", gradeId: "middle-3", subject: "مراجعات شاملة", kind: "playlist", youtubeId: "PLYJciGiVcNtQ27vxMcTv5vgDact78U93z", title: "مراجعات الصف الثالث الإعدادي — الترم الأول — كل المواد", channel: "Abwaab Egypt" },
];

export function lessonsForGrade(gradeId: GradeId | null): Lesson[] {
  if (!gradeId) return [];
  return LESSONS.filter((lesson) => lesson.gradeId === gradeId);
}

export function lessonsFor(gradeId: GradeId | null, subject: string | null): Lesson[] {
  const forGrade = lessonsForGrade(gradeId);
  return subject ? forGrade.filter((lesson) => lesson.subject === subject) : forGrade;
}

export function youtubeWatchUrl(lesson: Lesson): string {
  return lesson.kind === "playlist"
    ? `https://www.youtube.com/playlist?list=${lesson.youtubeId}`
    : `https://www.youtube.com/watch?v=${lesson.youtubeId}`;
}

export function youtubeEmbedUrl(lesson: Lesson): string {
  return lesson.kind === "playlist"
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${lesson.youtubeId}&rel=0`
    : `https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?rel=0`;
}

export function youtubeThumbnailUrl(lesson: Lesson): string | null {
  return lesson.kind === "video" ? `https://i.ytimg.com/vi/${lesson.youtubeId}/hqdefault.jpg` : null;
}

/** Fallback for subjects whose catalog is still growing: a precise YouTube search. */
export function youtubeSearchUrl(gradeLabel: string, subject: string): string {
  const query = encodeURIComponent(`شرح ${subject} الصف ${gradeLabel} المنهج المصري`);
  return `https://www.youtube.com/results?search_query=${query}`;
}
