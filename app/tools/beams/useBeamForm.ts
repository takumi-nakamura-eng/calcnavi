'use client';

import { useCallback, useMemo, useState } from 'react';
import { BEAM_MATERIAL_PRESETS } from '@/lib/materialPresets';
import { calcSection, SECTION_DEFS, validateSectionDims, type SectionShape } from '@/lib/beams/sections';
import { fmt, kgToKN, kNToKg } from '@/lib/beams/units';
import type { LoadCase } from '@/lib/beams/simpleBeam';

export type LoadUnit = 'kg' | 'kN';
export type ZUnit = 'cm3' | 'mm3';
export type IUnit = 'cm4' | 'mm4';
export type SectionMode = 'shape' | 'direct';

export interface BeamFormState {
  materialIdx: number;
  E_GPa: string;
  sigmaAllow: string;
  isCustomMaterial: boolean;
  L: string;
  loadCase: LoadCase;
  loadValue: string;
  loadUnit: LoadUnit;
  sectionMode: SectionMode;
  Z: string;
  ZUnit: ZUnit;
  I: string;
  IUnit: IUnit;
  selectedShape: SectionShape;
  shapeDims: Record<string, string>;
  deflectionNStr: string;
  deflectionN: number;
  purpose: string;
  shapeResult: ReturnType<typeof calcSection> | null;
  shapeErrors: string[];
  currentShapeDef: (typeof SECTION_DEFS)[number];
  loadKNDisplay: string | null;
  wDisplay: string | null;
  wKNperMDisplay: string | null;
  spanLabel: string | undefined;
  loadLabelForDiagram: string | undefined;
}

export interface BeamFormActions {
  setE_GPa: (value: string) => void;
  setSigmaAllow: (value: string) => void;
  setL: (value: string) => void;
  setLoadCase: (value: LoadCase) => void;
  setLoadValue: (value: string) => void;
  setZ: (value: string) => void;
  setI: (value: string) => void;
  setDeflectionNStr: (value: string) => void;
  setPurpose: (value: string) => void;
  handleMaterialChange: (idx: number) => void;
  handleLoadUnitChange: (newUnit: LoadUnit) => void;
  handleZUnitChange: (newUnit: ZUnit) => void;
  handleIUnitChange: (newUnit: IUnit) => void;
  handleSectionModeChange: (mode: SectionMode) => void;
  handleShapeChange: (shape: SectionShape) => void;
  setShapeDim: (key: string, value: string) => void;
}

export function useBeamForm(defaultDeflectionN: number) {
  const [materialIdx, setMaterialIdx] = useState(0);
  const [E_GPa, setE_GPa] = useState<string>('205');
  const [sigmaAllow, setSigmaAllow] = useState<string>('150');
  const [L, setL] = useState<string>('');
  const [loadCase, setLoadCase] = useState<LoadCase>('center');
  const [loadValue, setLoadValue] = useState<string>('');
  const [loadUnit, setLoadUnit] = useState<LoadUnit>('kg');
  const [sectionMode, setSectionMode] = useState<SectionMode>('shape');
  const [Z, setZ] = useState<string>('');
  const [ZUnit, setZUnit] = useState<ZUnit>('cm3');
  const [I, setI] = useState<string>('');
  const [IUnit, setIUnit] = useState<IUnit>('cm4');
  const [selectedShape, setSelectedShape] = useState<SectionShape>('H');
  const [shapeDims, setShapeDims] = useState<Record<string, string>>({});
  const [deflectionNStr, setDeflectionNStr] = useState<string>(String(defaultDeflectionN));
  const [purpose, setPurpose] = useState<string>('');

  const isCustomMaterial = materialIdx === BEAM_MATERIAL_PRESETS.length - 1;

  const deflectionN = useMemo(() => {
    const parsed = parseInt(deflectionNStr, 10);
    return Number.isNaN(parsed) || parsed <= 0 ? defaultDeflectionN : parsed;
  }, [defaultDeflectionN, deflectionNStr]);

  const currentShapeDef = useMemo(
    () => SECTION_DEFS.find((definition) => definition.shape === selectedShape) ?? SECTION_DEFS[0],
    [selectedShape],
  );

  const shapeResult = useMemo(() => {
    if (sectionMode !== 'shape') return null;
    const nums: Record<string, number> = {};

    for (const param of currentShapeDef.params) {
      const value = parseFloat(shapeDims[param.key] ?? '');
      if (Number.isNaN(value) || value <= 0) return null;
      nums[param.key] = value;
    }

    if (validateSectionDims(selectedShape, nums).length > 0) return null;
    return calcSection(selectedShape, nums);
  }, [currentShapeDef.params, sectionMode, selectedShape, shapeDims]);

  const shapeErrors = useMemo(() => {
    if (sectionMode !== 'shape') return [];
    const nums: Record<string, number> = {};
    let hasAnyInput = false;

    for (const param of currentShapeDef.params) {
      const value = parseFloat(shapeDims[param.key] ?? '');
      if (!Number.isNaN(value)) hasAnyInput = true;
      nums[param.key] = value;
    }

    return hasAnyInput ? validateSectionDims(selectedShape, nums) : [];
  }, [currentShapeDef.params, sectionMode, selectedShape, shapeDims]);

  const loadKNDisplay = useMemo(() => {
    if (!loadValue || Number.isNaN(parseFloat(loadValue))) return null;
    return loadUnit === 'kg'
      ? fmt(kgToKN(parseFloat(loadValue)), 2)
      : fmt(parseFloat(loadValue), 2);
  }, [loadUnit, loadValue]);

  const wDisplay = useMemo(() => {
    if (!loadKNDisplay || !L) return null;
    const span = parseFloat(L);
    if (Number.isNaN(span) || span <= 0) return null;
    return fmt(parseFloat(loadKNDisplay) / span, 6);
  }, [L, loadKNDisplay]);

  const wKNperMDisplay = useMemo(
    () => (wDisplay ? fmt(parseFloat(wDisplay) * 1000, 4) : null),
    [wDisplay],
  );

  const spanLabel = useMemo(() => {
    const span = parseFloat(L);
    return !Number.isNaN(span) && span > 0 ? `${L} mm` : undefined;
  }, [L]);

  const loadLabelForDiagram = useMemo(
    () => (loadKNDisplay ? `${loadKNDisplay} kN` : undefined),
    [loadKNDisplay],
  );

  const handleMaterialChange = useCallback((idx: number) => {
    setMaterialIdx(idx);
    const preset = BEAM_MATERIAL_PRESETS[idx];
    if (preset.E_GPa !== null) setE_GPa(String(preset.E_GPa));
    if (preset.sigmaAllow_MPa !== null) setSigmaAllow(String(preset.sigmaAllow_MPa));
  }, []);

  const handleLoadUnitChange = useCallback((newUnit: LoadUnit) => {
    setLoadUnit((currentUnit) => {
      if (newUnit === currentUnit) return currentUnit;
      setLoadValue((currentValue) => {
        const parsed = parseFloat(currentValue);
        if (Number.isNaN(parsed) || parsed <= 0) return currentValue;
        return newUnit === 'kN' ? fmt(kgToKN(parsed), 4) : fmt(kNToKg(parsed), 2);
      });
      return newUnit;
    });
  }, []);

  const handleZUnitChange = useCallback((newUnit: ZUnit) => {
    setZUnit((currentUnit) => {
      if (newUnit === currentUnit) return currentUnit;
      setZ((currentValue) => {
        const parsed = parseFloat(currentValue);
        if (Number.isNaN(parsed) || parsed <= 0) return currentValue;
        return newUnit === 'mm3' ? fmt(parsed * 1000, 4) : fmt(parsed / 1000, 6);
      });
      return newUnit;
    });
  }, []);

  const handleIUnitChange = useCallback((newUnit: IUnit) => {
    setIUnit((currentUnit) => {
      if (newUnit === currentUnit) return currentUnit;
      setI((currentValue) => {
        const parsed = parseFloat(currentValue);
        if (Number.isNaN(parsed) || parsed <= 0) return currentValue;
        return newUnit === 'mm4' ? fmt(parsed * 10000, 4) : fmt(parsed / 10000, 6);
      });
      return newUnit;
    });
  }, []);

  const setShapeDim = useCallback((key: string, value: string) => {
    setShapeDims((current) => ({ ...current, [key]: value }));
  }, []);

  const state: BeamFormState = {
    materialIdx,
    E_GPa,
    sigmaAllow,
    isCustomMaterial,
    L,
    loadCase,
    loadValue,
    loadUnit,
    sectionMode,
    Z,
    ZUnit,
    I,
    IUnit,
    selectedShape,
    shapeDims,
    deflectionNStr,
    deflectionN,
    purpose,
    shapeResult,
    shapeErrors,
    currentShapeDef,
    loadKNDisplay,
    wDisplay,
    wKNperMDisplay,
    spanLabel,
    loadLabelForDiagram,
  };

  const actions: BeamFormActions = {
    setE_GPa,
    setSigmaAllow,
    setL,
    setLoadCase,
    setLoadValue,
    setZ,
    setI,
    setDeflectionNStr,
    setPurpose,
    handleMaterialChange,
    handleLoadUnitChange,
    handleZUnitChange,
    handleIUnitChange,
    handleSectionModeChange: setSectionMode,
    handleShapeChange: (shape) => {
      setSelectedShape(shape);
      setShapeDims({});
    },
    setShapeDim,
  };

  return { state, actions };
}
