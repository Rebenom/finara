import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { BUDGET_CATEGORIES } from '../data';
import { formatPercent, formatRupiah, summarizeBudgets } from '../utils/finance';
import { CategorySticker, ResultMarker, RupiahAmount } from '../components/NeoPrimitives';

export const AnggaranPage: React.FC = () => {
  const [copiedNotice, setCopiedNotice] = useState(false);
  const summary = summarizeBudgets(BUDGET_CATEGORIES);

  const handleCopyLastMonth = () => {
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <section className="grid grid-cols-3 gap-6">
        <div className="metric-card-container neo-card bg-white p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold font-display-heading">Total batas anggaran</h2>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="metric-num-card font-extrabold leading-none">
            <RupiahAmount value={summary.totalLimit} />
          </div>
          <p className="mt-2.5 text-[13px] text-[#15121E]/75">
            Terbagi ke dalam 5 pos pengeluaran bulanan
          </p>
        </div>

        <div className="metric-card-container neo-card bg-[#FFBE9A] p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold font-display-heading">Realisasi hari ke-15</h2>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="metric-num-card font-extrabold leading-none">
            <RupiahAmount value={summary.totalSpent} />
          </div>
          <p className="mt-2.5 text-[13px] text-[#15121E]/85 tabular-nums">
            {formatPercent(summary.totalPercent)} dari total anggaran bulanan
          </p>
        </div>

        <div className="metric-card-container neo-card bg-[#C4B2FF] p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold font-display-heading">Proyeksi akhir bulan</h2>
            <ResultMarker variant="baseline" />
          </div>
          <div className="metric-num-card font-extrabold leading-none">
            <RupiahAmount value={summary.totalProjected} approx />
          </div>
          <p className="mt-2.5 text-[13px] text-[#15121E]/80 tabular-nums">
            Berpotensi melampaui anggaran Rp400.000 jika laju berlanjut
          </p>
        </div>
      </section>

      {/* Budget Rows */}
      <section className="neo-card bg-white p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display-heading text-[20px] font-bold text-[#15121E]">
              Rincian anggaran per kategori
            </h2>
            <p className="text-[13px] text-[#15121E]/75 mt-1">
              Membandingkan realisasi hari ke-15 dengan proyeksi baseline akhir bulan.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyLastMonth}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#F8F3E6] px-4 py-2 text-[13px] font-bold text-[#15121E] hover:bg-white hover:shadow-[2px_2px_0_#15121E] transition-all whitespace-nowrap shrink-0"
          >
            {copiedNotice ? (
              <Check size={16} strokeWidth={2.5} />
            ) : (
              <Copy size={16} strokeWidth={2.25} />
            )}
            <span>{copiedNotice ? 'Batas bulan lalu disalin' : 'Salin dari bulan lalu'}</span>
          </button>
        </div>

        {copiedNotice && (
          <div className="rounded-[12px] border-[1.5px] border-[#15121E] bg-[#F8F3E6] px-4 py-2.5 text-[13px] font-semibold text-[#15121E]">
            Batas anggaran Oktober 2026 (total Rp2.200.000) diterapkan ke templat bulan berjalan.
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-[#15121E] text-[12px] font-bold text-[#15121E]/75">
                <th className="py-3 pr-4">Kategori</th>
                <th className="py-3 px-4 text-right">Batas</th>
                <th className="py-3 px-4 text-right">Realisasi</th>
                <th className="py-3 px-4 text-right">Proyeksi akhir bulan</th>
                <th className="py-3 px-4 text-right">Sisa</th>
                <th className="py-3 pl-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#15121E]/12 text-[14px]">
              {BUDGET_CATEGORIES.map((cat) => {
                const remaining = cat.limit - cat.spent;
                const isWarning = cat.tone === 'perhatian' || cat.tone === 'habis';
                return (
                  <tr key={cat.id} className="group hover:bg-[#F8F3E6]/60 transition-colors">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <CategorySticker category={cat.id} size="sm" />
                        <div>
                          <div className="font-bold text-[#15121E]">{cat.name}</div>
                          <div className="text-[12px] text-[#15121E]/70 tabular-nums">
                            Terpakai {formatPercent(cat.percentage)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold tabular-nums">
                      {formatRupiah(cat.limit)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold tabular-nums">
                      {formatRupiah(cat.spent)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold tabular-nums">
                      {cat.id === 'cicilan' ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[14px] font-bold text-[#15121E]">
                            {formatRupiah(cat.projectedEndOfMonth)}
                          </span>
                          <span className="text-[11px] font-medium text-[#15121E]/65">
                            sudah dibayar
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-[#15121E] bg-[#C4B2FF]/45 px-2.5 py-0.5 text-[13px]">
                          {formatRupiah(cat.projectedEndOfMonth, { approx: true })}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold tabular-nums">
                      {formatRupiah(remaining)}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      <span
                        className={`neo-chip px-3 py-1 whitespace-nowrap ${
                          isWarning
                            ? 'bg-[#FFD84D]'
                            : cat.tone === 'aman'
                            ? 'bg-[#D2F25F]'
                            : 'bg-white'
                        }`}
                      >
                        {cat.statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
