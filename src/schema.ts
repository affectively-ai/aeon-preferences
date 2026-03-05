import { z } from 'zod';

export const ThemeModeSchema = z.enum(['light', 'dark', 'system']);

export const StargateConfigSchema = z.object({
  autoConnect: z.boolean().default(true),
  defaultRelay: z.string().optional(),
  trustedNodes: z.array(z.string()).default([]),
});

export const AeonPreferencesSchema = z.object({
  theme: z.object({
    mode: ThemeModeSchema.default('system'),
    cssOverrides: z.string().optional(),
  }).default({}),
  security: z.object({
    disabledApps: z.array(z.string()).default([]),
    disabledMcps: z.array(z.string()).default([]),
    blockedSites: z.array(z.string()).default([]),
  }).default({}),
  stargate: StargateConfigSchema.default({}),
  locale: z.object({
    timezone: z.string().optional(),
    language: z.string().optional(),
  }).default({}),
  agent: z.object({
    persona: z.string().optional(),
    pronouns: z.string().optional(),
  }).default({}),
  
  // Goodchild / Feature Flags (Read-heavy, merged with global flags)
  flags: z.record(z.boolean()).default({}),

  // Granular hierarchical storage for Apps, Sites, and MCPs (e.g., "app://remote.fun.decoder")
  namespaces: z.record(z.any()).default({}),

  // Highly sensitive custodial wallets and keys.
  // MUST be ZK-encrypted before leaving the client.
  vault: z.record(z.string()).default({}), 
});

export type ThemeMode = z.infer<typeof ThemeModeSchema>;
export type StargateConfig = z.infer<typeof StargateConfigSchema>;
export type AeonPreferences = z.infer<typeof AeonPreferencesSchema>;

export const DEFAULT_PREFERENCES: AeonPreferences = AeonPreferencesSchema.parse({});
