import React from 'react';
import { Calendar, Plus } from 'lucide-react';

interface TopBarProps {
  title: string;
  isHeroHeadline?: boolean;
  periodLabel: string;
  onPeriodChange: (period: string) => void;
  currentDay: number;
  totalDays: number;
  onOpenAddTransaction: () => void;
}

const PERIOD_OPTIONS = ['November 2026', 'Oktober 2026 (Arsip)'];

export const TopBar: React.FC<TopBarProps> = ({
  title,
  isHeroHeadline = false,
  periodLabel,
  onPeriodChange,
  currentDay,
  totalDays,
  onOpenAddTransaction,
}) => {
  return (
    <header className="flex items-start justify-between gap-8 mb-8">
      <div className="min-w-0 max-w-[660px]">
        <h1
          className={`font-display-heading font-extrabold text-[#15121E] leading-[1.15] ${
            isHeroHeadline ? 'text-[30px]' : 'text-[32px]'
          }`}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3 shrink-0 pt-1">
        {/* Period selector */}
        <label className="sr-only" htmlFor="period-select">
          Pilih periode bulan
        </label>
        <div className="relative inline-flex items-center">
          <Calendar
            size={15}
            strokeWidth={2.25}
            className="pointer-events-none absolute left-3.5 text-[#15121E]"
            aria-hidden="true"
          />
          <select
            id="period-select"
            value={periodLabel}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="appearance-none rounded-full border-[1.5px] border-[#15121E] bg-white pl-9 pr-7 py-2 text-[13px] font-semibold text-[#15121E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15121E]"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 text-[10px] font-bold text-[#15121E]"
          >
            ▾
          </span>
        </div>

        {/* Day progress chip */}
        <span className="neo-chip bg-white px-3.5 py-2 text-[#15121E] whitespace-nowrap shrink-0 tabular-nums">
          Hari ke-{currentDay} dari {totalDays}
        </span>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onOpenAddTransaction}
          className="inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#15121E] px-5 py-2 text-[13px] font-bold text-[#F8F3E6] whitespace-nowrap shrink-0 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#D2F25F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15121E]"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Catat transaksi</span>
        </button>
      </div>
    </header>
  );
};
