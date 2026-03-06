import type { AeonPreferences } from './schema';

export const GENESIS_NAMESPACE_KEY = 'app://shell.aeonflux.dev/genesis';

export type GenesisPreferenceLens =
  | 'blend'
  | 'semantic'
  | 'affective'
  | 'social'
  | 'spatial'
  | 'temporal';

export type GenesisPreferenceMode = 'system1' | 'system2';

export interface GenesisDefaultsPreference {
  lens: GenesisPreferenceLens;
  mode: GenesisPreferenceMode;
  motionScale: number;
  showContours: boolean;
  autoCollapseOnSelect: boolean;
}

export interface GenesisBookmarkPreference {
  id: string;
  label: string;
  lens: GenesisPreferenceLens;
  mode: GenesisPreferenceMode;
  focusEntityId?: string;
  focusAddress?: string;
  snapshotRoot?: string;
  query?: string;
  createdAt: number;
}

export interface GenesisImpulsePreference {
  id: string;
  kind: 'attractor' | 'repulsor' | 'shear' | 'freeze' | 'damp' | 'amplify';
  x: number;
  y: number;
  radius: number;
  strength: number;
  axis?: 'x' | 'y';
  createdAt: number;
}

export interface GenesisPresetPreference {
  id: string;
  label: string;
  focusAddress?: string;
  impulses: GenesisImpulsePreference[];
  createdAt: number;
  updatedAt: number;
}

export interface GenesisNamespacePreferences {
  defaults: GenesisDefaultsPreference;
  bookmarks: GenesisBookmarkPreference[];
  presets: GenesisPresetPreference[];
}

export const DEFAULT_GENESIS_PREFERENCES: GenesisNamespacePreferences = {
  defaults: {
    lens: 'blend',
    mode: 'system1',
    motionScale: 1,
    showContours: true,
    autoCollapseOnSelect: true,
  },
  bookmarks: [],
  presets: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function toLens(value: unknown): GenesisPreferenceLens {
  return value === 'semantic' ||
    value === 'affective' ||
    value === 'social' ||
    value === 'spatial' ||
    value === 'temporal'
    ? value
    : 'blend';
}

function toMode(value: unknown): GenesisPreferenceMode {
  return value === 'system2' ? 'system2' : 'system1';
}

function toString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function toFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function parseDefaults(value: unknown): GenesisDefaultsPreference {
  if (!isRecord(value)) {
    return { ...DEFAULT_GENESIS_PREFERENCES.defaults };
  }

  return {
    lens: toLens(value['lens']),
    mode: toMode(value['mode']),
    motionScale: clamp(
      toFiniteNumber(value['motionScale']) ??
        DEFAULT_GENESIS_PREFERENCES.defaults.motionScale,
      0.2,
      1.4
    ),
    showContours:
      typeof value['showContours'] === 'boolean'
        ? value['showContours']
        : DEFAULT_GENESIS_PREFERENCES.defaults.showContours,
    autoCollapseOnSelect:
      typeof value['autoCollapseOnSelect'] === 'boolean'
        ? value['autoCollapseOnSelect']
        : DEFAULT_GENESIS_PREFERENCES.defaults.autoCollapseOnSelect,
  };
}

function parseImpulse(value: unknown): GenesisImpulsePreference | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toString(value['id']);
  const kind = value['kind'];
  const x = toFiniteNumber(value['x']);
  const y = toFiniteNumber(value['y']);
  const radius = toFiniteNumber(value['radius']);
  const strength = toFiniteNumber(value['strength']);
  const createdAt = toFiniteNumber(value['createdAt']);
  if (
    !id ||
    (kind !== 'attractor' &&
      kind !== 'repulsor' &&
      kind !== 'shear' &&
      kind !== 'freeze' &&
      kind !== 'damp' &&
      kind !== 'amplify') ||
    typeof x !== 'number' ||
    typeof y !== 'number' ||
    typeof radius !== 'number' ||
    typeof strength !== 'number' ||
    typeof createdAt !== 'number'
  ) {
    return null;
  }

  const axis = value['axis'] === 'y' ? 'y' : value['axis'] === 'x' ? 'x' : undefined;
  return {
    id,
    kind,
    x: clamp(x, 0, 1),
    y: clamp(y, 0, 1),
    radius: clamp(radius, 0.05, 0.8),
    strength: clamp(strength, 0.05, 1.5),
    createdAt,
    ...(axis ? { axis } : {}),
  };
}

function parseBookmark(value: unknown): GenesisBookmarkPreference | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toString(value['id']);
  const label = toString(value['label']);
  const createdAt = toFiniteNumber(value['createdAt']);
  if (!id || !label || typeof createdAt !== 'number') {
    return null;
  }

  return {
    id,
    label,
    lens: toLens(value['lens']),
    mode: toMode(value['mode']),
    createdAt,
    ...(toString(value['focusEntityId'])
      ? { focusEntityId: toString(value['focusEntityId']) }
      : {}),
    ...(toString(value['focusAddress'])
      ? { focusAddress: toString(value['focusAddress']) }
      : {}),
    ...(toString(value['snapshotRoot'])
      ? { snapshotRoot: toString(value['snapshotRoot']) }
      : {}),
    ...(toString(value['query']) ? { query: toString(value['query']) } : {}),
  };
}

function parsePreset(value: unknown): GenesisPresetPreference | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = toString(value['id']);
  const label = toString(value['label']);
  const createdAt = toFiniteNumber(value['createdAt']);
  const updatedAt = toFiniteNumber(value['updatedAt']);
  if (!id || !label || typeof createdAt !== 'number' || typeof updatedAt !== 'number') {
    return null;
  }

  const impulses = Array.isArray(value['impulses'])
    ? value['impulses']
        .map((candidate) => parseImpulse(candidate))
        .filter((candidate): candidate is GenesisImpulsePreference => candidate !== null)
    : [];

  return {
    id,
    label,
    ...(toString(value['focusAddress'])
      ? { focusAddress: toString(value['focusAddress']) }
      : {}),
    impulses,
    createdAt,
    updatedAt,
  };
}

export function readGenesisPreferences(
  preferences: AeonPreferences | null | undefined
): GenesisNamespacePreferences {
  const namespace = preferences?.namespaces?.[GENESIS_NAMESPACE_KEY];
  if (!isRecord(namespace)) {
    return {
      defaults: { ...DEFAULT_GENESIS_PREFERENCES.defaults },
      bookmarks: [],
      presets: [],
    };
  }

  const bookmarks = Array.isArray(namespace['bookmarks'])
    ? namespace['bookmarks']
        .map((candidate) => parseBookmark(candidate))
        .filter((candidate): candidate is GenesisBookmarkPreference => candidate !== null)
    : [];
  const presets = Array.isArray(namespace['presets'])
    ? namespace['presets']
        .map((candidate) => parsePreset(candidate))
        .filter((candidate): candidate is GenesisPresetPreference => candidate !== null)
    : [];

  return {
    defaults: parseDefaults(namespace['defaults']),
    bookmarks,
    presets,
  };
}

export function mergeGenesisPreferences(
  preferences: AeonPreferences | null | undefined,
  partial: Partial<GenesisNamespacePreferences>
): Partial<AeonPreferences> {
  const existing = readGenesisPreferences(preferences);
  return {
    namespaces: {
      ...preferences?.namespaces,
      [GENESIS_NAMESPACE_KEY]: {
        defaults: {
          ...existing.defaults,
          ...partial.defaults,
        },
        bookmarks: partial.bookmarks ?? existing.bookmarks,
        presets: partial.presets ?? existing.presets,
      },
    },
  };
}
