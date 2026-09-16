import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const SPORTS_CATEGORIES = [
  { id: 'all', title: 'All sports', icon: 'grid-outline' },
  { id: 'basketball', title: 'Basketball', icon: 'basketball-outline' },
  { id: 'football', title: 'Football', icon: 'football-outline' },
  { id: 'tennis', title: 'Tennis', icon: 'tennisball-outline' },
];

interface CategorySportProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategorySport({ selectedCategory, onSelectCategory }: CategorySportProps) {
  return (
    // ✅ ИСПРАВЛЕНИЕ: Обернули ScrollView в легкий View с фиксированной высотой,
    // чтобы горизонтальная лента не выдавливала контент вниз и не создавала дыру!
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {SPORTS_CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;

          return (
            <Pressable
              key={category.id}
              onPress={() => onSelectCategory(category.id)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              {category.id !== 'all' && (
                <Ionicons
                  name={category.icon as any}
                  size={14}
                  color={isActive ? '#FFFFFF' : '#334A77'}
                  style={styles.icon}
                />
              )}
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ✅ НАСТРОЙКА ВЫСОТЫ: ограничиваем высоту всей ленты под размер маленьких кнопок
  wrapper: {
    height: 44, // Идеальная высота: 28px кнопка + по 8px внешние отступы сверху и снизу
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center', // Центрируем кнопки по вертикали внутри полосы
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 28, // Наша аккуратная тонкая кнопка
  },
  chipActive: {
    backgroundColor: '#208AEF',
    borderColor: '#208AEF',
  },
  icon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334A77',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
