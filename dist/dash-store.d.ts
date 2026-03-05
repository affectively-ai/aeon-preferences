import { AeonPreferences } from './schema';
import { PreferencesStore } from './store';
export interface UcanToken {
    token: string;
}
export interface ZkKeypair {
    publicKey: string;
    privateKey: string;
}
export interface DashPreferencesStoreOptions {
    relayClient: any;
    ucan: UcanToken;
    zkKeys?: ZkKeypair;
    graphPath?: string;
}
export declare class DashPreferencesStore implements PreferencesStore {
    private prefs;
    private listeners;
    private relayClient;
    private ucan;
    private zkKeys?;
    private graphPath;
    constructor(options: DashPreferencesStoreOptions);
    getPreferences(): AeonPreferences;
    updatePreferences(partial: Partial<AeonPreferences>): Promise<void>;
    subscribe(callback: (prefs: AeonPreferences) => void): () => void;
    private notify;
    private verifyCapability;
    private encrypt;
}
