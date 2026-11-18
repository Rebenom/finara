import React from 'react';
import { Plus } from 'lucide-react';
import { SAVINGS_GOAL } from '../data';
import { formatPercent, formatRupiah } from '../utils/finance';
import { CategorySticker, ResultMarker, RupiahAmount } from '../components/NeoPrimitives';

interface TabunganPageProps {
  onOpenAddDeposit: () => void;
}

export const TabunganPage: React.FC<TabunganPageProps> = ({ onOpenAddDeposit }) => {
  const remainingTarget = SAVINGS_GOAL.targetAmount - SAVINGS_GOAL.currentAmount;

  return (
    <div className="space-y-6">
      {/* Main Goal Card */}
      <section className="neo-card bg-[#D2F25F] p-8">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <CategorySticker category="laptop" />
            <div>
              <h2 className="font-display-heading text-[26px] font-extrabold text-[#15121E] mb-0.5">
                {SAVINGS_GOAL.title}
              </h2>
              <p className="text-[14px] font-medium text-[#15121E]/85">
                Tenggat {SAVINGS_GOAL.deadlineLabel} · Sisa kebutuhan {formatRupiah(remainingTarget)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2.5 shrink-0">
            <ResultMarker variant="perhitungan" />
            <button
              type="button"
              onClick={onOpenAddDeposit}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#15121E] px-5 py-2.5 text-[13px] font-bold text-[#F8F3E6] whitespace-nowrap shrink-0 hover:shadow-[3px_3px_0_#FFFFFF] transition-shadow"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Catat setoran</span>
            </button>
          </div>
        </div>

        {/* Big Progress */}
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <div className="flex items-baseline gap-4">
            <span className="font-display-num text-[52px] font-extrabold text-[#15121E] leading-none">
              {formatPercent(SAVINGS_GOAL.progressPercent)}
            </span>
            <span className="text-[16px] font-bold text-[#15121E] tabular-nums">
              {formatRupiah(SAVINGS_GOAL.currentAmount)} terkumpul dari{' '}
              {formatRupiah(SAVINGS_GOAL.targetAmount)}
            </span>
          </div>
          <span className="text-[13px] font-semibold text-[#15121E]/85">
            Setoran bulan ini: Rp300.000 (2 Nov 2026)
          </span>
        </div>

        <div className="h-6 w-full rounded-full border-2 border-[#15121E] bg-white p-0.5">
          <div
            className="h-full rounded-full bg-[#15121E]"
            style={{ width: `${SAVINGS_GOAL.progressPercent}%` }}
          />
        </div>
      </section>

      {/* 3 Key Figures Row */}
      <section aria-label="Ringkasan setoran dan kapasitas menabung" className="grid grid-cols-3 gap-6">
        <div className="metric-card-container neo-card bg-white p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[14px] font-bold text-[#15121E]/80">
              Perlu disetor per bulan
            </span>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
            <RupiahAmount value={SAVINGS_GOAL.requiredMonthly} />
          </div>
          <p className="text-[13px] text-[#15121E]/75 mt-2">per bulan hingga April 2027</p>
        </div>

        <div className="metric-card-container neo-card bg-[#C4B2FF] p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[14px] font-bold text-[#15121E]/80">
              Kapasitas menabung
            </span>
            <ResultMarker variant="baseline" />
          </div>
          <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
            <RupiahAmount value={SAVINGS_GOAL.savingCapacity} />
          </div>
          <p className="text-[13px] text-[#15121E]/80 mt-2">
            berdasarkan laju pemasukan &amp; belanja
          </p>
        </div>

        <div className="metric-card-container neo-card bg-white p-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[14px] font-bold text-[#15121E]/80">Kekurangan</span>
            <ResultMarker variant="baseline" />
          </div>
          <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
            <RupiahAmount value={SAVINGS_GOAL.monthlyGap} />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="neo-chip bg-[#FFD84D] px-2.5 py-0.5 text-[#15121E] whitespace-nowrap">
              Perlu diperhatikan
            </span>
            <span className="text-[13px] text-[#15121E]/75">selisih per bulan</span>
          </div>
        </div>
      </section>

      {/* Three Alternatives */}
      <section aria-label="Tiga alternatif menutup kekurangan">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display-heading text-[20px] font-extrabold text-[#15121E]">
            Tiga alternatif menutup kekurangan Rp200.000/bulan
          </h2>
          <ResultMarker variant="rekomendasi" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {SAVINGS_GOAL.alternatives.map((alt, index) => (
            <article key={alt.id} className="neo-card bg-white p-6 flex flex-col justify-between">
              <div>
                <span className="neo-chip bg-[#F8F3E6] px-3 py-1 inline-block mb-3">
                  Alternatif {index + 1}
                </span>
                <h3 className="font-display-heading text-[18px] font-bold text-[#15121E] mb-1.5">
                  {alt.title}
                </h3>
                <p className="font-display-num text-[32px] leading-[1.15] font-extrabold text-[#15121E] mb-3">
                  {alt.valueLabel}
                </p>
              </div>
              <p className="text-[14px] text-[#15121E]/80 leading-relaxed">{alt.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
