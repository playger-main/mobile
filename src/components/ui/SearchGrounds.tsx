// src/components/ui/SearchGrounds.tsx
import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
// @ts-ignore
import { DrawerActions } from 'expo-router/react-navigation';

import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface SearchGroundsProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchGrounds({ value, onChangeText }: SearchGroundsProps) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={styles.outerWrapper} edges={[]}>
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={({ pressed }) => [
          styles.menuButton,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Ionicons name="menu-outline" size={24} color={colors.textPrimary} />
      </Pressable>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, { color: colors.textPrimary }]}
          placeholder={t('grounds.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
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
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: { marginRight: 8 },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
  },
});