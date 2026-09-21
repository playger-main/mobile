import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
// @ts-ignore
import { DrawerActions } from 'expo-router/react-navigation';

interface SearchGroundsProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchGrounds({ value, onChangeText }: SearchGroundsProps) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.outerWrapper} edges={[]}>
      <Pressable 
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={({ pressed }) => [
          styles.menuButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <Ionicons name="menu-outline" size={24} color="#334A77" />
      </Pressable>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6080A8" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search grounds or area"
          placeholderTextColor="#6080A8"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
    gap: 12,
  },
  menuButton: {
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
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#334A77',
    fontWeight: '400',
  },
});
