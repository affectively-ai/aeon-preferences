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
    custom: z.record(z.unknown()).default({}),
});
export const DEFAULT_PREFERENCES = AeonPreferencesSchema.parse({});
//# sourceMappingURL=schema.js.map