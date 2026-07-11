import { cx } from '@/utils/format';
import { initials } from '@/utils/format';

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, color = '#6366f1', size = 40, className }: AvatarProps) {
  return (
    <span
      className={cx('avatar', className)}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: Math.round(size * 0.4),
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
