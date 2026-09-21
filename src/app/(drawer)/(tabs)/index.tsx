// src/app/(drawer)/(tabs)/index.tsx
import React, { useRef, useMemo } from 'react';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router'; 
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

import SearchGrounds from '@/components/ui/SearchGrounds';
import CategorySport from '@/components/ui/CategorySport';
import ListGrounds from '@/components/ui/ListGrounds';
import MapComponent from '@/components/ui/MapComponent';

import { $grounds, $searchQuery, $selectedCategory } from '@/effector/store';
import { setSearchQuery, setSelectedCategory, toggleFavoriteInStore } from '@/effector/events/sync';

export default function GroundsScreen() {
  const insets = useSafeAreaInsets(); 
  const router = useRouter(); 
  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    grounds,
    searchQuery,
    selectedKindofsport,
    changeSearch,
    changeKindofsport,
    toggleFavorite
  } = useUnit({
    grounds: $grounds,
    searchQuery: $searchQuery,
    selectedKindofsport: $selectedCategory,
    changeSearch: setSearchQuery,
    changeKindofsport: setSelectedCategory,
    toggleFavorite: toggleFavoriteInStore
  });

  const mapRegion = {
    latitude: 54.7284,
    longitude: 25.2273,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const snapPoints = useMemo(() => ['4%', '52%', '86%'], []);
  const isWeb = Platform.OS === 'web';

  const renderCustomHandle = () => (
    <View style={styles.massiveHandleContainer}>
      <View style={styles.customHandlePill} />
    </View>
  );

  if (isWeb) {
    return (
      <View style={styles.webRoot}>
        <ScrollView style={styles.webScrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.webSearchWrapper}>
            <SearchGrounds value={searchQuery} onChangeText={changeSearch} />
          </View>
          <View style={styles.webMapWrapper}>
            <MapComponent region={mapRegion} grounds={grounds} />
          </View>
          <CategorySport selectedKindofsport={selectedKindofsport} onSelectKindofsport={changeKindofsport} />
          <View style={styles.webListWrapper}>
            <ListGrounds onItemPress={(item) => router.push(`/ground/${item.id}`)} onToggleFavorite={toggleFavorite} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <View style={StyleSheet.absoluteFill}>
        <MapComponent region={mapRegion} grounds={grounds} />
      </View>

      <View style={[styles.topOverlayMobile, { paddingTop: insets.top }]}>
        <SearchGrounds value={searchQuery} onChangeText={changeSearch} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1} 
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetBackground}
        handleComponent={renderCustomHandle}
        enableDynamicSizing={false}        
        enableContentPanningGesture={true} 
        enableHandlePanningGesture={true}  
        

        // ✅ РЕШЕНИЕ: Задаем порог вертикального перехвата для шторки.
        // Движения пальцем по вертикали в пределах 20px шторка будет игнорировать,
        // что позволит внутреннему списку BottomSheetFlatList свободно скроллиться на 55%.
        activeOffsetY={[-20, 20]}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ListGrounds 
            onItemPress={(item) => router.push(`/ground/${item.id}`)} 
            onToggleFavorite={toggleFavorite}
          />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topOverlayMobile: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
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
    backgroundColor: '#BACAD6',
    width: 55,
    height: 4,
    borderRadius: 2    
  },
  webRoot: { flex: 1, backgroundColor: '#FFFFFF' },
  webScrollContainer: { flex: 1 },
  webSearchWrapper: { paddingTop: 16, paddingBottom: 8, width: '100%' },
  webMapWrapper: { width: '100%', height: 250, marginBottom: 4 },
  webListWrapper: { flex: 1, minHeight: 400 }
});
