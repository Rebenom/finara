import React, { useState } from 'react';
import { Archive, Compass, Plus } from 'lucide-react';
import {
  METHOD_INFO,
  PATTERN_SUMMARY,
  SUMMARY_METRICS,
  TRANSACTIONS,
  USER_PROFILE,
} from '../data';
import { buildCumulativeSeries } from '../utils/finance';
import { CumulativeExpenseChart, PatternDonutChart } from '../components/Charts';
import { ResultMarker, RupiahAmount } from '../components/NeoPrimitives';

interface AnalisisPageProps {
  onOpenAddTransaction: () => void;
}

export const AnalisisPage: React.FC<AnalisisPageProps> = ({ onOpenAddTransaction }) => {
  const [insufficientPreview, setInsufficientPreview] = useState(false);

  const cumulativeSeries = buildCumulativeSeries(
    TRANSACTIONS,
    USER_PROFILE.currentDay,
    USER_PROFILE.totalDays,
    USER_PROFILE.dailyBaselineRate
  );

  return (
    <div className="space-y-6">
      {/* Compact Demo Mode Switch Bar (max 44px height) */}
      <div className="h-[44px] max-h-[44px] rounded-[14px] border-2 border-[#15121E] bg-white px-4 flex items-center justify-between gap-4">
        <span className="text-[13px] font-bold text-[#15121E]">Mode demo</span>

        <button
          type="button"
          role="switch"
          aria-checked={insufficientPreview}
          onClick={() => setInsufficientPreview((v) => !v)}
          className="inline-flex items-center gap-2.5 text-[12px] font-semibold text-[#15121E] whitespace-nowrap shrink-0"
        >
          <span>Pratinjau: data belum cukup</span>
          <span
            aria-hidden="true"
            className={`w-9 h-5 rounded-full border-[1.5px] border-[#15121E] p-0.5 flex items-center transition-colors ${
              insufficientPreview ? 'bg-[#15121E] justify-end' : 'bg-[#F8F3E6] justify-start'
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full ${
                insufficientPreview ? 'bg-white' : 'bg-[#15121E]'
              }`}
            />
          </span>
        </button>
      </div>

      {insufficientPreview ? (
        /* Insufficient Data Empty Forecast State — zero forecast numbers */
        <section
          aria-label="Prediksi belum tersedia"
          className="neo-card bg-[#C4B2FF] p-8 flex items-start justify-between gap-8"
        >
          <div className="max-w-[640px] space-y-3">
            <div className="flex items-center gap-3">
              <span className="neo-sticker rounded-[12px] bg-white -rotate-6">
                <Compass size={20} strokeWidth={2.25} />
              </span>
              <ResultMarker variant="baseline" label="Perkiraan belum aktif" />
            </div>

            <h2 className="font-display-heading text-[28px] font-extrabold text-[#15121E]">
              Prediksi belum tersedia
            </h2>
            <p className="text-[15px] text-[#15121E]/85 leading-relaxed">
              {METHOD_INFO.insufficientDataReason}
            </p>
            <p className="text-[14px] font-semibold text-[#15121E]">
              Catat pemasukan dan pengeluaran harian secara rutin selama beberapa hari ke depan
              agar Finara dapat menghitung laju belanja dan pola keuanganmu.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenAddTransaction}
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#15121E] px-5 py-2.5 text-[13px] font-bold text-[#F8F3E6] hover:shadow-[3px_3px_0_#FFFFFF] transition-shadow"
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Catat transaksi rutin</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        /* Active Baseline Analysis & Forecast */
        <div className="grid grid-cols-[1.55fr_1fr] gap-6 items-stretch">
          {/* Forecast + Method Card */}
          <section className="neo-card bg-white p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h2 className="font-display-heading text-[22px] font-bold text-[#15121E]">
                  Perkiraan akhir bulan dan metode
                </h2>
                <ResultMarker variant="baseline" />
              </div>

              <div className="flex items-baseline gap-10 mb-5">
                <div>
                  <p className="text-[12px] font-semibold text-[#15121E]/70 mb-1">
                    Perkiraan pengeluaran
                  </p>
                  <div className="text-[32px] font-extrabold whitespace-nowrap">
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

            <div className="mt-5 pt-4 border-t-2 border-[#15121E]/12 space-y-1.5">
              <p className="text-[13px] font-bold text-[#15121E]">
                Metode yang dipakai: Baseline Laju Harian
              </p>
              <p className="text-[13px] text-[#15121E]/80 leading-relaxed">
                {METHOD_INFO.baselineDescription} Rumus: pengeluaran hari ke-15 (Rp1.400.000) + 15
                hari tersisa × Rp80.000/hari = Rp2.600.000.
              </p>
            </div>
          </section>

          {/* Pattern Classification Card (Lilac) */}
          <section className="neo-card bg-[#C4B2FF] p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <h2 className="font-display-heading text-[22px] font-bold text-[#15121E]">
                  Pola keuangan
                </h2>
                <ResultMarker variant="sementara" />
              </div>

              <p className="font-display-heading text-[26px] font-extrabold text-[#15121E] leading-tight">
                {PATTERN_SUMMARY.label}
              </p>
              <p className="text-[13px] font-medium text-[#15121E]/80 mt-1 mb-5">
                {PATTERN_SUMMARY.temporaryNote}
              </p>

              <PatternDonutChart segments={PATTERN_SUMMARY.segments} />
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#15121E]/15">
              <p className="text-[13px] font-bold text-[#15121E] mb-2">Ciri pola bulan ini</p>
              <ul className="list-disc pl-5 space-y-2 text-[13px] text-[#15121E]/85">
                {PATTERN_SUMMARY.characteristics.map((item) => (
                  <li key={item} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      )}

      {/* Friendly Empty State for Analysis History */}
      <section
        aria-label="Riwayat analisis bulanan"
        className="neo-card bg-white p-6 flex items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <span className="neo-sticker rounded-[14px] bg-[#F8F3E6] -rotate-6">
            <Archive size={20} strokeWidth={2.25} />
          </span>
          <div>
            <h2 className="font-display-heading text-[18px] font-bold text-[#15121E]">
              Belum ada arsip analisis bulanan
            </h2>
            <p className="text-[13px] text-[#15121E]/75 mt-0.5 max-w-[680px]">
              November 2026 adalah periode pertama yang sedang berjalan. Ringkasan pola dan akurasi
              perkiraan akan tersimpan otomatis di sini setiap akhir bulan pada hari ke-30.
            </p>
          </div>
        </div>
        <span className="neo-chip bg-[#F8F3E6] px-3.5 py-1.5 whitespace-nowrap shrink-0">
          0 arsip tersimpan
        </span>
      </section>
    </div>
  );
};
