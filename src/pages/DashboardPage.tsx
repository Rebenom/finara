import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Circle,
  Clock,
} from 'lucide-react';
import {
  BUDGET_CATEGORIES,
  METHOD_INFO,
  PATTERN_SUMMARY,
  RECOMMENDATIONS,
  SAVINGS_GOAL,
  SUMMARY_METRICS,
  TRANSACTIONS,
  USER_PROFILE,
} from '../data';
import type { BudgetCategory, PageId, RecommendationItem } from '../types';
import { buildCumulativeSeries, formatPercent, formatRupiah } from '../utils/finance';
import { CumulativeExpenseChart, PatternDonutChart } from '../components/Charts';
import {
  CategorySticker,
  CountUpRupiah,
  ResultMarker,
  RupiahAmount,
} from '../components/NeoPrimitives';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
}

const getBudgetBarColor = (tone: BudgetCategory['tone']) => {
  if (tone === 'perhatian' || tone === 'habis') return 'bg-[#FFD84D]';
  return 'bg-[#D2F25F]';
};

const getBudgetChipStyle = (tone: BudgetCategory['tone']) => {
  if (tone === 'perhatian' || tone === 'habis') return 'bg-[#FFD84D] text-[#15121E]';
  if (tone === 'aman') return 'bg-[#D2F25F] text-[#15121E]';
  return 'bg-white text-[#15121E]';
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({});

  const cumulativeSeries = buildCumulativeSeries(
    TRANSACTIONS,
    USER_PROFILE.currentDay,
    USER_PROFILE.totalDays,
    USER_PROFILE.dailyBaselineRate
  );

  const topRecommendations = RECOMMENDATIONS.filter((r) => r.featuredOnDashboard);
  const remainingTarget = SAVINGS_GOAL.targetAmount - SAVINGS_GOAL.currentAmount;

  const toggleRuleDetail = (id: string) => {
    setExpandedRules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* BARIS 1: 3 Kartu Metrik pada grid 12 kolom (Hero 6, Pemasukan 3, Pengeluaran 3) */}
      <section
        aria-label="Ringkasan metrik keuangan utama"
        className="grid grid-cols-12 gap-6 items-stretch"
      >
        {/* Hero Card: 6 kolom, Ink, angka Lime cqw clamp, hard shadow at rest */}
        <button
          type="button"
          onClick={() => onNavigate('transaksi')}
          className="col-span-6 metric-card-container neo-card-hero neo-card-interactive bg-[#15121E] text-[#F8F3E6] p-6 text-left flex flex-col justify-between relative focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E]"
        >
          {/* One small decorative star shape */}
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="absolute right-6 bottom-6 opacity-90 pointer-events-none"
          >
            <path
              d="M14 2L16.9 11.1L26 14L16.9 16.9L14 26L11.1 16.9L2 14L11.1 11.1L14 2Z"
              fill="#D2F25F"
            />
          </svg>

          <div className="flex items-start justify-between gap-3">
            <h2 className="text-[18px] font-bold text-[#F8F3E6] font-display-heading">
              Sisa dana saat ini
            </h2>
            <ResultMarker variant="perhitungan" onDark />
          </div>

          <div className="my-4">
            <div className="metric-num-hero font-extrabold text-[#D2F25F] leading-none">
              <CountUpRupiah target={SUMMARY_METRICS.remainingCash} durationMs={540} />
            </div>
          </div>

          <p className="text-[14px] font-medium text-[#F8F3E6]/85 pr-10 whitespace-nowrap">
            Saldo <strong className="font-bold text-[#F8F3E6] tabular-nums">Rp1.600.000</strong>{' '}
            − setoran tabungan{' '}
            <strong className="font-bold text-[#F8F3E6] tabular-nums">Rp300.000</strong>
          </p>
        </button>

        {/* Sky: Pemasukan (3 kolom) */}
        <button
          type="button"
          onClick={() => onNavigate('transaksi')}
          className="col-span-3 metric-card-container neo-card neo-card-interactive bg-[#A9D9FF] text-[#15121E] p-6 text-left flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E]"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[18px] font-bold font-display-heading">Pemasukan</h2>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="my-4">
            <div className="metric-num-card font-extrabold leading-none">
              <RupiahAmount value={SUMMARY_METRICS.income} />
            </div>
          </div>
          <p className="text-[13px] font-medium text-[#15121E]/85">
            {SUMMARY_METRICS.incomeSubtitle}
          </p>
        </button>

        {/* Peach: Pengeluaran (3 kolom) */}
        <button
          type="button"
          onClick={() => onNavigate('transaksi')}
          className="col-span-3 metric-card-container neo-card neo-card-interactive bg-[#FFBE9A] text-[#15121E] p-6 text-left flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E]"
        >
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-[18px] font-bold font-display-heading">Pengeluaran</h2>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="my-4">
            <div className="metric-num-card font-extrabold leading-none">
              <RupiahAmount value={SUMMARY_METRICS.expenses} />
            </div>
          </div>
          <p className="text-[13px] font-medium text-[#15121E]/85 tabular-nums">
            {SUMMARY_METRICS.expensesSubtitle}
          </p>
        </button>
      </section>

      {/* BARIS 2: Perkiraan akhir bulan (2/3) + Pola keuangan (1/3) */}
      <section
        aria-label="Perkiraan akhir bulan dan pola keuangan"
        className="grid grid-cols-[2fr_1fr] gap-6 items-stretch"
      >
        {/* Left: Perkiraan akhir bulan */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('analisis')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('analisis');
            }
          }}
          className="neo-card neo-card-interactive bg-white p-6 flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E]"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="text-[20px] font-bold text-[#15121E] font-display-heading">
                Perkiraan akhir bulan
              </h2>
              <ResultMarker variant="baseline" />
            </div>

            <div className="flex flex-wrap items-baseline gap-10 mb-5">
              <div>
                <p className="text-[12px] font-semibold text-[#15121E]/70 mb-1">
                  Perkiraan pengeluaran
                </p>
                <div className="text-[32px] font-extrabold text-[#15121E] whitespace-nowrap">
                  <RupiahAmount value={SUMMARY_METRICS.projectedExpenses} approx />
                </div>
              </div>
              <div className="pl-8 border-l-2 border-[#15121E]/15">
                <p className="text-[12px] font-semibold text-[#15121E]/70 mb-1">
                  Perkiraan sisa dana
                </p>
                <div
                  className={`text-[32px] font-extrabold whitespace-nowrap ${
                    SUMMARY_METRICS.projectedRemainingCash < 0
                      ? 'text-[#FF6B4A]'
                      : 'text-[#15121E]'
                  }`}
                >
                  <RupiahAmount value={SUMMARY_METRICS.projectedRemainingCash} approx />
                </div>
              </div>
            </div>

            <CumulativeExpenseChart
              points={cumulativeSeries}
              budgetLimit={USER_PROFILE.totalBudget}
            />
          </div>

          <p className="mt-4 text-[12px] text-[#15121E]/75 leading-relaxed">
            {METHOD_INFO.baselineDescription}
          </p>
        </div>

        {/* Right: Pola keuangan (Lilac) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('analisis')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('analisis');
            }
          }}
          className="neo-card neo-card-interactive bg-[#C4B2FF] p-6 flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E]"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-[20px] font-bold text-[#15121E] font-display-heading">
                Pola keuangan
              </h2>
              <ResultMarker variant="sementara" />
            </div>

            <p className="font-display-heading text-[24px] font-extrabold text-[#15121E] leading-[1.15]">
              {PATTERN_SUMMARY.label}
            </p>
            <p className="mt-1.5 text-[13px] font-medium text-[#15121E]/80">
              {PATTERN_SUMMARY.temporaryNote}
            </p>
          </div>

          <div className="my-5">
            <PatternDonutChart segments={PATTERN_SUMMARY.segments} />
          </div>

          <p className="text-[12px] text-[#15121E]/75 leading-relaxed">
            Pembagian komposisi dari total pengeluaran Rp1.400.000 sejauh ini.
          </p>
        </div>
      </section>

      {/* BARIS 3: Status anggaran (3/5) + Target tabungan Laptop (2/5) */}
      <section
        aria-label="Status anggaran dan target tabungan"
        className="grid grid-cols-[3fr_2fr] gap-6 items-stretch"
      >
        {/* Left: Status anggaran */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('anggaran')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('anggaran');
            }
          }}
          className="neo-card neo-card-interactive bg-white p-6 flex flex-col justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E]"
        >
          <div>
            <div className="flex items-start justify-between gap-4 mb-1.5">
              <h2 className="text-[20px] font-bold text-[#15121E] font-display-heading">
                Status anggaran
              </h2>
              <ResultMarker variant="perhitungan" />
            </div>

            {/* Legend for 50% vertical time marker */}
            <div className="flex items-center gap-2 text-[12px] font-medium text-[#15121E]/75 mb-5">
              <span
                aria-hidden="true"
                className="inline-block w-[2px] h-3.5 bg-[#15121E] shrink-0"
              />
              <span>hari ke-15 dari 30 (50% waktu)</span>
            </div>

            <div className="space-y-4">
              {BUDGET_CATEGORIES.map((cat) => {
                const widthPct = Math.min(100, cat.percentage);
                return (
                  <div
                    key={cat.id}
                    className="group grid grid-cols-[40px_1fr_195px] items-center gap-3.5"
                  >
                    <CategorySticker category={cat.id} />

                    <div className="min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <span className="text-[14px] font-bold text-[#15121E] truncate">
                          {cat.name}
                        </span>
                        <span className="text-[13px] font-semibold text-[#15121E]/80 tabular-nums whitespace-nowrap">
                          {formatRupiah(cat.spent)} / {formatRupiah(cat.limit)}
                        </span>
                      </div>

                      {/* Thick bar with Ink outline and 50% vertical marker */}
                      <div className="relative h-3.5 w-full rounded-full border-2 border-[#15121E] bg-[#F8F3E6]">
                        <div
                          className={`h-full rounded-full transition-all ${getBudgetBarColor(cat.tone)}`}
                          style={{ width: `${widthPct}%` }}
                        />
                        <div
                          aria-hidden="true"
                          className="absolute -top-1 -bottom-1 left-1/2 w-[1.5px] bg-[#15121E]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <span
                        className={`neo-chip px-3 py-1 whitespace-nowrap ${getBudgetChipStyle(cat.tone)}`}
                      >
                        {cat.statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t-2 border-[#15121E]/10 flex items-center justify-between text-[14px] font-bold text-[#15121E] tabular-nums">
            <span>Total terpakai bulan ini</span>
            <span>Rp1.400.000 dari Rp2.200.000 (63,6%)</span>
          </div>
        </div>

        {/* Right: Target tabungan Laptop (Lime) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onNavigate('tabungan')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('tabungan');
            }
          }}
          className="neo-card neo-card-interactive bg-[#D2F25F] p-6 flex flex-col cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E]"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <CategorySticker category="laptop" />
              <h2 className="text-[20px] font-bold text-[#15121E] font-display-heading leading-tight">
                Target tabungan: {SAVINGS_GOAL.title}
              </h2>
            </div>
            <ResultMarker variant="perhitungan" />
          </div>

          <div className="flex items-end justify-between gap-3 mb-2.5">
            <span className="font-display-num text-[42px] font-extrabold text-[#15121E] leading-none whitespace-nowrap">
              {formatPercent(SAVINGS_GOAL.progressPercent)}
            </span>
            <div className="text-[13px] font-semibold text-[#15121E]/85 tabular-nums text-right leading-snug">
              <div>
                {formatRupiah(SAVINGS_GOAL.currentAmount)} dari{' '}
                {formatRupiah(SAVINGS_GOAL.targetAmount)}
              </div>
              <div>tenggat {SAVINGS_GOAL.deadlineLabel}</div>
            </div>
          </div>

          {/* Thick progress bar + 25/50/75% milestone ticks + Sisa kebutuhan */}
          <div>
            <div className="h-5 w-full rounded-full border-2 border-[#15121E] bg-white overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-[#15121E]"
                style={{ width: `${SAVINGS_GOAL.progressPercent}%` }}
              />
            </div>

            <div className="relative h-[26px] mt-1.5 text-[12px] font-semibold text-[#15121E]/70 tabular-nums select-none">
              {[25, 50, 75].map((pct) => (
                <div
                  key={pct}
                  className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${pct}%` }}
                >
                  <span className="w-[2px] h-2 bg-[#15121E]/70" aria-hidden="true" />
                  <span className="leading-none mt-1">{pct}%</span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[13px] font-medium text-[#15121E]/85 tabular-nums">
              Masih perlu terkumpul{' '}
              <strong className="font-bold text-[#15121E]">
                {formatRupiah(remainingTarget)}
              </strong>
            </p>
          </div>

          {/* 3 rows raised right below progress block */}
          <div className="mt-4 pt-4 border-t-2 border-[#15121E]/15 space-y-3.5">
            {/* Row 1: Perlu disetor per bulan */}
            <div className="flex items-start justify-between gap-3">
              <span className="text-[13px] font-semibold text-[#15121E]/85">
                Perlu disetor per bulan
              </span>
              <span className="font-display-num text-[18px] font-extrabold text-[#15121E] tabular-nums whitespace-nowrap">
                {formatRupiah(SAVINGS_GOAL.requiredMonthly)}
              </span>
            </div>

            {/* Row 2: Kapasitas menabung */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[13px] font-semibold text-[#15121E]/85">
                  Kapasitas menabung
                </span>
                <ResultMarker variant="baseline" />
              </div>
              <span className="font-display-num text-[18px] font-extrabold text-[#15121E] tabular-nums whitespace-nowrap">
                {formatRupiah(SAVINGS_GOAL.savingCapacity)}
              </span>
            </div>

            {/* Row 3: Kekurangan */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[13px] font-semibold text-[#15121E]/85">
                  Kekurangan
                </span>
                <ResultMarker variant="baseline" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-display-num text-[18px] font-extrabold text-[#15121E] tabular-nums whitespace-nowrap">
                  {formatRupiah(SAVINGS_GOAL.monthlyGap)}
                </span>
                <span className="neo-chip bg-[#FFD84D] px-2.5 py-0.5 text-[#15121E] whitespace-nowrap">
                  Perlu diperhatikan
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BARIS 4: Tiga rekomendasi teratas */}
      <section aria-label="Tiga rekomendasi teratas">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[20px] font-extrabold text-[#15121E] font-display-heading">
              Tiga rekomendasi teratas
            </h2>
            <ResultMarker variant="rekomendasi" />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('rekomendasi')}
            className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#15121E] underline decoration-2 underline-offset-4 hover:text-[#15121E]/70"
          >
            <span>Lihat semua rekomendasi</span>
            <ArrowRight size={16} strokeWidth={2.25} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 items-stretch">
          {topRecommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              rec={rec}
              isExpanded={Boolean(expandedRules[rec.id])}
              onToggle={() => toggleRuleDetail(rec.id)}
            />
          ))}
        </div>
      </section>

      {/* Marker legend & bottom simulation disclaimer */}
      <footer className="pt-1 pb-4 space-y-1.5 text-[12px]">
        <p className="font-medium text-[#15121E]/75">
          Perhitungan = hasil rumus pasti · Perkiraan = hasil baseline atau model, bukan kepastian ·
          Rekomendasi = saran sistem.
        </p>
        <p className="text-[#15121E]/60">{METHOD_INFO.disclaimer}</p>
      </footer>
    </div>
  );
};

interface RecommendationCardProps {
  rec: RecommendationItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  rec,
  isExpanded,
  onToggle,
}) => {
  const isHigh = rec.priority === 'tinggi';
  const isMedium = rec.priority === 'sedang';

  return (
    <article className="neo-card bg-white p-6 flex flex-col h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className={`neo-chip inline-flex items-center gap-1.5 px-3 py-1 whitespace-nowrap ${
              isHigh ? 'bg-[#FFD84D]' : 'bg-white'
            } text-[#15121E]`}
          >
            {isHigh ? (
              <AlertTriangle size={13} strokeWidth={2.25} aria-hidden="true" />
            ) : isMedium ? (
              <Clock size={13} strokeWidth={2.25} aria-hidden="true" />
            ) : (
              <Circle size={12} strokeWidth={2.25} aria-hidden="true" />
            )}
            <span>
              {isHigh
                ? 'Prioritas tinggi'
                : isMedium
                ? 'Prioritas sedang'
                : 'Prioritas rendah'}
            </span>
          </span>

          <ResultMarker variant="perhitungan" label={rec.resultType} />
        </div>

        <h3 className="font-display-heading text-[18px] font-bold text-[#15121E] leading-snug mb-2">
          {rec.title}
        </h3>

        <p className="text-[14px] text-[#15121E]/80 leading-relaxed mb-4">{rec.reason}</p>
      </div>

      <div className="mt-auto pt-2">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={onToggle}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#15121E] underline decoration-2 underline-offset-4 hover:text-[#15121E]/70"
        >
          <span>Lihat dasar perhitungan</span>
          <ChevronDown
            size={15}
            strokeWidth={2.5}
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        <div
          className={`grid transition-all duration-200 ease-out ${
            isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-[14px] border-[1.5px] border-[#15121E] bg-[#F8F3E6] p-3.5 text-[12px] space-y-2.5">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#15121E]/15">
                <span className="font-mono font-semibold text-[#15121E]">
                  Aturan {rec.ruleCode}
                </span>
                <span className="font-semibold text-[#15121E]/80">{rec.resultType}</span>
              </div>

              <div className="space-y-2">
                {rec.variables.map((v) => (
                  <div key={v.name} className="space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-[#15121E]">{v.name}</span>
                      <span className="font-bold text-[#15121E] tabular-nums">{v.value}</span>
                    </div>
                    <p className="text-[11px] text-[#15121E]/70 tabular-nums">
                      Ambang: {v.threshold}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
