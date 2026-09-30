// src/components/ui/CategorySport.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SPORT_CATEGORIES } from '@/constants/sports';

interface CategorySportProps {
  selectedKindofsport: string;
  onSelectKindofsport: (id: string) => void;
}

export default function CategorySport({
  selectedKindofsport,
  onSelectKindofsport,
}: CategorySportProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {SPORT_CATEGORIES.map((category) => {
          const isActive = selectedKindofsport === category.id;
          const isAll = category.id === 'all';

          return (
            <Pressable
              key={category.id}
              onPress={() => onSelectKindofsport(category.id)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              {!isAll && (
                <Ionicons
                  name={category.icon as any}
                  size={14}
                  color={isActive ? '#FFFFFF' : '#334A77'}
                  style={styles.icon}
                />
              )}
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category.label}
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
