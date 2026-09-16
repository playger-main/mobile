import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchGrounds from '@/components/ui/SearchGrounds';
import CategorySport from '@/components/ui/CategorySport';
import ListGrounds from '@/components/ui/ListGrounds';
import MapComponent from '@/components/ui/MapComponent';
import { ExtendedGroundItem } from '@/components/ui/CardGround';

const MOCK_GROUNDS_DATA: ExtendedGroundItem[] = [
  {
    id: '1',
    title: 'Riverside Court',
    address: '12 Embankment Walk',
    category: 'Basketball',
    rating: 4.8,
    reviewsCount: 132,
    distance: '0.6 km',
    imageUrl: 'https://unsplash.com',
    latitude: 55.7578,
    longitude: 37.6193,
    isLive: true,
  },
  {
    id: '2',
    title: 'Greenfield Pitch',
    address: '48 Meadow Lane',
    category: 'Football',
    rating: 4.6,
    reviewsCount: 98,
    distance: '1.2 km',
    imageUrl: 'https://unsplash.com',
    latitude: 55.7538,
    longitude: 37.6153,
    isLive: true,
  },
];

export default function GroundsScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets(); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mapRegion = {
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  const filteredGrounds = MOCK_GROUNDS_DATA.filter((ground) => {
    const matchesCategory = selectedCategory === 'all' || ground.category.toLowerCase() === selectedCategory;
    const matchesSearch = ground.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ground.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    return (
      <ScrollView style={styles.webScrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.webSearchWrapper}>
          <SearchGrounds value={searchQuery} onChangeText={setSearchQuery} />
        </View>
        
        <View style={styles.webMapWrapper}>
          <MapComponent region={mapRegion} grounds={filteredGrounds} />
        </View>

        <CategorySport 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        <ListGrounds 
          data={filteredGrounds} 
          onItemPress={(item) => console.log('Selected:', item.title)} 
        />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topSection, { height: windowHeight * 0.4 }]}>
        <MapComponent region={mapRegion} grounds={filteredGrounds} />
        <View style={[styles.searchOverlayMobile, { top: insets.top + 12 }]}>
          <SearchGrounds value={searchQuery} onChangeText={setSearchQuery} />
        </View>
      </View>

      <CategorySport 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      <View style={styles.bottomSection}>
        <ListGrounds 
          data={filteredGrounds} 
          onItemPress={(item) => console.log('Selected:', item.title)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topSection: { width: '100%', position: 'relative' },
  searchOverlayMobile: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99, 
  },
  bottomSection: { flex: 1 },
  webScrollContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  webSearchWrapper: { paddingTop: 16, marginBottom: 8 },
  webMapWrapper: { paddingHorizontal: 16, marginBottom: 8 }
});
