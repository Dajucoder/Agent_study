/**
 * 轻量 localStorage 封装：统一做 JSON 序列化与异常兜底。
 * 所有需要持久化的状态（登录态、学习进度、主题）都走这里。
 */

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 存储不可用（隐私模式 / 配额满）时静默降级，不影响内存态。
  }
}

export function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

/** 存储键集中管理，避免拼写不一致 */
export const STORAGE_KEYS = {
  auth: 'as_auth',
  users: 'as_users',
  progress: 'as_progress',
  theme: 'as_theme',
} as const;
