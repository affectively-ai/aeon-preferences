/**
 * Dissolution Preferences — aeon-preferences namespace
 *
 * Stores user-configurable dissolution settings: trust defaults,
 * fragmentation preferences, checkpoint scheduling, proxy delegation,
 * centralization limits, and bandwidth budgets.
 */
import type { AeonPreferences } from './schema';
export declare const DISSOLUTION_NAMESPACE_KEY = "app://shell.aeonflux.dev/dissolution";
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
export declare const DEFAULT_DISSOLUTION_PREFERENCES: DissolutionPreferences;
/**
 * Read dissolution preferences from an AeonPreferences object.
 * Returns defaults if namespace is missing or malformed.
 */
export declare function readDissolutionPreferences(preferences: AeonPreferences | null | undefined): DissolutionPreferences;
/**
 * Merge partial dissolution preferences into an AeonPreferences update.
 * Returns a Partial<AeonPreferences> suitable for updatePreferences().
 */
export declare function mergeDissolutionPreferences(preferences: AeonPreferences | null | undefined, partial: Partial<DissolutionPreferences>): Partial<AeonPreferences>;
