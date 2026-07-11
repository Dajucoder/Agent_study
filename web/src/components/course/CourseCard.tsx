import { Link } from 'react-router-dom';
import type { Course } from '@/types';
import { LEVEL_NAME, CATEGORY_MAP } from '@/data/categories';
import { formatCount, formatHoursDecimal, cx } from '@/utils/format';
import { StarIcon, UserIcon, ClockIcon, PlayIcon, BookOpenIcon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/Badge';
import { useProgress } from '@/store';

export function CourseCard({ course }: { course: Course }) {
  const { getPercent } = useProgress();
  const percent = getPercent(course.id);
  const cat = CATEGORY_MAP[course.category];
  const hasVideo = course.lessons.some((l) => l.type === 'video');
  const hasArticle = course.lessons.some((l) => l.type === 'article');

  return (
    <Link to={`/courses/${course.slug}`} className="course-card">
      <div className="course-card__cover" style={{ background: course.cover }}>
        <span className="course-card__cat">
          {cat?.icon} {cat?.name}
        </span>
        <span className="course-card__level">{LEVEL_NAME[course.level]}</span>
      </div>
      <div className="course-card__body">
        <h3 className="course-card__title">{course.title}</h3>
        <p className="course-card__subtitle">{course.subtitle}</p>
        <div className="course-card__tags">
          {course.tags.slice(0, 3).map((t) => (
            <Badge key={t} tone="neutral">
              {t}
            </Badge>
          ))}
        </div>
        <div className="course-card__stats">
          <span className="course-card__rating">
            <StarIcon size={14} /> {course.rating.toFixed(1)}
          </span>
          <span>
            <UserIcon size={14} /> {formatCount(course.students)}
          </span>
          <span>
            <ClockIcon size={14} /> {formatHoursDecimal(course.durationHours)}
          </span>
        </div>
        <div className="course-card__formats">
          {hasVideo && (
            <span className="format-pill">
              <PlayIcon size={12} /> 视频
            </span>
          )}
          {hasArticle && (
            <span className="format-pill">
              <BookOpenIcon size={12} /> 图文
            </span>
          )}
          <span className="course-card__lessons">{course.lessonCount} 节</span>
        </div>
        {percent > 0 && (
          <div className={cx('course-card__progress')}>
            <div className="course-card__progress-bar">
              <div style={{ width: `${percent}%` }} />
            </div>
            <span>已学 {percent}%</span>
          </div>
        )}
      </div>
    </Link>
  );
}
