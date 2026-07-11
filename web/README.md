# Agent Study · Web（在线学习平台前端）

基于 **React 18 + TypeScript + Vite** 构建的现代化在线学习平台前端，与仓库的 LangChain 学习路线深度结合。

## 功能模块

1. **课程展示与多维分类** — 6 大主题 + 难度 + 视频/图文形式筛选、搜索与排序，筛选状态同步到 URL。
2. **内容播放器** — HTML5 视频（自动续播）+ 图文富文本（代码一键复制、提示框）。
3. **学习进度追踪与历史** — 按课程记录完成度与观看秒数，按用户隔离并持久化。
4. **用户登录注册及个人中心** — 路由守卫、账户设置、学习概览。

## 快速开始

```bash
npm install
npm run dev        # 开发服务器 http://localhost:5173
npm run build      # 类型检查 + 生产构建 -> dist/
npm run preview    # 预览生产构建
```

## 结构

```
src/
├── components/   ui（基础原语）/ layout（布局）/ course（课程）/ player（播放器）
├── pages/        首页 / 课程 / 详情 / 学习 / 登录 / 注册 / 个人中心 / 进度 / 404
├── store/        AuthContext / ProgressContext / ThemeContext
├── data/         课程与分类 mock 数据
├── utils/        localStorage 封装、格式化、多维筛选
├── styles/       模块化 CSS（base / header / home / courses / learn / account / responsive）
├── types/        全局 TS 类型
├── App.tsx       路由表
└── main.tsx      入口
```

完整设计文档见仓库 [`docs/WEB_FRONTEND.md`](../../docs/WEB_FRONTEND.md)。

> 说明：本前端为演示项目，登录态与进度仅保存在浏览器 `localStorage`；生产环境需接入后端鉴权与数据库。
