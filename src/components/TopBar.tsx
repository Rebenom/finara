import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface TopBarProps {
  title: string;
  isHeroHeadline?: boolean;
  periodLabel: string;
  onPeriodChange: (period: string) => void;
  currentDay: number;
  totalDays: number;
  onOpenAddTransaction: () => void;
}

const PERIOD_OPTIONS = [
  { value: 'November 2026', label: 'November 2026' },
  { value: 'Oktober 2026 (Arsip)', label: 'Oktober 2026 (Arsip)' },
];

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
        {/* Custom period dropdown */}
        <CustomSelect
          id="period-select"
          ariaLabel="Pilih periode bulan"
          value={periodLabel}
          options={PERIOD_OPTIONS}
          onChange={onPeriodChange}
          leadingIcon={<Calendar size={15} strokeWidth={2.25} />}
          bgClass="bg-white"
          align="right"
        />

        {/* Day progress chip */}
        <span className="neo-chip bg-white px-3.5 py-2.5 text-[#15121E] whitespace-nowrap shrink-0 tabular-nums">
          Hari ke-{currentDay} dari {totalDays}
        </span>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onOpenAddTransaction}
          className="h-[44px] inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#15121E] px-5 text-[13px] font-bold text-[#F8F3E6] whitespace-nowrap shrink-0 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#D2F25F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15121E]"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Catat transaksi</span>
        </button>
      </div>
    </header>
  );
};
