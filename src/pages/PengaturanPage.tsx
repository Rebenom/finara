import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Trash2 } from 'lucide-react';
import { METHOD_INFO, USER_PROFILE } from '../data';
import { DeleteAccountModal } from '../components/Modals';

interface PengaturanPageProps {
  aiExplanationEnabled: boolean;
  onToggleAiExplanation: (next: boolean) => void;
}

export const PengaturanPage: React.FC<PengaturanPageProps> = ({
  aiExplanationEnabled,
  onToggleAiExplanation,
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletedPreviewNotice, setDeletedPreviewNotice] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6 items-stretch">
        {/* Profile Card */}
        <section className="neo-card bg-white p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-display-heading text-[20px] font-bold text-[#15121E] mb-5">
              Profil pengguna
            </h2>

            <div className="flex items-center gap-5 pb-6 border-b-2 border-[#15121E]/10">
              <span
                aria-hidden="true"
                className="w-16 h-16 rounded-full bg-[#D2F25F] border-2 border-[#15121E] flex items-center justify-center font-display-heading text-[26px] font-extrabold text-[#15121E] shrink-0"
              >
                {USER_PROFILE.initial}
              </span>
              <div>
                <p className="font-display-heading text-[22px] font-extrabold text-[#15121E]">
                  {USER_PROFILE.name}, {USER_PROFILE.role}
                </p>
                <p className="text-[14px] text-[#15121E]/75">{USER_PROFILE.university}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-5 text-[14px]">
            <div>
              <p className="text-[12px] font-semibold text-[#15121E]/70 mb-1">Periode aktif</p>
              <p className="font-bold text-[#15121E]">{USER_PROFILE.periodLabel}</p>
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#15121E]/70 mb-1">Mode data</p>
              <p className="font-bold text-[#15121E]">Simulasi lokal (tanpa koneksi bank)</p>
            </div>
          </div>
        </section>

        {/* AI Explanation Toggle */}
        <section className="neo-card bg-white p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span className="neo-sticker rounded-[12px] bg-[#A9D9FF] rotate-6">
                <ShieldCheck size={20} strokeWidth={2.25} />
              </span>
              <div>
                <h2 className="font-display-heading text-[20px] font-bold text-[#15121E]">
                  Penjelasan AI
                </h2>
                <p className="text-[14px] text-[#15121E]/80 mt-2 leading-relaxed">
                  Menampilkan panel ringkasan bahasa natural pada halaman Rekomendasi.{' '}
                  {METHOD_INFO.aiPrivacyNote}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={aiExplanationEnabled}
              aria-label="Aktifkan Penjelasan AI"
              onClick={() => onToggleAiExplanation(!aiExplanationEnabled)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#F8F3E6] px-3 py-1.5 text-[12px] font-bold text-[#15121E] shrink-0 transition-colors hover:bg-white"
            >
              <span>{aiExplanationEnabled ? 'Aktif' : 'Mati'}</span>
              <span
                aria-hidden="true"
                className={`w-9 h-5 rounded-full border-[1.5px] border-[#15121E] p-0.5 flex items-center ${
                  aiExplanationEnabled ? 'bg-[#15121E] justify-end' : 'bg-white justify-start'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full ${
                    aiExplanationEnabled ? 'bg-white' : 'bg-[#15121E]'
                  }`}
                />
              </span>
            </button>
          </div>

          <p className="mt-5 pt-4 border-t-2 border-[#15121E]/10 text-[13px] text-[#15121E]/70">
            Status panel di halaman Rekomendasi:{' '}
            <strong className="font-bold text-[#15121E]">
              {aiExplanationEnabled ? 'Aktif' : 'Nonaktif'}
            </strong>
          </p>
        </section>
      </div>

      {/* Danger Zone: Hapus akun dan data (full width below, Coral allowed here) */}
      <section className="neo-card bg-white p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="neo-sticker rounded-[12px] bg-[#FF6B4A] -rotate-6">
              <AlertTriangle size={20} strokeWidth={2.25} />
            </span>
            <div>
              <h2 className="font-display-heading text-[20px] font-bold text-[#15121E]">
                Hapus akun dan data
              </h2>
              <p className="text-[14px] text-[#15121E]/80 mt-1">
                Menghapus seluruh catatan transaksi, batas anggaran, dan target tabungan secara
                permanen dari akun ini.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDeletedPreviewNotice(false);
              setDeleteModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#15121E] bg-[#FF6B4A] px-4 py-2 text-[13px] font-bold text-[#15121E] whitespace-nowrap shrink-0 hover:shadow-[3px_3px_0_#15121E] transition-shadow"
          >
            <Trash2 size={15} strokeWidth={2.25} />
            <span>Hapus akun dan data</span>
          </button>
        </div>

        {deletedPreviewNotice && (
          <div className="mt-4 rounded-[12px] border-[1.5px] border-[#15121E] bg-[#FFD84D] px-4 py-2.5 text-[13px] font-semibold text-[#15121E]">
            Konfirmasi penghapusan berhasil diuji. Karena ini prototipe simulasi, data demo tetap
            dipertahankan agar halaman lain dapat terus ditinjau.
          </div>
        )}
      </section>

      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          setDeleteModalOpen(false);
          setDeletedPreviewNotice(true);
        }}
      />
    </div>
  );
};
