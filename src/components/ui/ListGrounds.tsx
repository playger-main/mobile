// src/components/ui/ListGrounds.tsx
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import CardGround, { ExtendedGroundItem } from './CardGround';
import CategorySport from './CategorySport';
import LocationFilterSheet from './LocationFilterSheet';

import { fetchGroundsFx } from '@/effector/events/async/grounds';
import { fetchAllEventsFx } from '@/effector/events/async/events';
import {
  $grounds,
  $isGroundsLoading,
  $searchQuery,
  $selectedCategory,
  $userSession,
  $events,
  $userLocation,
  $cityCenter,
  $mapVisibleBounds,
  $locationFilter,
} from '@/effector/store';
import { setSelectedCategory } from '@/effector/events/sync';
import { calculateDistance } from '@/utils/distance';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

const MAX_GROUNDS_RESULTS = 100;
const NEAR_RADIUS_METERS = 5000;
const CITY_RADIUS_METERS = 20000;

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

  const [filterSheetVisible, setFilterSheetVisible] = useState(false);

  const {
    grounds,
    isLoading,
    searchQuery,
    selectedCategory,
    changeCategory,
    user,
    events,
    userLocation,
    cityCenter,
    mapBounds,
    locationFilter,
  } = useUnit({
    grounds: $grounds,
    isLoading: $isGroundsLoading,
    searchQuery: $searchQuery,
    selectedCategory: $selectedCategory,
    changeCategory: setSelectedCategory,
    user: $userSession,
    events: $events,
    userLocation: $userLocation,
    cityCenter: $cityCenter,
    mapBounds: $mapVisibleBounds,
    locationFilter: $locationFilter,
  });

  useFocusEffect(
    useCallback(() => {
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

  // ✅ Фильтр + сортировка
  const visibleGrounds = useMemo(() => {
    const origin = userLocation ?? cityCenter;
    let list = [...grounds];

    switch (locationFilter) {
      case 'visible': {
        if (mapBounds) {
          const { north, south, east, west } = mapBounds;
          const latPad = (north - south) * 0.1;
          const lngPad = (east - west) * 0.1;
          list = list.filter((g) => {
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
          });
        }
        break;
      }
      case 'near': {
        if (origin) {
          list = list.filter((g) => getDistanceToGround(g, origin) <= NEAR_RADIUS_METERS);
        }
        break;
      }
      case 'city': {
        if (origin) {
          list = list.filter((g) => getDistanceToGround(g, origin) <= CITY_RADIUS_METERS);
        }
        break;
      }
      default:
        break;
    }

    if (origin) {
      list.sort((a, b) => {
        const da = getDistanceToGround(a, origin);
        const db = getDistanceToGround(b, origin);
        return da - db;
      });
    }

    return list.slice(0, MAX_GROUNDS_RESULTS);
  }, [grounds, userLocation, cityCenter, mapBounds, locationFilter]);

  const filterLabel = useMemo(() => {
    switch (locationFilter) {
      case 'visible': return t('locationFilter.visibleShort');
      case 'near': return t('locationFilter.nearShort');
      case 'city': return t('locationFilter.cityShort');
      default: return t('locationFilter.allShort');
    }
  }, [locationFilter, t]);

  const filterIcon = useMemo(() => {
    switch (locationFilter) {
      case 'visible': return 'map-outline';
      case 'near': return 'navigate-outline';
      case 'city': return 'business-outline';
      default: return 'globe-outline';
    }
  }, [locationFilter]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTopRow}>
        <Text style={[styles.countText, { color: colors.textPrimary }]}>
          {t('grounds.count', { count: visibleGrounds.length })}
        </Text>

        <Pressable
          style={[
            styles.filterBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setFilterSheetVisible(true)}
        >
          <Ionicons name={filterIcon as any} size={13} color={colors.primary} />
          <Text style={[styles.filterBtnText, { color: colors.primary }]}>
            {filterLabel}
          </Text>
          <Ionicons name="chevron-down" size={13} color={colors.primary} />
        </Pressable>
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
        <LocationFilterSheet
          visible={filterSheetVisible}
          onClose={() => setFilterSheetVisible(false)}
        />
      </View>
    );
  }

  return (
    <>
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
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              {t('grounds.emptyInArea')}
            </Text>
          </View>
        }
      />

      <LocationFilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
      />
    </>
  );
}

function getDistanceToGround(
  ground: ExtendedGroundItem,
  origin: { latitude: number; longitude: number },
): number {
  if (!ground.geolocation?.lat || !ground.geolocation?.lng) {
    return Number.MAX_SAFE_INTEGER;
  }
  const lat = Number(ground.geolocation.lat);
  const lng = Number(ground.geolocation.lng);
  if (isNaN(lat) || isNaN(lng)) return Number.MAX_SAFE_INTEGER;
  return calculateDistance(origin.latitude, origin.longitude, lat, lng);
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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  filterBtnText: { fontSize: 12, fontWeight: '600' },
  categoriesWrapper: {
    marginLeft: -16,
    marginRight: -16,
    paddingBottom: 4,
  },
  countText: { fontSize: 16, fontWeight: '700' },
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