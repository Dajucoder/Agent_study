/** 通用格式化与样式工具。 */

/** 拼接 className，过滤假值 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/** 12345 -> 1.2 万；1234 -> 1.2k 风格的简写放在这里不合适，统一用万/千中文习惯 */
export function formatCount(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)} 万`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

/** 秒 -> "Xh Ym" 或 "Ym" */
export function formatHoursDecimal(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} 分钟`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h} 小时 ${m} 分` : `${h} 小时`;
}

/** 日期 ISO -> YYYY-MM-DD */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** "相对时间"：刚刚 / N 分钟前 / N 小时前 / N 天前 / 日期 */
export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diff = Date.now() - then;
  const min = 60 * 1000;
  const hour = 60 * min;
  const day = 24 * hour;
  if (diff < min) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / min)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  return formatDate(iso);
}

/** 取名字首字符（用于无图头像） */
export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  // 中文取首字，英文取首字母（最多 2）
  if (/[一-龥]/.test(trimmed[0])) return trimmed[0];
  const parts = trimmed.split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** 简单的 id 生成（演示用，非加密用途） */
export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** 一组柔和的头像底色，按名字稳定选取 */
const AVATAR_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#14b8a6',
  '#0ea5e9',
];
export function pickAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
