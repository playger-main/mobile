// src/app/_layout.tsx
import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  AppState,
  Appearance,
  LogBox,
} from 'react-native';
import {
  Stack,
  ThemeProvider,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  router,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import KeyboardDoneButton from '@/components/ui/KeyboardDoneButton';
import { useFonts } from 'expo-font';
import Ionicons from "@react-native-vector-icons/ionicons";
import { useUnit } from 'effector-react';

import {
  hydrateSessionFx,
  $isHydrating,
  hydrateSettingsFx,
  fetchGroundsFx,
  fetchAllEventsFx,
  fetchMyProfileFx,
  requestUserLocationFx,
  checkLocationPermissionFx,
  detectCityFx,
  $userSession,
  $appLanguage,
  $useLocation,
} from '@/effector/store';
import { sessionExpired } from '@/effector/events/sync';

import { DEFAULT_CITY_CENTER } from '@/constants/location';
import { registerCalendarLocales, setCalendarLocale } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

registerCalendarLocales();

SplashScreen.preventAutoHideAsync().catch(() => {});

if (__DEV__) {
  /**
   * ✅ Reanimated 4 на нативе предупреждает, если в `useAnimatedProps` передан
   * массив зависимостей (этот параметр нужен только для web). Так делают
   * библиотеки, а не наш код:
   *   - `react-native-drawer-layout` (drawer из React Navigation) — (updater, [progress]);
   *   - `@gorhom/bottom-sheet` — в scrollable/refresh-control.
   * На нативе зависимости игнорируются, поведение не меняется — это шум,
   * который повторяется на каждый ререндер. Фильтруем только это сообщение,
   * остальные предупреждения остаются видимыми.
   */
  const originalWarn = console.warn;
  console.warn = ((...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === 'string' &&
      first.includes('Dependencies should only be used on the web')
    ) {
      return;
    }
    originalWarn(...(args as Parameters<typeof console.warn>));
  }) as typeof console.warn;
}
LogBox.ignoreLogs([
  '[Reanimated] Dependencies should only be used on the web and are always ignored on native. Check DevTools to see the offending code.',
]);

export default function RootLayout() {
  const { isHydrating } = useUnit({ isHydrating: $isHydrating });
  const appLanguage = useUnit($appLanguage);

  const { theme, colors, mode } = useTheme();

  const [fontsLoaded, fontError] = useFonts({});

  // ✅ Синхронизация локали календаря с языком
  useEffect(() => {
    setCalendarLocale(appLanguage);
  }, [appLanguage]);

  // ✅ P2-fix: в режиме «как в системе» нативную тему не фиксируем, иначе
  // iOS перестаёт реагировать на смену системной темы после первого рендера.
  // 'unspecified' снимает override (тип ColorSchemeOverride не допускает null).
  useEffect(() => {
    Appearance.setColorScheme(mode === 'system' ? 'unspecified' : theme);
  }, [theme, mode]);

  // ✅ Гидратация при старте
  useEffect(() => {
    (async () => {
      await hydrateSessionFx();
      hydrateSettingsFx();

      // ✅ профиль нужен сразу: в нём дата/версия согласия с документами
      if ($userSession.getState()) fetchMyProfileFx();
    })();

    (async () => {
      try {
        // ✅ Пользователь выключил геолокацию в настройках — не запрашиваем её
        if (!$useLocation.getState()) {
          detectCityFx(DEFAULT_CITY_CENTER);
          return;
        }

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

  // ✅ №23: sessionExpired → редирект на профиль (там покажется welcome/auth)
  useEffect(() => {
    const unsubscribe = sessionExpired.watch(() => {
      try {
        router.replace('/(drawer)/(tabs)/profile');
      } catch (e) {
        console.warn('[sessionExpired] router.replace failed:', e);
      }
    });
    return () => unsubscribe();
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
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="ground/[id]" />
          <Stack.Screen name="ground/create" />
          <Stack.Screen name="ground/edit" />
          <Stack.Screen name="ground/moderation" />
      <Stack.Screen name="moderation/reports" />
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
        
        {/* ✅ Глобальная кнопка закрытия клавиатуры */}
        <KeyboardDoneButton />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}