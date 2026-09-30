// src/app/(drawer)/(tabs)/index.tsx
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import SearchGrounds from '@/components/ui/SearchGrounds';
import CategorySport from '@/components/ui/CategorySport';
import ListGrounds from '@/components/ui/ListGrounds';
import MapComponent from '@/components/ui/MapComponent';
import MapLegend from '@/components/ui/MapLegend';

import {
  $grounds,
  $searchQuery,
  $selectedCategory,
  $clusterSheetVisible, // ✅
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

  // ✅ Подписываемся на стейт списка кластера
  const clusterSheetVisible = useUnit($clusterSheetVisible);

  // Snap-поинты: 30px, средний, максимальный
  const snapPoints = useMemo(() => {
    const minListHeight = insets.top + 58;
    const topLimit = 100 - (minListHeight / screenHeight) * 100;
    return [30, `${Math.round(topLimit / 2 + 8)}%`, `${Math.round(topLimit)}%`];
  }, [insets.top, screenHeight]);

  // Стартовая позиция карты/шита
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

  const [sheetIndex, setSheetIndex] = useState(1);
  const handleSheetChange = useCallback((index: number) => {
    setSheetIndex(index);
  }, []);

  // ✅ Скрываем/показываем основной BottomSheet при открытии/закрытии списка кластера
  useEffect(() => {
    if (isWeb) return;

    if (clusterSheetVisible) {
      // Скрываем основной список
      bottomSheetRef.current?.close();
    } else {
      // Возвращаем на средний snap
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
        <MapComponent region={mapRegion} grounds={grounds} />

        <View style={styles.legendWrapper} pointerEvents="box-none">
          <MapLegend />
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
        backgroundStyle={styles.bottomSheetBackground}
        handleComponent={renderCustomHandle}
        enableDynamicSizing={false}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        activeOffsetY={[-20, 20]}
        onChange={handleSheetChange}
        animationConfigs={{
          damping: 40,
          stiffness: 200,
          mass: 1,
          overshootClamping: false,
        }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ListGrounds
            onItemPress={(item) => router.push(`/ground/${item.id}`)}
            onToggleFavorite={toggleFavorite}
          />
        </BottomSheetView>
      </BottomSheet>
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
  webRoot: { flex: 1, backgroundColor: '#FFFFFF' },
  webScrollContainer: { flex: 1 },
  webSearchWrapper: { paddingTop: 16, paddingBottom: 8, width: '100%' },
  webMapWrapper: { width: '100%', height: 250, marginBottom: 4 },
  webListWrapper: { flex: 1, minHeight: 400 },
});