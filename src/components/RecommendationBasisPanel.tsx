import React from 'react';
import type { RecommendationItem } from '../types';
import { ResultMarker } from './NeoPrimitives';

interface RecommendationBasisPanelProps {
  rec: RecommendationItem;
  isExpanded: boolean;
}

export const RecommendationBasisPanel: React.FC<RecommendationBasisPanelProps> = ({
  rec,
  isExpanded,
}) => {
  return (
    <div
      className={`grid transition-[grid-template-rows,opacity,margin-top] duration-200 ease-out ${
        isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
      }`}
    >
      <div className="overflow-hidden">
        <div className="rounded-[12px] border-[1.5px] border-[#15121E] bg-[#F8F3E6] p-4">
          <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-[#15121E]/15">
            <span className="font-mono text-[12px] font-bold text-[#15121E]">
              Aturan {rec.ruleCode}
            </span>
            <span className="text-[12px] font-semibold text-[#15121E]/80">
              {rec.resultType}
            </span>
          </div>

          <div className="divide-y divide-[#15121E]/12">
            {rec.variables.map((v) => (
              <div key={v.name} className="py-2.5 last:pb-0">
                <p className="text-[12px] font-semibold text-[#15121E]/70 leading-snug">
                  {v.name}
                </p>

                {v.valueLines ? (
                  <div className="mt-1 space-y-1">
                    {v.valueLines.map((line) => (
                      <p
                        key={line}
                        className="text-[14px] font-bold text-[#15121E] tabular-nums leading-snug"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="mt-0.5 flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-bold text-[#15121E] tabular-nums leading-snug">
                      {v.value}
                    </span>
                    {v.isEstimate && <ResultMarker variant="baseline" />}
                  </div>
                )}

                {v.details && v.details.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    {v.details.map((detail) => (
                      <p
                        key={detail}
                        className="text-[12px] text-[#15121E]/70 tabular-nums leading-snug"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
