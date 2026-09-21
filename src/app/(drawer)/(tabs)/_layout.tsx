import React from 'react';
import { Tabs, useNavigation } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// @ts-ignore
import { DrawerActions } from 'expo-router/react-navigation';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderDrawerButton = () => (
    <Pressable 
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={({ pressed }) => [
        styles.tabMenuButton,
        { opacity: pressed ? 0.7 : 1 }
      ]}
    >
      <Ionicons name="menu-outline" size={24} color="#334A77" />
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
        tabBarActiveTintColor: '#208AEF',   
        tabBarInactiveTintColor: '#6080A8', 
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },        
        tabBarButton: (props: any) => {
          const { children, onPress, style } = props;
          return (
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                { flex: 1, backgroundColor: pressed ? '#ffffff0d' : 'transparent' },
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
          borderTopColor: '#E6F4FE',
          backgroundColor: '#FFFFFF',
          elevation: 2,
          shadowOpacity: 0.05,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Grounds',
          headerShown: false, // На Grounds хедер выключен, так как кнопка встроена внутрь поиска
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabMenuButton: {
    position: "absolute",
    top: 0,
    left: 16,
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 99,
  },
});
