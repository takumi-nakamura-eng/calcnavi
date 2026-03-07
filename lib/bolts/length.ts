import type { FormulaStep } from '@/lib/engHistory';
import { BOLT_CALC_SPECS, type Diameter } from './specs';

export interface BoltLengthInput {
  diam: Diameter;
  thicknessMm: number;
  nutCount: number;
  plainWasherCount: number;
  springWasherCount: number;
}

export interface BoltLengthBreakdownItem {
  label: string;
  value: number;
}

export interface BoltLengthResult {
  lRequired: number;
  lBuy: number;
  tipAllowance: number;
  breakdown: BoltLengthBreakdownItem[];
  diam: Diameter;
  steps: FormulaStep[];
}

export function ceilToBuyLength(mm: number): number {
  const step = mm <= 100 ? 5 : mm <= 200 ? 10 : 25;
  return Math.ceil(mm / step) * step;
}

export function calcBoltLength(input: BoltLengthInput): BoltLengthResult {
  const spec = BOLT_CALC_SPECS[input.diam];
  const nutTerm = input.nutCount * spec.Hnut;
  const plainWasherTerm = input.plainWasherCount * spec.Hpw;
  const springWasherTerm = input.springWasherCount * spec.Hsw;
  const tipAllowance = 3 * spec.p;

  const lRequired =
    input.thicknessMm +
    nutTerm +
    plainWasherTerm +
    springWasherTerm +
    tipAllowance;
  const lBuy = ceilToBuyLength(lRequired);

  return {
    lRequired,
    lBuy,
    tipAllowance,
    diam: input.diam,
    steps: [
      {
        label: '先端余長',
        expr: `先端余長 = 3p = 3 × ${spec.p.toFixed(2)} = ${tipAllowance.toFixed(2)} mm`,
      },
      {
        label: '必要長さ',
        expr:
          `L_required = t + N×Hnut + PW×Hpw + SW×Hsw + 3p\n` +
          `= ${input.thicknessMm.toFixed(1)} + ${input.nutCount}×${spec.Hnut.toFixed(1)} + ${input.plainWasherCount}×${spec.Hpw.toFixed(1)} + ${input.springWasherCount}×${spec.Hsw.toFixed(1)} + ${tipAllowance.toFixed(2)}\n` +
          `= ${lRequired.toFixed(2)} mm`,
      },
      {
        label: '推奨購入長さ',
        expr: `規格刻みに切り上げ: ceil(${lRequired.toFixed(2)}) -> ${lBuy} mm`,
      },
    ],
    breakdown: [
      { label: '締結厚さ t', value: input.thicknessMm },
      { label: `六角ナット N × ${input.nutCount}`, value: nutTerm },
      { label: `平座金 PW × ${input.plainWasherCount}`, value: plainWasherTerm },
      { label: `ばね座金 SW × ${input.springWasherCount}`, value: springWasherTerm },
      { label: '先端余長 (3p)', value: tipAllowance },
    ],
  };
}
