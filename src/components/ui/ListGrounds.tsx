import React, { useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

// ✅ ИСПРАВЛЕНИЕ: Импортируем интерфейс ExtendedGroundItem для строгой типизации
import CardGround, { ExtendedGroundItem } from './CardGround';

// Импортируем сторы и эффекты из Effector
import { fetchGroundsFx } from '@/effector/events/async/grounds';
import { $grounds, $isGroundsLoading, $searchQuery, $selectedCategory } from '@/effector/store';

interface ListGroundsProps {
  // ✅ ИСПРАВЛЕНИЕ: Заменили any на ExtendedGroundItem
  onItemPress: (item: ExtendedGroundItem) => void; 
  onToggleFavorite: (id: string) => void;
}

export default function ListGrounds({ onItemPress, onToggleFavorite }: ListGroundsProps) {
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets(); 

  // Подписываемся на данные из глобального стора Effector
  const { grounds, isLoading, searchQuery, selectedCategory } = useUnit({
    grounds: $grounds,
    isLoading: $isGroundsLoading,
    searchQuery: $searchQuery,
    selectedCategory: $selectedCategory,
  });

  // Автоматический перезапрос при смене фильтров
  useEffect(() => {
    fetchGroundsFx({
      kindofsport: selectedCategory === 'all' ? undefined : selectedCategory,
      search: searchQuery || undefined,
    });
  }, [selectedCategory, searchQuery]);

  if (isLoading && grounds.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  return (
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      {/* Шапка списка */}
      <View style={styles.header}>
        <Text style={styles.countText}>{grounds.length} grounds nearby</Text>
        <Text style={styles.sortText}>By distance</Text>
      </View>

      {/* УСЛОВНЫЙ РЕНДЕРИНГ */}
      {isWeb ? (
        <View style={styles.webListContent}>
          {grounds.map((item) => (
            <CardGround 
              key={item.id} 
              item={item} 
              onPress={() => onItemPress(item)} 
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </View>
      ) : (
        <FlatList
          data={grounds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardGround 
              item={item} 
              onPress={() => onItemPress(item)} 
              onToggleFavorite={onToggleFavorite}
            />
          )}
          showsVerticalScrollIndicator={false}
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
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  containerWeb: {
    flex: 0,
    height: 'auto',
    backgroundColor: 'transparent', 
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  countText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334A77',
  },
  sortText: {
    fontSize: 13,
    color: '#6080A8',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 24,
  },
  webListContent: {
    width: '100%',
    paddingBottom: 32,
  },
});
