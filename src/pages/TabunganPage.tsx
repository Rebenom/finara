import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { SAVINGS_GOAL } from '../data';
import { formatPercent, formatRupiah } from '../utils/finance';
import { CategorySticker, ResultMarker, RupiahAmount } from '../components/NeoPrimitives';

interface TabunganPageProps {
  onOpenAddDeposit: () => void;
}

export const TabunganPage: React.FC<TabunganPageProps> = ({ onOpenAddDeposit }) => {
  const [showGapFormula, setShowGapFormula] = useState(false);
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
                Tenggat {SAVINGS_GOAL.deadlineLabel} · Masih perlu terkumpul{' '}
                {formatRupiah(remainingTarget)}
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

      {/* 3 Key Figures Row + Collapsible Gap Formula */}
      <section aria-label="Ringkasan setoran dan kapasitas menabung">
        <div className="grid grid-cols-3 gap-6">
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
              <ResultMarker variant="baseline" outlineOnly />
            </div>
            <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
              <RupiahAmount value={SAVINGS_GOAL.savingCapacity} />
            </div>
            <p className="text-[13px] text-[#15121E]/80 mt-2">
              berdasarkan laju pemasukan &amp; belanja
            </p>
          </div>

          <div className="metric-card-container neo-card bg-[#C4B2FF] p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[14px] font-bold text-[#15121E]/80">Kekurangan</span>
              <ResultMarker variant="baseline" outlineOnly />
            </div>
            <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
              <RupiahAmount value={SAVINGS_GOAL.monthlyGap} />
            </div>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span className="neo-chip bg-[#FFD84D] px-2.5 py-0.5 text-[#15121E] whitespace-nowrap">
                Perlu diperhatikan
              </span>
              <span className="text-[13px] text-[#15121E]/80">selisih per bulan</span>
            </div>
          </div>
        </div>

        {/* Right-aligned toggle link */}
        <div className="flex justify-end mt-3">
          <button
            type="button"
            aria-expanded={showGapFormula}
            onClick={() => setShowGapFormula((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#15121E] underline decoration-2 underline-offset-4 hover:text-[#15121E]/70"
          >
            <span>Lihat cara menghitung kekurangan</span>
            <ChevronDown
              size={15}
              strokeWidth={2.5}
              className={`transition-transform duration-200 ${showGapFormula ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Collapsible Equation Card */}
        <div
          className={`grid transition-all duration-250 ease-out ${
            showGapFormula ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="neo-card bg-white p-6">
              <div className="flex items-start justify-between gap-2.5">
                {/* Term 1: KS */}
                <div className="flex-1 min-w-0">
                  <div className="font-display-num text-[24px] font-extrabold text-[#15121E] leading-tight whitespace-nowrap">
                    <RupiahAmount value={600000} />
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[#15121E]/85 leading-snug">
                    Perlu disetor per bulan
                  </p>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-[#15121E]/50">KS</p>
                </div>

                {/* Operator: - */}
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-[#15121E] text-[#F8F3E6] flex items-center justify-center text-[15px] font-bold shrink-0 mt-0.5"
                >
                  −
                </span>

                {/* Term 2: Tef */}
                <div className="flex-1 min-w-0">
                  <div className="font-display-num text-[24px] font-extrabold text-[#15121E] leading-tight whitespace-nowrap">
                    <RupiahAmount value={300000} />
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[#15121E]/85 leading-snug">
                    Sudah disetor bulan ini
                  </p>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-[#15121E]/50">Tef</p>
                </div>

                {/* Operator: = */}
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-[#15121E] text-[#F8F3E6] flex items-center justify-center text-[15px] font-bold shrink-0 mt-0.5"
                >
                  =
                </span>

                {/* Term 3: KSr */}
                <div className="flex-1 min-w-0">
                  <div className="font-display-num text-[24px] font-extrabold text-[#15121E] leading-tight whitespace-nowrap">
                    <RupiahAmount value={300000} />
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[#15121E]/85 leading-snug">
                    Sisa setoran bulan ini
                  </p>
                  <p className="mt-1 font-mono text-[11px] font-semibold text-[#15121E]/50">KSr</p>
                </div>

                {/* Operator: - */}
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-[#15121E] text-[#F8F3E6] flex items-center justify-center text-[15px] font-bold shrink-0 mt-0.5"
                >
                  −
                </span>

                {/* Term 4: DS */}
                <div className="flex-1 min-w-0">
                  <div className="font-display-num text-[24px] font-extrabold text-[#15121E] leading-tight whitespace-nowrap">
                    <RupiahAmount value={100000} approx />
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[#15121E]/85 leading-snug">
                    Dana yang masih bisa disetor
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] font-semibold text-[#15121E]/50">DS</span>
                    <ResultMarker variant="baseline" />
                  </div>
                </div>

                {/* Operator: = */}
                <span
                  aria-hidden="true"
                  className="w-7 h-7 rounded-full bg-[#15121E] text-[#F8F3E6] flex items-center justify-center text-[15px] font-bold shrink-0 mt-0.5"
                >
                  =
                </span>

                {/* Term 5: KK */}
                <div className="flex-1 min-w-0">
                  <div className="font-display-num text-[24px] font-extrabold text-[#15121E] leading-tight whitespace-nowrap">
                    <RupiahAmount value={200000} approx />
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-[#15121E]/85 leading-snug">
                    Kekurangan
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] font-semibold text-[#15121E]/50">KK</span>
                    <ResultMarker variant="baseline" />
                  </div>
                </div>
              </div>

              <p className="mt-4 pt-3.5 border-t border-[#15121E]/15 text-[13px] font-medium text-[#15121E]/85 tabular-nums">
                Kapasitas menabung (KM) = Tef Rp300.000 + DS ≈ Rp100.000 = ≈ Rp400.000.
              </p>
            </div>
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

        <div className="grid grid-cols-3 gap-6 items-stretch">
          {SAVINGS_GOAL.alternatives.map((alt, index) => (
            <article key={alt.id} className="neo-card bg-white p-6 flex flex-col">
              <span className="neo-chip bg-[#F8F3E6] px-3 py-1 inline-block self-start mb-3">
                Alternatif {index + 1}
              </span>
              <h3 className="font-display-heading text-[18px] font-bold text-[#15121E]">
                {alt.title}
              </h3>
              <p className="mt-3 text-[13px] font-semibold text-[#15121E]/70">
                {alt.metricLabel}
              </p>
              <p className="mt-1 font-display-num text-[32px] leading-none font-extrabold text-[#15121E] whitespace-nowrap">
                {alt.valueLabel}
              </p>
              <p className="mt-4 text-[14px] text-[#15121E]/80 leading-relaxed">{alt.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
