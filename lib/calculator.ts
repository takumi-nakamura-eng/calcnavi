import type { LoanResult, AmortizationRow } from '@/lib/types';

export function calculateMonthlyPayment(
  amount: number,
  rate: number,
  years: number,
): number {
  const r = rate / 12 / 100;
  const n = years * 12;

  if (r === 0) {
    return amount / n;
  }

  const pow = Math.pow(1 + r, n);
  return (amount * r * pow) / (pow - 1);
}

export function calculateLoan(
  amount: number,
  rate: number,
  years: number,
): LoanResult {
  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);
  const n = years * 12;
  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - amount;

  return { amount, rate, years, monthlyPayment, totalPayment, totalInterest };
}

export function generateAmortizationSchedule(
  amount: number,
  rate: number,
  years: number,
): AmortizationRow[] {
  const r = rate / 12 / 100;
  const n = years * 12;
  const monthlyPayment = calculateMonthlyPayment(amount, rate, years);

  const rows: AmortizationRow[] = [];
  let balance = amount;

  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const principal = monthlyPayment - interest;
    balance = balance - principal;

    rows.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, balance),
    });
  }

  return rows;
}
