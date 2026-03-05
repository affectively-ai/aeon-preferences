import React from 'react';
import { AeonPreferences } from './schema';
import { PreferencesStore } from './store';
export declare function PreferencesProvider({ store, children }: {
    store?: PreferencesStore;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAeonPreferences(): {
    preferences: AeonPreferences;
    updatePreferences: (partial: Partial<AeonPreferences>) => Promise<void>;
};
