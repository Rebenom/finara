import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildCumulativeSeries,
  calculateMonthEndProjection,
  calculateRemainingCash,
  calculateRunningBalance,
  filterTransactions,
  formatPercent,
  formatRupiah,
  splitRupiah,
  summarizeBudgets,
} from './finance';
import {
  BUDGET_CATEGORIES,
  PATTERN_SUMMARY,
  RECOMMENDATIONS,
  SAVINGS_GOAL,
  SUMMARY_METRICS,
  TRANSACTIONS,
  USER_PROFILE,
} from '../data';

test('Rupiah and percentage formatting follows Indonesian Neo Pop rules', () => {
  assert.equal(formatRupiah(1300000), 'Rp1.300.000');
  assert.equal(formatRupiah(2600000, { approx: true }), '≈ Rp2.600.000');
  assert.deepEqual(splitRupiah(1300000), {
    prefix: 'Rp',
    amount: '1.300.000',
    isNegative: false,
  });
  assert.equal(formatPercent(46.7), '46,7%');
  assert.equal(formatPercent(60.0), '60%');
});

test('Simulated transactions add up exactly to summary metrics', () => {
  const incomes = TRANSACTIONS.filter((t) => t.type === 'pemasukan');
  assert.deepEqual(
    incomes.map((t) => t.amount).sort((a, b) => a - b),
    [1000000, 2000000]
  );
  const income = incomes.reduce((s, t) => s + t.amount, 0);
  const expenses = TRANSACTIONS.filter((t) => t.type === 'pengeluaran').reduce(
    (s, t) => s + t.amount,
    0
  );
  const savings = TRANSACTIONS.filter((t) => t.type === 'tabungan').reduce(
    (s, t) => s + t.amount,
    0
  );

  assert.equal(income, SUMMARY_METRICS.income);
  assert.equal(expenses, SUMMARY_METRICS.expenses);
  assert.equal(savings, SUMMARY_METRICS.savingsDeposit);
  assert.equal(
    calculateRemainingCash(income, expenses, savings),
    SUMMARY_METRICS.remainingCash
  );
  assert.equal(
    calculateRunningBalance(income, expenses),
    SUMMARY_METRICS.runningBalance
  );
});

test('Month-end baseline projection matches simulated Rp2.600.000 and Rp100.000', () => {
  const projection = calculateMonthEndProjection({
    spentToDate: SUMMARY_METRICS.expenses,
    currentDay: USER_PROFILE.currentDay,
    totalDays: USER_PROFILE.totalDays,
    dailyRate: USER_PROFILE.dailyBaselineRate,
    income: SUMMARY_METRICS.income,
    savingsDeposit: SUMMARY_METRICS.savingsDeposit,
  });

  assert.equal(projection.projectedExpenses, 2600000);
  assert.equal(projection.projectedRemainingCash, 100000);
});

test('Cumulative series reaches Rp1.400.000 at day 15 and Rp2.600.000 at day 30', () => {
  const series = buildCumulativeSeries(
    TRANSACTIONS,
    USER_PROFILE.currentDay,
    USER_PROFILE.totalDays,
    USER_PROFILE.dailyBaselineRate
  );
  assert.equal(series.length, 30);
  const day15 = series[14];
  const day30 = series[29];
  assert.equal(day15.isToday, true);
  assert.equal(day15.actualCumulative, 1400000);
  assert.equal(day15.projectedCumulative, 1400000);
  assert.equal(day30.actualCumulative, null);
  assert.equal(day30.projectedCumulative, 2600000);
});

test('Budget categories, pattern segments, savings alternatives, and recommendations follow spec', () => {
  const summary = summarizeBudgets(BUDGET_CATEGORIES);
  assert.equal(summary.totalSpent, 1400000);
  assert.equal(summary.totalLimit, 2200000);
  assert.equal(formatPercent(summary.totalPercent), '63,6%');

  const segmentSum = PATTERN_SUMMARY.segments.reduce((s, seg) => s + seg.amount, 0);
  assert.equal(segmentSum, 1400000);

  assert.equal(
    SAVINGS_GOAL.requiredMonthly - SAVINGS_GOAL.savingCapacity,
    SAVINGS_GOAL.monthlyGap
  );
  assert.equal(SAVINGS_GOAL.alternatives[1].valueLabel, '9 bulan (Juli 2027)');
  assert.deepEqual(
    RECOMMENDATIONS.map((r) => r.ruleCode),
    ['R-02', 'R-01', 'R-05']
  );
});

test('Transaction filtering narrows results by category and day range', () => {
  const hiburanOnly = filterTransactions(TRANSACTIONS, {
    categoryId: 'hiburan',
    type: 'semua',
    startDay: 1,
    endDay: 15,
    query: '',
  });
  assert.equal(hiburanOnly.length, 2);
  assert.equal(
    hiburanOnly.reduce((s, t) => s + t.amount, 0),
    300000
  );

  const day10To15 = filterTransactions(TRANSACTIONS, {
    categoryId: 'semua',
    type: 'pengeluaran',
    startDay: 10,
    endDay: 15,
    query: '',
  });
  assert.equal(day10To15.length, 6);
});
