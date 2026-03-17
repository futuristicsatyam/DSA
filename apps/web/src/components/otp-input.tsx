
'use client';
// apps/web/src/components/otp-input.tsx

import { useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  disabled?: boolean;
  className?: string;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  className,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digits = Array.from({ length }, (_, i) => value[i] ?? '');

  const update = (index: number, char: string) => {
    const arr = digits.slice();
    arr[index] = char;
    onChange(arr.join(''));
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        update(index, '');
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        update(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleInput = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, '').slice(-1);
    if (!char) return;
    update(index, char);
    if (index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted.padEnd(length, value.slice(pasted.length) ?? '').slice(0, length));
    const next = Math.min(pasted.length, length - 1);
    inputRefs.current[next]?.focus();
  };

  return (
    <div className={cn('flex gap-2', className)}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoComplete="one-time-code"
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            'w-10 h-12 text-center text-lg font-semibold rounded-lg border',
            'border-input bg-background transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            digit && 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        />
      ))}
    </div>
  );
}

