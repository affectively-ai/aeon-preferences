import React from 'react';
import { AeonPreferences } from './schema';
import { PreferencesStore } from './store';
export declare function PreferencesProvider({ store, children, }: {
    store?: PreferencesStore;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAeonPreferences(): {
    preferences: AeonPreferences;
    updatePreferences: (partial: Partial<AeonPreferences>) => Promise<void>;
} | {
    preferences: {
        theme?: {
            mode?: "light" | "dark" | "system";
            cssOverrides?: string;
        };
        security?: {
            disabledApps?: string[];
            disabledMcps?: string[];
            blockedSites?: string[];
        };
        stargate?: {
            autoConnect?: boolean;
            defaultRelay?: string;
            trustedNodes?: string[];
        };
        locale?: {
            timezone?: string;
            language?: string;
        };
        agent?: {
            persona?: string;
            pronouns?: string;
        };
        flags?: Record<string, boolean>;
        namespaces?: Record<string, any>;
        vault?: Record<string, string>;
    };
    updatePreferences: () => Promise<any>;
};
