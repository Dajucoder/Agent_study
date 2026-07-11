import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Course, CourseProgress } from '@/types';
import { COURSES } from '@/data/courses';
import { loadJSON, saveJSON, STORAGE_KEYS } from '@/utils/storage';
import { useAuth } from './AuthContext';

/** 按 course.id 建索引，便于快速取总课时数 */
const COURSE_BY_ID: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.id, c]),
);

interface ContinueItem {
  course: Course;
  lessonId: string;
  lessonTitle: string;
  percent: number;
  updatedAt: string;
}

interface ProgressContextValue {
  /** 某课程的进度原始记录 */
  getProgress: (courseId: string) => CourseProgress | undefined;
  /** 完成百分比 0-100 */
  getPercent: (courseId: string) => number;
  /** 某个课时是否已完成 */
  isComplete: (courseId: string, lessonId: string) => boolean;
  /** 标记课时完成 */
  markComplete: (courseId: string, lessonId: string) => void;
  /** 取消完成（用于纠错/重学） */
  unmarkComplete: (courseId: string, lessonId: string) => void;
  /** 记录当前学习到的课时 */
  setCurrentLesson: (courseId: string, lessonId: string) => void;
  /** 记录视频观看秒数（取最大值，避免回退） */
  updateWatchSeconds: (courseId: string, lessonId: string, seconds: number) => void;
  /** 重置整门课程进度 */
  resetCourse: (courseId: string) => void;
  /** 继续学习列表（按最近更新排序，最多 limit 条） */
  getContinueLearning: (limit?: number) => ContinueItem[];
  /** 历史记录：所有已开始的课程（含完成度与时间） */
  getHistory: () => ContinueItem[];
  /** 汇总统计 */
  stats: {
    coursesStarted: number;
    lessonsCompleted: number;
    overallPercent: number;
  };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function emptyProgress(): CourseProgress {
  return {
    completedLessons: [],
    currentLessonId: null,
    watchSeconds: {},
    updatedAt: new Date().toISOString(),
  };
}

function storageKeyFor(userId: string | undefined): string {
  return `${STORAGE_KEYS.progress}_${userId ?? 'guest'}`;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [records, setRecords] = useState<Record<string, CourseProgress>>(() =>
    loadJSON<Record<string, CourseProgress>>(storageKeyFor(userId), {}),
  );

  // 切换用户时重新加载其专属进度
  useEffect(() => {
    setRecords(loadJSON<Record<string, CourseProgress>>(storageKeyFor(userId), {}));
  }, [userId]);

  const persist = useCallback(
    (next: Record<string, CourseProgress>) => {
      setRecords(next);
      saveJSON(storageKeyFor(userId), next);
    },
    [userId],
  );

  const getProgress = useCallback(
    (courseId: string) => records[courseId],
    [records],
  );

  const getPercent = useCallback(
    (courseId: string) => {
      const course = COURSE_BY_ID[courseId];
      const rec = records[courseId];
      if (!course || course.lessons.length === 0) return 0;
      const done = rec?.completedLessons.length ?? 0;
      return Math.round((done / course.lessons.length) * 100);
    },
    [records],
  );

  const isComplete = useCallback(
    (courseId: string, lessonId: string) =>
      records[courseId]?.completedLessons.includes(lessonId) ?? false,
    [records],
  );

  const markComplete = useCallback(
    (courseId: string, lessonId: string) => {
      const cur = records[courseId] ?? emptyProgress();
      const completed = cur.completedLessons.includes(lessonId)
        ? cur.completedLessons
        : [...cur.completedLessons, lessonId];
      persist({
        ...records,
        [courseId]: { ...cur, completedLessons: completed, updatedAt: new Date().toISOString() },
      });
    },
    [records, persist],
  );

  const unmarkComplete = useCallback(
    (courseId: string, lessonId: string) => {
      const cur = records[courseId];
      if (!cur) return;
      persist({
        ...records,
        [courseId]: {
          ...cur,
          completedLessons: cur.completedLessons.filter((id) => id !== lessonId),
          updatedAt: new Date().toISOString(),
        },
      });
    },
    [records, persist],
  );

  const setCurrentLesson = useCallback(
    (courseId: string, lessonId: string) => {
      const cur = records[courseId] ?? emptyProgress();
      persist({
        ...records,
        [courseId]: { ...cur, currentLessonId: lessonId, updatedAt: new Date().toISOString() },
      });
    },
    [records, persist],
  );

  const updateWatchSeconds = useCallback(
    (courseId: string, lessonId: string, seconds: number) => {
      const cur = records[courseId] ?? emptyProgress();
      const prev = cur.watchSeconds[lessonId] ?? 0;
      if (seconds <= prev) return; // 只增不减，避免拖动进度条回退时丢失记录
      persist({
        ...records,
        [courseId]: {
          ...cur,
          watchSeconds: { ...cur.watchSeconds, [lessonId]: Math.round(seconds) },
          updatedAt: new Date().toISOString(),
        },
      });
    },
    [records, persist],
  );

  const resetCourse = useCallback(
    (courseId: string) => {
      const { [courseId]: _removed, ...rest } = records;
      void _removed;
      persist(rest);
    },
    [records, persist],
  );

  const buildContinueItem = useCallback(
    (courseId: string, rec: CourseProgress): ContinueItem | null => {
      const course = COURSE_BY_ID[courseId];
      if (!course) return null;
      const percent = Math.round((rec.completedLessons.length / course.lessons.length) * 100);
      // 优先用记录中的当前课时；否则取第一个未完成课时；否则取最后一节
      const nextLessonId =
        rec.currentLessonId ??
        course.lessons.find((l) => !rec.completedLessons.includes(l.id))?.id ??
        course.lessons[course.lessons.length - 1]?.id ??
        '';
      const lesson = course.lessons.find((l) => l.id === nextLessonId);
      return {
        course,
        lessonId: nextLessonId,
        lessonTitle: lesson?.title ?? '',
        percent,
        updatedAt: rec.updatedAt,
      };
    },
    [],
  );

  const getContinueLearning = useCallback(
    (limit = 6) => {
      return Object.entries(records)
        .map(([id, rec]) => buildContinueItem(id, rec))
        .filter((x): x is ContinueItem => x !== null)
        .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
        .slice(0, limit);
    },
    [records, buildContinueItem],
  );

  const getHistory = useCallback(() => {
    return Object.entries(records)
      .map(([id, rec]) => buildContinueItem(id, rec))
      .filter((x): x is ContinueItem => x !== null)
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [records, buildContinueItem]);

  const stats = useMemo(() => {
    const ids = Object.keys(records);
    const lessonsCompleted = Object.values(records).reduce(
      (sum, r) => sum + r.completedLessons.length,
      0,
    );
    const totalLessons = ids.reduce(
      (sum, id) => sum + (COURSE_BY_ID[id]?.lessons.length ?? 0),
      0,
    );
    const overallPercent = totalLessons === 0 ? 0 : Math.round((lessonsCompleted / totalLessons) * 100);
    return {
      coursesStarted: ids.length,
      lessonsCompleted,
      overallPercent,
    };
  }, [records]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      getProgress,
      getPercent,
      isComplete,
      markComplete,
      unmarkComplete,
      setCurrentLesson,
      updateWatchSeconds,
      resetCourse,
      getContinueLearning,
      getHistory,
      stats,
    }),
    [
      getProgress,
      getPercent,
      isComplete,
      markComplete,
      unmarkComplete,
      setCurrentLesson,
      updateWatchSeconds,
      resetCourse,
      getContinueLearning,
      getHistory,
      stats,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress 必须在 ProgressProvider 内使用');
  return ctx;
}
