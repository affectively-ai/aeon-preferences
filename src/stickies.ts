import type { AeonPreferences } from './schema';

export const STICKY_NAMESPACE_KEY = 'app://note.yoga/stickies';
export const STICKY_VAULT_KEY_PREFIX = 'sticky://vault/';
export const STICKY_ISSUER_VAULT_KEY = `${STICKY_VAULT_KEY_PREFIX}issuer`;
export const STICKY_GRANT_VAULT_KEY_PREFIX = `${STICKY_VAULT_KEY_PREFIX}grant/`;

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

export const DEFAULT_STICKY_PREFERENCES: StickyNamespacePreferences = {
  defaults: {
    privacyMode: 'plaintext',
    anchorMode: 'global',
    anchorRadiusMiles: 0.06,
    mementoVisibility: 'linked',
    requireEncryptionForCollaboration: true,
    presenceMode: 'collaborators',
    defaultExpiryMinutes: null,
    collaborationGrantDurationMinutes: 60,
    trustedCollaboratorDids: [],
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (candidate): candidate is string =>
      typeof candidate === 'string' && candidate.trim().length > 0
  );
}

function toStickyDefaults(value: unknown): StickyDefaultsPreference {
  if (!isRecord(value)) {
    return { ...DEFAULT_STICKY_PREFERENCES.defaults };
  }

  const privacyMode =
    value['privacyMode'] === 'encrypted' ? 'encrypted' : 'plaintext';
  const anchorMode =
    value['anchorMode'] === 'context' || value['anchorMode'] === 'geospatial'
      ? value['anchorMode']
      : 'global';
  const rawRadius = value['anchorRadiusMiles'];
  const anchorRadiusMiles =
    typeof rawRadius === 'number' && Number.isFinite(rawRadius) && rawRadius > 0
      ? rawRadius
      : DEFAULT_STICKY_PREFERENCES.defaults.anchorRadiusMiles;
  const mementoVisibility =
    value['mementoVisibility'] === 'public' ? 'public' : 'linked';
  const requireEncryptionForCollaboration =
    value['requireEncryptionForCollaboration'] !== false;
  const presenceMode =
    value['presenceMode'] === 'private' || value['presenceMode'] === 'public'
      ? value['presenceMode']
      : 'collaborators';
  const rawDefaultExpiryMinutes = value['defaultExpiryMinutes'];
  const defaultExpiryMinutes =
    rawDefaultExpiryMinutes === null
      ? null
      : typeof rawDefaultExpiryMinutes === 'number' &&
        Number.isFinite(rawDefaultExpiryMinutes) &&
        rawDefaultExpiryMinutes > 0
      ? rawDefaultExpiryMinutes
      : DEFAULT_STICKY_PREFERENCES.defaults.defaultExpiryMinutes;
  const rawCollaborationGrantDurationMinutes =
    value['collaborationGrantDurationMinutes'];
  const collaborationGrantDurationMinutes =
    typeof rawCollaborationGrantDurationMinutes === 'number' &&
    Number.isFinite(rawCollaborationGrantDurationMinutes) &&
    rawCollaborationGrantDurationMinutes > 0
      ? rawCollaborationGrantDurationMinutes
      : DEFAULT_STICKY_PREFERENCES.defaults.collaborationGrantDurationMinutes;

  return {
    privacyMode,
    anchorMode,
    anchorRadiusMiles,
    mementoVisibility,
    requireEncryptionForCollaboration,
    presenceMode,
    defaultExpiryMinutes,
    collaborationGrantDurationMinutes,
    trustedCollaboratorDids: toStringArray(value['trustedCollaboratorDids']),
  };
}

export function readStickyPreferences(
  preferences: AeonPreferences | null | undefined
): StickyNamespacePreferences {
  const namespace = preferences?.namespaces?.[STICKY_NAMESPACE_KEY];
  if (!isRecord(namespace)) {
    return {
      ...DEFAULT_STICKY_PREFERENCES,
      defaults: { ...DEFAULT_STICKY_PREFERENCES.defaults },
    };
  }

  return {
    stickies: Array.isArray(namespace['stickies'])
      ? [...namespace['stickies']]
      : undefined,
    defaults: toStickyDefaults(namespace['defaults']),
  };
}

export function mergeStickyPreferences(
  preferences: AeonPreferences | null | undefined,
  partial: Partial<StickyNamespacePreferences>
): Partial<AeonPreferences> {
  const existing = readStickyPreferences(preferences);
  return {
    namespaces: {
      ...preferences?.namespaces,
      [STICKY_NAMESPACE_KEY]: {
        ...existing,
        ...partial,
        defaults: {
          ...existing.defaults,
          ...partial.defaults,
          trustedCollaboratorDids:
            partial.defaults?.trustedCollaboratorDids ??
            existing.defaults.trustedCollaboratorDids,
        },
      },
    },
  };
}

export function appendTrustedStickyCollaborator(
  preferences: AeonPreferences | null | undefined,
  collaboratorDid: string
): Partial<AeonPreferences> {
  const stickyPreferences = readStickyPreferences(preferences);
  const normalized = collaboratorDid.trim();
  if (normalized.length === 0) {
    return mergeStickyPreferences(preferences, {});
  }

  const trustedCollaboratorDids = Array.from(
    new Set([...stickyPreferences.defaults.trustedCollaboratorDids, normalized])
  );

  return mergeStickyPreferences(preferences, {
    defaults: {
      ...stickyPreferences.defaults,
      trustedCollaboratorDids,
    },
  });
}

export function buildStickyVaultKey(noteId: string, keyId: string): string {
  return `${STICKY_VAULT_KEY_PREFIX}${noteId}/${keyId}`;
}

export function buildStickyGrantVaultKey(
  noteId: string,
  grantId: string
): string {
  return `${STICKY_GRANT_VAULT_KEY_PREFIX}${noteId}/${grantId}`;
}

export function serializeStickyVaultEnvelope(
  envelope: StickyVaultEnvelope
): string {
  return JSON.stringify(envelope);
}

export function parseStickyVaultEnvelope(
  value: string | null | undefined
): StickyVaultEnvelope | null {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) {
      return null;
    }

    const kind = parsed['kind'];
    const payload = parsed['payload'];
    const createdAt = parsed['createdAt'];
    if (
      (kind !== 'sticky-key' &&
        kind !== 'sticky-issuer' &&
        kind !== 'sticky-grant') ||
      typeof payload !== 'string' ||
      typeof createdAt !== 'number' ||
      !Number.isFinite(createdAt)
    ) {
      return null;
    }

    return {
      kind,
      payload,
      createdAt,
      ...(typeof parsed['noteId'] === 'string'
        ? { noteId: parsed['noteId'] }
        : {}),
      ...(typeof parsed['stickyId'] === 'string'
        ? { stickyId: parsed['stickyId'] }
        : {}),
      ...(typeof parsed['collaboratorDid'] === 'string'
        ? { collaboratorDid: parsed['collaboratorDid'] }
        : {}),
    };
  } catch {
    return null;
  }
}

export function mergeStickyVaultEntries(
  entries: Record<string, StickyVaultEnvelope>
): Partial<AeonPreferences> {
  const nextVault: Record<string, string> = {};
  for (const [key, entry] of Object.entries(entries)) {
    nextVault[key] = serializeStickyVaultEnvelope(entry);
  }

  return {
    vault: nextVault,
  };
}
