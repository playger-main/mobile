import React from 'react';
import { FlatList, View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CardGround, { ExtendedGroundItem } from './CardGround';

interface ListGroundsProps {
  data: ExtendedGroundItem[];
  onItemPress: (item: ExtendedGroundItem) => void;
}

export default function ListGrounds({ data, onItemPress }: ListGroundsProps) {
  const isWeb = Platform.OS === 'web';
  const insets = useSafeAreaInsets(); 

  return (
    // ✅ ИСПРАВЛЕНИЕ: В Вебе убираем flex: 1, чтобы блок не улетал вниз от категорий
    <View style={[styles.container, isWeb && styles.containerWeb]}>
      {/* Шапка списка */}
      <View style={styles.header}>
        <Text style={styles.countText}>{data.length} grounds nearby</Text>
        <Text style={styles.sortText}>By distance</Text>
      </View>

      {/* УСЛОВНЫЙ РЕНДЕРИНГ */}
      {isWeb ? (
        <View style={styles.webListContent}>
          {data.map((item) => (
            <CardGround key={item.id} item={item} onPress={() => onItemPress(item)} />
          ))}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardGround item={item} onPress={() => onItemPress(item)} />
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
    flex: 1, // Оставляем растяжение для мобильных телефонов
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // ✅ НАСТРОЙКА ДЛЯ ВЕБА: отключаем принудительное выдавливание вниз
  containerWeb: {
    flex: 0,
    height: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    paddingBottom: 16,
    width: '100%',
  },
});
