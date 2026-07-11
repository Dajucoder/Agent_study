import { useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getCourseBySlug } from '@/data/courses';
import { useProgress } from '@/store';
import { LessonList } from '@/components/player/LessonList';
import { LessonView } from '@/components/player/LessonView';
import { EmptyState } from '@/components/ui/EmptyState';
import { GraduationIcon, ArrowLeftIcon } from '@/components/ui/icons';

export function LearnPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const { getProgress, isComplete, markComplete, unmarkComplete, setCurrentLesson, updateWatchSeconds } =
    useProgress();

  const course = slug ? getCourseBySlug(slug) : undefined;

  const currentLessonId = useMemo(() => {
    if (!course) return '';
    const fromUrl = params.get('l');
    if (fromUrl && course.lessons.some((l) => l.id === fromUrl)) return fromUrl;
    const saved = getProgress(course.id)?.currentLessonId;
    if (saved && course.lessons.some((l) => l.id === saved)) return saved;
    return course.lessons[0]?.id ?? '';
  }, [course, params]);

  // URL 未带课时参数时，回写默认课时，保证可分享/可后退
  useEffect(() => {
    if (course && currentLessonId && !params.get('l')) {
      setParams({ l: currentLessonId }, { replace: true });
    }
  }, [course, currentLessonId, params, setParams]);

  if (!course) {
    return (
      <div className="container page">
        <EmptyState
          icon={<GraduationIcon size={32} />}
          title="课程不存在"
          action={
            <Link to="/courses">
              <button className="btn btn--primary">返回课程中心</button>
            </Link>
          }
        />
      </div>
    );
  }

  const index = course.lessons.findIndex((l) => l.id === currentLessonId);
  const lesson = course.lessons[index];
  const done = isComplete(course.id, lesson.id);
  const progress = getProgress(course.id);
  const startSeconds = progress?.watchSeconds[lesson.id] ?? 0;

  const selectLesson = (id: string) => {
    setCurrentLesson(course.id, id);
    setParams({ l: id });
  };

  const goRelative = (delta: number) => {
    const next = course.lessons[index + delta];
    if (next) selectLesson(next.id);
  };

  const toggleComplete = () => {
    if (done) unmarkComplete(course.id, lesson.id);
    else markComplete(course.id, lesson.id);
  };

  return (
    <div className="learn">
      <div className="learn__topbar">
        <Link to={`/courses/${course.slug}`} className="learn__back">
          <ArrowLeftIcon size={16} /> {course.title}
        </Link>
        <Link to="/courses" className="link-btn">
          课程中心
        </Link>
      </div>

      <div className="learn__layout">
        <aside className="learn__sidebar">
          <div className="learn__sidebar-head">
            <h3>课时目录</h3>
            <span>
              {progress?.completedLessons.length ?? 0}/{course.lessonCount}
            </span>
          </div>
          <LessonList
            lessons={course.lessons}
            currentLessonId={currentLessonId}
            isComplete={(id) => isComplete(course.id, id)}
            onSelect={selectLesson}
          />
        </aside>

        <section className="learn__main">
          <LessonView
            key={lesson.id}
            lesson={lesson}
            startSeconds={startSeconds}
            isComplete={done}
            onProgress={(s) => updateWatchSeconds(course.id, lesson.id, s)}
            onToggleComplete={toggleComplete}
            onPrev={index > 0 ? () => goRelative(-1) : undefined}
            onNext={index < course.lessons.length - 1 ? () => goRelative(1) : undefined}
            hasPrev={index > 0}
            hasNext={index < course.lessons.length - 1}
          />
        </section>
      </div>
    </div>
  );
}
