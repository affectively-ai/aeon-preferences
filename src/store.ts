import { AeonPreferences, DEFAULT_PREFERENCES, AeonPreferencesSchema } from './schema';

export interface PreferencesStore {
  getPreferences(): AeonPreferences;
  updatePreferences(partial: Partial<AeonPreferences>): Promise<void>;
  subscribe(callback: (prefs: AeonPreferences) => void): () => void;
}

export class InMemoryPreferencesStore implements PreferencesStore {
  private prefs: AeonPreferences = { ...DEFAULT_PREFERENCES };
  private listeners: Set<(prefs: AeonPreferences) => void> = new Set();

  getPreferences(): AeonPreferences {
    return this.prefs;
  }

  async updatePreferences(partial: Partial<AeonPreferences>): Promise<void> {
    this.prefs = AeonPreferencesSchema.parse({
      ...this.prefs,
      ...partial,
      theme: { ...this.prefs.theme, ...partial.theme },
      security: { ...this.prefs.security, ...partial.security },
      stargate: { ...this.prefs.stargate, ...partial.stargate },
      locale: { ...this.prefs.locale, ...partial.locale },
      agent: { ...this.prefs.agent, ...partial.agent },
      flags: { ...this.prefs.flags, ...partial.flags },
      namespaces: { ...this.prefs.namespaces, ...partial.namespaces },
      vault: { ...this.prefs.vault, ...partial.vault },
    });
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
}
