export type PageId =
  | 'dashboard'
  | 'transaksi'
  | 'anggaran'
  | 'tabungan'
  | 'analisis'
  | 'rekomendasi'
  | 'pengaturan';

export type TransactionType = 'pemasukan' | 'pengeluaran' | 'tabungan';

export type CategoryId =
  | 'makan'
  | 'transportasi'
  | 'kuliah'
  | 'hiburan'
  | 'cicilan'
  | 'pemasukan'
  | 'tabungan';

export interface TransactionItem {
  id: string;
  day: number;
  date: string; // YYYY-MM-DD
  dateLabel: string; // e.g. "15 Nov 2026"
  type: TransactionType;
  categoryId: CategoryId;
  categoryLabel: string;
  amount: number;
  description: string;
}

export type BudgetStatusTone = 'aman' | 'pas' | 'perhatian' | 'habis' | 'lunas';

export interface BudgetCategory {
  id: Exclude<CategoryId, 'pemasukan' | 'tabungan'>;
  name: string;
  spent: number;
  limit: number;
  projectedEndOfMonth: number;
  percentage: number;
  statusLabel: string;
  tone: BudgetStatusTone;
  group: 'kebutuhan' | 'keinginan' | 'cicilan';
  tiltDeg: number;
}

export interface CumulativePoint {
  day: number;
  label: string;
  actualCumulative: number | null;
  projectedCumulative: number | null;
  dailySpend: number;
  isToday: boolean;
  isProjected: boolean;
}

export interface PatternSegment {
  id: 'kebutuhan' | 'keinginan' | 'cicilan';
  label: string;
  amount: number;
  percentage: number;
  fillColor: string;
}

export interface SavingsAlternative {
  id: string;
  title: string;
  valueLabel: string;
  detail: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  progressPercent: number;
  deadlineLabel: string;
  monthsRemaining: number;
  requiredMonthly: number;
  savingCapacity: number;
  monthlyGap: number;
  alternatives: SavingsAlternative[];
}

export type RecommendationPriority = 'tinggi' | 'sedang' | 'rendah';
export type RecommendationResultType = 'Perhitungan langsung' | 'Perkiraan baseline' | 'Gabungan';

export interface RuleVariable {
  name: string;
  value: string;
  threshold: string;
}

export interface RecommendationItem {
  id: string;
  ruleCode: string;
  priority: RecommendationPriority;
  resultType: RecommendationResultType;
  title: string;
  reason: string;
  categoryLabel: string;
  variables: RuleVariable[];
  aiExplanation: string;
  featuredOnDashboard?: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  initial: string;
  university: string;
  periodLabel: string;
  currentDay: number;
  totalDays: number;
  dailyBaselineRate: number;
  totalBudget: number;
}
