'use client';

import { useState } from 'react';
import type {
  LoanFormData,
  LoanFormErrors,
  LoanResult,
  AmortizationRow,
} from '@/lib/types';
import { calculateLoan, generateAmortizationSchedule } from '@/lib/calculator';
import { addHistoryEntry } from '@/lib/storage';
import { trackToolCalculate } from '@/lib/analytics/events';
import AmortizationTable from './AmortizationTable';

function validate(data: LoanFormData): LoanFormErrors {
  const errors: LoanFormErrors = {};

  const amount = parseFloat(data.amount);
  if (!data.amount || isNaN(amount) || amount <= 0) {
    errors.amount = 'ローン額は0より大きい数値を入力してください';
  } else if (amount > 999_999_999) {
    errors.amount = 'ローン額は999,999,999円以下で入力してください';
  }

  const rate = parseFloat(data.rate);
  if (data.rate === '' || isNaN(rate) || rate < 0) {
    errors.rate = '年利率は0以上の数値を入力してください';
  } else if (rate > 99.99) {
    errors.rate = '年利率は99.99%以下で入力してください';
  }

  const years = parseInt(data.years, 10);
  if (!data.years || isNaN(years) || years < 1) {
    errors.years = '返済期間は1年以上で入力してください';
  } else if (years > 50) {
    errors.years = '返済期間は50年以下で入力してください';
  }

  return errors;
}

const fmtCurrency = (val: number) =>
  `¥${Math.round(val).toLocaleString('ja-JP')}`;

export default function LoanCalculator() {
  const [formData, setFormData] = useState<LoanFormData>({
    amount: '',
    rate: '',
    years: '',
  });
  const [errors, setErrors] = useState<LoanFormErrors>({});
  const [result, setResult] = useState<LoanResult | null>(null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoanFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const amount = parseFloat(formData.amount);
    const rate = parseFloat(formData.rate);
    const years = parseInt(formData.years, 10);

    const loanResult = calculateLoan(amount, rate, years);
    const amortizationSchedule = generateAmortizationSchedule(amount, rate, years);

    setResult(loanResult);
    setSchedule(amortizationSchedule);
    setSaved(false);

    addHistoryEntry({
      amount,
      rate,
      years,
      monthlyPayment: loanResult.monthlyPayment,
      totalPayment: loanResult.totalPayment,
      totalInterest: loanResult.totalInterest,
    });
    setSaved(true);
    trackToolCalculate({ toolId: 'loan', category: 'ローン' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="loan-form" noValidate>
        <div className="form-group">
          <label htmlFor="amount">ローン額（円）</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="例: 30000000"
            min="1"
            className={errors.amount ? 'input-error' : ''}
          />
          {errors.amount && (
            <span className="error-message" role="alert">
              {errors.amount}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rate">年利率（%）</label>
          <input
            type="number"
            id="rate"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            placeholder="例: 1.5"
            min="0"
            max="99.99"
            step="0.01"
            className={errors.rate ? 'input-error' : ''}
          />
          {errors.rate && (
            <span className="error-message" role="alert">
              {errors.rate}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="years">返済期間（年）</label>
          <input
            type="number"
            id="years"
            name="years"
            value={formData.years}
            onChange={handleChange}
            placeholder="例: 35"
            min="1"
            max="50"
            step="1"
            className={errors.years ? 'input-error' : ''}
          />
          {errors.years && (
            <span className="error-message" role="alert">
              {errors.years}
            </span>
          )}
        </div>

        <div className="form-submit-row">
          <button type="submit" className="btn-primary">
            計算する
          </button>
          {saved && (
            <span className="saved-notice">履歴に保存しました</span>
          )}
        </div>
      </form>

      {result && (
        <div className="results">
          <h2>計算結果</h2>
          <p className="result-meta">
            ローン額 {fmtCurrency(result.amount)} ／ 年利率 {result.rate}% ／ 返済期間 {result.years}年
          </p>
          <div className="result-cards">
            <div className="result-card result-card--primary">
              <div className="result-label">月々の返済額</div>
              <div className="result-value">{fmtCurrency(result.monthlyPayment)}</div>
            </div>
            <div className="result-card">
              <div className="result-label">総返済額</div>
              <div className="result-value">{fmtCurrency(result.totalPayment)}</div>
            </div>
            <div className="result-card">
              <div className="result-label">総利息額</div>
              <div className="result-value">{fmtCurrency(result.totalInterest)}</div>
            </div>
          </div>

          <AmortizationTable schedule={schedule} />
        </div>
      )}
    </div>
  );
}
