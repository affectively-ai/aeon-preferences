/**
 * Ghost Migration Preferences — aeon-preferences namespace
 *
 * Stores user-configurable ghost operation settings: migration defaults,
 * fork preferences, merge strategies, streaming priorities, and consent
 * configuration. Complementary to the ghost kernel module — preferences
 * travel WITH the ghost and configure HOW future operations behave.
 */
import type { AeonPreferences } from './schema';
export declare const GHOST_NAMESPACE_KEY = "app://shell.aeonflux.dev/ghost";
export declare const GHOST_VAULT_KEY_PREFIX = "ghost://vault/";
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
export declare const DEFAULT_GHOST_PREFERENCES: GhostNamespacePreferences;
/**
 * Read ghost preferences from an AeonPreferences object.
 * Returns defaults if namespace is missing or malformed.
 */
export declare function readGhostPreferences(preferences: AeonPreferences | null | undefined): GhostNamespacePreferences;
/**
 * Merge partial ghost preferences into an AeonPreferences update.
 * Returns a Partial<AeonPreferences> suitable for updatePreferences().
 */
export declare function mergeGhostPreferences(preferences: AeonPreferences | null | undefined, partial: Partial<GhostNamespacePreferences>): Partial<AeonPreferences>;
/**
 * Record a completed ghost operation in preferences history.
 * Keeps only the last 20 records.
 */
export declare function recordGhostOperation(preferences: AeonPreferences | null | undefined, record: GhostOperationRecord): Partial<AeonPreferences>;
/**
 * Build a vault key for ghost-specific encrypted data.
 */
export declare function buildGhostVaultKey(ghostCid: string, keyId: string): string;
