import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { TRANSACTIONS } from '../data';
import type { CategoryId, TransactionType } from '../types';
import { filterTransactions, formatRupiah } from '../utils/finance';
import { CategorySticker, ResultMarker, RupiahAmount } from '../components/NeoPrimitives';

interface TransaksiPageProps {
  onOpenAddTransaction: (defaultCategory?: string) => void;
}

const CATEGORY_OPTIONS: { id: CategoryId | 'semua'; label: string }[] = [
  { id: 'semua', label: 'Semua kategori' },
  { id: 'makan', label: 'Makan dan minum' },
  { id: 'transportasi', label: 'Transportasi' },
  { id: 'kuliah', label: 'Keperluan kuliah' },
  { id: 'hiburan', label: 'Hiburan dan jajan' },
  { id: 'cicilan', label: 'Cicilan ponsel' },
  { id: 'pemasukan', label: 'Pemasukan' },
  { id: 'tabungan', label: 'Setoran tabungan' },
];

export const TransaksiPage: React.FC<TransaksiPageProps> = ({ onOpenAddTransaction }) => {
  const [categoryId, setCategoryId] = useState<CategoryId | 'semua'>('semua');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'semua'>('semua');
  const [startDay, setStartDay] = useState<number>(1);
  const [endDay, setEndDay] = useState<number>(15);
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(
    () =>
      filterTransactions(TRANSACTIONS, {
        categoryId,
        type: typeFilter,
        startDay: Math.min(startDay, endDay),
        endDay: Math.max(startDay, endDay),
        query,
      }),
    [categoryId, typeFilter, startDay, endDay, query]
  );

  const totals = useMemo(() => {
    const income = filtered
      .filter((t) => t.type === 'pemasukan')
      .reduce((s, t) => s + t.amount, 0);
    const expense = filtered
      .filter((t) => t.type === 'pengeluaran')
      .reduce((s, t) => s + t.amount, 0);
    const savings = filtered
      .filter((t) => t.type === 'tabungan')
      .reduce((s, t) => s + t.amount, 0);
    return { income, expense, savings };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Summary Strip */}
      <section
        aria-label="Ringkasan transaksi tersaring"
        className="grid grid-cols-3 gap-6"
      >
        <div className="metric-card-container neo-card bg-[#A9D9FF] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-[#15121E]">Total pemasukan</span>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
            <RupiahAmount value={totals.income} />
          </div>
        </div>

        <div className="metric-card-container neo-card bg-[#FFBE9A] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-[#15121E]">Total pengeluaran</span>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
            <RupiahAmount value={totals.expense} />
          </div>
        </div>

        <div className="metric-card-container neo-card bg-[#D2F25F] p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-[#15121E]">Setoran tabungan</span>
            <ResultMarker variant="perhitungan" />
          </div>
          <div className="metric-num-card font-extrabold text-[#15121E] leading-none">
            <RupiahAmount value={totals.savings} />
          </div>
        </div>
      </section>

      {/* Filters + CTA */}
      <section
        aria-label="Filter daftar transaksi"
        className="neo-card bg-white p-6 space-y-5"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="filter-query"
                className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
              >
                Cari keterangan
              </label>
              <div className="relative">
                <Search
                  size={15}
                  strokeWidth={2.25}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#15121E]/65"
                  aria-hidden="true"
                />
                <input
                  id="filter-query"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Misalnya: kantin, KRL..."
                  className="w-[220px] rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] pl-9 pr-3 py-2 text-[13px] font-medium text-[#15121E]"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="filter-category"
                className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
              >
                Kategori
              </label>
              <select
                id="filter-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId | 'semua')}
                className="rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3 py-2 text-[13px] font-semibold text-[#15121E]"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="filter-type"
                className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
              >
                Jenis
              </label>
              <select
                id="filter-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'semua')}
                className="rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3 py-2 text-[13px] font-semibold text-[#15121E]"
              >
                <option value="semua">Semua jenis</option>
                <option value="pengeluaran">Pengeluaran</option>
                <option value="pemasukan">Pemasukan</option>
                <option value="tabungan">Setoran tabungan</option>
              </select>
            </div>

            {/* Day Range */}
            <div className="flex items-end gap-2">
              <div>
                <label
                  htmlFor="filter-start-day"
                  className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
                >
                  Dari tanggal
                </label>
                <select
                  id="filter-start-day"
                  value={startDay}
                  onChange={(e) => setStartDay(Number(e.target.value))}
                  className="rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3 py-2 text-[13px] font-semibold text-[#15121E] tabular-nums"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d} Nov
                    </option>
                  ))}
                </select>
              </div>
              <span className="pb-2.5 text-[13px] font-bold text-[#15121E]">–</span>
              <div>
                <label
                  htmlFor="filter-end-day"
                  className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
                >
                  Sampai
                </label>
                <select
                  id="filter-end-day"
                  value={endDay}
                  onChange={(e) => setEndDay(Number(e.target.value))}
                  className="rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3 py-2 text-[13px] font-semibold text-[#15121E] tabular-nums"
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d} Nov
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddTransaction('Makan dan minum')}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#D2F25F] px-4 py-2 text-[13px] font-bold text-[#15121E] whitespace-nowrap shrink-0 hover:shadow-[3px_3px_0_#15121E] transition-shadow"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Tambah transaksi</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-[#15121E] text-[12px] font-bold text-[#15121E]/75">
                <th className="py-3 pr-4">Tanggal</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 pl-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#15121E]/12 text-[14px]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#15121E]/75">
                    Tidak ada transaksi yang cocok dengan filter saat ini.{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryId('semua');
                        setTypeFilter('semua');
                        setStartDay(1);
                        setEndDay(15);
                        setQuery('');
                      }}
                      className="font-bold text-[#15121E] underline"
                    >
                      Atur ulang filter
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="group hover:bg-[#F8F3E6]/70 transition-colors">
                    <td className="py-3.5 pr-4 font-semibold text-[#15121E]/85 tabular-nums whitespace-nowrap">
                      {tx.dateLabel}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <CategorySticker category={tx.categoryId} size="sm" />
                        <span className="font-semibold text-[#15121E]">{tx.categoryLabel}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#15121E]">{tx.description}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`neo-chip px-2.5 py-0.5 ${
                          tx.type === 'pemasukan'
                            ? 'bg-[#A9D9FF]'
                            : tx.type === 'tabungan'
                            ? 'bg-[#D2F25F]'
                            : 'bg-[#F8F3E6]'
                        }`}
                      >
                        {tx.type === 'pemasukan'
                          ? 'Pemasukan'
                          : tx.type === 'tabungan'
                          ? 'Tabungan'
                          : 'Pengeluaran'}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right font-display-num text-[16px] font-bold text-[#15121E] tabular-nums whitespace-nowrap">
                      {tx.type === 'pemasukan' ? '+' : '-'}
                      {formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-[12px] font-medium text-[#15121E]/70 tabular-nums">
          Menampilkan {filtered.length} dari {TRANSACTIONS.length} transaksi simulasi bulan November
          2026.
        </p>
      </section>
    </div>
  );
};
