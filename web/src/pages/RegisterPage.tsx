import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/store';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GraduationIcon } from '@/components/ui/icons';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
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
        <h1 className="auth-card__title">创建账户</h1>
        <p className="auth-card__sub">免费注册，开启你的 LangChain 学习之旅。</p>

        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <Input
            label="昵称"
            name="name"
            placeholder="你的称呼"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="nickname"
            required
          />
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
            placeholder="至少 6 位"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            hint="至少 6 位字符"
            required
          />
          <Input
            label="确认密码"
            type="password"
            name="confirm"
            placeholder="再次输入密码"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            error={error}
            required
          />
          <Button type="submit" block loading={loading}>
            注册并登录
          </Button>
        </form>

        <p className="auth-card__foot">
          已有账户？<Link to="/login">去登录</Link>
        </p>
      </div>
    </div>
  );
}
