// src/app/(drawer)/(tabs)/_layout.tsx
import React from 'react';
import { Tabs, useNavigation } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import { DrawerActions } from 'expo-router/react-navigation';

import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const renderDrawerButton = () => (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={({ pressed }) => [
        styles.tabMenuButton,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Ionicons name="menu-outline" size={24} color={colors.textPrimary} />
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerLeft: () => renderDrawerButton(),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarButton: (props: any) => {
          const { children, onPress, style } = props;
          return (
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: pressed
                    ? colors.surfaceSecondary
                    : 'transparent',
                },
                style,
              ]}
              android_ripple={null}
            >
              {children}
            </Pressable>
          );
        },
        tabBarStyle: {
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
          elevation: 2,
          shadowOpacity: 0.05,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tab.grounds'),
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: t('tab.events'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tab.profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabMenuButton: {
    position: 'absolute',
    top: 0,
    left: 16,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 99,
  },
});