import { AppState } from 'react-native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { superbaseAnonKey, superbaseUrl } from '../constants';

// Detect if running on web
const isWeb = typeof window !== "undefined";

// Use AsyncStorage only if it's available (for React Native)
let storage;
if (!isWeb) {
  try {
    storage = require("@react-native-async-storage/async-storage").default;
  } catch (error) {
    console.warn("AsyncStorage not available, using default storage");
  }
} else {
  storage = window.localStorage;
}

export const supabase = createClient(superbaseUrl, superbaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Only use AppState in React Native
if (!isWeb) {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
