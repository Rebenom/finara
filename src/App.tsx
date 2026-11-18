import { useState } from 'react';
import { USER_PROFILE } from './data';
import type { PageId } from './types';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AddTransactionModal } from './components/Modals';
import { DashboardPage } from './pages/DashboardPage';
import { TransaksiPage } from './pages/TransaksiPage';
import { AnggaranPage } from './pages/AnggaranPage';
import { TabunganPage } from './pages/TabunganPage';
import { AnalisisPage } from './pages/AnalisisPage';
import { RekomendasiPage } from './pages/RekomendasiPage';
import { PengaturanPage } from './pages/PengaturanPage';

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: 'Baru 46,7% pemasukan terpakai, tetapi anggaran hiburan sudah habis.',
  transaksi: 'Catatan transaksi',
  anggaran: 'Anggaran bulanan',
  tabungan: 'Target tabungan',
  analisis: 'Analisis dan prediksi',
  rekomendasi: 'Rekomendasi keuangan',
  pengaturan: 'Pengaturan',
};

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [periodLabel, setPeriodLabel] = useState<string>(USER_PROFILE.periodLabel);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [addModalMode, setAddModalMode] = useState<'transaksi' | 'setoran'>('transaksi');
  const [aiExplanationEnabled, setAiExplanationEnabled] = useState<boolean>(true);

  const openAddTransaction = (mode: 'transaksi' | 'setoran' = 'transaksi') => {
    setAddModalMode(mode);
    setAddModalOpen(true);
  };

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="min-h-screen min-w-[1280px] bg-[#F8F3E6] text-[#15121E] flex">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} user={USER_PROFILE} />

      <main className="flex-1 min-w-0">
        <div className="max-w-[1200px] p-10 mx-auto">
          <TopBar
            title={PAGE_TITLES[activePage]}
            isHeroHeadline={activePage === 'dashboard'}
            periodLabel={periodLabel}
            onPeriodChange={setPeriodLabel}
            currentDay={USER_PROFILE.currentDay}
            totalDays={USER_PROFILE.totalDays}
            onOpenAddTransaction={() => openAddTransaction('transaksi')}
          />

          {activePage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {activePage === 'transaksi' && <TransaksiPage />}
          {activePage === 'anggaran' && <AnggaranPage />}
          {activePage === 'tabungan' && (
            <TabunganPage onOpenAddDeposit={() => openAddTransaction('setoran')} />
          )}
          {activePage === 'analisis' && (
            <AnalisisPage onOpenAddTransaction={() => openAddTransaction('transaksi')} />
          )}
          {activePage === 'rekomendasi' && (
            <RekomendasiPage
              aiExplanationEnabled={aiExplanationEnabled}
              onToggleAiExplanation={setAiExplanationEnabled}
            />
          )}
          {activePage === 'pengaturan' && (
            <PengaturanPage
              aiExplanationEnabled={aiExplanationEnabled}
              onToggleAiExplanation={setAiExplanationEnabled}
            />
          )}
        </div>
      </main>

      <AddTransactionModal
        key={`${addModalMode}-${String(addModalOpen)}`}
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        mode={addModalMode}
      />
    </div>
  );
}
