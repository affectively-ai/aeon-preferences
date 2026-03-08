/**
 * Ghost Migration Preferences — aeon-preferences namespace
 *
 * Stores user-configurable ghost operation settings: migration defaults,
 * fork preferences, merge strategies, streaming priorities, and consent
 * configuration. Complementary to the ghost kernel module — preferences
 * travel WITH the ghost and configure HOW future operations behave.
 */

import type { AeonPreferences } from './schema';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const GHOST_NAMESPACE_KEY = 'app://shell.aeonflux.dev/ghost';
export const GHOST_VAULT_KEY_PREFIX = 'ghost://vault/';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** User-configurable merge strategy preference per component */
export type GhostMergePreference = 'auto' | 'manual-confirm' | 'primary-wins' | 'most-recent';

/** Streaming priority preference */
export type GhostStreamPriority = 'ai-first' | 'emotion-first' | 'balanced';

/** Auto-fork behavior when connecting a new device */
export type GhostAutoForkMode = 'always' | 'ask' | 'never';

/** Bequeath eligibility */
export type GhostBequeathPolicy = 'allow' | 'require-biometric' | 'deny';

export interface GhostMigrationDefaults {
  /** Whether to auto-compress during packaging (default: true) */
  autoCompress: boolean;
  /** Max size budget in bytes (default: 50MB) */
  maxSizeBudgetBytes: number;
  /** Streaming priority order */
  streamPriority: GhostStreamPriority;
  /** Whether to announce relocation via Rhizome (default: true) */
  announceRelocation: boolean;
  /** Forwarding TTL for in-flight messages in ms (default: 24h) */
  forwardingTtlMs: number;
}

export interface GhostForkDefaults {
  /** Auto-fork behavior on new device connection */
  autoFork: GhostAutoForkMode;
  /** Merge window duration in days (default: 30) */
  mergeWindowDays: number;
  /** Whether to notify when merge window is expiring (default: true) */
  notifyMergeWindowExpiry: boolean;
  /** Days before expiry to start warning (default: 3) */
  expiryWarningDays: number;
}

export interface GhostMergeDefaults {
  /** Per-component merge strategy */
  loraStrategy: GhostMergePreference;
  cvmStrategy: GhostMergePreference;
  cyranoStrategy: GhostMergePreference;
  knowledgeGraphStrategy: GhostMergePreference;
  tellsStrategy: GhostMergePreference;
  preferencesStrategy: GhostMergePreference;
  /** Whether to require consent before merge (default: true) */
  requireConsentForMerge: boolean;
}

export interface GhostConsentDefaults {
  /** Require voice confirmation for ghost operations */
  requireVoice: boolean;
  /** Require typing pattern confirmation */
  requireTyping: boolean;
  /** Timeout for consent in seconds (default: 60) */
  consentTimeoutSeconds: number;
  /** Bequeath transfer policy */
  bequeathPolicy: GhostBequeathPolicy;
}

export interface GhostComponentInclusion {
  /** Include LoRA adapter in ghost (default: true) */
  lora: boolean;
  /** Include Cyrano consciousness state (default: true) */
  cyrano: boolean;
  /** Include CVM emotional baseline (default: true) */
  cvm: boolean;
  /** Include behavioral tells profile (default: true) */
  tells: boolean;
  /** Include neurochemical model (default: true) */
  neurochemical: boolean;
  /** Include knowledge graph (default: true) */
  knowledgeGraph: boolean;
  /** Include user preferences (default: true) */
  preferences: boolean;
}

/** Complete ghost namespace preferences */
export interface GhostNamespacePreferences {
  migration: GhostMigrationDefaults;
  fork: GhostForkDefaults;
  merge: GhostMergeDefaults;
  consent: GhostConsentDefaults;
  /** Which components to include in ghost operations */
  components: GhostComponentInclusion;
  /** History of completed ghost operations (last 20) */
  operationHistory: GhostOperationRecord[];
}

/** Record of a completed ghost operation stored in preferences */
export interface GhostOperationRecord {
  id: string;
  operation: 'migrate' | 'fork' | 'merge' | 'bequeath';
  ghostCid: string;
  targetDeviceId?: string;
  targetDid?: string;
  completedAt: number;
  sizeBytes: number;
  durationMs: number;
  success: boolean;
  error?: string;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_GHOST_PREFERENCES: GhostNamespacePreferences = {
  migration: {
    autoCompress: true,
    maxSizeBudgetBytes: 50 * 1024 * 1024,
    streamPriority: 'ai-first',
    announceRelocation: true,
    forwardingTtlMs: 24 * 60 * 60 * 1000,
  },
  fork: {
    autoFork: 'ask',
    mergeWindowDays: 30,
    notifyMergeWindowExpiry: true,
    expiryWarningDays: 3,
  },
  merge: {
    loraStrategy: 'auto',
    cvmStrategy: 'most-recent',
    cyranoStrategy: 'auto',
    knowledgeGraphStrategy: 'auto',
    tellsStrategy: 'most-recent',
    preferencesStrategy: 'most-recent',
    requireConsentForMerge: true,
  },
  consent: {
    requireVoice: true,
    requireTyping: true,
    consentTimeoutSeconds: 60,
    bequeathPolicy: 'require-biometric',
  },
  components: {
    lora: true,
    cyrano: true,
    cvm: true,
    tells: true,
    neurochemical: true,
    knowledgeGraph: true,
    preferences: true,
  },
  operationHistory: [],
};

// ---------------------------------------------------------------------------
// Reader / Writer Functions (consistent with stickies.ts / genesis.ts)
// ---------------------------------------------------------------------------

/**
 * Read ghost preferences from an AeonPreferences object.
 * Returns defaults if namespace is missing or malformed.
 */
export function readGhostPreferences(
  preferences: AeonPreferences | null | undefined,
): GhostNamespacePreferences {
  if (!preferences?.namespaces) return { ...DEFAULT_GHOST_PREFERENCES };

  const raw = preferences.namespaces[GHOST_NAMESPACE_KEY];
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_GHOST_PREFERENCES };

  const obj = raw as Record<string, unknown>;

  return {
    migration: {
      ...DEFAULT_GHOST_PREFERENCES.migration,
      ...(typeof obj.migration === 'object' && obj.migration !== null
        ? (obj.migration as Partial<GhostMigrationDefaults>)
        : {}),
    },
    fork: {
      ...DEFAULT_GHOST_PREFERENCES.fork,
      ...(typeof obj.fork === 'object' && obj.fork !== null
        ? (obj.fork as Partial<GhostForkDefaults>)
        : {}),
    },
    merge: {
      ...DEFAULT_GHOST_PREFERENCES.merge,
      ...(typeof obj.merge === 'object' && obj.merge !== null
        ? (obj.merge as Partial<GhostMergeDefaults>)
        : {}),
    },
    consent: {
      ...DEFAULT_GHOST_PREFERENCES.consent,
      ...(typeof obj.consent === 'object' && obj.consent !== null
        ? (obj.consent as Partial<GhostConsentDefaults>)
        : {}),
    },
    components: {
      ...DEFAULT_GHOST_PREFERENCES.components,
      ...(typeof obj.components === 'object' && obj.components !== null
        ? (obj.components as Partial<GhostComponentInclusion>)
        : {}),
    },
    operationHistory: Array.isArray(obj.operationHistory)
      ? (obj.operationHistory as GhostOperationRecord[]).slice(-20)
      : [],
  };
}

/**
 * Merge partial ghost preferences into an AeonPreferences update.
 * Returns a Partial<AeonPreferences> suitable for updatePreferences().
 */
export function mergeGhostPreferences(
  preferences: AeonPreferences | null | undefined,
  partial: Partial<GhostNamespacePreferences>,
): Partial<AeonPreferences> {
  const current = readGhostPreferences(preferences);

  const merged: GhostNamespacePreferences = {
    migration: partial.migration
      ? { ...current.migration, ...partial.migration }
      : current.migration,
    fork: partial.fork ? { ...current.fork, ...partial.fork } : current.fork,
    merge: partial.merge
      ? { ...current.merge, ...partial.merge }
      : current.merge,
    consent: partial.consent
      ? { ...current.consent, ...partial.consent }
      : current.consent,
    components: partial.components
      ? { ...current.components, ...partial.components }
      : current.components,
    operationHistory: partial.operationHistory ?? current.operationHistory,
  };

  return {
    namespaces: {
      ...(preferences?.namespaces ?? {}),
      [GHOST_NAMESPACE_KEY]: merged,
    },
  };
}

/**
 * Record a completed ghost operation in preferences history.
 * Keeps only the last 20 records.
 */
export function recordGhostOperation(
  preferences: AeonPreferences | null | undefined,
  record: GhostOperationRecord,
): Partial<AeonPreferences> {
  const current = readGhostPreferences(preferences);
  const history = [...current.operationHistory, record].slice(-20);
  return mergeGhostPreferences(preferences, { operationHistory: history });
}

/**
 * Build a vault key for ghost-specific encrypted data.
 */
export function buildGhostVaultKey(ghostCid: string, keyId: string): string {
  return `${GHOST_VAULT_KEY_PREFIX}${ghostCid}/${keyId}`;
}
