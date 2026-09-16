import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
// ✅ Импортируем Ionicons для иконок в боковом меню
import { Ionicons } from '@expo/vector-icons';

function CustomDrawerContent() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.drawerRoot, { paddingTop: insets.top }]} edges={[]}>      
      <View style={styles.appHeader}>
        <Text style={styles.appName}>PlayG</Text>           
        <Text style={styles.appSubtitle}>Sport app (v_1.0)</Text>
      </View>
      {/* Здесь при необходимости можно отрендерить кастомный список кнопок, 
          но встроенный механизм Drawer.Screen ниже автоматически добавит пункты в меню */}
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerType: 'front',
        drawerStyle: { backgroundColor: '#FFFFFF', width: 255 },
        drawerActiveTintColor: '#208AEF',   // Цвет активного пункта в меню
        drawerInactiveTintColor: '#6080A8', // Цвет неактивного пункта
      }}
    >
      {/* 1. Главный пункт меню, ведущий на нижние вкладки (Tabs) */}
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Home',
          headerTitle: 'PlayG', // Заголовок в верхней шапке приложения
          headerShadowVisible: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }} 
      />

      {/* 2. Пункт меню Settings */}
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          headerTitle: 'Settings',
          headerShadowVisible: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }} 
      />

      {/* 3. Пункт меню About */}
      <Drawer.Screen 
        name="about" 
        options={{ 
          title: 'About',
          headerTitle: 'About',
          headerShadowVisible: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }} 
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerRoot: { flex: 1, backgroundColor: '#EEF7F5' },
  appHeader: { marginBottom: 16, paddingHorizontal: 16, paddingTop: 16 },
  appName: { fontSize: 20, fontWeight: 'bold', color: '#334A77' },
  appSubtitle: { marginTop: 2, fontSize: 12, color: '#6080A8' },
});
