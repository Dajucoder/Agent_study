import type { Lesson } from '@/types';
import { VideoPlayer } from './VideoPlayer';
import { ArticlePlayer } from './ArticlePlayer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, BookOpenIcon } from '@/components/ui/icons';

interface Props {
  lesson: Lesson;
  startSeconds: number;
  isComplete: boolean;
  onProgress: (seconds: number) => void;
  onToggleComplete: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function LessonView({
  lesson,
  startSeconds,
  isComplete,
  onProgress,
  onToggleComplete,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: Props) {
  return (
    <div className="lesson-view">
      <div className="lesson-view__head">
        <div className="lesson-view__badges">
          <Badge tone={lesson.type === 'video' ? 'info' : 'success'}>
            {lesson.type === 'video' ? (
              <>
                <PlayIcon size={12} /> 视频
              </>
            ) : (
              <>
                <BookOpenIcon size={12} /> 图文
              </>
            )}
          </Badge>
          {isComplete && (
            <Badge tone="success">
              <CheckIcon size={12} /> 已完成
            </Badge>
          )}
        </div>
        <h1 className="lesson-view__title">{lesson.title}</h1>
        {lesson.description && <p className="lesson-view__desc">{lesson.description}</p>}
      </div>

      {lesson.type === 'video' && lesson.videoUrl ? (
        <VideoPlayer
          src={lesson.videoUrl}
          title={lesson.title}
          startSeconds={startSeconds}
          onProgress={onProgress}
          onEnded={onToggleComplete}
        />
      ) : lesson.content ? (
        <ArticlePlayer blocks={lesson.content} />
      ) : (
        <p className="lesson-view__empty">该课时暂无内容。</p>
      )}

      <div className="lesson-view__actions">
        <div className="lesson-view__nav">
          <Button variant="outline" onClick={onPrev} disabled={!hasPrev} leftIcon={<ChevronLeftIcon size={16} />}>
            上一节
          </Button>
          <Button variant="outline" onClick={onNext} disabled={!hasNext} rightIcon={<ChevronRightIcon size={16} />}>
            下一节
          </Button>
        </div>
        <Button
          variant={isComplete ? 'secondary' : 'primary'}
          onClick={onToggleComplete}
          leftIcon={<CheckIcon size={16} />}
        >
          {isComplete ? '取消完成' : '标记完成'}
        </Button>
      </div>
    </div>
  );
}
