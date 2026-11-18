import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { TRANSACTIONS } from '../data';
import type { CategoryId, TransactionType } from '../types';
import { filterTransactions, formatRupiah } from '../utils/finance';
import { CustomSelect } from '../components/CustomSelect';
import { CategorySticker, ResultMarker, RupiahAmount } from '../components/NeoPrimitives';

const CATEGORY_OPTIONS: { value: CategoryId | 'semua'; label: string }[] = [
  { value: 'semua', label: 'Semua kategori' },
  { value: 'makan', label: 'Makan dan minum' },
  { value: 'transportasi', label: 'Transportasi' },
  { value: 'kuliah', label: 'Keperluan kuliah' },
  { value: 'hiburan', label: 'Hiburan dan jajan' },
  { value: 'cicilan', label: 'Cicilan ponsel' },
  { value: 'pemasukan', label: 'Pemasukan' },
  { value: 'tabungan', label: 'Setoran tabungan' },
];

const TYPE_OPTIONS: { value: TransactionType | 'semua'; label: string }[] = [
  { value: 'semua', label: 'Semua jenis' },
  { value: 'pengeluaran', label: 'Pengeluaran' },
  { value: 'pemasukan', label: 'Pemasukan' },
  { value: 'tabungan', label: 'Setoran tabungan' },
];

const DAY_OPTIONS = Array.from({ length: 15 }, (_, i) => {
  const day = i + 1;
  return { value: String(day), label: `${day} Nov` };
});

export const TransaksiPage: React.FC = () => {
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

      {/* Filters + Table */}
      <section
        aria-label="Filter daftar transaksi"
        className="neo-card bg-white p-6 space-y-5"
      >
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
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#15121E]/65"
                aria-hidden="true"
              />
              <input
                id="filter-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Misalnya: kantin, KRL..."
                className="h-[44px] w-[240px] rounded-[14px] border-2 border-[#15121E] bg-[#F8F3E6] pl-9 pr-3.5 text-[13px] font-medium text-[#15121E]"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <span
              id="filter-category-label"
              className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
            >
              Kategori
            </span>
            <CustomSelect
              id="filter-category"
              ariaLabelledBy="filter-category-label"
              value={categoryId}
              options={CATEGORY_OPTIONS}
              onChange={(val) => setCategoryId(val as CategoryId | 'semua')}
              bgClass="bg-[#F8F3E6]"
              className="min-w-[190px]"
            />
          </div>

          {/* Type */}
          <div>
            <span
              id="filter-type-label"
              className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
            >
              Jenis
            </span>
            <CustomSelect
              id="filter-type"
              ariaLabelledBy="filter-type-label"
              value={typeFilter}
              options={TYPE_OPTIONS}
              onChange={(val) => setTypeFilter(val as TransactionType | 'semua')}
              bgClass="bg-[#F8F3E6]"
              className="min-w-[168px]"
            />
          </div>

          {/* Day Range */}
          <div className="flex items-end gap-2">
            <div>
              <span
                id="filter-start-day-label"
                className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
              >
                Dari tanggal
              </span>
              <CustomSelect
                id="filter-start-day"
                ariaLabelledBy="filter-start-day-label"
                value={String(startDay)}
                options={DAY_OPTIONS}
                onChange={(val) => setStartDay(Number(val))}
                bgClass="bg-[#F8F3E6]"
                className="min-w-[112px] tabular-nums"
              />
            </div>
            <span className="h-[44px] flex items-center text-[13px] font-bold text-[#15121E]">
              –
            </span>
            <div>
              <span
                id="filter-end-day-label"
                className="block text-[12px] font-semibold text-[#15121E]/75 mb-1.5"
              >
                Sampai
              </span>
              <CustomSelect
                id="filter-end-day"
                ariaLabelledBy="filter-end-day-label"
                value={String(endDay)}
                options={DAY_OPTIONS}
                onChange={(val) => setEndDay(Number(val))}
                bgClass="bg-[#F8F3E6]"
                className="min-w-[112px] tabular-nums"
              />
            </div>
          </div>
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
                      {tx.type === 'pemasukan' && (
                        <span className="neo-chip bg-[#A9D9FF] px-2.5 py-0.5">Pemasukan</span>
                      )}
                      {tx.type === 'tabungan' && (
                        <span className="neo-chip bg-[#D2F25F] px-2.5 py-0.5">Tabungan</span>
                      )}
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
