import { DEFAULT_PREFERENCES, AeonPreferencesSchema } from './schema';
export class InMemoryPreferencesStore {
    constructor() {
        this.prefs = { ...DEFAULT_PREFERENCES };
        this.listeners = new Set();
    }
    getPreferences() {
        return this.prefs;
    }
    async updatePreferences(partial) {
        this.prefs = AeonPreferencesSchema.parse({
            ...this.prefs,
            ...partial,
            theme: { ...this.prefs.theme, ...partial.theme },
            security: { ...this.prefs.security, ...partial.security },
            stargate: { ...this.prefs.stargate, ...partial.stargate },
            locale: { ...this.prefs.locale, ...partial.locale },
            agent: { ...this.prefs.agent, ...partial.agent },
            custom: { ...this.prefs.custom, ...partial.custom },
        });
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
}
//# sourceMappingURL=store.js.map