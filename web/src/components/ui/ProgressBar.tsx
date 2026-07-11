import { cx } from '@/utils/format';

interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md';
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  size = 'md',
  label,
  showPercent = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cx('progress', `progress--${size}`, className)}>
      {(label || showPercent) && (
        <div className="progress__meta">
          {label && <span className="progress__label">{label}</span>}
          {showPercent && <span className="progress__value">{clamped}%</span>}
        </div>
      )}
      <div className="progress__track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress__fill" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
