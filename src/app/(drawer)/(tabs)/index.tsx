import React from 'react';
import { StyleSheet, View, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import SearchGrounds from '@/components/ui/SearchGrounds';
import CategorySport from '@/components/ui/CategorySport';
import ListGrounds from '@/components/ui/ListGrounds';
import MapComponent from '@/components/ui/MapComponent';

import { $grounds, $searchQuery, $selectedCategory } from '@/effector/store';
import { setSearchQuery, setSelectedCategory, toggleFavoriteInStore } from '@/effector/events/sync';

export default function GroundsScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets(); 

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

  // Дефолтные координаты для Вильнюса (Pašilaičiai), чтобы сразу видеть маркеры
  const mapRegion = {
    latitude: 54.7284,
    longitude: 25.2273,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const isWeb = Platform.OS === 'web';

  // 🌐 ВЕРСТКА СПЕЦИАЛЬНО ДЛЯ WEB (БРАУЗЕРА)
  if (isWeb) {
    return (
      <View style={styles.webRoot}>
        <ScrollView style={styles.webScrollContainer} showsVerticalScrollIndicator={false}>
          {/* Поиск в вебе идет обычным потоком, а не абсолютным оверлеем */}
          <View style={styles.webSearchWrapper}>
            <SearchGrounds value={searchQuery} onChangeText={changeSearch} />
          </View>
          
          {/* Карта в вебе получает фиксированную высоту */}
          <View style={styles.webMapWrapper}>
            <MapComponent region={mapRegion} grounds={grounds} />
          </View>

          <CategorySport 
            selectedKindofsport={selectedKindofsport} 
            onSelectKindofsport={changeKindofsport}   
          />

          <View style={styles.webListWrapper}>
            <ListGrounds 
              onItemPress={(item) => console.log('Selected:', item.name)} 
              onToggleFavorite={toggleFavorite}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  // 📱 ВЕРСТКА ДЛЯ СМАРТФОНОВ (iOS / Android) — остается без изменений
  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { height: windowHeight * 0.4 }]}>
        <MapComponent region={mapRegion} grounds={grounds} />
        <View style={[styles.searchOverlayMobile, { top: insets.top + 12 }]}>
          <SearchGrounds value={searchQuery} onChangeText={changeSearch} />
        </View>
      </View>

      <CategorySport 
        selectedKindofsport={selectedKindofsport} 
        onSelectKindofsport={changeKindofsport}   
      />

      <View style={styles.bottomSection}>
        <ListGrounds 
          onItemPress={(item) => console.log('Selected:', item.name)} 
          onToggleFavorite={toggleFavorite}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Мобильные стили
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topSection: { width: '100%', position: 'relative' },
  searchOverlayMobile: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99, 
    paddingBottom: 8,
  },
  bottomSection: { flex: 1 },

  // Стили для Web-версии
  webRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webScrollContainer: {
    flex: 1,
  },
  webSearchWrapper: {
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
  },
  webMapWrapper: {
    width: '100%',
    height: 250, // Фиксируем высоту карты в браузере, чтобы она не сжимала список
    paddingHorizontal: 0,
    marginBottom: 4,
  },
  webListWrapper: {
    flex: 1,
    minHeight: 400, // Даем списку гарантированную высоту для раскрытия карточек
  }
});
