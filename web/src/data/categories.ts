import type { Category, CourseLevel } from '@/types';

/** 主题维度（多维分类的第一维度） */
export const CATEGORIES: Category[] = [
  {
    id: 'models',
    name: '模型与提示词',
    icon: '🤖',
    description: '调用 LLM、管理 ChatModel 与 Prompt 模板，打好应用基础。',
  },
  {
    id: 'chains',
    name: '链（Chains）',
    icon: '🔗',
    description: '用 LCEL 把多次模型调用串成可复用的流水线。',
  },
  {
    id: 'memory',
    name: '记忆（Memory）',
    icon: '🧠',
    description: '让对话拥有上下文，构建有状态的智能应用。',
  },
  {
    id: 'retrieval',
    name: '检索与 RAG',
    icon: '🔍',
    description: '文档加载、切分、向量化与检索增强生成。',
  },
  {
    id: 'agents',
    name: '代理（Agents）',
    icon: '🕹️',
    description: '让 LLM 自主选择工具，完成复杂多步任务。',
  },
  {
    id: 'deployment',
    name: '服务化与部署',
    icon: '🚀',
    description: '用 LangServe + FastAPI 把链暴露为生产级 API。',
  },
];

/** 难度维度 */
export const LEVELS: { id: CourseLevel; name: string; color: string }[] = [
  { id: 'beginner', name: '入门', color: '#10b981' },
  { id: 'intermediate', name: '进阶', color: '#f59e0b' },
  { id: 'advanced', name: '高级', color: '#ef4444' },
];

export const LEVEL_NAME: Record<CourseLevel, string> = {
  beginner: '入门',
  intermediate: '进阶',
  advanced: '高级',
};

/** 按 id 快速取分类 */
export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);
