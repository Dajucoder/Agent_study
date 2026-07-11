import { useState } from 'react';
import type { ArticleBlock } from '@/types';
import { CheckIcon } from '@/components/ui/icons';

function CodeBlock({ code, lang, caption }: { code: string; lang?: string; caption?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 剪贴板不可用时忽略 */
    }
  };
  return (
    <figure className="code-block">
      <div className="code-block__bar">
        <span className="code-block__lang">{lang ?? 'code'}</span>
        <button className="code-block__copy" onClick={copy}>
          {copied ? <CheckIcon size={14} /> : '复制'}
        </button>
      </div>
      <pre className="code-block__pre">
        <code>{code}</code>
      </pre>
      {caption && <figcaption className="code-block__caption">{caption}</figcaption>}
    </figure>
  );
}

export function ArticlePlayer({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <article className="article">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return block.level === 3 ? (
              <h3 key={i}>{block.text}</h3>
            ) : (
              <h2 key={i}>{block.text}</h2>
            );
          case 'paragraph':
            return (
              <p key={i} className="article__p">
                {block.text}
              </p>
            );
          case 'code':
            return <CodeBlock key={i} code={block.code} lang={block.lang} caption={block.caption} />;
          case 'list':
            return (
              <ul key={i} className="article__list">
                {block.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case 'callout':
            return (
              <div key={i} className={`callout callout--${block.variant ?? 'info'}`}>
                {block.title && <strong>{block.title}</strong>}
                <p>{block.text}</p>
              </div>
            );
          case 'image':
            return (
              <figure key={i} className="article__figure">
                {block.src ? (
                  <img src={block.src} alt={block.alt ?? ''} loading="lazy" />
                ) : (
                  <div className="article__figure-ph">{block.alt ?? '示意图'}</div>
                )}
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
