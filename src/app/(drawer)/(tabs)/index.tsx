import React from 'react';
import { StyleSheet, View, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';
import { useRouter } from 'expo-router'; 

import SearchGrounds from '@/components/ui/SearchGrounds';
import CategorySport from '@/components/ui/CategorySport';
import ListGrounds from '@/components/ui/ListGrounds';
import MapComponent from '@/components/ui/MapComponent';

import { $grounds, $searchQuery, $selectedCategory } from '@/effector/store';
import { setSearchQuery, setSelectedCategory, toggleFavoriteInStore } from '@/effector/events/sync';

export default function GroundsScreen() {
  const insets = useSafeAreaInsets(); 
  const router = useRouter(); 

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

  const isWeb = Platform.OS === 'web';

  // 🌐 ВЕРСТКА ДЛЯ WEB (БРАУЗЕРА)
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

  // 📱 ВЕРСТКА ДЛЯ СМАРТФОНОВ (iOS / Android)
  return (
    <View style={styles.container}>
      {/* Карта занимает честные 40% экрана и не перекрывает нижний список */}
      <View style={styles.topSectionMobile}>
        <MapComponent region={mapRegion} grounds={grounds} />
        
        {/* Поиск поверх карты с высоким zIndex */}
        <View style={[styles.searchOverlayMobile, { top: insets.top + 12 }]}>
          <SearchGrounds value={searchQuery} onChangeText={changeSearch} />
        </View>
      </View>

      {/* Лента категорий */}
      <CategorySport 
        selectedKindofsport={selectedKindofsport} 
        onSelectKindofsport={changeKindofsport}   
      />

      {/* Список занимает оставшиеся 60% и гарантированно ловит нажатия пальцем */}
      <View style={styles.bottomSectionMobile}>
        <ListGrounds 
          onItemPress={(item) => router.push(`/ground/${item.id}`)} 
          onToggleFavorite={toggleFavorite}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Новые жесткие мобильные стили без пересечения слоев
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  topSectionMobile: { 
    flex: 0.4, // Ровно 40% экрана отдаем карте
    width: '100%', 
    position: 'relative',
    zIndex: 1,
  },
  searchOverlayMobile: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99, 
    paddingBottom: 8,
  },
  bottomSectionMobile: { 
    flex: 0.6, // Ровно 60% экрана отдаем списку
    zIndex: 10, // Принудительно поднимаем список выше слоя карты, чтобы кликалось
  },

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
    height: 250, 
    marginBottom: 4,
  },
  webListWrapper: {
    flex: 1,
    minHeight: 400, 
  }
});
