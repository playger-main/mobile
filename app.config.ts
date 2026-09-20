// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): { expo: ExpoConfig } => ({
  expo: {
    // Базовые настройки
    name: 'playg-mobile',
    slug: 'playg-mobile',
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
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
    },

    // Настройки платформы iOS
    ios: {
      bundleIdentifier: 'com.dziforge.playg',
      buildNumber: '1',
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
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
        projectId: '2ef31943-3815-43fd-bf34-534f068c8018', 
      },
    },
  },
});
