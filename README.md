# @affectively/aeon-preferences

A unified, federated user preferences store for the entire Aeon ecosystem. Backed by Dash DB (via `dashrelay`), it provides real-time, cross-device sync of user settings, access controls, entitlements, and highly sensitive encrypted custodial wallets.

## Features

- **Federated State:** Powered by Yjs and DashRelay. Update a preference on your phone, and it instantly applies to your desktop shell.
- **Granular Namespaces:** Strict path-based separation for Apps, Sites, and MCPs (e.g., `namespaces["app://remote.fun.language-decoder"]`). Games and tools can read/write their own isolated settings without polluting global state.
- **Zero-Knowledge Vault:** A dedicated `vault` namespace designed exclusively for highly sensitive data like Agent Wallets and Custodial Keys. Enforces client-side ZK-encryption before transmission to the relay.
- **UCAN Authorized:** Built from the ground up to support UCAN capability delegations. You can grant an Agent the `preferences/read` capability, or explicitly restrict a third-party app to `namespace/write:app://my-game`.
- **Goodchild Flags Integration:** Native support for merging global `aeon-flags` broadcasts with user-overridden feature flags.
- **React & MCP Ready:** Ships with a `<PreferencesProvider>` for instant React reactivity, and pre-built MCP tools (`get_aeon_preferences`, `update_aeon_preferences`) for immediate Agent integration.

## Installation

```bash
npm install @affectively/aeon-preferences
```

## Schema Overview

The federated graph is structured using strict Zod validation.

```typescript
export const AeonPreferencesSchema = z.object({
  theme: z.object({ mode: z.string(), cssOverrides: z.string() }),
  security: z.object({ disabledApps: z.array(z.string()), disabledMcps: z.array(z.string()) }),
  stargate: z.object({ autoConnect: z.boolean(), defaultRelay: z.string() }),
  locale: z.object({ timezone: z.string(), language: z.string() }),
  agent: z.object({ persona: z.string(), pronouns: z.string() }),
  
  // Feature Flags
  flags: z.record(z.boolean()),

  // Granular hierarchical storage for Apps, Sites, and MCPs
  namespaces: z.record(z.any()),

  // Highly sensitive custodial wallets and keys (Must be ZK-encrypted)
  vault: z.record(z.string()), 
});
```

## Usage

### 1. The React Provider

Wrap your application to make it reactive to the federated Dash DB.

```tsx
import { PreferencesProvider, useAeonPreferences } from '@affectively/aeon-preferences';
// ... initialization of DashPreferencesStore ...

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

### 2. The Federated Store (Dash DB)

Instantiate the store with your DashRelay client and UCAN token.

```typescript
import { DashPreferencesStore } from '@affectively/aeon-preferences';

const store = new DashPreferencesStore({
  relayClient: dashRelayClient,
  ucan: { token: 'eyJhbG...' }, // Requires 'preferences/write'
  zkKeys: { publicKey: '...', privateKey: '...' }, // Required for Vault access
  graphPath: 'user/preferences'
});
```

### 3. Agent Integration (MCP Tools)

Provide your AI Agents with direct access to user preferences.

```typescript
import { createPreferencesMcpTools } from '@affectively/aeon-preferences';

const tools = createPreferencesMcpTools(store);
// Register these tools with your MCP Server or Kernel
```

## Security & Scoping

- **Global vs Namespace:** Global preferences (`theme`, `locale`) require `preferences/write` capabilities. Applications should request scoped access like `namespace/write:app://my-game`.
- **The Vault:** Any interaction with the `vault` requires a distinct `vault/write` or `vault/read` UCAN capability, preventing rogue apps from accessing sensitive key material.

## License

UNLICENSED - Edgework DAO
