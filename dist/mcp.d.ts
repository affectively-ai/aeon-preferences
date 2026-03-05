import { z } from 'zod';
import { PreferencesStore } from './store';
export declare function createPreferencesMcpTools(store: PreferencesStore): ({
    name: string;
    description: string;
    parameters: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
    execute: () => Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
} | {
    name: string;
    description: string;
    parameters: z.ZodObject<{
        preferences: z.ZodObject<{
            theme: z.ZodOptional<z.ZodDefault<z.ZodObject<{
                mode: z.ZodDefault<z.ZodEnum<["light", "dark", "system"]>>;
                cssOverrides: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                mode?: "light" | "dark" | "system";
                cssOverrides?: string;
            }, {
                mode?: "light" | "dark" | "system";
                cssOverrides?: string;
            }>>>;
            security: z.ZodOptional<z.ZodDefault<z.ZodObject<{
                disabledApps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                disabledMcps: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
                blockedSites: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                disabledApps?: string[];
                disabledMcps?: string[];
                blockedSites?: string[];
            }, {
                disabledApps?: string[];
                disabledMcps?: string[];
                blockedSites?: string[];
            }>>>;
            stargate: z.ZodOptional<z.ZodDefault<z.ZodObject<{
                autoConnect: z.ZodDefault<z.ZodBoolean>;
                defaultRelay: z.ZodOptional<z.ZodString>;
                trustedNodes: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            }, "strip", z.ZodTypeAny, {
                autoConnect?: boolean;
                defaultRelay?: string;
                trustedNodes?: string[];
            }, {
                autoConnect?: boolean;
                defaultRelay?: string;
                trustedNodes?: string[];
            }>>>;
            locale: z.ZodOptional<z.ZodDefault<z.ZodObject<{
                timezone: z.ZodOptional<z.ZodString>;
                language: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                timezone?: string;
                language?: string;
            }, {
                timezone?: string;
                language?: string;
            }>>>;
            agent: z.ZodOptional<z.ZodDefault<z.ZodObject<{
                persona: z.ZodOptional<z.ZodString>;
                pronouns: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                persona?: string;
                pronouns?: string;
            }, {
                persona?: string;
                pronouns?: string;
            }>>>;
            custom: z.ZodOptional<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
        }, "strip", z.ZodTypeAny, {
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
            custom?: Record<string, unknown>;
        }, {
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
            custom?: Record<string, unknown>;
        }>;
    }, "strip", z.ZodTypeAny, {
        preferences?: {
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
            custom?: Record<string, unknown>;
        };
    }, {
        preferences?: {
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
            custom?: Record<string, unknown>;
        };
    }>;
    execute: (args: {
        preferences: any;
    }) => Promise<{
        content: {
            type: string;
            text: string;
        }[];
        isError?: undefined;
    } | {
        isError: boolean;
        content: {
            type: string;
            text: string;
        }[];
    }>;
})[];
