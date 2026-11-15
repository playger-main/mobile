// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): { expo: ExpoConfig } => ({
  expo: {
    // Базовые настройки
    // ✅ name — отображаемое имя приложения (под иконкой на устройстве и в
    // App Store Connect для новой сборки). Само имя в App Store задаётся в
    // App Store Connect → App Information, код на уже созданную карточку не влияет.
    name: 'PlayG',
    slug: 'playg',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'playgmobile',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',

    // Настройки статус-бара и платформы Android
    androidStatusBar: {
      barStyle: 'light-content',
    },
    android: {
      package: 'com.dziforge.playg',
      versionCode: 1,
      predictiveBackGestureEnabled: false,
      // ✅ P2: без этого ключа react-native-maps на Android рисует пустую карту
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
    },

    // Настройки платформы iOS
    ios: {
      bundleIdentifier: 'com.dziforge.playg',
      buildNumber: '1',
      supportsTablet: false,
      // ✅ P2: ключ для Google Maps на iOS (provider=google)
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          'PlayG uses your location to show grounds near you.',
      },
    },

    // Конфигурация веб-платформы
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },

    // Обновления и эксперименты (Включая компилятор React)
    updates: {
      enabled: true,
      fallbackToCacheTimeout: 0,
    },
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    // Список плагинов
    plugins: [
      'expo-router',
      '@react-native-vector-icons/material-design-icons',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#208AEF',
          image: './assets/images/splash-icon.png',
          imageWidth: 76,
        },
      ],
      [
        'expo-build-properties',
        {
          android: {
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            buildToolsVersion: '36.0.0',
          },
          ios: {
            deploymentTarget: '16.4',
          },
        },
      ],
    ],

    // Динамические переменные окружения
    extra: {      
      APP_ENV: process.env.APP_ENV ?? 'dev',
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: 'a339d70e-8003-4682-9a6b-97655045dce0', 
      },
    },
  },
});
