import type {
  BudgetCategory,
  CategoryId,
  CumulativePoint,
  TransactionItem,
  TransactionType,
} from '../types';

export interface SplitRupiahResult {
  prefix: string;
  amount: string;
  isNegative: boolean;
}

export function formatNumberId(value: number): string {
  const absRounded = Math.round(Math.abs(value));
  return absRounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatRupiah(value: number, options?: { approx?: boolean }): string {
  const prefix = value < 0 ? '-Rp' : 'Rp';
  const formatted = `${prefix}${formatNumberId(value)}`;
  return options?.approx ? `≈ ${formatted}` : formatted;
}

export function splitRupiah(value: number): SplitRupiahResult {
  return {
    prefix: 'Rp',
    amount: formatNumberId(value),
    isNegative: value < 0,
  };
}

export function formatPercent(value: number, decimals = 1): string {
  const fixed = value.toFixed(decimals);
  const cleaned = fixed.endsWith('.0') && decimals === 1 ? fixed.slice(0, -2) : fixed;
  return `${cleaned.replace('.', ',')}%`;
}

export function formatPercentExact(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace('.', ',')}%`;
}

export function calculateRemainingCash(
  income: number,
  expenses: number,
  savingsDeposit: number
): number {
  return income - expenses - savingsDeposit;
}

export function calculateRunningBalance(income: number, expenses: number): number {
  return income - expenses;
}

export function calculateMonthEndProjection(params: {
  spentToDate: number;
  currentDay: number;
  totalDays: number;
  dailyRate: number;
  income: number;
  savingsDeposit: number;
}): {
  projectedExpenses: number;
  projectedRemainingCash: number;
} {
  const remainingDays = Math.max(0, params.totalDays - params.currentDay);
  const projectedExpenses = params.spentToDate + remainingDays * params.dailyRate;
  const projectedRemainingCash =
    params.income - params.savingsDeposit - projectedExpenses;
  return { projectedExpenses, projectedRemainingCash };
}

export function buildCumulativeSeries(
  transactions: TransactionItem[],
  currentDay: number,
  totalDays: number,
  dailyBaselineRate: number
): CumulativePoint[] {
  const dailyTotals = new Map<number, number>();
  for (const tx of transactions) {
    if (tx.type === 'pengeluaran') {
      dailyTotals.set(tx.day, (dailyTotals.get(tx.day) ?? 0) + tx.amount);
    }
  }

  const points: CumulativePoint[] = [];
  let running = 0;

  for (let day = 1; day <= totalDays; day++) {
    const dailySpend = day <= currentDay ? dailyTotals.get(day) ?? 0 : dailyBaselineRate;
    if (day <= currentDay) {
      running += dailySpend;
    }
    const isToday = day === currentDay;
    const isProjected = day > currentDay;

    const projectedValue =
      day >= currentDay
        ? running + (day - currentDay) * dailyBaselineRate
        : null;

    points.push({
      day,
      label: `Hari ke-${day}`,
      actualCumulative: day <= currentDay ? running : null,
      projectedCumulative: projectedValue,
      dailySpend,
      isToday,
      isProjected,
    });
  }

  return points;
}

export interface TransactionFilter {
  categoryId: CategoryId | 'semua';
  type: TransactionType | 'semua';
  startDay: number;
  endDay: number;
  query: string;
}

export function filterTransactions(
  transactions: TransactionItem[],
  filter: TransactionFilter
): TransactionItem[] {
  const normalizedQuery = filter.query.trim().toLowerCase();
  return transactions.filter((tx) => {
    if (filter.categoryId !== 'semua' && tx.categoryId !== filter.categoryId) {
      return false;
    }
    if (filter.type !== 'semua' && tx.type !== filter.type) {
      return false;
    }
    if (tx.day < filter.startDay || tx.day > filter.endDay) {
      return false;
    }
    if (
      normalizedQuery.length > 0 &&
      !tx.description.toLowerCase().includes(normalizedQuery) &&
      !tx.categoryLabel.toLowerCase().includes(normalizedQuery)
    ) {
      return false;
    }
    return true;
  });
}

export function summarizeBudgets(budgets: BudgetCategory[]): {
  totalSpent: number;
  totalLimit: number;
  totalProjected: number;
  totalPercent: number;
} {
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalProjected = budgets.reduce((sum, b) => sum + b.projectedEndOfMonth, 0);
  const totalPercent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
  return { totalSpent, totalLimit, totalProjected, totalPercent };
}
