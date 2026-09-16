import React from 'react';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// ✅ Импортируем Ionicons из встроенного пакета Expo
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Хедер управляется на уровне Drawer
        tabBarActiveTintColor: '#208AEF',   // Цвет иконки и текста активной вкладки
        tabBarInactiveTintColor: '#6080A8', // Цвет неактивной вкладки
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarStyle: {
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
          borderTopWidth: 1,
          borderTopColor: '#E6F4FE',
          backgroundColor: '#FFFFFF',
          elevation: 2,
          shadowOpacity: 0.05,
        },
      }}
    >
      {/* 1. Вкладка Grounds */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Grounds',
          tabBarIcon: ({ color, focused }) => (
            // Используем иконку карты/стадиона. Залитая, если активна, контурная — если нет.
            <Ionicons 
              name={focused ? 'map' : 'map-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 2. Вкладка Events */}
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            // Иконка календаря для спортивных событий
            <Ionicons 
              name={focused ? 'calendar' : 'calendar-outline'} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />

      {/* 3. Вкладка Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            // Иконка пользователя для личного кабинета
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
