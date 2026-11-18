import React from 'react';
import {
  ArrowLeftRight,
  Compass,
  LayoutDashboard,
  Lightbulb,
  PiggyBank,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';
import type { PageId, UserProfile } from '../types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  user: UserProfile;
}

const NAV_ITEMS: {
  id: PageId;
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'transaksi', label: 'Transaksi', Icon: ArrowLeftRight },
  { id: 'anggaran', label: 'Anggaran', Icon: SlidersHorizontal },
  { id: 'tabungan', label: 'Target Tabungan', Icon: PiggyBank },
  { id: 'analisis', label: 'Analisis dan Prediksi', Icon: Compass },
  { id: 'rekomendasi', label: 'Rekomendasi', Icon: Lightbulb },
  { id: 'pengaturan', label: 'Pengaturan', Icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  user,
}) => {
  return (
    <aside
      aria-label="Navigasi utama Finara"
      className="w-[240px] shrink-0 bg-[#F8F3E6] border-r-2 border-[#15121E] flex flex-col justify-between sticky top-0 h-screen self-start overflow-y-auto px-5 py-8"
    >
      <div>
        {/* Brand Wordmark + small playful geometric mark */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-3 px-2 mb-10 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15121E] rounded-lg"
        >
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-[11px] bg-[#D2F25F] border-2 border-[#15121E] flex items-center justify-center -rotate-6 shadow-[2px_2px_0_#15121E]"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="2.5" y="3.5" width="15" height="3.5" rx="1.5" fill="#15121E" />
              <rect x="2.5" y="9" width="10.5" height="3.5" rx="1.5" fill="#15121E" />
              <circle cx="15.5" cy="14.5" r="2.5" fill="#15121E" />
            </svg>
          </span>
          <span className="font-display-heading text-[26px] font-extrabold tracking-tight text-[#15121E] leading-none">
            Finara
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activePage === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-full text-[14px] font-semibold text-left transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15121E] ${
                  isActive
                    ? 'bg-[#15121E] text-[#D2F25F]'
                    : 'text-[#15121E]/80 hover:bg-white hover:text-[#15121E]'
                }`}
              >
                <Icon size={18} strokeWidth={2.25} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile */}
      <div className="pt-6 border-t-2 border-[#15121E]/15">
        <div className="flex items-center gap-3 px-2">
          <span
            aria-hidden="true"
            className="w-10 h-10 rounded-full bg-[#D2F25F] border-2 border-[#15121E] flex items-center justify-center font-display-heading text-[16px] font-extrabold text-[#15121E] shrink-0"
          >
            {user.initial}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#15121E] truncate">
              {user.name}, {user.role}
            </p>
            <p className="text-[12px] text-[#15121E]/65 truncate">
              Simulasi pribadi
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
