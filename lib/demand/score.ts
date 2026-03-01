export interface DemandScoreInput {
  candidateId: string;
  impressions: number;
  ctr: number;
  avgPosition: number;
  practicality: number; // 0..1
  sourceCoverage: number; // 0..1
}

export interface DemandScoreBreakdown {
  demand: number; // 40
  unmetNeed: number; // 30
  practicality: number; // 20
  sourceCoverage: number; // 10
  total: number; // 100
  promotable: boolean; // total >= 70
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function demandPart(impressions: number): number {
  const normalized = clamp(impressions / 5000, 0, 1);
  return normalized * 40;
}

function unmetNeedPart(ctr: number, avgPosition: number): number {
  const ctrPenalty = clamp((0.06 - ctr) / 0.06, 0, 1); // lower CTR => higher score
  const positionFit = avgPosition >= 8 && avgPosition <= 20 ? 1 : avgPosition > 20 ? 0.6 : 0.25;
  return ctrPenalty * positionFit * 30;
}

export function calculateDemandScore(input: DemandScoreInput): DemandScoreBreakdown {
  const demand = demandPart(input.impressions);
  const unmetNeed = unmetNeedPart(input.ctr, input.avgPosition);
  const practicality = clamp(input.practicality, 0, 1) * 20;
  const sourceCoverage = clamp(input.sourceCoverage, 0, 1) * 10;
  const total = round1(demand + unmetNeed + practicality + sourceCoverage);
  return {
    demand: round1(demand),
    unmetNeed: round1(unmetNeed),
    practicality: round1(practicality),
    sourceCoverage: round1(sourceCoverage),
    total,
    promotable: total >= 70,
  };
}

export const FIXED_PILLAR_IDS = [
  'bolt-length',
  'simple-beam',
  'section-properties',
] as const;

export const CONDITIONAL_PILLAR_IDS = ['anchor'] as const;
