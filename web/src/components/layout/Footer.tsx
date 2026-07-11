import { Link } from 'react-router-dom';
import { GraduationIcon } from '@/components/ui/icons';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="brand__logo">
            <GraduationIcon size={18} />
          </span>
          <div>
            <div className="brand__name">
              Agent<span className="brand__accent">Study</span>
            </div>
            <p className="footer__tagline">系统学习 LangChain 的现代化在线学习平台。</p>
          </div>
        </div>
        <div className="footer__cols">
          <div className="footer__col">
            <h4>学习</h4>
            <Link to="/courses">全部课程</Link>
            <Link to="/courses?category=models">模型与提示词</Link>
            <Link to="/courses?category=rag">检索与 RAG</Link>
            <Link to="/courses?category=agents">代理 Agents</Link>
          </div>
          <div className="footer__col">
            <h4>账户</h4>
            <Link to="/login">登录</Link>
            <Link to="/register">注册</Link>
            <Link to="/profile">个人中心</Link>
            <Link to="/progress">学习进度</Link>
          </div>
          <div className="footer__col">
            <h4>项目</h4>
            <a href="https://github.com/Dajucoder/Agent_study" target="_blank" rel="noopener">
              GitHub 仓库
            </a>
            <a href="https://python.langchain.com" target="_blank" rel="noopener">
              LangChain 文档
            </a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {year} Agent Study · 仅供学习交流</span>
        <span>基于 React + TypeScript + Vite 构建</span>
      </div>
    </footer>
  );
}
