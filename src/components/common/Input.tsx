import React, { forwardRef, useState, ReactNode } from 'react';
import { LucideIcon, Eye, EyeOff, X, AlertCircle } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  leadingIcon?: LucideIcon | ReactNode;
  trailingIcon?: LucideIcon | ReactNode;
  showClearButton?: boolean;
  onClear?: () => void;
}

const renderAdornmentIcon = (icon: LucideIcon | ReactNode, defaultClassName = "w-5 h-5") => {
  if (!icon) return null;
  if (React.isValidElement(icon)) {
    return icon;
  }
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && '$$typeof' in icon)) {
    const IconComponent = icon as React.ComponentType<{ className?: string }>;
    return <IconComponent className={defaultClassName} />;
  }
  return <>{icon}</>;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  type = 'text',
  showClearButton,
  onClear,
  className = '',
  disabled,
  id,
  value,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const uniqueId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Determine exact padding dynamically based on presence of adornments
  // Left padding guarantees typed text never collides with leading icon (icon = 20px, left = 14px -> 48px / 3rem minimum)
  const hasLeadingIcon = !!LeadingIcon;
  
  // Calculate trailing items to reserve sufficient right padding
  let trailingElementsCount = 0;
  if (isPassword) trailingElementsCount++;
  if (showClearButton && value && !disabled) trailingElementsCount++;
  if (TrailingIcon && !isPassword) trailingElementsCount++;
  if (error) trailingElementsCount++;

  // Explicit pixel-safe clearance for trailing controls
  let rightPaddingStyle = '1rem';
  let rightPaddingClass = '!pr-4';
  if (trailingElementsCount === 1) {
    rightPaddingStyle = '3.25rem'; // 52px
    rightPaddingClass = '!pr-13';
  } else if (trailingElementsCount === 2) {
    rightPaddingStyle = '5.25rem'; // 84px
    rightPaddingClass = '!pr-22';
  } else if (trailingElementsCount >= 3) {
    rightPaddingStyle = '7.25rem'; // 116px
    rightPaddingClass = '!pr-30';
  }

  const leftPaddingStyle = hasLeadingIcon ? '3rem' : '1rem'; // 48px if icon present
  const leftPaddingClass = hasLeadingIcon ? '!pl-12' : '!pl-4';

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="w-full flex flex-col align-start text-left" id={`${uniqueId}-container`}>
      {label && (
        <label 
          htmlFor={uniqueId} 
          className="input-label select-none block mb-1.5 text-sm font-medium text-[var(--color-text-primary)]"
          id={`${uniqueId}-label`}
        >
          {label}
        </label>
      )}
      
      <div className="relative w-full flex items-center">
        {/* Leading Icon - z-10 and pointer-events-none so input clicks pass through */}
        {LeadingIcon && (
          <div 
            className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-[var(--color-text-secondary)] pointer-events-none z-10"
            id={`${uniqueId}-leading-icon`}
            aria-hidden="true"
          >
            {renderAdornmentIcon(LeadingIcon)}
          </div>
        )}

        {/* The Native Input Field with guaranteed inline padding guards */}
        <input
          {...props}
          ref={ref}
          id={uniqueId}
          type={inputType}
          disabled={disabled}
          value={value}
          style={{
            paddingLeft: leftPaddingStyle,
            paddingRight: rightPaddingStyle,
            ...props.style
          }}
          className={`input-box ${leftPaddingClass} ${rightPaddingClass} ${
            error 
              ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-[var(--color-error)]/25' 
              : 'border-[var(--color-border)] focus:border-[var(--color-primary)]'
          } ${className}`}
        />

        {/* Trailing Control Elements Container - z-10 for reliable click actions */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[var(--color-text-secondary)] z-10 pointer-events-auto">
          {/* Clear Button */}
          {showClearButton && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full hover:bg-[var(--color-background)] active:scale-95 transition-all text-[var(--color-text-light)] hover:text-[var(--color-text-primary)] cursor-pointer"
              aria-label="Clear field value"
              id={`${uniqueId}-clear-btn`}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Password Visibility Toggle */}
          {isPassword && !disabled && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 rounded-lg hover:bg-[var(--color-background)] active:scale-95 transition-all text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              id={`${uniqueId}-password-toggle`}
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          )}

          {/* Validation/Trailing Icon */}
          {TrailingIcon && !isPassword && (
            <div className="flex items-center justify-center" id={`${uniqueId}-trailing-icon`}>
              {renderAdornmentIcon(TrailingIcon)}
            </div>
          )}

          {/* Error Indicator Icon */}
          {error && (
            <div className="flex items-center justify-center text-[var(--color-error)]" id={`${uniqueId}-error-icon`}>
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>

      {/* Under-Input Error Message */}
      {error && (
        <span 
          className="mt-1 text-xs font-medium text-[var(--color-error)] flex items-center gap-1 animate-fade-in"
          id={`${uniqueId}-error-msg`}
        >
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
