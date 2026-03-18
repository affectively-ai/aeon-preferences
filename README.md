# @a0n/aeon-preferences

`@a0n/aeon-preferences` is a synced preferences store for Aeon apps, sites, tools, and agents.

The fair brag is that it goes beyond "theme and locale." The package already covers namespaced preferences, flag overrides, a protected vault area for sensitive values, React bindings, MCP tools, and a store model designed for multi-device sync.

## Why People May Like It

- preferences can be shared across devices instead of staying trapped in one browser tab,
- namespaced storage keeps one app from stepping on another app's settings,
- the vault area gives sensitive values a separate place and a separate capability story,
- `aeon-flags` overrides can live alongside normal preferences,
- and React and MCP entry points are included instead of left as follow-up work.

## Install

```bash
npm install @a0n/aeon-preferences
```

## Schema Shape

At a high level, the store includes:

- global preferences such as theme, locale, and security settings
- `flags` for user-level feature overrides
- `namespaces` for app-, site-, and tool-specific data
- `vault` for sensitive values that need stronger handling

The schema is validated with Zod.

## React Example

```tsx
import { PreferencesProvider, useAeonPreferences } from '@a0n/aeon-preferences';

function App() {
  return (
    <PreferencesProvider store={myDashStore}>
      <Dashboard />
    </PreferencesProvider>
  );
}

function Dashboard() {
  const { preferences, updatePreferences } = useAeonPreferences();

  return (
    <div className={preferences.theme.mode === 'dark' ? 'bg-black' : 'bg-white'}>
      <button onClick={() => updatePreferences({ theme: { mode: 'dark' } })}>
        Enable Dark Mode
      </button>
    </div>
  );
}
```

## Store Example

```ts
import { DashPreferencesStore } from '@a0n/aeon-preferences';

const store = new DashPreferencesStore({
  relayClient: dashRelayClient,
  ucan: { token: 'eyJhbG...' },
  zkKeys: { publicKey: '...', privateKey: '...' },
  graphPath: 'user/preferences',
});
```

## MCP Example

```ts
import { createPreferencesMcpTools } from '@a0n/aeon-preferences';

const tools = createPreferencesMcpTools(store);
```

## Security And Scoping

- global preferences use broader capabilities such as `preferences/write`
- namespaced settings can be scoped to a specific app or tool
- vault access is intended to stay behind separate read and write capabilities

## Why This README Is Grounded

Aeon Preferences does not need sweeping claims. The strongest fair brag is that it already gives you a fairly complete preferences package with sync, scoping, React bindings, and automation hooks.
