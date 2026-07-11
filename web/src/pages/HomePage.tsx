import { Link } from 'react-router-dom';
import { COURSES } from '@/data/courses';
import { CATEGORIES as CATS } from '@/data/categories';
import { useAuth, useProgress } from '@/store';
import { CourseCard } from '@/components/course/CourseCard';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  GraduationIcon,
  BookOpenIcon,
  PlayIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChevronRightIcon,
} from '@/components/ui/icons';
import { formatCount } from '@/utils/format';

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const { getContinueLearning } = useProgress();

  const totalLessons = COURSES.reduce((s, c) => s + c.lessonCount, 0);
  const totalStudents = COURSES.reduce((s, c) => s + c.students, 0);
  const featured = [...COURSES].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const continueList = isAuthenticated ? getContinueLearning(4) : [];

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__glow" />
        <div className="hero__inner">
          <span className="hero__eyebrow">
            <SparklesIcon size={16} /> 系统学习 LangChain
          </span>
          <h1 className="hero__title">
            从 0 到 1，<br />
            掌握大模型应用开发
          </h1>
          <p className="hero__subtitle">
            现代化在线学习平台：体系化课程、视频与图文双模式播放器、学习进度自动追踪，
            帮你把"调接口"升级为"搭系统"。
          </p>
          <div className="hero__actions">
            <Link to="/courses">
              <Button size="lg" rightIcon={<ArrowRightIcon size={18} />}>
                开始学习
              </Button>
            </Link>
            <Link to="/courses?category=models">
              <Button size="lg" variant="outline">
                浏览课程
              </Button>
            </Link>
          </div>
          <div className="hero__stats">
            <div>
              <strong>{COURSES.length}</strong>
              <span>门课程</span>
            </div>
            <div>
              <strong>{totalLessons}</strong>
              <span>个课时</span>
            </div>
            <div>
              <strong>{formatCount(totalStudents)}</strong>
              <span>名学员</span>
            </div>
          </div>
        </div>
      </section>

      {/* 继续学习 */}
      {continueList.length > 0 && (
        <section className="section">
          <div className="section__head">
            <h2 className="section__title">
              <PlayIcon size={20} /> 继续学习
            </h2>
            <Link to="/progress" className="section__more">
              全部进度 <ChevronRightIcon size={16} />
            </Link>
          </div>
          <div className="continue-grid">
            {continueList.map((item) => (
              <Link key={item.course.id} to={`/learn/${item.course.slug}?l=${item.lessonId}`} className="continue-card">
                <div className="continue-card__cover" style={{ background: item.course.cover }} />
                <div className="continue-card__body">
                  <span className="continue-card__cat">{item.course.title}</span>
                  <h3>{item.lessonTitle}</h3>
                  <ProgressBar value={item.percent} size="sm" showPercent />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 主题分类 */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">
            <BookOpenIcon size={20} /> 学习路线
          </h2>
        </div>
        <div className="cat-grid">
          {CATS.map((c) => {
            const count = COURSES.filter((course) => course.category === c.id).length;
            return (
              <Link key={c.id} to={`/courses?category=${c.id}`} className="cat-card">
                <span className="cat-card__icon">{c.icon}</span>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <span className="cat-card__count">{count} 门课程</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 精选课程 */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">
            <GraduationIcon size={20} /> 精选课程
          </h2>
          <Link to="/courses" className="section__more">
            查看全部 <ChevronRightIcon size={16} />
          </Link>
        </div>
        <div className="course-grid">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>准备好动手了吗？</h2>
        <p>注册账户即可追踪学习进度、收藏课程，随时随地继续上次的进度。</p>
        <Link to={isAuthenticated ? '/courses' : '/register'}>
          <Button size="lg">{isAuthenticated ? '去课程中心' : '免费注册'}</Button>
        </Link>
      </section>
    </div>
  );
}
