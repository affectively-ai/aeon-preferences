import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { InMemoryPreferencesStore } from './store';
const PreferencesContext = createContext(null);
export function PreferencesProvider({ store = new InMemoryPreferencesStore(), children }) {
    const [preferences, setPreferences] = useState(store.getPreferences());
    useEffect(() => {
        return store.subscribe((newPrefs) => {
            setPreferences(newPrefs);
        });
    }, [store]);
    const value = useMemo(() => ({
        preferences,
        updatePreferences: (partial) => store.updatePreferences(partial),
    }), [preferences, store]);
    return (_jsx(PreferencesContext.Provider, { value: value, children: children }));
}
export function useAeonPreferences() {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('useAeonPreferences must be used within a PreferencesProvider');
    }
    return context;
}
//# sourceMappingURL=react.js.map