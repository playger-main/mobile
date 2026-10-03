// src/app/_layout.tsx
import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  AppState,
  Appearance,               // ✅ NEW
} from 'react-native';
import {
  Stack,
  ThemeProvider,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';

import {
  hydrateSessionFx,
  $isHydrating,
  hydrateSettingsFx,
  fetchGroundsFx,
  fetchAllEventsFx,
  requestUserLocationFx,
  checkLocationPermissionFx,
  detectCityFx,
  $appLanguage,
} from '@/effector/store';

import { DEFAULT_CITY_CENTER } from '@/constants/location';
import { registerCalendarLocales, setCalendarLocale } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

registerCalendarLocales();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { isHydrating } = useUnit({ isHydrating: $isHydrating });
  const appLanguage = useUnit($appLanguage);

  // ✅ Тема приложения
  const { theme, colors } = useTheme();

  const [fontsLoaded, fontError] = useFonts({
    ...Ionicons.font,
  });

  // ✅ Синхронизация локали календаря с языком
  useEffect(() => {
    setCalendarLocale(appLanguage);
  }, [appLanguage]);

  // ✅ NEW: синхронизируем нативную тему (Alert, клавиатура, системные пикеры)
  // с нашей темой приложения
  useEffect(() => {
    Appearance.setColorScheme(theme);
  }, [theme]);

  // ✅ Гидратация при старте
  useEffect(() => {
    hydrateSessionFx();
    hydrateSettingsFx();

    (async () => {
      try {
        const status = await checkLocationPermissionFx();
        if (status === 'denied') return;

        const result = await requestUserLocationFx();
        if (result?.location) {
          detectCityFx(result.location);
        } else {
          detectCityFx(DEFAULT_CITY_CENTER);
        }
      } catch {}
    })();
  }, []);

  // ✅ AppState
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        hydrateSessionFx();
        fetchGroundsFx();
        fetchAllEventsFx();
      }
    });
    return () => subscription.remove();
  }, []);

  // ✅ Splash Screen
  useEffect(() => {
    const assetsReady = fontsLoaded || fontError;
    if (assetsReady && !isHydrating) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError, isHydrating]);

  if ((!fontsLoaded && !fontError) || isHydrating) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const navTheme = {
    ...(theme === 'dark' ? NavDarkTheme : NavLightTheme),
    colors: {
      ...(theme === 'dark' ? NavDarkTheme.colors : NavLightTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navTheme}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

        <Stack screenOptions={{ headerShown: false }}>
          {/* ...все Stack.Screen без изменений... */}
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="ground/[id]" />
          <Stack.Screen name="ground/create" />
          <Stack.Screen name="ground/edit" />
          <Stack.Screen name="ground/moderation" />
          <Stack.Screen name="reviews/ground/[id]" />
          <Stack.Screen name="event/[id]" />
          <Stack.Screen name="event/create" />
          <Stack.Screen name="event/edit" />
          <Stack.Screen name="user/[id]" />
          <Stack.Screen name="user/edit" />
          <Stack.Screen name="user/change-email" />
          <Stack.Screen name="user/joined" />
          <Stack.Screen name="user/favorites" />
          <Stack.Screen name="user/created" />
          <Stack.Screen name="user/reviews" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}