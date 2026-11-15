// src/components/forms/ChipGroup.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export interface ChipOption {
  value: string;
  label: string;
}

interface ChipGroupProps {
  options: readonly ChipOption[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * ✅ P2: единая группа чипов выбора (уровень игры, покрытие, удобства…).
 * Раньше разметка + 3 правила StyleSheet дублировались в каждой форме.
 */
export default function ChipGroup({
  options,
  value,
  onChange,
}: ChipGroupProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={option.label}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : colors.textPrimary },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
});
