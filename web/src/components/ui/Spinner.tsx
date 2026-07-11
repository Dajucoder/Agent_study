import { cx } from '@/utils/format';

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cx('spinner', className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="加载中"
    />
  );
}
