import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '@/types';
import { useProgress, useAuth } from '@/store';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRelative } from '@/utils/format';
import { BarChartIcon, TrashIcon, PlayIcon, GraduationIcon } from '@/components/ui/icons';

export function ProgressPage() {
  const { user } = useAuth();
  const { stats, getHistory, resetCourse } = useProgress();
  const [resetTarget, setResetTarget] = useState<Course | null>(null);
  const history = getHistory();

  if (!user) return null;

  return (
    <div className="container page">
      <header className="page__header">
        <h1 className="page__title">
          <BarChartIcon size={24} /> 学习进度与历史
        </h1>
        <p className="page__lead">所有进度按账户本地保存，随时查看与续学。</p>
      </header>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-card__value">{stats.coursesStarted}</span>
          <span className="stat-card__label">在学课程</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{stats.lessonsCompleted}</span>
          <span className="stat-card__label">已完成课时</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{stats.overallPercent}%</span>
          <span className="stat-card__label">总完成度</span>
        </div>
      </div>

      <h2 className="section__title" style={{ marginTop: '2rem' }}>
        学习历史
      </h2>

      {history.length > 0 ? (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.course.id} className="history-item card">
              <div
                className="history-item__cover"
                style={{ background: item.course.cover }}
                aria-hidden="true"
              />
              <div className="history-item__main">
                <div className="history-item__head">
                  <h3>{item.course.title}</h3>
                  <span className="history-item__time">最近 {formatRelative(item.updatedAt)}</span>
                </div>
                <p className="history-item__lesson">
                  <PlayIcon size={12} /> 当前：{item.lessonTitle}
                </p>
                <ProgressBar value={item.percent} size="sm" showPercent />
              </div>
              <div className="history-item__actions">
                <Link to={`/learn/${item.course.slug}?l=${item.lessonId}`} className="btn btn--primary btn--sm">
                  继续学习
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setResetTarget(item.course)}
                  leftIcon={<TrashIcon size={14} />}
                >
                  重置
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<GraduationIcon size={32} />}
          title="暂无学习记录"
          description="开始学习任意课程后，这里会显示你的进度与历史。"
          action={
            <Link to="/courses">
              <Button>去课程中心</Button>
            </Link>
          }
        />
      )}

      <Modal
        open={resetTarget !== null}
        onClose={() => setResetTarget(null)}
        title="重置学习进度"
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetTarget(null)}>
              取消
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (resetTarget) resetCourse(resetTarget.id);
                setResetTarget(null);
              }}
            >
              确认重置
            </Button>
          </>
        }
      >
        <p>
          确定要重置 <strong>{resetTarget?.title}</strong> 的全部学习进度吗？此操作不可撤销。
        </p>
      </Modal>
    </div>
  );
}
