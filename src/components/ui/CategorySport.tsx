import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Переименовали константу для соответствия сущности бэкенда
export const KINDOFSPORT_CATEGORIES = [
  { id: 'all', title: 'All sports', icon: 'grid-outline' },
  { id: 'basketball', title: 'Basketball', icon: 'basketball-outline' },
  { id: 'pickleball', title: 'Pickleball', icon: 'trophy-outline' },       // ✅ ДОБАВЛЕНО
  { id: 'skateboarding', title: 'Skatepark', icon: 'bicycle-outline' },    // ✅ ДОБАВЛЕНО
  { id: 'football', title: 'Football', icon: 'football-outline' },
  { id: 'tennis', title: 'Tennis', icon: 'tennisball-outline' },
];

interface CategorySportProps {
  // ✅ ИСПРАВЛЕНИЕ: переименовали пропсы под бизнес-логику сервера
  selectedKindofsport: string;
  onSelectKindofsport: (id: string) => void;
}

export default function CategorySport({ selectedKindofsport, onSelectKindofsport }: CategorySportProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {KINDOFSPORT_CATEGORIES.map((category) => {
          const isActive = selectedKindofsport === category.id;

          return (
            <Pressable
              key={category.id}
              onPress={() => onSelectKindofsport(category.id)}
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
  wrapper: {
    height: 44, 
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center', 
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
    height: 28, 
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
