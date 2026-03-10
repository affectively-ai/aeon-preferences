import type { AeonPreferences } from './schema';
export declare const GENESIS_NAMESPACE_KEY = "app://shell.aeonflux.dev/genesis";
export type GenesisPreferenceLens = 'blend' | 'semantic' | 'affective' | 'social' | 'spatial' | 'temporal';
export type GenesisPreferenceMode = 'system1' | 'system2';
export interface GenesisDefaultsPreference {
    lens: GenesisPreferenceLens;
    mode: GenesisPreferenceMode;
    motionScale: number;
    showContours: boolean;
    autoCollapseOnSelect: boolean;
}
export interface GenesisBookmarkPreference {
    id: string;
    label: string;
    lens: GenesisPreferenceLens;
    mode: GenesisPreferenceMode;
    focusEntityId?: string;
    focusAddress?: string;
    snapshotRoot?: string;
    query?: string;
    createdAt: number;
}
export interface GenesisImpulsePreference {
    id: string;
    kind: 'attractor' | 'repulsor' | 'shear' | 'freeze' | 'damp' | 'amplify';
    x: number;
    y: number;
    radius: number;
    strength: number;
    axis?: 'x' | 'y';
    createdAt: number;
}
export interface GenesisPresetPreference {
    id: string;
    label: string;
    focusAddress?: string;
    impulses: GenesisImpulsePreference[];
    createdAt: number;
    updatedAt: number;
}
export interface GenesisNamespacePreferences {
    defaults: GenesisDefaultsPreference;
    bookmarks: GenesisBookmarkPreference[];
    presets: GenesisPresetPreference[];
}
export declare const DEFAULT_GENESIS_PREFERENCES: GenesisNamespacePreferences;
export declare function readGenesisPreferences(preferences: AeonPreferences | null | undefined): GenesisNamespacePreferences;
export declare function mergeGenesisPreferences(preferences: AeonPreferences | null | undefined, partial: Partial<GenesisNamespacePreferences>): Partial<AeonPreferences>;
