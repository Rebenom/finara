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
                  ? 'bg-[#15121E] text-[#D2F25F]'
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
          className={`inline-flex items-center gap-3 rounded-full border-2 border-[#15121E] px-4 py-1.5 text-[13px] font-bold transition-colors whitespace-nowrap ${
            aiExplanationEnabled ? 'bg-[#D2F25F]' : 'bg-white'
          }`}
        >
          <span>Panel Penjelasan AI</span>
          <span className="font-mono text-[11px] uppercase">
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
                className={`neo-card p-6 transition-opacity ${
                  status === 'diabaikan'
                    ? 'bg-[#F8F3E6] opacity-70'
                    : status === 'selesai'
                    ? 'bg-[#D2F25F]/45'
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

                    <ResultMarker
                      variant={rec.resultType === 'Perkiraan baseline' ? 'baseline' : 'perhitungan'}
                      label={rec.resultType}
                    />

                    {status !== 'aktif' && (
                      <span className="neo-chip bg-[#15121E] text-[#D2F25F] px-3 py-1">
                        {status === 'selesai' ? 'Sudah dilakukan' : 'Diabaikan'}
                      </span>
                    )}
                  </div>

                  <span className="font-mono text-[12px] font-semibold text-[#15121E]/75">
                    {rec.ruleCode}
                  </span>
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
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div className="flex items-center gap-2">
                    {status === 'aktif' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setItemStatus(rec.id, 'selesai')}
                          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#15121E] bg-[#D2F25F] px-3.5 py-1.5 text-[12px] font-bold text-[#15121E] hover:shadow-[2px_2px_0_#15121E]"
                        >
                          <Check size={14} strokeWidth={2.5} />
                          <span>Sudah dilakukan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setItemStatus(rec.id, 'diabaikan')}
                          className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#15121E] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#15121E] hover:bg-[#F8F3E6]"
                        >
                          <EyeOff size={14} strokeWidth={2.25} />
                          <span>Abaikan</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setItemStatus(rec.id, 'aktif')}
                        className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#15121E] bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#15121E] hover:bg-[#F8F3E6]"
                      >
                        <RotateCcw size={13} strokeWidth={2.25} />
                        <span>Pulihkan</span>
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 rounded-[14px] border-[1.5px] border-[#15121E] bg-[#F8F3E6] p-4 text-[13px] space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#15121E]/15 pb-2">
                      <span className="font-mono font-bold">Kode aturan: {rec.ruleCode}</span>
                      <span className="font-semibold">{rec.resultType}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-1">
                      {rec.variables.map((v) => (
                        <div key={v.name}>
                          <p className="text-[11px] font-semibold text-[#15121E]/70">{v.name}</p>
                          <p className="font-bold text-[#15121E] tabular-nums">{v.value}</p>
                          <p className="text-[11px] text-[#15121E]/70 tabular-nums">
                            Ambang: {v.threshold}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                  <p className="text-[12px] text-[#15121E]/70">
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
                  <p className="text-[13px] text-[#15121E] leading-relaxed">
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
