// src/app/(drawer)/(tabs)/index.tsx
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  useWindowDimensions,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import SearchGrounds from '@/components/ui/SearchGrounds';
import CategorySport from '@/components/ui/CategorySport';
import ListGrounds from '@/components/ui/ListGrounds';
import MapComponent from '@/components/ui/MapComponent';
import MapLegend from '@/components/ui/MapLegend';

import {
  $grounds,
  $searchQuery,
  $selectedCategory,
  $clusterSheetVisible,
  $userSession,
  $pendingGrounds,
} from '@/effector/store';
import {
  setSearchQuery,
  setSelectedCategory,
  toggleFavoriteInStore,
} from '@/effector/events/sync';

export default function GroundsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = useWindowDimensions();

  const isWeb = Platform.OS === 'web';

  const clusterSheetVisible = useUnit($clusterSheetVisible);
  const user = useUnit($userSession);
  const pendingCount = useUnit($pendingGrounds.map((p) => p.length));
  const isModerator =
    user?.role?.includes('moderator') || user?.role?.includes('admin');

  const snapPoints = useMemo(() => {
    const minListHeight = insets.top + 58;
    const topLimit = 100 - (minListHeight / screenHeight) * 100;
    return [30, `${Math.round(topLimit / 2 + 8)}%`, `${Math.round(topLimit)}%`];
  }, [insets.top, screenHeight]);

  const initialSheetPosition = useMemo(() => {
    const midPercent = parseFloat((snapPoints[1] as string).replace('%', ''));
    return screenHeight - (screenHeight * midPercent) / 100;
  }, [screenHeight, snapPoints]);

  const sheetPosition = useSharedValue(initialSheetPosition);

  const MIN_MAP_HEIGHT = insets.top + 100;

  const animatedMapStyle = useAnimatedStyle(() => {
    const height = Math.max(sheetPosition.value, MIN_MAP_HEIGHT);
    return { height };
  });

  useEffect(() => {
    if (isWeb) return;

    if (clusterSheetVisible) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.snapToIndex(1);
    }
  }, [clusterSheetVisible, isWeb]);

  const {
    grounds,
    searchQuery,
    selectedKindofsport,
    changeSearch,
    changeKindofsport,
    toggleFavorite,
  } = useUnit({
    grounds: $grounds,
    searchQuery: $searchQuery,
    selectedKindofsport: $selectedCategory,
    changeSearch: setSearchQuery,
    changeKindofsport: setSelectedCategory,
    toggleFavorite: toggleFavoriteInStore,
  });

  const mapRegion = {
    latitude: 54.7284,
    longitude: 25.2273,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const renderCustomHandle = () => (
    <View style={styles.massiveHandleContainer}>
      <View style={styles.customHandlePill} />
    </View>
  );

  // ✅ FAB: Add ground
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

  // ✅ FAB: Moderation
  const handleModerationPress = () => {
    router.push('/ground/moderation');
  };

  if (isWeb) {
    return (
      <View style={styles.webRoot}>
        <ScrollView
          style={styles.webScrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.webSearchWrapper}>
            <SearchGrounds value={searchQuery} onChangeText={changeSearch} />
          </View>
          <View style={styles.webMapWrapper}>
            <MapComponent region={mapRegion} grounds={grounds} />
          </View>
          <CategorySport
            selectedKindofsport={selectedKindofsport}
            onSelectKindofsport={changeKindofsport}
          />
          <View style={styles.webListWrapper}>
            <ListGrounds
              onItemPress={(item) => router.push(`/ground/${item.id}`)}
              onToggleFavorite={toggleFavorite}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.mapContainer, animatedMapStyle]}>
        {/* ✅ Кнопка locate теперь сверху, под поиском */}
        <MapComponent
          region={mapRegion}
          grounds={grounds}
          topOffset={insets.top + 60}
        />

        <View style={styles.legendWrapper} pointerEvents="box-none">
          <MapLegend />
        </View>
      </Animated.View>

      {/* Строка поиска поверх карты */}
      <View
        style={[styles.topOverlayMobile, { paddingTop: insets.top }]}
        pointerEvents="box-none"
      >
        <SearchGrounds value={searchQuery} onChangeText={changeSearch} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        animatedPosition={sheetPosition}
        backgroundStyle={styles.bottomSheetBackground}
        handleComponent={renderCustomHandle}
        enableDynamicSizing={false}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        animationConfigs={{
          damping: 40,
          stiffness: 200,
          mass: 1,
          overshootClamping: false,
        }}
      >
        <ListGrounds
          onItemPress={(item) => router.push(`/ground/${item.id}`)}
          onToggleFavorite={toggleFavorite}
        />
      </BottomSheet>

      {/* ✅ FAB'ы — поверх BottomSheet, скрываем когда открыт список кластера */}
      {!clusterSheetVisible && (
        <>
          <Pressable
            style={({ pressed }) => [
              styles.fabButton,
              {
                bottom:
                  isModerator && pendingCount > 0
                    ? insets.bottom + 88
                    : insets.bottom + 16,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={handleAddGroundPress}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </Pressable>

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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#F0F4F8',
    overflow: 'hidden',
  },
  legendWrapper: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    zIndex: 5,
  },
  topOverlayMobile: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomSheetBackground: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: '#334A77',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  massiveHandleContainer: {
    width: '100%',
    height: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customHandlePill: {
    backgroundColor: '#86909C',
    width: 55,
    height: 4,
    borderRadius: 2,
  },

  // ✅ FAB'ы
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
    zIndex: 100,
  },
  fabModeration: {
    backgroundColor: '#FF8000',
    shadowColor: '#FF8000',
  },
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

  webRoot: { flex: 1, backgroundColor: '#FFFFFF' },
  webScrollContainer: { flex: 1 },
  webSearchWrapper: { paddingTop: 16, paddingBottom: 8, width: '100%' },
  webMapWrapper: { width: '100%', height: 250, marginBottom: 4 },
  webListWrapper: { flex: 1, minHeight: 400 },
});