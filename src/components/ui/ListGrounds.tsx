// src/components/ui/ListGrounds.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import CardGround, { ExtendedGroundItem } from './CardGround';
import CategorySport from './CategorySport';

import { fetchGroundsFx } from '@/effector/events/async/grounds';
import {
  $grounds,
  $isGroundsLoading,
  $searchQuery,
  $selectedCategory,
  $userSession,
  $pendingGrounds,
} from '@/effector/store';
import { setSelectedCategory } from '@/effector/events/sync';

interface ListGroundsProps {
  onItemPress: (item: ExtendedGroundItem) => void;
  onToggleFavorite: (id: string) => void;
}

export default function ListGrounds({ onItemPress, onToggleFavorite }: ListGroundsProps) {
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    grounds,
    isLoading,
    searchQuery,
    selectedCategory,
    changeCategory,
    user,
    pendingCount,
  } = useUnit({
    grounds: $grounds,
    isLoading: $isGroundsLoading,
    searchQuery: $searchQuery,
    selectedCategory: $selectedCategory,
    changeCategory: setSelectedCategory,
    user: $userSession,
    pendingCount: $pendingGrounds.map((p) => p.length),
  });

  // ✅ Проверка роли модератора/админа
  const isModerator =
    user?.role?.includes('moderator') || user?.role?.includes('admin');

  useEffect(() => {
    fetchGroundsFx({
      kindofsport: selectedCategory === 'all' ? undefined : selectedCategory,
      search: searchQuery.trim() || undefined,
    });
  }, [selectedCategory, searchQuery]);

  // ✅ Безопасный переход на создание площадки
  const handleAddGroundPress = () => {
    if (user) {
      router.push('/ground/create');
    } else {
      Alert.alert(
        'Authentication Required',
        'Please sign in or create an account to add a new ground to the community.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign In',
            onPress: () => router.push('/(drawer)/(tabs)/profile'),
          },
        ],
      );
    }
  };

  // ✅ Переход на экран модерации
  const handleModerationPress = () => {
    router.push('/ground/moderation');
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <Text style={styles.countText}>{grounds.length} grounds nearby</Text>
        <Text style={styles.sortText}>By distance</Text>
      </View>

      {!isWeb && (
        <View style={styles.categoriesWrapper}>
          <CategorySport
            selectedKindofsport={selectedCategory}
            onSelectKindofsport={changeCategory}
          />
        </View>
      )}
    </View>
  );

  if (isLoading && grounds.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isWeb ? styles.containerWeb : styles.containerMobile]}>
      {isWeb ? (
        <View style={styles.webListContent}>
          {grounds.map((item) => (
            <CardGround
              key={item.id}
              item={item}
              onPress={() => onItemPress(item)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </View>
      ) : (
        <>
          <BottomSheetFlatList
            data={grounds}
            keyExtractor={(item: ExtendedGroundItem) => item.id}
            ListHeaderComponent={renderHeader}
            renderItem={({ item }: { item: ExtendedGroundItem }) => (
              <CardGround
                item={item}
                onPress={() => onItemPress(item)}
                onToggleFavorite={onToggleFavorite}
              />
            )}
            showsVerticalScrollIndicator={false}
            bounces={true}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + 80 },
            ]}
          />

          {/* ✅ FAB "Add ground" — всегда виден авторизованным пользователям */}
          <Pressable
            style={({ pressed }) => [
              styles.fabButton,
              {
                bottom: isModerator && pendingCount > 0 ? insets.bottom + 88 : insets.bottom + 16,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={handleAddGroundPress}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </Pressable>

          {/* ✅ FAB "Moderation" — только для модераторов/админов с бейджем */}
          {isModerator && (
            <Pressable
              style={({ pressed }) => [
                styles.fabButton,
                styles.fabModeration,
                {
                  bottom: insets.bottom + 16,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={handleModerationPress}
            >
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />

              {pendingCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  containerMobile: { backgroundColor: 'transparent' },
  containerWeb: { flex: 0, height: 'auto', paddingTop: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { backgroundColor: 'transparent', paddingTop: 0, marginBottom: 8 },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoriesWrapper: { marginLeft: -16, marginRight: -16, paddingBottom: 4 },
  countText: { fontSize: 16, fontWeight: '700', color: '#334A77' },
  sortText: { fontSize: 13, color: '#6080A8', fontWeight: '500' },
  listContent: { paddingBottom: 20 },
  webListContent: { width: '100%', paddingBottom: 32 },

  // ✅ Стили для плавающих кнопок
  fabButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    backgroundColor: '#208AEF',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#208AEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },

  // ✅ Оранжевый цвет для кнопки модерации
  fabModeration: {
    backgroundColor: '#FF8000',
    shadowColor: '#FF8000',
  },

  // ✅ Бейдж с количеством pending
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});