import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CourseFilters } from '@/types';
import { COURSES } from '@/data/courses';
import { CATEGORY_MAP } from '@/data/categories';
import { filterCourses } from '@/utils/courseFilter';
import { CourseCard } from '@/components/course/CourseCard';
import { CourseFilterPanel } from '@/components/course/CourseFilterPanel';
import { CourseToolbar } from '@/components/course/CourseToolbar';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchIcon } from '@/components/ui/icons';

const DEFAULT_FILTERS: CourseFilters = {
  keyword: '',
  category: 'all',
  level: 'all',
  format: 'all',
  sort: 'popular',
};

export function CoursesPage() {
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get('category') ?? 'all';
  const qParam = params.get('q') ?? '';

  const [filters, setFilters] = useState<CourseFilters>({
    ...DEFAULT_FILTERS,
    category: categoryParam,
    keyword: qParam,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 当 URL 中的 category / q 变化（如从首页分类卡片进入）时同步筛选状态
  useEffect(() => {
    setFilters((f) => ({ ...f, category: categoryParam, keyword: qParam }));
  }, [categoryParam, qParam]);

  const results = useMemo(() => filterCourses(COURSES, filters), [filters]);

  const patch = (p: Partial<CourseFilters>) => setFilters((f) => ({ ...f, ...p }));
  const clear = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setParams({}, { replace: true });
  };

  const activeCategory = filters.category !== 'all' ? CATEGORY_MAP[filters.category] : null;

  return (
    <div className="container page">
      <header className="page__header">
        <h1 className="page__title">课程中心</h1>
        <p className="page__lead">
          {activeCategory
            ? `${activeCategory.icon} ${activeCategory.name} · ${activeCategory.description}`
            : '按主题、难度与内容形式多维筛选，找到最适合你的学习路径。'}
        </p>
      </header>

      <div className="courses-layout">
        <aside className="courses-layout__sidebar">
          <CourseFilterPanel filters={filters} onChange={patch} onClear={clear} />
        </aside>

        <div className="courses-layout__main">
          <CourseToolbar
            filters={filters}
            onChange={patch}
            total={results.length}
            onOpenFilter={() => setDrawerOpen(true)}
          />

          {results.length > 0 ? (
            <div className="course-grid">
              {results.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<SearchIcon size={32} />}
              title="没有匹配的课程"
              description="试试调整关键词，或重置筛选条件。"
              action={
                <button className="btn btn--outline btn--sm" onClick={clear}>
                  重置筛选
                </button>
              }
            />
          )}
        </div>
      </div>

      {/* 移动端筛选抽屉 */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} role="presentation">
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <CourseFilterPanel
              filters={filters}
              onChange={(p) => {
                patch(p);
              }}
              onClear={clear}
            />
            <button className="btn btn--primary btn--block" onClick={() => setDrawerOpen(false)}>
              查看 {results.length} 门课程
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
