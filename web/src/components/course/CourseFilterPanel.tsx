import type { CourseFilters, LessonType, CourseLevel } from '@/types';
import { CATEGORIES, LEVELS } from '@/data/categories';
import { cx } from '@/utils/format';

interface Props {
  filters: CourseFilters;
  onChange: (patch: Partial<CourseFilters>) => void;
  onClear: () => void;
}

const FORMATS: { id: LessonType | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'video', label: '视频' },
  { id: 'article', label: '图文' },
];

const LEVEL_OPTS: { id: CourseLevel | 'all'; label: string }[] = [
  { id: 'all', label: '全部' },
  ...LEVELS.map((l) => ({ id: l.id, label: l.name })),
];

export function CourseFilterPanel({ filters, onChange, onClear }: Props) {
  const isDirty =
    filters.category !== 'all' ||
    filters.level !== 'all' ||
    filters.format !== 'all' ||
    filters.keyword.trim() !== '';

  return (
    <div className="filter-panel">
      <div className="filter-panel__head">
        <h3>筛选</h3>
        {isDirty && (
          <button className="link-btn" onClick={onClear}>
            重置
          </button>
        )}
      </div>

      <section className="filter-group">
        <h4 className="filter-group__title">主题分类</h4>
        <div className="filter-cats">
          <button
            className={cx('filter-cat', filters.category === 'all' && 'filter-cat--active')}
            onClick={() => onChange({ category: 'all' })}
          >
            <span className="filter-cat__icon">📚</span>
            <span>全部主题</span>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={cx('filter-cat', filters.category === c.id && 'filter-cat--active')}
              onClick={() => onChange({ category: c.id })}
            >
              <span className="filter-cat__icon">{c.icon}</span>
              <span className="filter-cat__text">
                <strong>{c.name}</strong>
                <small>{c.description}</small>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="filter-group">
        <h4 className="filter-group__title">难度</h4>
        <div className="chip-row">
          {LEVEL_OPTS.map((o) => (
            <button
              key={o.id}
              className={cx('chip', filters.level === o.id && 'chip--active')}
              onClick={() => onChange({ level: o.id })}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>

      <section className="filter-group">
        <h4 className="filter-group__title">内容形式</h4>
        <div className="chip-row">
          {FORMATS.map((o) => (
            <button
              key={o.id}
              className={cx('chip', filters.format === o.id && 'chip--active')}
              onClick={() => onChange({ format: o.id })}
            >
              {o.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
