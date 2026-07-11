import type { Course, CourseFilters } from '@/types';

/**
 * 多维分类筛选 + 排序（纯函数，便于测试与复用）。
 * 维度：关键词、主题分类、难度、内容形式（视频/图文）、排序方式。
 */
export function filterCourses(courses: Course[], filters: CourseFilters): Course[] {
  const kw = filters.keyword.trim().toLowerCase();

  const filtered = courses.filter((c) => {
    if (filters.category !== 'all' && c.category !== filters.category) return false;
    if (filters.level !== 'all' && c.level !== filters.level) return false;
    if (filters.format !== 'all' && !c.lessons.some((l) => l.type === filters.format)) {
      return false;
    }
    if (kw) {
      const haystack = [
        c.title,
        c.subtitle,
        c.description,
        c.instructor,
        ...c.tags,
        c.category,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(kw)) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case 'newest':
      sorted.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'duration':
      sorted.sort((a, b) => b.durationHours - a.durationHours);
      break;
    case 'popular':
    default:
      sorted.sort((a, b) => b.students - a.students);
      break;
  }
  return sorted;
}

export const SORT_OPTIONS: { id: CourseFilters['sort']; label: string }[] = [
  { id: 'popular', label: '最受欢迎' },
  { id: 'newest', label: '最近更新' },
  { id: 'rating', label: '评分最高' },
  { id: 'duration', label: '时长最长' },
];
