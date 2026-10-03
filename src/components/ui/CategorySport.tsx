// src/components/ui/CategorySport.tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SPORT_CATEGORIES, getSportKey } from '@/constants/sports';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface CategorySportProps {
  selectedKindofsport: string;
  onSelectKindofsport: (id: string) => void;
}

export default function CategorySport({
  selectedKindofsport,
  onSelectKindofsport,
}: CategorySportProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.listBackground }]}>
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
              style={[
                styles.chip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              {!isAll && (
                <Ionicons
                  name={category.icon as any}
                  size={14}
                  color={isActive ? '#FFFFFF' : colors.textPrimary}
                  style={styles.icon}
                />
              )}
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isActive ? '#FFFFFF' : colors.textPrimary,
                    fontWeight: isActive ? '600' : '500',
                  },
                ]}
              >
                {t(getSportKey(category.id))}
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
  },
  container: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 28,
  },
  icon: { marginRight: 4 },
  chipText: { fontSize: 13 },
});