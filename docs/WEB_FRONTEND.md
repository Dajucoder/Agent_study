# 在线学习平台（前端）

> 🌐 **English version**: [WEB_FRONTEND.en.md](/en/WEB_FRONTEND/)
>
> 🧭 **导航** · [🏠 首页](index.md) · [目录结构](PROJECT_STRUCTURE.md) · [架构总览](ARCHITECTURE.md)
>
> 🏷️ **类型**：前端应用文档 · **前置**：Node.js 18+

本仓库现已内置一个**现代化的在线学习平台前端**（`web/` 目录），与仓库的 LangChain 学习路线深度结合，提供课程展示、内容播放、进度追踪与个人中心等完整能力。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 18（函数组件 + Hooks） |
| 语言 | TypeScript 5（严格模式，`strict`、`noUnusedLocals`） |
| 构建 | Vite 5（极速 HMR、基于 Rollup 的生产构建） |
| 路由 | React Router 6（嵌套路由 + 路由守卫） |
| 状态管理 | React Context + `useReducer`/`useState`，统一封装为 `Auth / Progress / Theme` Provider |
| 样式 | 原生 CSS + CSS 变量（设计令牌），模块化拆分，零运行时依赖 |
| 持久化 | `localStorage`（登录态、学习进度、主题，按用户隔离） |
| 图标 | 自建轻量 SVG 图标集（无第三方图标库） |

> 设计原则：**不引入额外 UI 组件库**，保持依赖精简、构建轻量，所有交互与视觉均由自研组件与 CSS 实现，便于后期维护与扩展。

## 目录结构

```
web/
├── public/favicon.svg        # 站点图标
├── src/
│   ├── components/
│   │   ├── ui/               # 基础 UI 原语（Button/Input/Modal/ProgressBar/Badge/Avatar/... + icons）
│   │   ├── layout/           # 响应式布局（Header/Footer/Layout/RequireAuth/ScrollToTop）
│   │   ├── course/           # 课程卡片、多维筛选面板、工具栏
│   │   └── player/           # 视频/图文播放器、课时列表、课时视图
│   ├── pages/                # 页面：首页/课程/课程详情/学习/登录/注册/个人中心/进度/404
│   ├── store/                # 状态管理：AuthContext / ProgressContext / ThemeContext
│   ├── data/                 # 课程与分类 mock 数据（与 LangChain 主题一一对应）
│   ├── utils/                # 工具：localStorage 封装、格式化、多维筛选纯函数
│   ├── styles/               # 模块化 CSS：base / header / home / courses / learn / account / responsive
│   ├── types/                # 全局 TypeScript 类型
│   ├── App.tsx               # 路由表
│   ├── main.tsx              # 应用入口（挂载 Provider + Router）
│   └── index.css             # 样式入口（@import 聚合各模块）
├── index.html
├── vite.config.ts            # Vite 配置（别名 @ -> src）
├── tsconfig.json
├── package.json
└── README.md
```

## 核心功能模块

1. **课程展示与多维分类**
   - 6 大主题维度（模型与提示词、链、记忆、检索与 RAG、代理、服务化部署）+ 难度 + 内容形式（视频/图文）的多维筛选。
   - 关键词搜索、排序（最受欢迎 / 最近更新 / 评分 / 时长），URL 同步筛选状态，可分享、可后退。
   - 课程卡片展示进度条、时长、评分与形式标签。

2. **支持视频与图文的内容播放器**
   - 视频播放器基于 HTML5 `<video>`，自动续播（记录上次观看秒数）。
   - 图文播放器渲染富文本块（标题、段落、代码含一键复制、列表、提示框、示意图）。
   - 课时侧边栏展示完成状态与进度。

3. **学习进度追踪与历史记录**
   - 按课程记录已完成课时、当前课时、视频观看秒数，进度持久化到本地。
   - “继续学习”“学习历史”页面展示完成度、最近学习时间，支持重置单门课程。
   - 进度**按登录用户隔离**，切换账户自动加载各自进度。

4. **用户登录注册及个人中心**
   - 注册 / 登录（演示用本地账户，数据存于浏览器），路由守卫保护学习页与个人页。
   - 个人中心含概览、我的课程、账户设置（昵称 / 简介 / 头像色）。
   - 登录后自动回跳来源页面。

## 状态管理设计

状态管理遵循 React 官方推荐的 **Context + Hooks** 模式，集中在 `src/store/`：

| Provider | 职责 | 持久化 |
| --- | --- | --- |
| `ThemeContext` | 浅色 / 深色主题，跟随系统偏好 | `localStorage` |
| `AuthContext` | 当前用户、登录 / 注册 / 登出 / 修改资料 | `localStorage` |
| `ProgressContext` | 各课程学习进度、历史、统计（按用户隔离） | `localStorage`（按 `userId` 分桶） |

所有 Provider 通过 `AppProviders` 统一挂载，组件以 `useAuth()` / `useProgress()` / `useTheme()` 消费，避免 prop drilling，状态来源清晰、易于测试与扩展。

## 路由与守卫

| 路径 | 页面 | 守卫 |
| --- | --- | --- |
| `/` | 首页 | 公开 |
| `/courses` | 课程中心 | 公开 |
| `/courses/:slug` | 课程详情 | 公开 |
| `/learn/:slug` | 学习页（播放器） | 需登录 |
| `/login`、`/register` | 登录 / 注册 | 公开 |
| `/profile` | 个人中心 | 需登录 |
| `/progress` | 学习进度与历史 | 需登录 |
| `*` | 404 | 公开 |

## 响应式与主题

- 移动优先（mobile-first），断点：`<=1024px`（平板）、`<=768px`（手机）、`<=480px`（小屏）。
- 桌面端课程筛选为侧边栏；移动端折叠为抽屉；导航在移动端收起为汉堡菜单。
- 内置浅色 / 深色双主题，通过 CSS 变量切换，用户偏好持久化。

## 本地运行

```bash
cd web
npm install
npm run dev        # 启动开发服务器 http://localhost:5173
npm run build      # 类型检查（tsc --noEmit）+ 生产构建，产物在 dist/
npm run preview    # 本地预览生产构建
```

## 构建与部署

`npm run build` 产出纯静态文件（`dist/`），可托管到任意静态服务器或对象存储。
例如部署到 GitHub Pages：将 `dist/` 推送到 `gh-pages` 分支即可（SPA 需配置 404 回退到 `index.html`）。

## 安全说明

- 本前端为**演示项目**，登录态与进度仅保存在浏览器 `localStorage`；密码使用**非安全散列**仅用于本地校验。
- 真实生产环境必须接入后端：使用 `bcrypt` / `argon2` 等慢哈希 + 盐存储密码，登录态使用 HttpOnly Cookie / 短期 Token，进度写入服务端数据库。
- 视频示例采用 Google 公开示例影片，仅用于演示播放器，生产请替换为自有 CDN 资源。
