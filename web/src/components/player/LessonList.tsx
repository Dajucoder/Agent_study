import type { Lesson } from '@/types';
import { formatLessonMeta } from '@/data/courses';
import { cx } from '@/utils/format';
import { PlayIcon, BookOpenIcon, CheckCircleIcon, LockIcon } from '@/components/ui/icons';

interface Props {
  lessons: Lesson[];
  currentLessonId: string;
  isComplete: (lessonId: string) => boolean;
  onSelect: (lessonId: string) => void;
}

export function LessonList({ lessons, currentLessonId, isComplete, onSelect }: Props) {
  return (
    <ol className="lesson-list">
      {lessons.map((lesson, i) => {
        const done = isComplete(lesson.id);
        const active = lesson.id === currentLessonId;
        return (
          <li key={lesson.id}>
            <button
              className={cx('lesson-item', active && 'lesson-item--active', done && 'lesson-item--done')}
              onClick={() => onSelect(lesson.id)}
              aria-current={active}
            >
              <span className="lesson-item__index">
                {done ? <CheckCircleIcon size={18} /> : <span>{i + 1}</span>}
              </span>
              <span className="lesson-item__main">
                <span className="lesson-item__title">{lesson.title}</span>
                <span className="lesson-item__meta">
                  {lesson.type === 'video' ? <PlayIcon size={12} /> : <BookOpenIcon size={12} />}
                  {formatLessonMeta(lesson)}
                  {lesson.free && (
                    <span className="lesson-item__free">
                      <LockIcon size={11} /> 免费
                    </span>
                  )}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
