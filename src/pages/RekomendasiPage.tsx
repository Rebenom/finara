import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Circle,
  Clock,
  EyeOff,
  Lightbulb,
  RotateCcw,
} from 'lucide-react';
import { RECOMMENDATIONS } from '../data';
import type { RecommendationPriority } from '../types';
import { ResultMarker } from '../components/NeoPrimitives';
import { RecommendationBasisPanel } from '../components/RecommendationBasisPanel';

interface RekomendasiPageProps {
  aiExplanationEnabled: boolean;
  onToggleAiExplanation: (next: boolean) => void;
}

type RecStatus = 'aktif' | 'selesai' | 'diabaikan';

export const RekomendasiPage: React.FC<RekomendasiPageProps> = ({
  aiExplanationEnabled,
  onToggleAiExplanation,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<RecommendationPriority | 'semua'>('semua');
  const [statuses, setStatuses] = useState<Record<string, RecStatus>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const visibleItems = RECOMMENDATIONS.filter((item) =>
    priorityFilter === 'semua' ? true : item.priority === priorityFilter
  );

  const setItemStatus = (id: string, status: RecStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & AI Explanation Switch */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter prioritas rekomendasi"
          className="flex items-center gap-2"
        >
          {(
            [
              { id: 'semua', label: 'Semua' },
              { id: 'tinggi', label: 'Prioritas tinggi' },
              { id: 'sedang', label: 'Prioritas sedang' },
              { id: 'rendah', label: 'Prioritas rendah' },
            ] as const
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPriorityFilter(opt.id)}
              className={`rounded-full border-[1.5px] border-[#15121E] px-4 py-1.5 text-[13px] font-semibold transition-colors whitespace-nowrap ${
                priorityFilter === opt.id
                  ? 'bg-[#15121E] text-[#F8F3E6]'
                  : 'bg-white text-[#15121E] hover:bg-[#F8F3E6]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={aiExplanationEnabled}
          onClick={() => onToggleAiExplanation(!aiExplanationEnabled)}
          className="inline-flex items-center gap-3 rounded-full border-2 border-[#15121E] bg-white px-4 py-1.5 text-[13px] font-bold text-[#15121E] hover:bg-[#F8F3E6] transition-colors whitespace-nowrap"
        >
          <span>Panel Penjelasan AI</span>
          <span
            className={`rounded-full border border-[#15121E] px-2 py-0.5 font-mono text-[11px] uppercase ${
              aiExplanationEnabled
                ? 'bg-[#15121E] text-[#F8F3E6]'
                : 'bg-[#F8F3E6] text-[#15121E]'
            }`}
          >
            {aiExplanationEnabled ? 'Aktif' : 'Nonaktif'}
          </span>
        </button>
      </div>

      {/* Main Content Split: Recommendations List + Separate AI Explanation Panel */}
      <div
        className={`grid gap-6 items-start ${
          aiExplanationEnabled ? 'grid-cols-[1.65fr_1fr]' : 'grid-cols-1'
        }`}
      >
        <div className="space-y-4">
          {visibleItems.map((rec) => {
            const status = statuses[rec.id] ?? 'aktif';
            const isExpanded = Boolean(expanded[rec.id]);
            const isHigh = rec.priority === 'tinggi';

            return (
              <article
                key={rec.id}
                className={`neo-card p-6 transition-all ${
                  status === 'diabaikan'
                    ? 'bg-[#F8F3E6] opacity-70'
                    : status === 'selesai'
                    ? 'bg-[#D2F25F]/70 opacity-80'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`neo-chip inline-flex items-center gap-1.5 px-3 py-1 whitespace-nowrap ${
                        isHigh ? 'bg-[#FFD84D]' : 'bg-white'
                      } text-[#15121E]`}
                    >
                      {isHigh ? (
                        <AlertTriangle size={13} strokeWidth={2.25} aria-hidden="true" />
                      ) : rec.priority === 'sedang' ? (
                        <Clock size={13} strokeWidth={2.25} aria-hidden="true" />
                      ) : (
                        <Circle size={12} strokeWidth={2.25} aria-hidden="true" />
                      )}
                      <span>
                        {isHigh
                          ? 'Prioritas tinggi'
                          : rec.priority === 'sedang'
                          ? 'Prioritas sedang'
                          : 'Prioritas rendah'}
                      </span>
                    </span>

                    {status === 'selesai' && (
                      <span className="neo-chip inline-flex items-center gap-1.5 bg-[#D2F25F] text-[#15121E] px-3 py-1 whitespace-nowrap">
                        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
                        <span>Sudah dilakukan</span>
                      </span>
                    )}

                    {status === 'diabaikan' && (
                      <span className="neo-chip inline-flex items-center gap-1.5 bg-white text-[#15121E] px-3 py-1 whitespace-nowrap">
                        <EyeOff size={13} strokeWidth={2.25} aria-hidden="true" />
                        <span>Diabaikan</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <ResultMarker
                      variant={rec.resultType === 'Perkiraan baseline' ? 'baseline' : 'perhitungan'}
                      label={rec.resultType}
                    />
                    <span className="font-mono text-[12px] font-semibold text-[#15121E]/75">
                      {rec.ruleCode}
                    </span>
                  </div>
                </div>

                <h2 className="font-display-heading text-[20px] font-bold text-[#15121E] mb-1.5">
                  {rec.title}
                </h2>
                <p className="text-[14px] text-[#15121E]/85 leading-relaxed mb-4">
                  {rec.reason}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setExpanded((prev) => ({ ...prev, [rec.id]: !prev[rec.id] }))
                    }
                    className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#15121E] underline decoration-2 underline-offset-4"
                  >
                    <span>Lihat dasar perhitungan</span>
                    <ChevronDown
                      size={15}
                      strokeWidth={2.5}
                      className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div className="flex items-center gap-2">
                    {status === 'aktif' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setItemStatus(rec.id, 'selesai')}
                          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#15121E] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#15121E] hover:bg-[#F8F3E6] transition-colors"
                        >
                          <Check size={14} strokeWidth={2.25} />
                          <span>Sudah dilakukan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemStatus(rec.id, 'diabaikan')}
                          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#15121E] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#15121E] hover:bg-[#F8F3E6] transition-colors"
                        >
                          <EyeOff size={14} strokeWidth={2.25} />
                          <span>Abaikan</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setItemStatus(rec.id, 'aktif')}
                        className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#15121E] bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[#15121E] hover:bg-[#F8F3E6] transition-colors"
                      >
                        <RotateCcw size={13} strokeWidth={2.25} />
                        <span>Pulihkan</span>
                      </button>
                    )}
                  </div>
                </div>

                <RecommendationBasisPanel rec={rec} isExpanded={isExpanded} />
              </article>
            );
          })}
        </div>

        {/* Separate AI Explanation Panel */}
        {aiExplanationEnabled && (
          <aside
            aria-label="Panel Penjelasan AI"
            className="neo-card bg-[#F8F3E6] p-6 space-y-4 sticky top-6"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="neo-sticker rounded-[12px] bg-[#A9D9FF] rotate-6">
                  <Lightbulb size={19} strokeWidth={2.25} />
                </span>
                <div>
                  <h2 className="font-display-heading text-[18px] font-bold text-[#15121E]">
                    Penjelasan AI
                  </h2>
                  <p className="text-[13px] text-[#15121E]/70">
                    Ringkasan statis berbasis angka terhitung
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t-2 border-[#15121E]/12 pt-4">
              {visibleItems.map((rec) => (
                <div key={rec.id} className="pb-3 border-b border-[#15121E]/10 last:border-b-0 last:pb-0">
                  <p className="font-mono text-[11px] font-bold text-[#15121E]/75 mb-1">
                    {rec.ruleCode} · {rec.categoryLabel}
                  </p>
                  <p className="text-[14px] text-[#15121E] leading-relaxed">
                    {rec.aiExplanation}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
