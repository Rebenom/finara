import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { formatInputRupiah, parseFormattedRupiah } from '../utils/finance';
import { CustomSelect } from './CustomSelect';
import { CategorySticker } from './NeoPrimitives';

const EXPENSE_CATEGORY_OPTIONS = [
  { value: 'Makan dan minum', label: 'Makan dan minum' },
  { value: 'Transportasi', label: 'Transportasi' },
  { value: 'Keperluan kuliah', label: 'Keperluan kuliah' },
  { value: 'Hiburan dan jajan', label: 'Hiburan dan jajan' },
  { value: 'Cicilan ponsel', label: 'Cicilan ponsel' },
];

const INCOME_CATEGORY_OPTIONS = [
  { value: 'Uang saku bulanan', label: 'Uang saku bulanan' },
  { value: 'Honor paruh waktu', label: 'Honor paruh waktu' },
];

const SAVINGS_TARGET_OPTIONS = [
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Tabungan umum (tanpa target)', label: 'Tabungan umum (tanpa target)' },
];

type ModalJenis = 'pengeluaran' | 'pemasukan' | 'tabungan';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'transaksi' | 'setoran';
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  mode = 'transaksi',
}) => {
  const isDepositMode = mode === 'setoran';
  const [jenis, setJenis] = useState<ModalJenis>(isDepositMode ? 'tabungan' : 'pengeluaran');
  const [tanggal, setTanggal] = useState('2026-11-15');
  const [nominal, setNominal] = useState('');
  const [kategori, setKategori] = useState(isDepositMode ? 'Laptop' : 'Makan dan minum');
  const [keterangan, setKeterangan] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeJenis: ModalJenis = isDepositMode ? 'tabungan' : jenis;

  const secondFieldLabel = activeJenis === 'tabungan' ? 'Target tabungan' : 'Kategori';
  const secondFieldOptions =
    activeJenis === 'pengeluaran'
      ? EXPENSE_CATEGORY_OPTIONS
      : activeJenis === 'pemasukan'
      ? INCOME_CATEGORY_OPTIONS
      : SAVINGS_TARGET_OPTIONS;

  const handleJenisChange = (nextJenis: ModalJenis) => {
    setJenis(nextJenis);
    setNotice(null);
    if (nextJenis === 'pengeluaran') {
      setKategori(EXPENSE_CATEGORY_OPTIONS[0].value);
    } else if (nextJenis === 'pemasukan') {
      setKategori(INCOME_CATEGORY_OPTIONS[0].value);
    } else {
      setKategori(SAVINGS_TARGET_OPTIONS[0].value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFormattedRupiah(nominal);
    if (!nominal.trim() || numericAmount <= 0) {
      setNotice('Masukkan nominal lebih dari Rp0 untuk melihat pratinjau formulir.');
      return;
    }
    setNotice(
      'Pratinjau formulir berhasil diperiksa. Dalam prototipe ini, data simulasi tidak diubah atau disimpan.'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#15121E]/45 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-catat-transaksi-title"
    >
      <div className="w-full max-w-[520px] rounded-[20px] border-2 border-[#15121E] bg-white p-6 shadow-[6px_6px_0_#15121E]">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            {isDepositMode && <CategorySticker category="tabungan" />}
            <div>
              <h2
                id="modal-catat-transaksi-title"
                className="font-display-heading text-[22px] font-extrabold text-[#15121E]"
              >
                {isDepositMode ? 'Catat setoran tabungan' : 'Catat transaksi baru'}
              </h2>
              <p className="text-[13px] text-[#15121E]/75 mt-1">
                {isDepositMode
                  ? 'Target: Laptop · perlu disetor Rp600.000 per bulan, sudah Rp300.000'
                  : 'Formulir ini hanya tampilan prototipe dan tidak mengubah angka simulasi.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isDepositMode ? 'Tutup dialog catat setoran' : 'Tutup dialog catat transaksi'}
            className="w-9 h-9 rounded-full border-[1.5px] border-[#15121E] bg-[#F8F3E6] flex items-center justify-center shrink-0 hover:bg-white transition-colors"
          >
            <X size={18} strokeWidth={2.25} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Jenis (hidden when mode === 'setoran') */}
          {!isDepositMode && (
            <div>
              <span className="block text-[13px] font-semibold text-[#15121E] mb-1.5">
                Jenis transaksi
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'pengeluaran', label: 'Pengeluaran' },
                    { id: 'pemasukan', label: 'Pemasukan' },
                    { id: 'tabungan', label: 'Setoran tabungan' },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleJenisChange(opt.id)}
                    className={`rounded-full border-[1.5px] border-[#15121E] px-3 py-2 text-[13px] font-semibold transition-colors ${
                      jenis === opt.id
                        ? 'bg-[#15121E] text-[#F8F3E6]'
                        : 'bg-[#F8F3E6] text-[#15121E] hover:bg-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 items-start">
            {/* Tanggal */}
            <div>
              <label
                htmlFor="tx-date"
                className="block text-[13px] font-semibold text-[#15121E] mb-1.5"
              >
                Tanggal
              </label>
              <input
                id="tx-date"
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3.5 py-2 text-[14px] font-medium text-[#15121E] tabular-nums"
              />
            </div>

            {/* Nominal */}
            <div>
              <label
                htmlFor="tx-amount"
                className="block text-[13px] font-semibold text-[#15121E] mb-1.5"
              >
                Nominal (Rp)
              </label>
              <input
                id="tx-amount"
                type="text"
                inputMode="numeric"
                placeholder="Contoh: 25.000"
                value={nominal}
                onChange={(e) => {
                  setNominal(formatInputRupiah(e.target.value));
                  setNotice(null);
                }}
                className="w-full rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3.5 py-2 text-[14px] font-medium text-[#15121E] tabular-nums"
              />
              {isDepositMode && (
                <p className="mt-1.5 text-[12px] text-[#15121E]/75 leading-snug">
                  Sisa setoran bulan ini Rp300.000{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setNominal('300.000');
                      setNotice(null);
                    }}
                    className="font-bold text-[#15121E] underline decoration-2 underline-offset-2 hover:text-[#15121E]/70"
                  >
                    Isi Rp300.000
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Kategori or Target tabungan depending on Jenis */}
          <div>
            <span
              id="tx-category-label"
              className="block text-[13px] font-semibold text-[#15121E] mb-1.5"
            >
              {secondFieldLabel}
            </span>
            <CustomSelect
              id="tx-category"
              ariaLabelledBy="tx-category-label"
              value={kategori}
              options={secondFieldOptions}
              onChange={setKategori}
              bgClass="bg-[#F8F3E6]"
              className="w-full"
            />
          </div>

          {/* Keterangan */}
          <div>
            <label
              htmlFor="tx-note"
              className="block text-[13px] font-semibold text-[#15121E] mb-1.5"
            >
              Keterangan
            </label>
            <input
              id="tx-note"
              type="text"
              placeholder={
                activeJenis === 'tabungan'
                  ? 'Misalnya: Setoran rutin target tabungan Laptop'
                  : activeJenis === 'pemasukan'
                  ? 'Misalnya: Honor asisten praktikum'
                  : 'Misalnya: Makan siang kantin kampus'
              }
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3.5 py-2 text-[14px] font-medium text-[#15121E]"
            />
          </div>

          {notice && (
            <div className="rounded-[12px] border-[1.5px] border-[#15121E] bg-[#FFD84D] px-3.5 py-2.5 text-[13px] font-medium text-[#15121E]">
              {notice}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border-[1.5px] border-[#15121E] bg-white px-5 py-2 text-[13px] font-semibold text-[#15121E] hover:bg-[#F8F3E6]"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="rounded-full border-2 border-[#15121E] bg-[#15121E] px-5 py-2 text-[13px] font-bold text-[#F8F3E6] hover:shadow-[3px_3px_0_#D2F25F] transition-shadow"
            >
              {isDepositMode ? 'Simpan setoran (pratinjau)' : 'Simpan pratinjau'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const canConfirm = confirmText.trim().toUpperCase() === 'HAPUS';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#15121E]/50 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-hapus-akun-title"
    >
      <div className="w-full max-w-[460px] rounded-[20px] border-2 border-[#15121E] bg-white p-6 shadow-[6px_6px_0_#15121E]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="neo-sticker rounded-[12px] bg-[#FF6B4A] text-[#15121E] -rotate-6">
              <AlertTriangle size={20} strokeWidth={2.25} />
            </span>
            <h2
              id="modal-hapus-akun-title"
              className="font-display-heading text-[20px] font-extrabold text-[#15121E]"
            >
              Hapus akun dan data?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup konfirmasi hapus akun"
            className="w-8 h-8 rounded-full border-[1.5px] border-[#15121E] bg-[#F8F3E6] flex items-center justify-center"
          >
            <X size={16} strokeWidth={2.25} />
          </button>
        </div>

        <p className="text-[14px] text-[#15121E]/85 mb-4">
          Tindakan ini akan menghapus seluruh riwayat transaksi, batas anggaran, dan target tabungan
          pada profil Nadia. Ketik <span className="font-mono font-bold">HAPUS</span> untuk
          mengonfirmasi.
        </p>

        <label htmlFor="delete-confirm-input" className="sr-only">
          Ketik HAPUS untuk konfirmasi
        </label>
        <input
          id="delete-confirm-input"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Ketik HAPUS"
          className="w-full rounded-[12px] border-2 border-[#15121E] bg-[#F8F3E6] px-3.5 py-2 text-[14px] font-semibold text-[#15121E] mb-5"
        />

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border-[1.5px] border-[#15121E] bg-white px-5 py-2 text-[13px] font-semibold text-[#15121E] hover:bg-[#F8F3E6]"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className={`rounded-full border-2 border-[#15121E] px-5 py-2 text-[13px] font-bold text-[#15121E] transition-opacity ${
              canConfirm
                ? 'bg-[#FF6B4A] hover:shadow-[3px_3px_0_#15121E]'
                : 'bg-[#FF6B4A]/40 opacity-60 cursor-not-allowed'
            }`}
          >
            Ya, hapus semua data
          </button>
        </div>
      </div>
    </div>
  );
};
