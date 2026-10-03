// src/components/ui/ListGrounds.tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { useFocusEffect } from 'expo-router';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import CardGround, { ExtendedGroundItem } from './CardGround';
import CategorySport from './CategorySport';

import { fetchGroundsFx } from '@/effector/events/async/grounds';
import { fetchAllEventsFx } from '@/effector/events/async/events';
import {
  $grounds,
  $isGroundsLoading,
  $searchQuery,
  $selectedCategory,
  $userSession,
  $events,
} from '@/effector/store';
import { setSelectedCategory } from '@/effector/events/sync';

interface ListGroundsProps {
  onItemPress: (item: ExtendedGroundItem) => void;
  // ✅ Новая сигнатура
  onToggleFavorite: (groundId: string, isFavorite: boolean) => void;
}

export default function ListGrounds({
  onItemPress,
  onToggleFavorite,
}: ListGroundsProps) {
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets();

  const {
    grounds,
    isLoading,
    searchQuery,
    selectedCategory,
    changeCategory,
    user,
    events,
  } = useUnit({
    grounds: $grounds,
    isLoading: $isGroundsLoading,
    searchQuery: $searchQuery,
    selectedCategory: $selectedCategory,
    changeCategory: setSelectedCategory,
    user: $userSession,
    events: $events,
  });

  useFocusEffect(
    useCallback(() => {
      fetchGroundsFx({
        kindofsport: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery.trim() || undefined,
      });
    }, [selectedCategory, searchQuery, user?.id]),
  );

  React.useEffect(() => {
    if (events.length === 0) {
      fetchAllEventsFx();
    }
  }, []);

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

  if (isWeb) {
    return (
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
    );
  }

  return (
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
        { paddingBottom: insets.bottom + 100 },
      ]}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerContainer: {
    paddingTop: 0,
    marginBottom: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoriesWrapper: {
    marginLeft: -16,
    marginRight: -16,
    paddingBottom: 4,
  },
  countText: { fontSize: 16, fontWeight: '700', color: '#334A77' },
  sortText: { fontSize: 13, color: '#6080A8', fontWeight: '500' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webListContent: { width: '100%', paddingBottom: 32 },
});