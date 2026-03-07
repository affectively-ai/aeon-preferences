import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { AeonPreferences, DEFAULT_PREFERENCES } from './schema';
import { PreferencesStore, InMemoryPreferencesStore } from './store';

const PreferencesContext = createContext<{
  preferences: AeonPreferences;
  updatePreferences: (partial: Partial<AeonPreferences>) => Promise<void>;
} | null>(null);

const fallbackPreferencesContext = {
  preferences: DEFAULT_PREFERENCES,
  updatePreferences: async () => undefined,
};

export function PreferencesProvider({
  store = new InMemoryPreferencesStore(),
  children,
}: {
  store?: PreferencesStore;
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] = useState<AeonPreferences>(
    store.getPreferences()
  );

  useEffect(() => {
    return store.subscribe((newPrefs) => {
      setPreferences(newPrefs);
    });
  }, [store]);

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences: (partial: Partial<AeonPreferences>) =>
        store.updatePreferences(partial),
    }),
    [preferences, store]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function useAeonPreferences() {
  const context = useContext(PreferencesContext);
  return context ?? fallbackPreferencesContext;
}
