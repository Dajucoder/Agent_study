import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/utils/format';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, leftIcon, hint, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name ?? undefined;
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={cx('field__control', error && 'field__control--error')}>
        {leftIcon && <span className="field__icon">{leftIcon}</span>}
        <input
          id={inputId}
          ref={ref}
          className={cx('input', leftIcon ? 'input--with-icon' : false, className)}
          aria-invalid={!!error}
          {...rest}
        />
      </div>
      {error ? (
        <span className="field__error">{error}</span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
});
