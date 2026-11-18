import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  value: string;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  leadingIcon?: React.ReactNode;
  bgClass?: string;
  className?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  ariaLabel,
  ariaLabelledBy,
  value,
  options,
  onChange,
  leadingIcon,
  bgClass = 'bg-white',
  className = '',
  menuClassName = '',
  align = 'left',
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );
  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (options.length > 0) {
        const nextIdx = (selectedIndex + 1) % options.length;
        onChange(options[nextIdx].value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (options.length > 0) {
        const prevIdx = (selectedIndex - 1 + options.length) % options.length;
        onChange(options[prevIdx].value);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        id={id}
        type="button"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={`h-[44px] w-full rounded-[14px] border-2 border-[#15121E] ${bgClass} px-3.5 text-[13px] font-semibold text-[#15121E] inline-flex items-center justify-between gap-2.5 whitespace-nowrap transition-shadow hover:shadow-[2px_2px_0_#15121E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15121E]`}
      >
        <span className="inline-flex items-center gap-2 min-w-0 truncate">
          {leadingIcon && (
            <span className="shrink-0 text-[#15121E]" aria-hidden="true">
              {leadingIcon}
            </span>
          )}
          <span className="truncate">{selectedOption?.label ?? ''}</span>
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2.25}
          aria-hidden="true"
          className={`shrink-0 text-[#15121E] transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute top-[calc(100%+6px)] z-50 min-w-full w-max max-h-[340px] overflow-y-auto rounded-[16px] border-2 border-[#15121E] bg-white p-1.5 shadow-[4px_4px_0_#15121E] ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full rounded-[10px] px-3 py-2 text-left text-[13px] flex items-center justify-between gap-3 whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-[#15121E] text-[#F8F3E6] font-bold'
                    : 'text-[#15121E] font-semibold hover:bg-[#F8F3E6]'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={14} strokeWidth={2.5} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
