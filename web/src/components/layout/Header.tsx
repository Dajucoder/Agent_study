import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '@/store';
import { cx } from '@/utils/format';
import {
  MenuIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  LogOutIcon,
  GraduationIcon,
  SearchIcon,
  ChevronDownIcon,
  BarChartIcon,
  SettingsIcon,
} from '@/components/ui/icons';
import { Avatar } from '@/components/ui/Avatar';

const NAV = [
  { to: '/', label: '首页', end: true },
  { to: '/courses', label: '课程', end: false },
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 路由变化时关闭移动端菜单
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // 点击外部关闭用户下拉
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [userMenuOpen]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/courses?q=${encodeURIComponent(q)}` : '/courses');
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="brand" aria-label="Agent Study 首页">
          <span className="brand__logo">
            <GraduationIcon size={20} />
          </span>
          <span className="brand__name">
            Agent<span className="brand__accent">Study</span>
          </span>
        </Link>

        <nav className="header__nav" aria-label="主导航">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cx('nav-link', isActive && 'nav-link--active')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <form className="header__search" onSubmit={onSearch} role="search">
          <SearchIcon size={16} />
          <input
            type="search"
            placeholder="搜索课程…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="搜索课程"
          />
        </form>

        <div className="header__actions">
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          {isAuthenticated && user ? (
            <div className="user-menu" ref={userMenuRef}>
              <button
                className="user-menu__trigger"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <Avatar name={user.name} color={user.avatarColor} size={32} />
                <span className="user-menu__name">{user.name}</span>
                <ChevronDownIcon size={16} />
              </button>
              {userMenuOpen && (
                <div className="user-menu__dropdown" role="menu">
                  <div className="user-menu__head">
                    <Avatar name={user.name} color={user.avatarColor} size={40} />
                    <div>
                      <div className="user-menu__title">{user.name}</div>
                      <div className="user-menu__email">{user.email}</div>
                    </div>
                  </div>
                  <Link className="user-menu__item" to="/profile" role="menuitem">
                    <UserIcon size={16} /> 个人中心
                  </Link>
                  <Link className="user-menu__item" to="/progress" role="menuitem">
                    <BarChartIcon size={16} /> 学习进度
                  </Link>
                  <Link className="user-menu__item" to="/profile?tab=settings" role="menuitem">
                    <SettingsIcon size={16} /> 账户设置
                  </Link>
                  <button
                    className="user-menu__item user-menu__item--danger"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    role="menuitem"
                  >
                    <LogOutIcon size={16} /> 退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header__auth">
              <Link to="/login" className="btn btn--ghost btn--sm">
                登录
              </Link>
              <Link to="/register" className="btn btn--primary btn--sm">
                注册
              </Link>
            </div>
          )}

          <button
            className="icon-btn header__burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="菜单"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* 移动端抽屉菜单 */}
      {menuOpen && (
        <div className="mobile-menu">
          <form className="mobile-menu__search" onSubmit={onSearch}>
            <SearchIcon size={16} />
            <input
              type="search"
              placeholder="搜索课程…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="搜索课程"
            />
          </form>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cx('mobile-menu__link', isActive && 'mobile-menu__link--active')}
            >
              {item.label}
            </NavLink>
          ))}
          <div className="mobile-menu__auth">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="btn btn--outline btn--block">
                  个人中心
                </Link>
                <Link to="/progress" className="btn btn--outline btn--block">
                  学习进度
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--outline btn--block">
                  登录
                </Link>
                <Link to="/register" className="btn btn--primary btn--block">
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
