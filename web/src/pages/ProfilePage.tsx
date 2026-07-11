import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth, useProgress } from '@/store';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { cx, formatDate, formatRelative } from '@/utils/format';
import { BookOpenIcon, BarChartIcon, SettingsIcon, GraduationIcon } from '@/components/ui/icons';

type Tab = 'overview' | 'courses' | 'settings';

const COLOR_SWATCHES = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#14b8a6',
  '#0ea5e9',
];

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { stats, getHistory } = useProgress();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<Tab>((params.get('tab') as Tab) || 'overview');

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [color, setColor] = useState(user?.avatarColor ?? '#6366f1');
  const [saved, setSaved] = useState(false);

  if (!user) return null;
  const history = getHistory();

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    updateProfile({ name: name.trim() || user.name, bio, avatarColor: color });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
    { id: 'overview', label: '概览', icon: <BarChartIcon size={16} /> },
    { id: 'courses', label: '我的课程', icon: <BookOpenIcon size={16} /> },
    { id: 'settings', label: '账户设置', icon: <SettingsIcon size={16} /> },
  ];

  return (
    <div className="container page">
      <div className="profile">
        <div className="profile__header card">
          <Avatar name={user.name} color={user.avatarColor} size={72} />
          <div className="profile__id">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <span className="profile__joined">加入于 {formatDate(user.createdAt)}</span>
          </div>
          <div className="profile__stats">
            <div>
              <strong>{stats.coursesStarted}</strong>
              <span>在学课程</span>
            </div>
            <div>
              <strong>{stats.lessonsCompleted}</strong>
              <span>已完成课时</span>
            </div>
            <div>
              <strong>{stats.overallPercent}%</strong>
              <span>总完成度</span>
            </div>
          </div>
        </div>

        <div className="profile__tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={cx('profile__tab', tab === t.id && 'profile__tab--active')}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="profile__panel">
            <div className="card">
              <h3>学习概览</h3>
              <ProgressBar value={stats.overallPercent} showPercent label="总体完成度" />
              <p className="profile__hint">
                {stats.coursesStarted === 0
                  ? '你还没有开始任何课程，去课程中心挑选一门吧。'
                  : `继续保持！你已在 ${stats.coursesStarted} 门课程中完成了 ${stats.lessonsCompleted} 个课时。`}
              </p>
              <Link to="/courses" className="btn btn--primary btn--sm">
                浏览课程
              </Link>
            </div>
            {history.length > 0 && (
              <div className="card">
                <h3>最近学习</h3>
                <ul className="mini-list">
                  {history.slice(0, 5).map((item) => (
                    <li key={item.course.id}>
                      <Link to={`/learn/${item.course.slug}?l=${item.lessonId}`}>
                        <span className="mini-list__title">{item.course.title}</span>
                        <span className="mini-list__meta">最近 {formatRelative(item.updatedAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === 'courses' && (
          <div className="profile__panel">
            {history.length > 0 ? (
              <div className="course-grid">
                {history.map((item) => (
                  <Link key={item.course.id} to={`/learn/${item.course.slug}?l=${item.lessonId}`} className="course-card">
                    <div className="course-card__cover" style={{ background: item.course.cover }}>
                      <span className="course-card__cat">{item.course.title}</span>
                    </div>
                    <div className="course-card__body">
                      <h3 className="course-card__title">{item.lessonTitle}</h3>
                      <ProgressBar value={item.percent} size="sm" showPercent />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<GraduationIcon size={32} />}
                title="还没有在学课程"
                description="从课程中心开始你的第一节课吧。"
                action={
                  <Link to="/courses">
                    <Button>去课程中心</Button>
                  </Link>
                }
              />
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="profile__panel">
            <form className="card auth-form" onSubmit={onSave}>
              <h3>账户设置</h3>
              <Input label="昵称" value={name} onChange={(e) => setName(e.target.value)} />
              <div className="field">
                <label className="field__label">个人简介</label>
                <textarea
                  className="input textarea"
                  rows={3}
                  placeholder="介绍一下你自己…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field__label">头像颜色</label>
                <div className="swatches">
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      type="button"
                      key={c}
                      className={cx('swatch', color === c && 'swatch--active')}
                      style={{ background: c }}
                      onClick={() => setColor(c)}
                      aria-label={`选择颜色 ${c}`}
                    />
                  ))}
                </div>
              </div>
              <div className="profile__settings-actions">
                <Button type="submit">{saved ? '已保存' : '保存修改'}</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
