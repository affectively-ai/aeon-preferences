import {
  AeonPreferences,
  DEFAULT_PREFERENCES,
  AeonPreferencesSchema,
} from './schema';
import { sanitizeCss } from './sanitize';

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
    const safePartial = { ...partial };
    if (safePartial.theme?.cssOverrides) {
      safePartial.theme = {
        ...safePartial.theme,
        cssOverrides: sanitizeCss(safePartial.theme.cssOverrides),
      };
    }

    this.prefs = AeonPreferencesSchema.parse({
      ...this.prefs,
      ...safePartial,
      theme: { ...this.prefs.theme, ...safePartial.theme },
      security: { ...this.prefs.security, ...safePartial.security },
      stargate: { ...this.prefs.stargate, ...safePartial.stargate },
      locale: { ...this.prefs.locale, ...safePartial.locale },
      agent: { ...this.prefs.agent, ...safePartial.agent },
      flags: { ...this.prefs.flags, ...safePartial.flags },
      namespaces: { ...this.prefs.namespaces, ...safePartial.namespaces },
      vault: { ...this.prefs.vault, ...safePartial.vault },
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
