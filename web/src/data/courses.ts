import type { Course, Lesson } from '@/types';

/**
 * 课程数据集（演示用，纯前端 mock）。
 * 内容主题与本仓库的 LangChain 学习路线一一对应：06 个主题维度各覆盖到。
 * 视频课时使用 Google 公开示例视频（Blender 开源影片），仅用于演示播放器。
 */

const VIDEO = {
  bigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  elephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  forBiggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  forBiggerFun: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  sintel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  tearsOfSteel: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
};

const rawCourses: Omit<Course, 'lessonCount' | 'durationHours'>[] = [
  {
    id: 'c-models-1',
    slug: 'model-io-foundations',
    title: '模型与提示词基础',
    subtitle: '从第一次模型调用到可复用的 Prompt 模板',
    description:
      '系统讲解 Model I/O 三大件：模型（Models）、提示词（Prompts）与输出解析（Output Parsers）。学完即可独立发起第一次 LLM 调用并结构化结果。',
    cover: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    level: 'beginner',
    category: 'models',
    tags: ['LLM', 'Prompt', 'ChatModel'],
    instructor: 'Dajucoder',
    rating: 4.9,
    students: 3120,
    updatedAt: '2026-07-10',
    lessons: [
      {
        id: 'l1',
        title: '认识 LangChain 与第一次调用',
        type: 'video',
        duration: 596,
        free: true,
        description: '搭建环境并发起第一个 ChatModel 调用。',
        videoUrl: VIDEO.bigBuckBunny,
      },
      {
        id: 'l2',
        title: 'PromptTemplate 与变量注入',
        type: 'article',
        duration: 0,
        free: true,
        description: '用模板管理提示词，告别字符串拼接。',
        content: [
          { kind: 'heading', text: '为什么需要 Prompt 模板', level: 2 },
          {
            kind: 'paragraph',
            text: '把提示词中的可变部分抽成变量，可以让同一段提示词复用于不同输入，也方便做 A/B 测试与版本管理。',
          },
          { kind: 'heading', text: '最小可运行示例', level: 3 },
          {
            kind: 'code',
            lang: 'python',
            code: 'from langchain_core.prompts import ChatPromptTemplate\n\nprompt = ChatPromptTemplate.from_messages([\n    ("system", "你是一位{role}，请用{style}风格回答。"),\n    ("user", "{question}"),\n])\nprint(prompt.format(role="教师", style="通俗易懂", question="什么是 RAG？"))',
          },
          {
            kind: 'callout',
            variant: 'tip',
            title: '小技巧',
            text: 'from_messages 用元组 (角色, 文本) 表达多轮对话，比手动拼字符串更安全、可读性更好。',
          },
          {
            kind: 'list',
            items: [
              'system：设定模型的身份与约束',
              'user：用户输入',
              'ai：历史回答（用于 few-shot）',
            ],
          },
        ],
      },
      {
        id: 'l3',
        title: '输出解析：从文本到结构化数据',
        type: 'video',
        duration: 653,
        description: '用 StrOutputParser 与 with_structured_output 提取结构化结果。',
        videoUrl: VIDEO.forBiggerBlazes,
      },
    ],
  },
  {
    id: 'c-models-2',
    slug: 'prompt-engineering-deep-dive',
    title: '提示词工程进阶',
    subtitle: 'Few-shot、思维链与约束输出',
    description:
      '深入提示词工程：少样本提示、思维链（CoT）、自我一致性，以及通过输出解析器强制结构化输出，让模型更可控。',
    cover: 'linear-gradient(135deg,#0ea5e9,#22d3ee)',
    level: 'intermediate',
    category: 'models',
    tags: ['Few-shot', 'CoT', '结构化输出'],
    instructor: 'Dajucoder',
    rating: 4.8,
    students: 2054,
    updatedAt: '2026-07-08',
    lessons: [
      {
        id: 'l1',
        title: 'Few-shot 提示词设计',
        type: 'article',
        duration: 0,
        free: true,
        content: [
          { kind: 'heading', text: 'Few-shot 的核心思想', level: 2 },
          {
            kind: 'paragraph',
            text: '给模型几个"输入→输出"的范例，它就能在新输入上模仿同样的模式，特别适合分类、抽取等任务。',
          },
          {
            kind: 'code',
            lang: 'python',
            code: 'examples = [\n    {"input": "很高兴见到你", "output": "positive"},\n    {"input": "这体验太糟糕了", "output": "negative"},\n]\nmessages = [("system", "判断情感，只回答 positive/negative")]\nfor ex in examples:\n    messages += [("user", ex["input"]), ("ai", ex["output"])]\nmessages.append(("user", "物流很快，体验不错"))',
          },
        ],
      },
      {
        id: 'l2',
        title: '思维链（Chain-of-Thought）',
        type: 'video',
        duration: 734,
        description: '引导模型"先思考再回答"，提升复杂推理准确率。',
        videoUrl: VIDEO.forBiggerFun,
      },
      {
        id: 'l3',
        title: '结构化输出与 Pydantic',
        type: 'video',
        duration: 512,
        description: '用 with_structured_output 把答案变成可校验的对象。',
        videoUrl: VIDEO.elephantsDream,
      },
    ],
  },
  {
    id: 'c-chains-1',
    slug: 'lcel-chains',
    title: 'LCEL 链式编排',
    subtitle: '用管道符把组件拼成生产级链',
    description:
      '掌握 LangChain Expression Language（LCEL）：用 | 把 Prompt、Model、Parser 串成链，并理解 Runnable 的统一接口与可观测性。',
    cover: 'linear-gradient(135deg,#f59e0b,#f97316)',
    level: 'intermediate',
    category: 'chains',
    tags: ['LCEL', 'Runnable', '组合'],
    instructor: 'Dajucoder',
    rating: 4.9,
    students: 2781,
    updatedAt: '2026-07-09',
    lessons: [
      {
        id: 'l1',
        title: 'Runnable 接口与管道符',
        type: 'video',
        duration: 654,
        free: true,
        description: '理解 Runnable 协议，用 | 串联组件。',
        videoUrl: VIDEO.sintel,
      },
      {
        id: 'l2',
        title: '并行、分支与 fallback',
        type: 'article',
        duration: 0,
        content: [
          { kind: 'heading', text: '组合原语', level: 2 },
          {
            kind: 'list',
            items: [
              'RunnableParallel：并行执行多个分支',
              'RunnableBranch：按条件选择分支',
              'with_fallbacks：主链路失败自动降级',
            ],
          },
          {
            kind: 'code',
            lang: 'python',
            code: 'from langchain_core.runnables import RunnableParallel\n\nchain = RunnableParallel({\n    "joke": joke_prompt | model | parser,\n    "poem": poem_prompt | model | parser,\n})\nchain.invoke({"topic": "猫"})',
          },
        ],
      },
      {
        id: 'l3',
        title: '流式输出与中间件',
        type: 'video',
        duration: 689,
        description: '用 streaming 提升体感速度，并加入自定义中间件。',
        videoUrl: VIDEO.tearsOfSteel,
      },
    ],
  },
  {
    id: 'c-memory-1',
    slug: 'conversational-memory',
    title: '对话记忆实战',
    subtitle: '让应用记住上下文',
    description:
      '实现有状态的对话：从最基础的消息历史，到基于 LangGraph 的持久化记忆，理解会话状态如何跨轮次保持。',
    cover: 'linear-gradient(135deg,#10b981,#14b8a6)',
    level: 'intermediate',
    category: 'memory',
    tags: ['Memory', 'LangGraph', '状态'],
    instructor: 'Dajucoder',
    rating: 4.7,
    students: 1893,
    updatedAt: '2026-07-07',
    lessons: [
      {
        id: 'l1',
        title: '消息历史与缓冲区',
        type: 'video',
        duration: 612,
        free: true,
        description: '用 InMemoryChatMessageHistory 管理对话上下文。',
        videoUrl: VIDEO.bigBuckBunny,
      },
      {
        id: 'l2',
        title: 'LangGraph 持久化记忆',
        type: 'video',
        duration: 845,
        description: '用 checkpointer 把状态落盘，支持断点续聊。',
        videoUrl: VIDEO.elephantsDream,
      },
      {
        id: 'l3',
        title: '记忆裁剪与窗口策略',
        type: 'article',
        duration: 0,
        content: [
          { kind: 'heading', text: '为什么要裁剪', level: 2 },
          {
            kind: 'paragraph',
            text: '上下文窗口有限且越长越贵。常用策略：最近 K 条、按 token 预算裁剪、或用摘要压缩历史。',
          },
          {
            kind: 'callout',
            variant: 'warning',
            title: '注意',
            text: '不要无脑把全部历史塞进上下文，先评估成本与相关性。',
          },
        ],
      },
    ],
  },
  {
    id: 'c-rag-1',
    slug: 'rag-from-scratch',
    title: 'RAG 从零到一',
    subtitle: '检索增强生成的完整链路',
    description:
      '从文档加载、切分、向量化到检索与生成，手把手实现一套可用的 RAG 系统，并补充评估与缓存技巧。',
    cover: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
    level: 'advanced',
    category: 'retrieval',
    tags: ['RAG', '向量库', 'Embeddings'],
    instructor: 'Dajucoder',
    rating: 4.9,
    students: 3412,
    updatedAt: '2026-07-11',
    lessons: [
      {
        id: 'l1',
        title: '文档加载与切分',
        type: 'video',
        duration: 720,
        free: true,
        description: '选择合适的 chunk size，平衡召回与噪声。',
        videoUrl: VIDEO.forBiggerBlazes,
      },
      {
        id: 'l2',
        title: '嵌入与向量检索',
        type: 'article',
        duration: 0,
        content: [
          { kind: 'heading', text: 'RAG 数据流', level: 2 },
          {
            kind: 'list',
            items: [
              '加载文档 → 切分（split）',
              '嵌入（embed） → 写入向量库',
              '问题嵌入 → 相似度检索 top-k',
              '拼接上下文 → 交给 LLM 生成',
            ],
          },
          {
            kind: 'code',
            lang: 'python',
            code: 'retriever = vectorstore.as_retriever(search_kwargs={"k": 4})\ndocs = retriever.invoke("如何部署 LangServe？")\ncontext = "\\n\\n".join(d.page_content for d in docs)',
          },
        ],
      },
      {
        id: 'l3',
        title: 'RAG 评估与缓存',
        type: 'video',
        duration: 932,
        description: '用上下文命中率评估质量，并用缓存降本提速。',
        videoUrl: VIDEO.sintel,
      },
    ],
  },
  {
    id: 'c-agents-1',
    slug: 'building-agents',
    title: '构建智能代理',
    subtitle: '让 LLM 自主调用工具',
    description:
      '学习 Agent 的核心理念：把工具交给模型，让它自己决定调用顺序。涵盖工具定义、ReAct 模式与安全约束。',
    cover: 'linear-gradient(135deg,#ef4444,#f43f5e)',
    level: 'advanced',
    category: 'agents',
    tags: ['Agent', 'Tools', 'ReAct'],
    instructor: 'Dajucoder',
    rating: 4.8,
    students: 2567,
    updatedAt: '2026-07-06',
    lessons: [
      {
        id: 'l1',
        title: '工具（Tool）的定义与绑定',
        type: 'video',
        duration: 668,
        free: true,
        description: '用 @tool 装饰器把函数变成 Agent 可调用工具。',
        videoUrl: VIDEO.forBiggerFun,
      },
      {
        id: 'l2',
        title: 'ReAct 推理循环',
        type: 'article',
        duration: 0,
        content: [
          { kind: 'heading', text: 'ReAct = 推理 + 行动', level: 2 },
          {
            kind: 'paragraph',
            text: '模型交替进行"思考（Thought）→ 行动（Action）→ 观察（Observation）"，直到给出最终答案。',
          },
          {
            kind: 'callout',
            variant: 'warning',
            title: '安全红线',
            text: '绝不要在工具内部使用 eval 执行模型生成的代码；用 AST 白名单等受控方式处理。',
          },
        ],
      },
      {
        id: 'l3',
        title: '多工具编排与护栏',
        type: 'video',
        duration: 801,
        description: '为 Agent 加边界，避免越权与失控调用。',
        videoUrl: VIDEO.tearsOfSteel,
      },
    ],
  },
  {
    id: 'c-models-3',
    slug: 'local-models-ollama',
    title: '本地模型与 Ollama',
    subtitle: '零成本、完全离线的 LLM',
    description:
      '用 Ollama 在本地运行开源模型（如 Qwen、Llama），实现零 token 费用、数据不出本机的开发调试体验。',
    cover: 'linear-gradient(135deg,#14b8a6,#0ea5e9)',
    level: 'beginner',
    category: 'models',
    tags: ['Ollama', '本地', '开源模型'],
    instructor: 'Dajucoder',
    rating: 4.6,
    students: 1422,
    updatedAt: '2026-07-05',
    lessons: [
      {
        id: 'l1',
        title: '安装与拉取模型',
        type: 'video',
        duration: 540,
        free: true,
        description: 'ollama pull + 在 LangChain 中接入。',
        videoUrl: VIDEO.elephantsDream,
      },
      {
        id: 'l2',
        title: '本地嵌入与隐私策略',
        type: 'article',
        duration: 0,
        content: [
          { kind: 'heading', text: '什么时候用本地模型', level: 2 },
          {
            kind: 'list',
            items: [
              '学习/调试，想省 token',
              '数据敏感，不能出内网',
              '需要可离线运行的演示',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'c-deploy-1',
    slug: 'langserve-deployment',
    title: 'LangServe 服务化部署',
    subtitle: '把链发布为生产级 API',
    description:
      '用 LangServe 把任意 Runnable 暴露为 REST API，自带 Playground、OpenAPI 文档与流式支持，并结合容器化部署。',
    cover: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    level: 'intermediate',
    category: 'deployment',
    tags: ['LangServe', 'FastAPI', 'Docker'],
    instructor: 'Dajucoder',
    rating: 4.7,
    students: 1634,
    updatedAt: '2026-07-07',
    lessons: [
      {
        id: 'l1',
        title: '第一个 LangServe 服务',
        type: 'video',
        duration: 612,
        free: true,
        description: 'add_routes 把链挂到 FastAPI 应用。',
        videoUrl: VIDEO.bigBuckBunny,
      },
      {
        id: 'l2',
        title: 'Playground 与流式端点',
        type: 'article',
        duration: 0,
        content: [
          { kind: 'heading', text: '自动获得的能力', level: 2 },
          {
            kind: 'list',
            items: [
              'Swagger / OpenAPI 文档',
              '交互式 Playground',
              'invoke / batch / stream 端点',
            ],
          },
          {
            kind: 'code',
            lang: 'python',
            code: 'from langserve import add_routes\nadd_routes(app, chain, path="/chain")',
          },
        ],
      },
      {
        id: 'l3',
        title: '容器化与 CI 发布',
        type: 'video',
        duration: 705,
        description: '多阶段 Dockerfile + GitHub Actions 自动发布。',
        videoUrl: VIDEO.forBiggerBlazes,
      },
    ],
  },
];

const ARTICLE_ESTIMATE_SECONDS = 480;

/** 归一化：自动计算课时数与总时长，保证数据与 lessons 一致 */
export const COURSES: Course[] = rawCourses.map((c) => {
  const lessonCount = c.lessons.length;
  const durationHours =
    Math.round(
      (c.lessons.reduce(
        (sum, l) => sum + (l.type === 'video' ? l.duration : ARTICLE_ESTIMATE_SECONDS),
        0,
      ) /
        3600) *
        10,
    ) / 10;
  return { ...c, lessonCount, durationHours };
});

export const COURSE_MAP: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.slug, c]),
);

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSE_MAP[slug];
}

/** 通用工具：把秒数格式化为 mm:ss 或 h:mm:ss */
export function formatLessonMeta(lesson: Lesson): string {
  if (lesson.type === 'video') {
    const m = Math.floor(lesson.duration / 60);
    const s = lesson.duration % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  return '图文';
}
