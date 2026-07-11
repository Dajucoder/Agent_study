/**
 * 全局类型定义。
 * 所有跨模块共享的数据结构都集中放在这里，便于类型推导与维护。
 */

/** 课时内容类型：视频 或 图文 */
export type LessonType = 'video' | 'article';

/** 课程难度 */
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

/** 图文课时中的富文本块 */
export type ArticleBlock =
  | { kind: 'heading'; text: string; level?: 2 | 3 }
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; lang?: string; code: string; caption?: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'callout'; variant?: 'info' | 'tip' | 'warning'; title?: string; text: string }
  | { kind: 'image'; src?: string; alt?: string; caption?: string };

/** 单个课时 */
export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** 视频时长（秒）；图文课时为 0 */
  duration: number;
  description?: string;
  /** 视频地址（type === 'video' 时有效） */
  videoUrl?: string;
  /** 图文正文（type === 'article' 时有效） */
  content?: ArticleBlock[];
  /** 是否免费试看 */
  free?: boolean;
}

/** 课程分类（多维分类的第一维度：主题） */
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

/** 课程 */
export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  /** 封面：CSS 渐变或 emoji 标识，避免依赖外部图片资源 */
  cover: string;
  level: CourseLevel;
  /** 主分类 id（对应 Category.id） */
  category: string;
  /** 标签（多维分类的附加维度） */
  tags: string[];
  durationHours: number;
  lessonCount: number;
  instructor: string;
  rating: number;
  students: number;
  updatedAt: string;
  lessons: Lesson[];
}

/** 登录用户 */
export interface User {
  id: string;
  name: string;
  email: string;
  /** 头像底色（用首字母 + 底色生成头像） */
  avatarColor: string;
  bio?: string;
  createdAt: string;
}

/** 注册时提交的信息（不含服务端生成的字段） */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/** 单门课程的学习记录 */
export interface CourseProgress {
  /** 已完成的课时 id 列表 */
  completedLessons: string[];
  /** 当前正在学习的课时 id */
  currentLessonId: string | null;
  /** 视频课时已观看的秒数（按课时 id 记录） */
  watchSeconds: Record<string, number>;
  /** 最近一次更新时间（ISO 字符串） */
  updatedAt: string;
}

/** 课程筛选条件（多维分类的核心） */
export interface CourseFilters {
  keyword: string;
  category: string | 'all';
  level: CourseLevel | 'all';
  format: LessonType | 'all';
  sort: CourseSort;
}

export type CourseSort = 'popular' | 'newest' | 'rating' | 'duration';

/** 主题模式 */
export type ThemeMode = 'light' | 'dark';
