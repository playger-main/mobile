// src/app/(drawer)/_layout.tsx
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import { DrawerItemList, DrawerContentScrollView } from 'expo-router/drawer';

import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 0, backgroundColor: colors.background }}
    >
      <SafeAreaView
        style={[styles.drawerRoot, { paddingTop: insets.top }]}
        edges={[]}
      >
        <View
          style={[
            styles.appHeader,
            { borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.appName, { color: colors.textPrimary }]}>
            PlayG
          </Text>
        </View>
        <View style={styles.menuItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerType: 'front',
        drawerStyle: {
          backgroundColor: colors.background,
          width: 255,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primaryBg,
        drawerItemStyle: { borderRadius: 8 },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          marginLeft: -10,
        },
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={({ pressed }) => [
              styles.globalMenuButton,
              {
                backgroundColor: colors.surface,
                shadowColor: colors.shadow,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="menu-outline"
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
        ),
      })}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: t('drawer.mainHub'),
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: t('drawer.settings'),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: t('drawer.about'),
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerRoot: { flex: 1 },
  appHeader: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  appName: { fontSize: 22, fontWeight: 'bold' },
  menuItemsContainer: { paddingTop: 12, paddingHorizontal: 8 },
  globalMenuButton: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 99,
  },
});