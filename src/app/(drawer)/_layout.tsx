// src/app/(drawer)/_layout.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { Drawer } from 'expo-router/drawer';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUnit } from 'effector-react';
// @ts-ignore
import {
  DrawerItemList,
  DrawerContentScrollView,
} from 'expo-router/drawer';

import { $userSession } from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const user = useUnit($userSession);

  const avatarLetter = user?.name?.charAt(0).toUpperCase() || '?';
  const hasAvatar = !!user?.avatar;

  const handleUserPress = () => {
    props.navigation.navigate('(tabs)', { screen: 'profile' });
  };

  const handleClose = () => {
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: 0,
        backgroundColor: colors.background,
      }}
    >
      <SafeAreaView
        style={[styles.drawerRoot, { paddingTop: insets.top + 8 }]}
        edges={[]}
      >
        {/* ===== HEADER: PlayG + X ===== */}
        <View style={styles.appHeader}>
          <View style={styles.headerLeft}>
            <View
              style={[styles.logoBox, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="basketball" size={20} color="#FFFFFF" />
            </View>
            <Text style={[styles.appName, { color: colors.textPrimary }]}>
              PlayG
            </Text>
          </View>

          <Pressable
            onPress={handleClose}
            hitSlop={12}
            style={({ pressed }) => [
              styles.closeButton,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* ===== USER CARD ===== */}
        <Pressable
          onPress={handleUserPress}
          style={({ pressed }) => [
            styles.userCard,
            {
              // backgroundColor: colors.listBackground,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          {hasAvatar ? (
            <Image
              key={user!.avatar!}
              source={{ uri: user!.avatar! }}
              style={[
                styles.userAvatar,
                { backgroundColor: colors.surfaceSecondary },
              ]}
            />
          ) : user ? (
            <View
              style={[styles.userAvatar, { backgroundColor: colors.primary, borderColor: colors.border, borderWidth: 1 }]}
            >
              <Text style={styles.userAvatarText}>{avatarLetter}</Text>
            </View>
          ) : (
            <View
              style={[
                styles.userAvatar,
                { backgroundColor: colors.surfaceSecondary, borderColor: colors.border, borderWidth: 1 },
              ]}
            >
              <Ionicons
                name="log-in-outline"
                size={22}
                color={colors.textSecondary}
              />
            </View>
          )}

          <View style={styles.userInfo}>
            <Text
              style={[styles.userName, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {user?.name || t('drawer.guest')}
            </Text>
            <Text
              style={[styles.userSubtitle, { color: colors.textTertiary }]}
              numberOfLines={1}
            >
              {user?.email || t('drawer.tapToSignIn')}
            </Text>
          </View>
        </Pressable>

        {/* ===== NAV ITEMS ===== */}
        <View style={styles.menuItemsContainer}>
          <DrawerItemList {...props} />
        </View>

        {/* ===== SPACER (толкает версию вниз) ===== */}
        <View style={styles.flexSpacer} />

        {/* ===== VERSION (прижат к низу) ===== */}
        <View
          style={[
            styles.versionWrapper
          ]}
        >
          <Text style={[styles.versionText, { color: colors.textTertiary }]}>
            {t('drawer.version')}
          </Text>
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
          width: 280,
        },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primaryBg,
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 4,
        },
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
          marginLeft: -8,
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

  // ===== HEADER =====
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  closeButton: { padding: 4 },

  // ===== USER CARD =====
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 14,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 15,
    fontWeight: '700',
  },
  userSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },

  // ===== MENU =====
  menuItemsContainer: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },

  // ===== SPACER =====
  flexSpacer: { flex: 1 },

  // ===== VERSION =====
  versionWrapper: {
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center'
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // ===== GLOBAL MENU BUTTON (на экранах) =====
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