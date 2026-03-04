/**
 * Steel weight calculation logic.
 *
 * All dimension inputs are in mm; length L is in m.
 * Cross-section area A is computed in m² for direct use with density ρ [kg/m³].
 */

// ─── Shape types ────────────────────────────────────────────────────────────

export type SteelShape = 'plate' | 'roundBar' | 'flatBar' | 'roundPipe' | 'rectPipe';

export interface ShapeDef {
  shape: SteelShape;
  label: string;
  params: { key: string; label: string; unit: string; placeholder: string }[];
}

export const SHAPE_DEFS: ShapeDef[] = [
  {
    shape: 'plate',
    label: '平板（鋼板）',
    params: [
      { key: 'b', label: '幅 b', unit: 'mm', placeholder: '100' },
      { key: 't', label: '厚 t', unit: 'mm', placeholder: '9' },
    ],
  },
  {
    shape: 'roundBar',
    label: '丸棒',
    params: [
      { key: 'd', label: '直径 d', unit: 'mm', placeholder: '20' },
    ],
  },
  {
    shape: 'flatBar',
    label: '角棒',
    params: [
      { key: 'a', label: '辺 a', unit: 'mm', placeholder: '30' },
      { key: 'b', label: '辺 b', unit: 'mm', placeholder: '30' },
    ],
  },
  {
    shape: 'roundPipe',
    label: '丸パイプ',
    params: [
      { key: 'D', label: '外径 D', unit: 'mm', placeholder: '60' },
      { key: 't', label: '肉厚 t', unit: 'mm', placeholder: '3' },
    ],
  },
  {
    shape: 'rectPipe',
    label: '角パイプ',
    params: [
      { key: 'B', label: '外寸 B', unit: 'mm', placeholder: '50' },
      { key: 'H', label: '外寸 H', unit: 'mm', placeholder: '50' },
      { key: 't', label: '肉厚 t', unit: 'mm', placeholder: '3.2' },
    ],
  },
];

// ─── Cross-section area (returns m²) ────────────────────────────────────────

export function calcArea_m2(shape: SteelShape, dims: Record<string, number>): number | null {
  const mm2m = 1 / 1000;

  switch (shape) {
    case 'plate': {
      const { b, t } = dims;
      if (!b || !t || b <= 0 || t <= 0) return null;
      return (b * mm2m) * (t * mm2m);
    }
    case 'roundBar': {
      const { d } = dims;
      if (!d || d <= 0) return null;
      return Math.PI * (d * mm2m) ** 2 / 4;
    }
    case 'flatBar': {
      const { a, b } = dims;
      if (!a || !b || a <= 0 || b <= 0) return null;
      return (a * mm2m) * (b * mm2m);
    }
    case 'roundPipe': {
      const { D, t } = dims;
      if (!D || !t || D <= 0 || t <= 0) return null;
      if (D <= 2 * t) return null; // hollow check
      const Do = D * mm2m;
      const Di = (D - 2 * t) * mm2m;
      return Math.PI * (Do ** 2 - Di ** 2) / 4;
    }
    case 'rectPipe': {
      const { B, H, t } = dims;
      if (!B || !H || !t || B <= 0 || H <= 0 || t <= 0) return null;
      if (B <= 2 * t || H <= 2 * t) return null; // hollow check
      const Bo = B * mm2m;
      const Ho = H * mm2m;
      const Bi = (B - 2 * t) * mm2m;
      const Hi = (H - 2 * t) * mm2m;
      return Bo * Ho - Bi * Hi;
    }
    default:
      return null;
  }
}

// ─── Validation ─────────────────────────────────────────────────────────────

export function validateDims(shape: SteelShape, dims: Record<string, number>): string[] {
  const errors: string[] = [];
  const def = SHAPE_DEFS.find((d) => d.shape === shape);
  if (!def) return ['不明な形状です'];

  for (const p of def.params) {
    const v = dims[p.key];
    if (v === undefined || isNaN(v)) continue; // skip empty
    if (v <= 0) errors.push(`${p.label} は正の値を入力してください`);
  }

  if (shape === 'roundPipe') {
    const { D, t } = dims;
    if (D > 0 && t > 0 && D <= 2 * t) {
      errors.push('外径 D は肉厚 t の2倍より大きくしてください');
    }
  }
  if (shape === 'rectPipe') {
    const { B, H, t } = dims;
    if (B > 0 && t > 0 && B <= 2 * t) {
      errors.push('外寸 B は肉厚 t の2倍より大きくしてください');
    }
    if (H > 0 && t > 0 && H <= 2 * t) {
      errors.push('外寸 H は肉厚 t の2倍より大きくしてください');
    }
  }

  return errors;
}

// ─── Item model ─────────────────────────────────────────────────────────────

export interface SteelWeightItem {
  id: string;
  shape: SteelShape;
  dims: Record<string, number>;
  Lm: number;
  n: number;
  rho: number;
  note: string;
  area_m2: number;
  w_kgm: number;
  W_kg: number;
}

export function buildItem(
  shape: SteelShape,
  dims: Record<string, number>,
  Lm: number,
  n: number,
  rho: number,
  note: string,
): SteelWeightItem | null {
  const area = calcArea_m2(shape, dims);
  if (area === null || Lm <= 0 || n <= 0 || rho <= 0) return null;
  const w = rho * area; // kg/m
  const W = w * Lm * n;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    shape,
    dims: { ...dims },
    Lm,
    n,
    rho,
    note,
    area_m2: area,
    w_kgm: w,
    W_kg: W,
  };
}

export function recalcItem(item: SteelWeightItem): SteelWeightItem {
  const area = calcArea_m2(item.shape, item.dims);
  if (area === null) return item;
  const w = item.rho * area;
  return { ...item, area_m2: area, w_kgm: w, W_kg: w * item.Lm * item.n };
}

// ─── Dimension summary string ───────────────────────────────────────────────

export function dimSummary(shape: SteelShape, dims: Record<string, number>): string {
  const def = SHAPE_DEFS.find((d) => d.shape === shape);
  if (!def) return '';
  return def.params.map((p) => `${p.key}=${dims[p.key] ?? '?'}`).join(', ');
}

// ─── localStorage persistence ───────────────────────────────────────────────

const STORAGE_KEY = 'calcnavi_steel_weight_items';

export function loadItems(): SteelWeightItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SteelWeightItem[];
  } catch {
    return [];
  }
}

export function saveItems(items: SteelWeightItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}
