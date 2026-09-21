import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import { DrawerItemList, DrawerContentScrollView } from 'expo-router/drawer';

function CustomDrawerContent(props: any) {
  const insets = useSafeAreaInsets();
  return (
    <DrawerContentScrollView 
      {...props} 
      contentContainerStyle={{ paddingTop: 0 }} 
    >
      <SafeAreaView style={[styles.drawerRoot, { paddingTop: insets.top }]} edges={[]}>      
        <View style={styles.appHeader}>
          <Text style={styles.appName}>PlayG</Text>                     
        </View>
        <View style={styles.menuItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        drawerType: 'front',
        drawerStyle: { backgroundColor: '#FFFFFF', width: 255 },
        drawerActiveTintColor: '#208AEF',   
        drawerInactiveTintColor: '#6080A8', 
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
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <Ionicons name="menu-outline" size={24} color="#334A77" />
          </Pressable>
        ),
      })}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
          title: 'Main Hub',
          headerShown: false, // Отключаем системный хедер, кнопка вшита в поиск на Grounds
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ 
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="about" 
        options={{ 
          title: 'About App',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
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
    borderBottomColor: '#E6F4FE',     
  },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#334A77' },
  appSubtitle: { marginTop: 2, fontSize: 12, color: '#6080A8', fontWeight: '500' },
  menuItemsContainer: { paddingTop: 12, paddingHorizontal: 8 },
  globalMenuButton: {
    position: "absolute",
    top: 0,
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 99,
  },
});
