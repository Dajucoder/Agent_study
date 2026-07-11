import type { CourseFilters } from '@/types';
import { SORT_OPTIONS } from '@/utils/courseFilter';
import { SearchIcon, FilterIcon, CloseIcon } from '@/components/ui/icons';
import { cx } from '@/utils/format';

interface Props {
  filters: CourseFilters;
  onChange: (patch: Partial<CourseFilters>) => void;
  total: number;
  onOpenFilter: () => void;
}

export function CourseToolbar({ filters, onChange, total, onOpenFilter }: Props) {
  return (
    <div className="course-toolbar">
      <button className="btn btn--outline btn--sm course-toolbar__filter" onClick={onOpenFilter}>
        <FilterIcon size={16} /> 筛选
      </button>

      <div className="course-toolbar__search">
        <SearchIcon size={16} />
        <input
          type="search"
          placeholder="搜索课程、标签或讲师…"
          value={filters.keyword}
          onChange={(e) => onChange({ keyword: e.target.value })}
          aria-label="搜索课程"
        />
        {filters.keyword && (
          <button
            className="course-toolbar__clear"
            onClick={() => onChange({ keyword: '' })}
            aria-label="清除搜索"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      <div className="course-toolbar__right">
        <span className={cx('course-toolbar__count')}>{total} 门课程</span>
        <label className="sort-select">
          <span>排序</span>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as CourseFilters['sort'] })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
