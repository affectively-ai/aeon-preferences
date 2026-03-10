/**
 * Dissolution Preferences — aeon-preferences namespace
 *
 * Stores user-configurable dissolution settings: trust defaults,
 * fragmentation preferences, checkpoint scheduling, proxy delegation,
 * centralization limits, and bandwidth budgets.
 */

import type { AeonPreferences } from './schema';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DISSOLUTION_NAMESPACE_KEY = 'app://shell.aeonflux.dev/dissolution';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DissolutionTrustDefaults {
  /** Default trust tier for new peers */
  defaultTier: 'acquaintance' | 'stranger';
  /** Interaction count threshold for auto-promotion */
  autoPromoteThreshold: number;
  /** Days of inactivity before trust decays */
  decayDays: number;
}

export interface DissolutionFragmentationDefaults {
  /** Whether fragmentation is enabled */
  enabled: boolean;
  /** Number of replicas for medium-vitality fragments */
  mediumReplicaCount: number;
  /** Number of replicas for low-vitality fragments */
  lowReplicaCount: number;
  /** Target survival rate on device loss (0-1) */
  survivalTarget: number;
}

export interface DissolutionCheckpointDefaults {
  /** Whether periodic checkpointing is enabled */
  enabled: boolean;
  /** Checkpoint interval in milliseconds */
  intervalMs: number;
  /** Max checkpoint size in bytes */
  maxSizeBytes: number;
  /** Target number of peers for each checkpoint */
  targetPeerCount: number;
}

export interface DissolutionProxyDefaults {
  /** Whether proxy delegation is enabled */
  enabled: boolean;
  /** Default proxy TTL in milliseconds */
  defaultTtlMs: number;
  /** Whether to auto-designate proxy on device sleep */
  autoDesignateOnSleep: boolean;
}

export interface DissolutionCentralizationDefaults {
  /** Max state any single peer can hold (0-1) */
  maxPeerStatePercent: number;
  /** Whether to auto-rebalance when violations are detected */
  autoRebalance: boolean;
}

export interface DissolutionBandwidthDefaults {
  /** Max sustained sync bandwidth in bytes/min */
  maxSustainedBytesPerMin: number;
  /** Whether to use lazy graph sync */
  lazyGraphSync: boolean;
}

/** Complete dissolution namespace preferences */
export interface DissolutionPreferences {
  trust: DissolutionTrustDefaults;
  fragmentation: DissolutionFragmentationDefaults;
  checkpoint: DissolutionCheckpointDefaults;
  proxy: DissolutionProxyDefaults;
  centralization: DissolutionCentralizationDefaults;
  bandwidth: DissolutionBandwidthDefaults;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_DISSOLUTION_PREFERENCES: DissolutionPreferences = {
  trust: {
    defaultTier: 'acquaintance',
    autoPromoteThreshold: 50,
    decayDays: 30,
  },
  fragmentation: {
    enabled: true,
    mediumReplicaCount: 3,
    lowReplicaCount: 1,
    survivalTarget: 0.8,
  },
  checkpoint: {
    enabled: true,
    intervalMs: 300_000, // 5 minutes
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    targetPeerCount: 3,
  },
  proxy: {
    enabled: true,
    defaultTtlMs: 30 * 60 * 1000, // 30 minutes
    autoDesignateOnSleep: true,
  },
  centralization: {
    maxPeerStatePercent: 0.2,
    autoRebalance: true,
  },
  bandwidth: {
    maxSustainedBytesPerMin: 102_400,
    lazyGraphSync: true,
  },
};

// ---------------------------------------------------------------------------
// Reader / Writer Functions (consistent with ghost.ts pattern)
// ---------------------------------------------------------------------------

/**
 * Read dissolution preferences from an AeonPreferences object.
 * Returns defaults if namespace is missing or malformed.
 */
export function readDissolutionPreferences(
  preferences: AeonPreferences | null | undefined
): DissolutionPreferences {
  if (!preferences?.namespaces) return { ...DEFAULT_DISSOLUTION_PREFERENCES };

  const raw = preferences.namespaces[DISSOLUTION_NAMESPACE_KEY];
  if (!raw || typeof raw !== 'object')
    return { ...DEFAULT_DISSOLUTION_PREFERENCES };

  const obj = raw as Record<string, unknown>;

  return {
    trust: {
      ...DEFAULT_DISSOLUTION_PREFERENCES.trust,
      ...(typeof obj.trust === 'object' && obj.trust !== null
        ? (obj.trust as Partial<DissolutionTrustDefaults>)
        : {}),
    },
    fragmentation: {
      ...DEFAULT_DISSOLUTION_PREFERENCES.fragmentation,
      ...(typeof obj.fragmentation === 'object' && obj.fragmentation !== null
        ? (obj.fragmentation as Partial<DissolutionFragmentationDefaults>)
        : {}),
    },
    checkpoint: {
      ...DEFAULT_DISSOLUTION_PREFERENCES.checkpoint,
      ...(typeof obj.checkpoint === 'object' && obj.checkpoint !== null
        ? (obj.checkpoint as Partial<DissolutionCheckpointDefaults>)
        : {}),
    },
    proxy: {
      ...DEFAULT_DISSOLUTION_PREFERENCES.proxy,
      ...(typeof obj.proxy === 'object' && obj.proxy !== null
        ? (obj.proxy as Partial<DissolutionProxyDefaults>)
        : {}),
    },
    centralization: {
      ...DEFAULT_DISSOLUTION_PREFERENCES.centralization,
      ...(typeof obj.centralization === 'object' && obj.centralization !== null
        ? (obj.centralization as Partial<DissolutionCentralizationDefaults>)
        : {}),
    },
    bandwidth: {
      ...DEFAULT_DISSOLUTION_PREFERENCES.bandwidth,
      ...(typeof obj.bandwidth === 'object' && obj.bandwidth !== null
        ? (obj.bandwidth as Partial<DissolutionBandwidthDefaults>)
        : {}),
    },
  };
}

/**
 * Merge partial dissolution preferences into an AeonPreferences update.
 * Returns a Partial<AeonPreferences> suitable for updatePreferences().
 */
export function mergeDissolutionPreferences(
  preferences: AeonPreferences | null | undefined,
  partial: Partial<DissolutionPreferences>
): Partial<AeonPreferences> {
  const current = readDissolutionPreferences(preferences);

  const merged: DissolutionPreferences = {
    trust: partial.trust
      ? { ...current.trust, ...partial.trust }
      : current.trust,
    fragmentation: partial.fragmentation
      ? { ...current.fragmentation, ...partial.fragmentation }
      : current.fragmentation,
    checkpoint: partial.checkpoint
      ? { ...current.checkpoint, ...partial.checkpoint }
      : current.checkpoint,
    proxy: partial.proxy
      ? { ...current.proxy, ...partial.proxy }
      : current.proxy,
    centralization: partial.centralization
      ? { ...current.centralization, ...partial.centralization }
      : current.centralization,
    bandwidth: partial.bandwidth
      ? { ...current.bandwidth, ...partial.bandwidth }
      : current.bandwidth,
  };

  return {
    namespaces: {
      ...(preferences?.namespaces ?? {}),
      [DISSOLUTION_NAMESPACE_KEY]: merged,
    },
  };
}
