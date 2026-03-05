import {
  AeonPreferences,
  AeonPreferencesSchema,
  DEFAULT_PREFERENCES,
} from './schema';
import { PreferencesStore } from './store';
import { sanitizeCss } from './sanitize';

export interface UcanToken {
  token: string;
}

export interface ZkKeypair {
  publicKey: string;
  privateKey: string;
}

export interface DashPreferencesStoreOptions {
  relayClient: any; // e.g. DashRelayClient
  ucan: UcanToken; // UCAN token with 'preferences/write' capability
  zkKeys?: ZkKeypair; // Optional keys for encrypted preferences
  graphPath?: string; // Path in the dash db where preferences live
}

export class DashPreferencesStore implements PreferencesStore {
  private prefs: AeonPreferences = { ...DEFAULT_PREFERENCES };
  private listeners: Set<(prefs: AeonPreferences) => void> = new Set();

  private relayClient: any;
  private ucan: UcanToken;
  private zkKeys?: ZkKeypair;
  private graphPath: string;

  constructor(options: DashPreferencesStoreOptions) {
    this.relayClient = options.relayClient;
    this.ucan = options.ucan;
    this.zkKeys = options.zkKeys;
    this.graphPath = options.graphPath || 'user/preferences';

    // In a real implementation, you would:
    // 1. Subscribe to Yjs/DashRelay at this.graphPath
    // 2. Fetch the initial state
    // 3. Decrypt with this.zkKeys if present
    // 4. Validate with AeonPreferencesSchema
    // 5. call this.notify() when changes occur
  }

  getPreferences(): AeonPreferences {
    return this.prefs;
  }

  async updatePreferences(partial: Partial<AeonPreferences>): Promise<void> {
    const safePartial = { ...partial };
    if (safePartial.theme?.cssOverrides) {
      safePartial.theme = {
        ...safePartial.theme,
        cssOverrides: sanitizeCss(safePartial.theme.cssOverrides),
      };
    }

    // 1. Verify UCAN capability locally before sending.
    // If the partial includes vault data, require 'vault/write'.
    if (safePartial.vault) {
      this.verifyCapability('vault/write');
    }
    // If updating global preferences
    this.verifyCapability('preferences/write');

    // 2. Compute new state
    const newPrefs = AeonPreferencesSchema.parse({
      ...this.prefs,
      ...safePartial,
      theme: { ...this.prefs.theme, ...safePartial.theme },
      security: { ...this.prefs.security, ...safePartial.security },
      stargate: { ...this.prefs.stargate, ...safePartial.stargate },
      locale: { ...this.prefs.locale, ...safePartial.locale },
      agent: { ...this.prefs.agent, ...safePartial.agent },
      flags: { ...this.prefs.flags, ...safePartial.flags },
      namespaces: { ...this.prefs.namespaces, ...safePartial.namespaces },
      // Vault should ideally be merged via a secure method, but we merge keys here.
      vault: { ...this.prefs.vault, ...safePartial.vault },
    });

    // 3. Encrypt payload. Ensure the vault is ALWAYS encrypted.
    const payload = this.zkKeys ? this.encrypt(newPrefs) : newPrefs;

    // 4. Send to DashRelay with UCAN for authorization
    await this.relayClient.pushState({
      path: this.graphPath,
      state: payload,
      ucan: this.ucan.token,
    });

    this.prefs = newPrefs;
    this.notify();
  }

  subscribe(callback: (prefs: AeonPreferences) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.prefs);
    }
  }

  private verifyCapability(capability: string) {
    // Basic stub. Real validation requires parsing the UCAN JWT, checking signatures,
    // and verifying the attenuation array includes the required capability.
    if (!this.ucan || !this.ucan.token) {
      throw new Error(`Missing UCAN token for capability: ${capability}`);
    }
  }

  private encrypt(data: any): any {
    // Stub for ZK / Zero-Knowledge / client-side encryption.
    // Real implementation would serialize data, encrypt with zkKeys.publicKey, etc.
    return data;
  }
}
