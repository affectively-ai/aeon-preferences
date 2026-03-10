import type { AeonPreferences } from './schema';
export declare const STICKY_NAMESPACE_KEY = "app://note.yoga/stickies";
export declare const STICKY_VAULT_KEY_PREFIX = "sticky://vault/";
export declare const STICKY_ISSUER_VAULT_KEY = "sticky://vault/issuer";
export declare const STICKY_GRANT_VAULT_KEY_PREFIX = "sticky://vault/grant/";
export type StickyDefaultPrivacyMode = 'plaintext' | 'encrypted';
export type StickyDefaultAnchorMode = 'global' | 'context' | 'geospatial';
export type StickyPresenceMode = 'private' | 'collaborators' | 'public';
export type StickyMementoVisibility = 'linked' | 'public';
export interface StickyDefaultsPreference {
    privacyMode: StickyDefaultPrivacyMode;
    anchorMode: StickyDefaultAnchorMode;
    anchorRadiusMiles: number;
    mementoVisibility: StickyMementoVisibility;
    requireEncryptionForCollaboration: boolean;
    presenceMode: StickyPresenceMode;
    defaultExpiryMinutes: number | null;
    collaborationGrantDurationMinutes: number;
    trustedCollaboratorDids: string[];
}
export interface StickyNamespacePreferences {
    stickies?: unknown[];
    defaults: StickyDefaultsPreference;
}
export interface StickyVaultEnvelope {
    kind: 'sticky-key' | 'sticky-issuer' | 'sticky-grant';
    noteId?: string;
    stickyId?: string;
    collaboratorDid?: string;
    payload: string;
    createdAt: number;
}
export declare const DEFAULT_STICKY_PREFERENCES: StickyNamespacePreferences;
export declare function readStickyPreferences(preferences: AeonPreferences | null | undefined): StickyNamespacePreferences;
export declare function mergeStickyPreferences(preferences: AeonPreferences | null | undefined, partial: Partial<StickyNamespacePreferences>): Partial<AeonPreferences>;
export declare function appendTrustedStickyCollaborator(preferences: AeonPreferences | null | undefined, collaboratorDid: string): Partial<AeonPreferences>;
export declare function buildStickyVaultKey(noteId: string, keyId: string): string;
export declare function buildStickyGrantVaultKey(noteId: string, grantId: string): string;
export declare function serializeStickyVaultEnvelope(envelope: StickyVaultEnvelope): string;
export declare function parseStickyVaultEnvelope(value: string | null | undefined): StickyVaultEnvelope | null;
export declare function mergeStickyVaultEntries(entries: Record<string, StickyVaultEnvelope>): Partial<AeonPreferences>;
