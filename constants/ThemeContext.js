import React, { createContext, useContext, useState, useEffect } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const THEME_KEY = '@laundry_app_theme';

// Tema Gelap (Original)
const darkTheme = {
  bg: '#1A1F1A',           // Background sangat gelap dengan semburat hijau
  card: '#222822',         // Warna dasar komponen (kartu)
  accent: '#C5E636',       // Aksen Hijau/Lime cerah
  textPrimary: '#FFFFFF',  // Teks utama putih
  textSecondary: '#A0A89A',// Teks deskripsi / sekunder
  border: '#2E332E',       // Garis border pemisah
  accentText: '#000000',   // Teks di dalam warna aksen (misal di atas tombol)
  isDark: true,
};

// Tema Terang
const lightTheme = {
  bg: '#F8FAFC',           // Abu-abu sangat terang (Slate 50)
  card: '#FFFFFF',         // Putih murni
  accent: '#38BDF8',       // Ocean Blue cerah (Sky 400)
  textPrimary: '#0F172A',  // Hitam/Slate pekat
  textSecondary: '#64748B',// Abu-abu netral
  border: '#E2E8F0',       // Garis tepi halus
  accentText: '#000000',
  isDark: false,
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Baca preferensi tema dari AsyncStorage saat app dibuka
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY)
      .then((value) => {
        if (value !== null) {
          setIsDark(value === 'dark');
        }
      })
      .catch(() => {})
      .finally(() => setIsLoaded(true));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    
    // Konfigurasi animasi yang lebih halus dan lebih lama (500ms)
    LayoutAnimation.configureNext({
      duration: 500,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    
    setIsDark(next);
    // Simpan ke AsyncStorage
    AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light').catch(() => {});
  };

  const themeColors = isDark ? darkTheme : lightTheme;

  // Jangan render anak-anak sampai tema selesai dimuat (hindari flash)
  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider value={{ Colors: themeColors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom Hook untuk digunakan di semua halaman
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

