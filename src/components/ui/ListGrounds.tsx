// src/components/ui/ListGrounds.tsx
import React, { useCallback, useMemo } from 'react';
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
  $mapVisibleBounds,
} from '@/effector/store';
import { setSelectedCategory } from '@/effector/events/sync';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

// ✅ №6, №7: лимит списка и поиска
const MAX_GROUNDS_RESULTS = 100;

// ✅ №6: padding от края видимой области (10%),
// чтобы площадки на границе не мигали при движении карты
const BOUNDS_PADDING_RATIO = 0.1;

interface ListGroundsProps {
  onItemPress: (item: ExtendedGroundItem) => void;
  onToggleFavorite: (groundId: string, isFavorite: boolean) => void;
}

export default function ListGrounds({
  onItemPress,
  onToggleFavorite,
}: ListGroundsProps) {
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const {
    grounds,
    isLoading,
    searchQuery,
    selectedCategory,
    changeCategory,
    user,
    events,
    mapBounds,
  } = useUnit({
    grounds: $grounds,
    isLoading: $isGroundsLoading,
    searchQuery: $searchQuery,
    selectedCategory: $selectedCategory,
    changeCategory: setSelectedCategory,
    user: $userSession,
    events: $events,
    mapBounds: $mapVisibleBounds,
  });

  useFocusEffect(
    useCallback(() => {
      // ✅ №6, №7: take = 100
      fetchGroundsFx({
        kindofsport: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery.trim() || undefined,
        take: MAX_GROUNDS_RESULTS,
      });
    }, [selectedCategory, searchQuery, user?.id]),
  );

  React.useEffect(() => {
    if (events.length === 0) {
      fetchAllEventsFx();
    }
  }, []);

  // ✅ №6: фильтруем площадки по видимой области карты
  const visibleGrounds = useMemo(() => {
    // №7: если поиск активен — показываем все найденные (до 100),
    // независимо от видимой области карты
    if (searchQuery.trim().length > 0) {
      return grounds.slice(0, MAX_GROUNDS_RESULTS);
    }

    // Если bounds ещё не установлены (карта не отрендерилась) — показываем всё
    if (!mapBounds) {
      return grounds.slice(0, MAX_GROUNDS_RESULTS);
    }

    const { north, south, east, west } = mapBounds;

    // padding — чтобы площадки на краю не мигали
    const latPad = (north - south) * BOUNDS_PADDING_RATIO;
    const lngPad = (east - west) * BOUNDS_PADDING_RATIO;

    return grounds
      .filter((g) => {
        if (!g.geolocation?.lat || !g.geolocation?.lng) return false;

        const lat = Number(g.geolocation.lat);
        const lng = Number(g.geolocation.lng);

        if (isNaN(lat) || isNaN(lng)) return false;

        return (
          lat >= south - latPad &&
          lat <= north + latPad &&
          lng >= west - lngPad &&
          lng <= east + lngPad
        );
      })
      .slice(0, MAX_GROUNDS_RESULTS);
  }, [grounds, mapBounds, searchQuery]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <Text style={[styles.countText, { color: colors.textPrimary }]}>
          {t('grounds.count', { count: visibleGrounds.length })}
        </Text>
        <Text style={[styles.sortText, { color: colors.textSecondary }]}>
          {t('grounds.sortByDistance')}
        </Text>
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
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isWeb) {
    return (
      <View style={styles.webListContent}>
        {visibleGrounds.map((item) => (
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
      data={visibleGrounds}
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
        { paddingBottom: insets.bottom + 140 },
      ]}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      ListEmptyComponent={
        // ✅ №6: пустое состояние, если в видимой области ничего нет
        !searchQuery.trim() && grounds.length > 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              {t('grounds.emptyInArea')}
            </Text>
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  headerContainer: { paddingTop: 0, marginBottom: 8 },
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
  countText: { fontSize: 16, fontWeight: '700' },
  sortText: { fontSize: 13, fontWeight: '500' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webListContent: { width: '100%', paddingBottom: 32 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: { fontSize: 14, fontWeight: '500' },
});