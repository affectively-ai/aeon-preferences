import { z } from 'zod';
import { AeonPreferencesSchema } from './schema';
import { PreferencesStore } from './store';

export function createPreferencesMcpTools(store: PreferencesStore) {
  return [
    {
      name: 'get_aeon_preferences',
      description:
        "Retrieve the current user's federated Aeon ecosystem preferences, including theme, security blocklists, stargate configuration, locale, agent settings, and custom key/value pairs.",
      parameters: z.object({}),
      execute: async () => {
        const prefs = store.getPreferences();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(prefs, null, 2),
            },
          ],
        };
      },
    },
    {
      name: 'update_aeon_preferences',
      description:
        "Update the current user's federated Aeon ecosystem preferences. Accepts a partial preference object. Requires UCAN delegated authority in a federated environment.",
      parameters: z.object({
        preferences: AeonPreferencesSchema.partial().describe(
          'A partial object containing the preferences to update. Can include deeply nested objects like theme.mode or custom key/value pairs.'
        ),
      }),
      execute: async (args: { preferences: any }) => {
        try {
          await store.updatePreferences(args.preferences);
          const updatedPrefs = store.getPreferences();
          return {
            content: [
              {
                type: 'text',
                text: `Preferences successfully updated.\n\nCurrent state:\n${JSON.stringify(
                  updatedPrefs,
                  null,
                  2
                )}`,
              },
            ],
          };
        } catch (err: any) {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Failed to update preferences: ${err.message}`,
              },
            ],
          };
        }
      },
    },
  ];
}
