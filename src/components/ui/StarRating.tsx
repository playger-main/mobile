// src/components/ui/StarRating.tsx
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface StarRatingProps {
  value: number; // 0..5
  size?: number;
  /** Если передан onChange — звёзды интерактивные */
  onChange?: (value: number) => void;
  /** Цвет закрашенных звёзд (по умолчанию — золотой) */
  activeColor?: string;
}

export default function StarRating({
  value,
  size = 20,
  onChange,
  activeColor = '#FFCC00',
}: StarRatingProps) {
  const { colors } = useTheme();
  const interactive = typeof onChange === 'function';

  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= value;
        const icon = isFilled ? 'star' : 'star-outline';
        const color = isFilled ? activeColor : colors.textTertiary;

        if (!interactive) {
          return (
            <Ionicons
              key={star}
              name={icon}
              size={size}
              color={color}
              style={styles.star}
            />
          );
        }

        return (
          <Pressable
            key={star}
            onPress={() => onChange(star)}
            hitSlop={6}
            style={styles.star}
          >
            <Ionicons name={icon} size={size} color={color} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  star: { marginRight: 2 },
});