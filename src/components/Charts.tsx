import React, { useEffect, useRef, useState } from 'react';
import type { CumulativePoint, PatternSegment } from '../types';
import { formatPercentExact, formatRupiah } from '../utils/finance';

interface CumulativeExpenseChartProps {
  points: CumulativePoint[];
  budgetLimit: number;
}

export const CumulativeExpenseChart: React.FC<CumulativeExpenseChartProps> = ({
  points,
  budgetLimit,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = (nextWidth?: number) => {
      const measured = Math.floor(nextWidth ?? el.getBoundingClientRect().width);
      if (measured > 0) {
        setChartWidth((prev) => (prev !== measured ? measured : prev));
      }
    };

    updateWidth();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const width = chartWidth;
  const height = 246;
  const padLeft = 68;
  const padRight = 24;
  const padTop = 34;
  const padBottom = 34;

  const plotW = Math.max(180, width - padLeft - padRight);
  const plotH = height - padTop - padBottom;
  const maxVal = 2800000;

  const xForDay = (day: number) => padLeft + ((day - 1) / 29) * plotW;
  const yForVal = (val: number) => padTop + plotH - (val / maxVal) * plotH;

  const actualPoints = points.filter((p) => p.actualCumulative !== null);
  const projectedPoints = points.filter((p) => p.projectedCumulative !== null);

  const actualPolyline = actualPoints
    .map((p) => `${xForDay(p.day).toFixed(1)},${yForVal(p.actualCumulative!).toFixed(1)}`)
    .join(' ');

  const projectedPolyline = projectedPoints
    .map((p) => `${xForDay(p.day).toFixed(1)},${yForVal(p.projectedCumulative!).toFixed(1)}`)
    .join(' ');

  const firstProj = projectedPoints[0];
  const lastProj = projectedPoints[projectedPoints.length - 1];
  const lilAreaPath =
    firstProj && lastProj
      ? `M ${xForDay(firstProj.day).toFixed(1)} ${yForVal(0).toFixed(1)} L ${projectedPoints
          .map((p) => `${xForDay(p.day).toFixed(1)} ${yForVal(p.projectedCumulative!).toFixed(1)}`)
          .join(' L ')} L ${xForDay(lastProj.day).toFixed(1)} ${yForVal(0).toFixed(1)} Z`
      : '';

  const todayPoint = points.find((p) => p.isToday);
  const budgetY = yForVal(budgetLimit);

  const hoveredPoint = hoveredDay !== null ? points.find((p) => p.day === hoveredDay) ?? null : null;
  const hoveredValue = hoveredPoint
    ? hoveredPoint.actualCumulative ?? hoveredPoint.projectedCumulative ?? 0
    : 0;

  const yTicks = [0, 1400000, 2600000];
  const xTicks = [1, 15, 30];

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0 overflow-hidden select-none"
    >
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          className="block"
          role="img"
          aria-label="Grafik garis pengeluaran kumulatif hari ke-1 sampai hari ke-30"
        >
        {/* Thin dashed horizontal gridlines */}
        {yTicks.map((tick) => {
          const y = yForVal(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="#15121E"
                strokeOpacity={0.14}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={padLeft - 10}
                y={y + 4}
                textAnchor="end"
                fill="#15121E"
                fillOpacity={0.7}
                fontSize={12.5}
                fontWeight={500}
                className="tabular-nums"
              >
                {tick === 0 ? 'Rp0' : tick === 1400000 ? 'Rp1,4 jt' : 'Rp2,6 jt'}
              </text>
            </g>
          );
        })}

        {/* Lilac shaded area under projected segment (days 15-30) */}
        {lilAreaPath && <path d={lilAreaPath} fill="#C4B2FF" fillOpacity={0.55} />}

        {/* Horizontal dashed budget reference line */}
        <line
          x1={padLeft}
          y1={budgetY}
          x2={width - padRight}
          y2={budgetY}
          stroke="#15121E"
          strokeWidth={1.5}
          strokeDasharray="6 5"
        />
        <g transform={`translate(${padLeft + 10}, ${budgetY - 12})`}>
          <rect
            x={-6}
            y={-15}
            width={162}
            height={23}
            rx={8}
            fill="#FFFFFF"
            stroke="#15121E"
            strokeWidth={1.25}
          />
          <text
            x={4}
            y={1}
            fill="#15121E"
            fillOpacity={0.7}
            fontSize={12.5}
            fontWeight={600}
            className="tabular-nums"
          >
            Anggaran Rp2.200.000
          </text>
        </g>

        {/* Solid Ink actual cumulative spending line (days 1-15) */}
        <polyline
          fill="none"
          stroke="#15121E"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={actualPolyline}
        />

        {/* Dashed Ink projected cumulative line (days 15-30) */}
        <polyline
          fill="none"
          stroke="#15121E"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="7 7"
          points={projectedPolyline}
        />

        {/* Today marker at day 15 */}
        {todayPoint && todayPoint.actualCumulative !== null && (
          <g>
            <circle
              cx={xForDay(todayPoint.day)}
              cy={yForVal(todayPoint.actualCumulative)}
              r={6.5}
              fill="#D2F25F"
              stroke="#15121E"
              strokeWidth={2.5}
            />
            <g
              transform={`translate(${xForDay(todayPoint.day)}, ${
                yForVal(todayPoint.actualCumulative) - 20
              })`}
            >
              <rect
                x={-35}
                y={-17}
                width={70}
                height={24}
                rx={12}
                fill="#D2F25F"
                stroke="#15121E"
                strokeWidth={1.5}
              />
              <text
                x={0}
                y={-1}
                textAnchor="middle"
                fill="#15121E"
                fillOpacity={0.7}
                fontSize={12.5}
                fontWeight={700}
              >
                Hari ini
              </text>
            </g>
          </g>
        )}

        {/* Day 30 endpoint */}
        {lastProj && lastProj.projectedCumulative !== null && (
          <circle
            cx={xForDay(lastProj.day)}
            cy={yForVal(lastProj.projectedCumulative)}
            r={4.5}
            fill="#C4B2FF"
            stroke="#15121E"
            strokeWidth={2}
          />
        )}

        {/* Minimal X-axis labels */}
        {xTicks.map((d) => (
          <text
            key={d}
            x={xForDay(d)}
            y={height - 8}
            textAnchor={d === 1 ? 'start' : d === 30 ? 'end' : 'middle'}
            fill="#15121E"
            fillOpacity={0.7}
            fontSize={12.5}
            fontWeight={600}
            className="tabular-nums"
          >
            Hari {d}
          </text>
        ))}

        {/* Hovered indicator */}
        {hoveredPoint && (
          <g pointerEvents="none">
            <line
              x1={xForDay(hoveredPoint.day)}
              y1={padTop}
              x2={xForDay(hoveredPoint.day)}
              y2={yForVal(0)}
              stroke="#15121E"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <circle
              cx={xForDay(hoveredPoint.day)}
              cy={yForVal(hoveredValue)}
              r={5.5}
              fill={hoveredPoint.isProjected ? '#C4B2FF' : '#D2F25F'}
              stroke="#15121E"
              strokeWidth={2.25}
            />
          </g>
        )}

        {/* Invisible hover hit targets for each day */}
        {points.map((p) => {
          const sliceW = plotW / 29;
          const x = xForDay(p.day) - sliceW / 2;
          return (
            <rect
              key={p.day}
              x={Math.max(padLeft, x)}
              y={padTop}
              width={sliceW}
              height={plotH}
              fill="transparent"
              onMouseEnter={() => setHoveredDay(p.day)}
              onMouseLeave={() => setHoveredDay(null)}
            />
          );
        })}
      </svg>
      ) : (
        <div style={{ height }} aria-hidden="true" />
      )}

      {/* Card-styled floating tooltip */}
      {hoveredPoint && (
        <div
          className="pointer-events-none absolute top-1 z-10 rounded-[14px] border-2 border-[#15121E] bg-white px-3 py-2 text-[12px] shadow-[3px_3px_0_#15121E]"
          style={{
            left: `${Math.min(72, Math.max(10, ((hoveredPoint.day - 1) / 29) * 78 + 8))}%`,
          }}
        >
          <div className="flex items-center gap-2 font-bold text-[#15121E]">
            <span>{hoveredPoint.label}</span>
            {hoveredPoint.isProjected && (
              <span className="rounded-full border border-dashed border-[#15121E] bg-[#C4B2FF] px-2 py-0.5 text-[12px] font-semibold">
                Perkiraan
              </span>
            )}
          </div>
          <div className="mt-0.5 font-display-num text-[15px] font-bold text-[#15121E] tabular-nums">
            {hoveredPoint.isProjected
              ? formatRupiah(hoveredValue, { approx: true })
              : formatRupiah(hoveredValue)}
          </div>
          <div className="text-[12px] text-[#15121E]/70 tabular-nums">
            {hoveredPoint.isProjected
              ? `Laju baseline +${formatRupiah(hoveredPoint.dailySpend)}/hari`
              : hoveredPoint.dailySpend > 0
              ? `Belanja hari ini ${formatRupiah(hoveredPoint.dailySpend)}`
              : 'Tidak ada pengeluaran'}
          </div>
        </div>
      )}
    </div>
  );
};

interface PatternDonutChartProps {
  segments: PatternSegment[];
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function createDonutArcPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
) {
  const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    outerStart.x.toFixed(2),
    outerStart.y.toFixed(2),
    'A',
    outerR,
    outerR,
    0,
    largeArcFlag,
    0,
    outerEnd.x.toFixed(2),
    outerEnd.y.toFixed(2),
    'L',
    innerEnd.x.toFixed(2),
    innerEnd.y.toFixed(2),
    'A',
    innerR,
    innerR,
    0,
    largeArcFlag,
    1,
    innerStart.x.toFixed(2),
    innerStart.y.toFixed(2),
    'Z',
  ].join(' ');
}

export const PatternDonutChart: React.FC<PatternDonutChartProps> = ({ segments }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const cx = 92;
  const cy = 92;
  const outerR = 80;
  const innerR = 46;

  let currentAngle = 0;
  const arcs = segments.map((seg) => {
    const sweep = (seg.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sweep;
    currentAngle = endAngle;
    return {
      ...seg,
      path: createDonutArcPath(cx, cy, outerR, innerR, startAngle, endAngle),
    };
  });

  const activeSegment = segments.find((s) => s.id === hoveredId) ?? null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
      <div className="relative shrink-0">
        <svg
          width={184}
          height={184}
          viewBox="0 0 184 184"
          role="img"
          aria-label="Grafik donat komposisi pengeluaran: Kebutuhan 64,3%, Keinginan 21,4%, Cicilan 14,3%"
        >
          {arcs.map((arc) => {
            const isActive = hoveredId === arc.id;
            return (
              <path
                key={arc.id}
                d={arc.path}
                fill={arc.fillColor}
                stroke="#15121E"
                strokeWidth={2}
                strokeLinejoin="round"
                style={{
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  transformOrigin: `${cx}px ${cy}px`,
                  transition: 'transform 140ms ease-out',
                }}
                onMouseEnter={() => setHoveredId(arc.id)}
                onMouseLeave={() => setHoveredId(null)}
              />
            );
          })}
        </svg>

        {/* Center text readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-2">
          <span className="text-[12px] font-semibold text-[#15121E]/75 leading-tight">
            {activeSegment ? activeSegment.label : 'Total 15 hari'}
          </span>
          <span className="font-display-num text-[15px] font-extrabold text-[#15121E] tabular-nums">
            {activeSegment ? formatPercentExact(activeSegment.percentage) : 'Rp1,4 jt'}
          </span>
        </div>
      </div>

      <ul className="flex flex-1 min-w-[150px] flex-col gap-2.5">
        {segments.map((seg) => (
          <li
            key={seg.id}
            onMouseEnter={() => setHoveredId(seg.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`flex items-center justify-between gap-2 rounded-lg px-2 py-1 transition-colors ${
              hoveredId === seg.id ? 'bg-white/60' : ''
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-[4px] border-[1.5px] border-[#15121E]"
                style={{ backgroundColor: seg.fillColor }}
                aria-hidden="true"
              />
              <span className="text-[13px] font-semibold text-[#15121E] truncate">
                {seg.label}
              </span>
            </div>
            <span className="font-display-num text-[13px] font-bold text-[#15121E] tabular-nums shrink-0">
              {formatPercentExact(seg.percentage)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
