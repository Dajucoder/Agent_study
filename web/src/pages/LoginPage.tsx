import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GraduationIcon } from '@/components/ui/icons';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-card__brand">
          <span className="brand__logo">
            <GraduationIcon size={18} />
          </span>
          Agent<span className="brand__accent">Study</span>
        </Link>
        <h1 className="auth-card__title">欢迎回来</h1>
        <p className="auth-card__sub">登录以同步你的学习进度与收藏。</p>

        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <Input
            label="邮箱"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="密码"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            error={error}
            required
          />
          <Button type="submit" block loading={loading}>
            登录
          </Button>
        </form>

        <p className="auth-card__foot">
          还没有账户？<Link to="/register">立即注册</Link>
        </p>
        <p className="auth-card__demo">
          演示提示：在本平台注册一个账户即可体验完整功能（数据仅保存在本地浏览器）。
        </p>
      </div>
    </div>
  );
}
