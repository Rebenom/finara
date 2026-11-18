import React, { useEffect, useState } from 'react';
import {
  Bus,
  Gamepad2,
  GraduationCap,
  Laptop,
  PiggyBank,
  Smartphone,
  Utensils,
  Wallet,
} from 'lucide-react';
import type { CategoryId } from '../types';
import { splitRupiah } from '../utils/finance';

interface RupiahAmountProps {
  value: number;
  approx?: boolean;
  className?: string;
}

export const RupiahAmount: React.FC<RupiahAmountProps> = ({
  value,
  approx = false,
  className = '',
}) => {
  const { prefix, amount, isNegative } = splitRupiah(value);
  return (
    <span className={`font-display-num inline-flex items-start leading-none ${className}`}>
      {approx && <span className="mr-1.5 self-center text-[0.7em] font-bold">≈</span>}
      {isNegative && <span className="mr-0.5 self-center">-</span>}
      <span className="text-[0.5em] font-bold leading-none mt-[0.14em] mr-[2px]">
        {prefix}
      </span>
      <span>{amount}</span>
    </span>
  );
};

interface CountUpRupiahProps {
  target: number;
  durationMs?: number;
  className?: string;
}

export const CountUpRupiah: React.FC<CountUpRupiahProps> = ({
  target,
  durationMs = 520,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return target;
    }
    return 0;
  });

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setDisplayValue(target);
      return;
    }

    let frameId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(target * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, durationMs]);

  return <RupiahAmount value={displayValue} className={className} />;
};

export type MarkerVariant = 'perhitungan' | 'baseline' | 'model' | 'sementara' | 'rekomendasi';

interface ResultMarkerProps {
  variant: MarkerVariant;
  label?: string;
  onDark?: boolean;
}

export const ResultMarker: React.FC<ResultMarkerProps> = ({
  variant,
  label,
  onDark = false,
}) => {
  if (variant === 'baseline' || variant === 'model') {
    const defaultLabel = variant === 'model' ? 'Perkiraan model' : 'Perkiraan baseline';
    return (
      <span className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-[#15121E] bg-[#C4B2FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#15121E] whitespace-nowrap shrink-0">
        {label ?? defaultLabel}
      </span>
    );
  }
  if (variant === 'sementara') {
    return (
      <span className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-[#15121E] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#15121E] whitespace-nowrap shrink-0">
        {label ?? 'Sementara'}
      </span>
    );
  }
  if (variant === 'rekomendasi') {
    return (
      <span className="inline-flex items-center rounded-full border-[1.5px] border-[#15121E] bg-[#15121E] px-2.5 py-0.5 text-[11px] font-semibold text-[#F8F3E6] whitespace-nowrap shrink-0">
        {label ?? 'Rekomendasi'}
      </span>
    );
  }
  return (
    <span
      className={`text-[12px] font-semibold whitespace-nowrap shrink-0 ${
        onDark ? 'text-[#F8F3E6]/65' : 'text-[#15121E]/60'
      }`}
    >
      {label ?? 'Perhitungan'}
    </span>
  );
};

interface CategoryStickerProps {
  category: CategoryId | 'laptop';
  size?: 'md' | 'sm';
}

const STICKER_STYLES: Record<
  CategoryId | 'laptop',
  { bg: string; shape: string; tilt: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }
> = {
  makan: { bg: 'bg-[#FFBE9A]', shape: 'rounded-[12px]', tilt: '-rotate-6', Icon: Utensils },
  transportasi: { bg: 'bg-[#A9D9FF]', shape: 'rounded-full', tilt: 'rotate-6', Icon: Bus },
  kuliah: { bg: 'bg-[#D2F25F]', shape: 'rounded-[12px]', tilt: '-rotate-6', Icon: GraduationCap },
  hiburan: { bg: 'bg-[#FFD84D]', shape: 'rounded-full', tilt: 'rotate-6', Icon: Gamepad2 },
  cicilan: { bg: 'bg-white', shape: 'rounded-[12px]', tilt: '-rotate-6', Icon: Smartphone },
  pemasukan: { bg: 'bg-[#A9D9FF]', shape: 'rounded-full', tilt: 'rotate-6', Icon: Wallet },
  tabungan: { bg: 'bg-[#D2F25F]', shape: 'rounded-[12px]', tilt: '-rotate-6', Icon: PiggyBank },
  laptop: { bg: 'bg-white', shape: 'rounded-[12px]', tilt: '-rotate-6', Icon: Laptop },
};

export const CategorySticker: React.FC<CategoryStickerProps> = ({ category, size = 'md' }) => {
  const cfg = STICKER_STYLES[category];
  const Icon = cfg.Icon;
  const dimClass = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 16 : 19;

  return (
    <span
      aria-hidden="true"
      className={`neo-sticker ${dimClass} ${cfg.bg} ${cfg.shape} ${cfg.tilt} text-[#15121E]`}
      style={size === 'sm' ? { width: 32, height: 32 } : undefined}
    >
      <Icon size={iconSize} strokeWidth={2.25} />
    </span>
  );
};
