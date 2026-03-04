/**
 * Cantilever beam (fixed–free) calculation library.
 *
 * ALL internal units: N, mm, MPa (= N/mm²)
 *
 * Reuses the same BeamInputsInternal / BeamResult interfaces from simpleBeam.
 */

import type { BeamInputsInternal, BeamResult } from './simpleBeam';

// ─── Core calculation ─────────────────────────────────────────────────────────

/**
 * Calculate cantilever beam results.
 *
 * Load cases:
 *  - 'center' → concentrated load P at free end (tip)
 *  - 'uniform' → uniformly distributed load (total W, w = W/L)
 *
 * @param inputs - Normalised inputs in N–mm–MPa
 * @returns Calculation results
 */
export function calcCantileverBeam(inputs: BeamInputsInternal): BeamResult {
  const { L, loadCase, loadN, E, I, Z, sigmaAllow, deflectionLimitN } = inputs;

  let Mmax_Nmm: number;
  let deltaMax: number;
  let w_N_per_mm: number | undefined;
  let w_kN_per_m: number | undefined;

  if (loadCase === 'center') {
    // Concentrated load P at free end (tip)
    const P = loadN; // [N]
    Mmax_Nmm = P * L;                                    // M = P × L
    deltaMax = (P * Math.pow(L, 3)) / (3 * E * I);       // δ = PL³ / 3EI
  } else {
    // Uniformly distributed load (total load W_total → line load w)
    const w = loadN / L; // [N/mm]
    w_N_per_mm = w;
    w_kN_per_m = w * 1000; // N/mm → kN/m (×1000)
    Mmax_Nmm = (w * L * L) / 2;                          // M = wL² / 2
    deltaMax = (w * Math.pow(L, 4)) / (8 * E * I);       // δ = wL⁴ / 8EI
  }

  const Mmax_kNm = Mmax_Nmm / 1e6; // N·mm → kN·m
  const sigmaMax = Mmax_Nmm / Z;    // MPa
  const deltaAllow = L / deflectionLimitN; // mm

  return {
    Mmax_Nmm,
    Mmax_kNm,
    sigmaMax,
    sigmaAllow,
    stressOK: sigmaMax <= sigmaAllow,
    deltaMax,
    deltaAllow,
    deflectionOK: deltaMax <= deltaAllow,
    w_N_per_mm,
    w_kN_per_m,
  };
}
