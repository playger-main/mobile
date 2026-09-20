// src/components/ui/ListGrounds.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import CardGround, { ExtendedGroundItem } from './CardGround';
import CategorySport from './CategorySport';

import { fetchGroundsFx } from '@/effector/events/async/grounds';
import { $grounds, $isGroundsLoading, $searchQuery, $selectedCategory } from '@/effector/store';
import { setSelectedCategory } from '@/effector/events/sync';

interface ListGroundsProps {
  onItemPress: (item: ExtendedGroundItem) => void; 
  onToggleFavorite: (id: string) => void;
}

export default function ListGrounds({ onItemPress, onToggleFavorite }: ListGroundsProps) {
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets(); 

  const { grounds, isLoading, searchQuery, selectedCategory, changeCategory } = useUnit({
    grounds: $grounds,
    isLoading: $isGroundsLoading,
    searchQuery: $searchQuery,
    selectedCategory: $selectedCategory,
    changeCategory: setSelectedCategory
  });

  useEffect(() => {
    fetchGroundsFx({
      kindofsport: selectedCategory === 'all' ? undefined : selectedCategory,
      search: searchQuery.trim() || undefined,
    });
  }, [selectedCategory, searchQuery]);

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

  return (
    <View style={[styles.container, isWeb ? styles.containerWeb : styles.containerMobile]}>
      {isWeb ? (
        <View style={styles.webListContent}>
          {grounds.map((item) => (
            <CardGround key={item.id} item={item} onPress={() => onItemPress(item)} onToggleFavorite={onToggleFavorite} />
          ))}
        </View>
      ) : (
        <BottomSheetFlatList
          data={grounds}
          keyExtractor={(item: ExtendedGroundItem) => item.id}
          ListHeaderComponent={renderHeader}
          // Явное указание типов убирает TS-ошибку неявного any
          renderItem={({ item }: { item: ExtendedGroundItem }) => (
            <CardGround item={item} onPress={() => onItemPress(item)} onToggleFavorite={onToggleFavorite} />
          )}
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={[
            styles.listContent, 
            { paddingBottom: insets.bottom + 16 }
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  containerMobile: { backgroundColor: 'transparent' },
  containerWeb: { flex: 0, height: 'auto', paddingTop: 16 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: { backgroundColor: 'transparent', paddingTop: 0, marginBottom: 8 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  categoriesWrapper: { marginLeft: -16, marginRight: -16, paddingBottom: 4 },
  countText: { fontSize: 16, fontWeight: '700', color: '#334A77' },
  sortText: { fontSize: 13, color: '#6080A8', fontWeight: '500' },
  listContent: { paddingBottom: 20 },
  webListContent: { width: '100%', paddingBottom: 32 },
});
