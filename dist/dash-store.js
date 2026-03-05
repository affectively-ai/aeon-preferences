import { AeonPreferencesSchema, DEFAULT_PREFERENCES } from './schema';
export class DashPreferencesStore {
    constructor(options) {
        this.prefs = { ...DEFAULT_PREFERENCES };
        this.listeners = new Set();
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
    getPreferences() {
        return this.prefs;
    }
    async updatePreferences(partial) {
        // 1. Verify UCAN capability locally before sending (or server validates it)
        this.verifyCapability('preferences/write');
        // 2. Compute new state
        const newPrefs = AeonPreferencesSchema.parse({
            ...this.prefs,
            ...partial,
            theme: { ...this.prefs.theme, ...partial.theme },
            security: { ...this.prefs.security, ...partial.security },
            stargate: { ...this.prefs.stargate, ...partial.stargate },
            locale: { ...this.prefs.locale, ...partial.locale },
            agent: { ...this.prefs.agent, ...partial.agent },
            custom: { ...this.prefs.custom, ...partial.custom },
        });
        // 3. Encrypt payload if ZK keys are provided
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
    subscribe(callback) {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }
    notify() {
        for (const listener of this.listeners) {
            listener(this.prefs);
        }
    }
    verifyCapability(capability) {
        // Basic stub. Real validation requires parsing the UCAN JWT, checking signatures,
        // and verifying the attenuation array includes the required capability.
        if (!this.ucan || !this.ucan.token) {
            throw new Error(`Missing UCAN token for capability: ${capability}`);
        }
    }
    encrypt(data) {
        // Stub for ZK / Zero-Knowledge / client-side encryption.
        // Real implementation would serialize data, encrypt with zkKeys.publicKey, etc.
        return data;
    }
}
//# sourceMappingURL=dash-store.js.map