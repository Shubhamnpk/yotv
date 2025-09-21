import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CustomTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

interface WatchHistoryItem {
  channelId: string;
  timestamp: number;
}

interface PlayerSettings {
  autoplay: boolean;
  volume: number;
  quality: 'auto' | 'low' | 'medium' | 'high' | 'ultra';
  subtitles: boolean;
  subtitlesLanguage: string;
  loop: boolean;
  muted: boolean;
}

interface UISettings {
  gridSize: 'small' | 'medium' | 'large';
  animations: boolean;
  compactMode: boolean;
  showChannelLogos: boolean;
  showChannelNumbers: boolean;
}

interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  dataSharing: boolean;
}

interface Settings {
  theme: 'system' | 'dark-blue' | 'dark-purple' | 'dark-green' | 'dark-red' | 'dark-orange' | 'light-blue' | 'light-purple' | 'light-green' | 'light-red' | 'light-orange' | 'dark-brown' | 'light-brown';
  customThemes: CustomTheme[];
  activeCustomTheme?: string;
  preferredLanguages: string[];
  preferredCountries: string[];
  preferredCategories: string[];
  favorites: string[];
  watchHistory: WatchHistoryItem[];
  player: PlayerSettings;
  ui: UISettings;
  privacy: PrivacySettings;
}

interface Store {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  updatePlayerSettings: (playerSettings: Partial<PlayerSettings>) => void;
  updateUISettings: (uiSettings: Partial<UISettings>) => void;
  updatePrivacySettings: (privacySettings: Partial<PrivacySettings>) => void;
  toggleFavorite: (channelId: string) => void;
  addToWatchHistory: (channelId: string) => void;
  clearWatchHistory: () => void;
  removeFromWatchHistory: (channelId: string) => void;
  addCustomTheme: (theme: CustomTheme) => void;
  removeCustomTheme: (themeId: string) => void;
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      settings: {
        theme: 'system',
        customThemes: [],
        preferredLanguages: [],
        preferredCountries: [],
        preferredCategories: [],
        favorites: [],
        watchHistory: [],
        player: {
          autoplay: false,
          volume: 0.8,
          quality: 'auto',
          subtitles: false,
          subtitlesLanguage: 'en',
          loop: false,
          muted: false
        },
        ui: {
          gridSize: 'medium',
          animations: true,
          compactMode: false,
          showChannelLogos: true,
          showChannelNumbers: false
        },
        privacy: {
          analytics: true,
          crashReports: true,
          dataSharing: false
        }
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      toggleFavorite: (channelId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            favorites: state.settings.favorites.includes(channelId)
              ? state.settings.favorites.filter((id) => id !== channelId)
              : [...state.settings.favorites, channelId],
          },
        })),
      addToWatchHistory: (channelId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            watchHistory: [
              { channelId, timestamp: Date.now() },
              ...state.settings.watchHistory.filter(item => item.channelId !== channelId)
            ].slice(0, 50) // Keep only last 50 items
          }
        })),
      clearWatchHistory: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            watchHistory: []
          }
        })),
      removeFromWatchHistory: (channelId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            watchHistory: state.settings.watchHistory.filter(
              item => item.channelId !== channelId
            )
          }
        })),
      addCustomTheme: (theme) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customThemes: [...state.settings.customThemes, theme]
          }
        })),
      removeCustomTheme: (themeId) =>
        set((state) => ({
          settings: {
            ...state.settings,
            customThemes: state.settings.customThemes.filter(theme => theme.id !== themeId),
            activeCustomTheme: state.settings.activeCustomTheme === themeId
              ? undefined
              : state.settings.activeCustomTheme
          }
        })),
      updatePlayerSettings: (playerSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            player: { ...state.settings.player, ...playerSettings }
          }
        })),
      updateUISettings: (uiSettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ui: { ...state.settings.ui, ...uiSettings }
          }
        })),
      updatePrivacySettings: (privacySettings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            privacy: { ...state.settings.privacy, ...privacySettings }
          }
        }))
    }),
    {
      name: 'iptv-settings',
    }
  )
);

export default useStore;