import { AeonPreferences } from './schema';
export interface PreferencesStore {
    getPreferences(): AeonPreferences;
    updatePreferences(partial: Partial<AeonPreferences>): Promise<void>;
    subscribe(callback: (prefs: AeonPreferences) => void): () => void;
}
export declare class InMemoryPreferencesStore implements PreferencesStore {
    private prefs;
    private listeners;
    getPreferences(): AeonPreferences;
    updatePreferences(partial: Partial<AeonPreferences>): Promise<void>;
    subscribe(callback: (prefs: AeonPreferences) => void): () => void;
    private notify;
}
