import React, { useEffect, useRef, useState } from 'react';

// Two-click confirm so it can't be triggered by accident.
// First click arms the button (3s window), second click within that window resets.
export default function ResetButton({
  onConfirm,
  label = 'Reset',
  variant = 'ghost',          // 'ghost' (small, header) | 'prominent' (in-body)
  disabled = false,
  armedLabel = 'Confirm reset?'
}) {
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);

  const cancel = () => {
    setArmed(false);
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  // If the parent flips disabled while armed, disarm.
  useEffect(() => { if (disabled && armed) cancel(); }, [disabled, armed]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    if (armed) {
      onConfirm();
      cancel();
    } else {
      setArmed(true);
      timer.current = setTimeout(cancel, 3000);
    }
  };

  const baseCls = variant === 'prominent'
    ? 'btn reset-btn reset-btn--prominent'
    : 'btn btn-ghost reset-btn';

  return (
    <button
      type="button"
      className={`${baseCls} ${armed ? 'is-armed' : ''}`}
      onClick={handleClick}
      onPointerDown={(e) => e.stopPropagation()}
      disabled={disabled}
      title={
        disabled
          ? 'Already at defaults'
          : armed
            ? 'Click again to confirm — restores to default'
            : 'Restore default values'
      }
      aria-label={armed ? `Confirm reset ${label}` : `Reset ${label}`}
    >
      <svg
        width={variant === 'prominent' ? 13 : 11}
        height={variant === 'prominent' ? 13 : 11}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 1 0 3-6.7" />
        <path d="M3 4v5h5" />
      </svg>
      <span>{armed ? armedLabel : label}</span>
    </button>
  );
}
