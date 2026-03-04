/**
 * Formula step generator for cantilever beam calculations.
 * Returns FormulaStep[] suitable for display and PDF export.
 */

import type { FormulaStep } from '@/lib/engHistory';
import type { BeamResult } from './simpleBeam';
import type { LoadCase } from './simpleBeam';
import { fmt } from './units';

export function buildCantileverFormulaSteps(params: {
  loadCase: LoadCase;
  loadKN: number;          // kN
  L_mm: number;
  E_GPa: number;
  I_mm4: number;
  Z_mm3: number;
  sigmaAllow: number;      // MPa
  deflectionLimitN: number;
  result: BeamResult;
}): FormulaStep[] {
  const { loadCase, loadKN, L_mm, E_GPa, I_mm4, Z_mm3, sigmaAllow, deflectionLimitN, result } = params;

  const P_N = loadKN * 1000;
  const E_MPa = E_GPa * 1000;
  const steps: FormulaStep[] = [];

  // ── Unit conversions ───────────────────────────────────────────────────────
  steps.push({
    label: '荷重の単位換算',
    expr: loadCase === 'center'
      ? `P = ${fmt(loadKN, 3)} kN = ${fmt(P_N, 0)} N`
      : `W_total = ${fmt(loadKN, 3)} kN = ${fmt(P_N, 0)} N`,
  });
  steps.push({
    label: 'ヤング率の単位換算',
    expr: `E = ${E_GPa} GPa = ${fmt(E_MPa, 0)} MPa = ${fmt(E_MPa, 0)} N/mm²`,
  });

  // ── Load intensity (uniform only) ──────────────────────────────────────────
  if (loadCase === 'uniform' && result.w_N_per_mm !== undefined) {
    steps.push({
      label: '線荷重 w',
      expr: `w = W_total / L\n    = ${fmt(P_N, 0)} / ${fmt(L_mm, 0)}\n    = ${fmt(result.w_N_per_mm, 6)} N/mm  (= ${fmt(result.w_kN_per_m!, 4)} kN/m)`,
    });
  }

  // ── Bending moment ─────────────────────────────────────────────────────────
  if (loadCase === 'center') {
    steps.push({
      label: '最大曲げモーメント M_max（固定端）',
      expr: `M_max = P × L\n      = ${fmt(P_N, 0)} × ${fmt(L_mm, 0)}\n      = ${fmt(result.Mmax_Nmm, 0)} N·mm\n      = ${fmt(result.Mmax_kNm, 4)} kN·m`,
    });
  } else {
    const w = result.w_N_per_mm!;
    steps.push({
      label: '最大曲げモーメント M_max（固定端）',
      expr: `M_max = w × L² / 2\n      = ${fmt(w, 6)} × ${fmt(L_mm, 0)}² / 2\n      = ${fmt(result.Mmax_Nmm, 0)} N·mm\n      = ${fmt(result.Mmax_kNm, 4)} kN·m`,
    });
  }

  // ── Bending stress ─────────────────────────────────────────────────────────
  steps.push({
    label: '最大曲げ応力 σ_max',
    expr: `σ_max = M_max / Z\n      = ${fmt(result.Mmax_Nmm, 0)} / ${fmt(Z_mm3, 0)}\n      = ${fmt(result.sigmaMax, 2)} MPa`,
  });
  steps.push({
    label: '応力判定',
    expr: `σ_max = ${fmt(result.sigmaMax, 2)} MPa  ${result.stressOK ? '≦' : '>'} σ_allow = ${sigmaAllow} MPa  →  ${result.stressOK ? 'OK ✓' : 'NG ✗'}`,
  });

  // ── Deflection ─────────────────────────────────────────────────────────────
  if (loadCase === 'center') {
    steps.push({
      label: '最大たわみ δ_max（自由端）',
      expr: `δ_max = P × L³ / (3 × E × I)\n      = ${fmt(P_N, 0)} × ${fmt(L_mm, 0)}³ / (3 × ${fmt(E_MPa, 0)} × ${fmt(I_mm4, 0)})\n      = ${fmt(result.deltaMax, 3)} mm`,
    });
  } else {
    const w = result.w_N_per_mm!;
    steps.push({
      label: '最大たわみ δ_max（自由端）',
      expr: `δ_max = w × L⁴ / (8 × E × I)\n      = ${fmt(w, 6)} × ${fmt(L_mm, 0)}⁴ / (8 × ${fmt(E_MPa, 0)} × ${fmt(I_mm4, 0)})\n      = ${fmt(result.deltaMax, 3)} mm`,
    });
  }
  steps.push({
    label: '許容たわみ δ_allow',
    expr: `δ_allow = L / ${deflectionLimitN}\n        = ${fmt(L_mm, 0)} / ${deflectionLimitN}\n        = ${fmt(result.deltaAllow, 2)} mm`,
  });
  steps.push({
    label: 'たわみ判定',
    expr: `δ_max = ${fmt(result.deltaMax, 3)} mm  ${result.deflectionOK ? '≦' : '>'} δ_allow = ${fmt(result.deltaAllow, 2)} mm  →  ${result.deflectionOK ? 'OK ✓' : 'NG ✗'}`,
  });

  return steps;
}
