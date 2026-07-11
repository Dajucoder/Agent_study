import { Link, useParams } from 'react-router-dom';
import { getCourseBySlug, formatLessonMeta } from '@/data/courses';
import { LEVEL_NAME, CATEGORY_MAP } from '@/data/categories';
import { useProgress } from '@/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  StarIcon,
  UserIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  GraduationIcon,
} from '@/components/ui/icons';
import { formatCount, formatHoursDecimal, formatDate } from '@/utils/format';

export function CourseDetailPage() {
  const { slug } = useParams();
  const course = slug ? getCourseBySlug(slug) : undefined;
  const { getPercent, getProgress, isComplete } = useProgress();

  if (!course) {
    return (
      <div className="container page">
        <EmptyState
          icon={<GraduationIcon size={32} />}
          title="课程不存在"
          description="该课程可能已下线或链接有误。"
          action={
            <Link to="/courses">
              <Button>返回课程中心</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const cat = CATEGORY_MAP[course.category];
  const percent = getPercent(course.id);
  const progress = getProgress(course.id);
  const resumeLessonId = progress?.currentLessonId ?? course.lessons[0]?.id;
  const completedCount = progress?.completedLessons.length ?? 0;

  return (
    <div className="course-detail">
      <div className="course-detail__hero" style={{ background: course.cover }}>
        <div className="container course-detail__hero-inner">
          <Link to="/courses" className="course-detail__back">
            <ArrowLeftIcon size={16} /> 返回课程中心
          </Link>
          <div className="course-detail__hero-badges">
            <Badge tone="primary">{cat?.icon} {cat?.name}</Badge>
            <Badge tone="neutral">{LEVEL_NAME[course.level]}</Badge>
          </div>
          <h1 className="course-detail__title">{course.title}</h1>
          <p className="course-detail__subtitle">{course.subtitle}</p>
          <div className="course-detail__meta">
            <span>
              <StarIcon size={16} /> {course.rating.toFixed(1)}
            </span>
            <span>
              <UserIcon size={16} /> {formatCount(course.students)} 名学员
            </span>
            <span>
              <ClockIcon size={16} /> {formatHoursDecimal(course.durationHours)}
            </span>
            <span>更新于 {formatDate(course.updatedAt)}</span>
          </div>
          <div className="course-detail__instructor">
            <Avatar name={course.instructor} size={36} />
            <div>
              <div className="course-detail__instructor-name">{course.instructor}</div>
              <div className="course-detail__instructor-role">课程讲师</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container course-detail__body">
        <div className="course-detail__main">
          <section className="card-block">
            <h2>课程介绍</h2>
            <p>{course.description}</p>
            <div className="course-detail__tags">
              {course.tags.map((t) => (
                <Badge key={t} tone="neutral">
                  {t}
                </Badge>
              ))}
            </div>
          </section>

          <section className="card-block">
            <h2>课时目录（{course.lessonCount} 节）</h2>
            <ol className="lesson-outline">
              {course.lessons.map((lesson, i) => {
                const done = isComplete(course.id, lesson.id);
                return (
                  <li key={lesson.id} className="lesson-outline__item">
                    <span className="lesson-outline__index">
                      {done ? <CheckCircleIcon size={18} /> : i + 1}
                    </span>
                    <div className="lesson-outline__main">
                      <span className="lesson-outline__title">{lesson.title}</span>
                      <span className="lesson-outline__meta">
                        {lesson.type === 'video' ? <PlayIcon size={12} /> : <BookOpenIcon size={12} />}
                        {formatLessonMeta(lesson)}
                        {lesson.free && <Badge tone="success">免费</Badge>}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="course-detail__aside">
          <div className="enroll-card">
            <div className="enroll-card__price">
              <span className="enroll-card__free">免费</span>
              <small>全部内容开放学习</small>
            </div>
            {percent > 0 && (
              <div className="enroll-card__progress">
                <ProgressBar value={percent} showPercent label="学习进度" />
                <p className="enroll-card__done">已完成 {completedCount}/{course.lessonCount} 节</p>
              </div>
            )}
            <Link
              to={`/learn/${course.slug}?l=${resumeLessonId}`}
              className="btn btn--primary btn--lg btn--block"
            >
              {percent > 0 ? '继续学习' : '开始学习'}
            </Link>
            <Link to="/courses" className="btn btn--ghost btn--block">
              浏览更多课程
            </Link>
            <ul className="enroll-card__points">
              <li>
                <PlayIcon size={14} /> {course.lessonCount} 节视频 / 图文课时
              </li>
              <li>
                <ClockIcon size={14} /> 约 {formatHoursDecimal(course.durationHours)}
              </li>
              <li>
                <CheckCircleIcon size={14} /> 进度自动保存，随时续学
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
