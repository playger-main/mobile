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

import { useTranslation } from '@/i18n';

import {
  $grounds,
  $searchQuery,
  $selectedCategory,
  $clusterSheetVisible,
  $userSession,
  $pendingGrounds,
  $mapCenter,
  addFavoriteFx,
  removeFavoriteFx,
} from '@/effector/store';
import {
  setSearchQuery,
  setSelectedCategory,
} from '@/effector/events/sync';
import { useTheme } from '@/hooks/useTheme';

// ✅ Fallback дельты карты
const MAP_LAT_DELTA = 0.02;
const MAP_LNG_DELTA = 0.02;

export default function GroundsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height: screenHeight } = useWindowDimensions();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const isWeb = Platform.OS === 'web';

  const clusterSheetVisible = useUnit($clusterSheetVisible);
  const user = useUnit($userSession);
  const pendingCount = useUnit($pendingGrounds.map((p) => p.length));
  const mapCenter = useUnit($mapCenter); // ✅ №5: центр карты из стора

  const addFavorite = useUnit(addFavoriteFx);
  const removeFavorite = useUnit(removeFavoriteFx);

  const isModerator =
    user?.role?.includes('moderator') || user?.role?.includes('admin');

  const showModerationFab = isModerator && pendingCount > 0;
  const showAddFab = true;

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
  } = useUnit({
    grounds: $grounds,
    searchQuery: $searchQuery,
    selectedKindofsport: $selectedCategory,
    changeSearch: setSearchQuery,
    changeKindofsport: setSelectedCategory,
  });

  const handleToggleFavorite = useCallback(
    (groundId: string, isFavorite: boolean) => {
      if (isFavorite) {
        removeFavorite(groundId);
      } else {
        addFavorite(groundId);
      }
    },
    [addFavorite, removeFavorite],
  );

  // ✅ №5: регион для карты — теперь из $mapCenter (userLocation → cityCenter → default)
  const mapRegion = useMemo(
    () => ({
      latitude: mapCenter.latitude,
      longitude: mapCenter.longitude,
      latitudeDelta: MAP_LAT_DELTA,
      longitudeDelta: MAP_LNG_DELTA,
    }),
    [mapCenter.latitude, mapCenter.longitude],
  );

  const renderCustomHandle = () => (
    <View style={styles.massiveHandleContainer}>
      <View
        style={[styles.customHandlePill, { backgroundColor: colors.textTertiary }]}
      />
    </View>
  );

  const handleAddGroundPress = () => {
    if (user) {
      router.push('/ground/create');
    } else {
      Alert.alert(
        t('common.authRequired'),
        t('grounds.addAuthHint'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('common.signIn'),
            onPress: () => router.push('/(drawer)/(tabs)/profile'),
          },
        ],
      );
    }
  };

  const handleModerationPress = () => {
    router.push('/ground/moderation');
  };

  if (isWeb) {
    return (
      <View style={[styles.webRoot, { backgroundColor: colors.listBackground }]}>
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
              onToggleFavorite={handleToggleFavorite}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        style={[
          styles.mapContainer,
          { backgroundColor: colors.surfaceSecondary },
          animatedMapStyle,
        ]}
      >
        <MapComponent
          region={mapRegion}
          grounds={grounds}
          topOffset={insets.top + 60}
        />

        <View style={styles.legendWrapper} pointerEvents="box-none">
          {!clusterSheetVisible && <MapLegend />}
        </View>
      </Animated.View>

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
        backgroundStyle={{
          backgroundColor: colors.listBackground,
          shadowColor: colors.shadow,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 16,
        }}
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
          onToggleFavorite={handleToggleFavorite}
        />
      </BottomSheet>

      {!clusterSheetVisible && (
        <>
          {showAddFab && (
            <Pressable
              style={({ pressed }) => [
                styles.fabButton,
                {
                  bottom: showModerationFab
                    ? insets.bottom + 88
                    : insets.bottom + 16,
                  opacity: pressed ? 0.85 : 1,
                  backgroundColor: colors.primary,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={handleAddGroundPress}
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </Pressable>
          )}

          {showModerationFab && (
            <Pressable
              style={({ pressed }) => [
                styles.fabButton,
                styles.fabModeration,
                {
                  bottom: insets.bottom + 16,
                  opacity: pressed ? 0.85 : 1,
                  backgroundColor: colors.warning,
                  shadowColor: colors.shadow,
                },
              ]}
              onPress={handleModerationPress}
            >
              <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: colors.danger,
                    borderColor: colors.background,
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {pendingCount > 99 ? '99+' : pendingCount}
                </Text>
              </View>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: {
    width: '100%',
    position: 'relative',
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
  massiveHandleContainer: {
    width: '100%',
    height: 30,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customHandlePill: {
    width: 55,
    height: 4,
    borderRadius: 2,
  },
  fabButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  fabModeration: {},
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  webRoot: { flex: 1 },
  webScrollContainer: { flex: 1 },
  webSearchWrapper: { paddingTop: 16, paddingBottom: 8, width: '100%' },
  webMapWrapper: { width: '100%', height: 250, marginBottom: 4 },
  webListWrapper: { flex: 1, minHeight: 400 },
});