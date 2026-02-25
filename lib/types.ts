export interface HistoryEntry {
  id: string;
  amount: number;
  rate: number;
  years: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  timestamp: number;
}

export interface LoanFormData {
  amount: string;
  rate: string;
  years: string;
}

export interface LoanFormErrors {
  amount?: string;
  rate?: string;
  years?: string;
}

export interface LoanResult {
  amount: number;
  rate: number;
  years: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}
