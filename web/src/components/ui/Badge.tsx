import type { ReactNode } from 'react';
import { cx } from '@/utils/format';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return <span className={cx('badge', `badge--${tone}`, className)}>{children}</span>;
}
