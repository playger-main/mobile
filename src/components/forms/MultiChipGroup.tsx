// src/components/forms/MultiChipGroup.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export interface MultiChipOption {
  value: string;
  label: string;
}

interface MultiChipGroupProps {
  options: readonly MultiChipOption[];
  /** Выбранные значения */
  values: readonly string[];
  onToggle: (value: string) => void;
  /** Компактный вариант (padding 12 вместо 14) — как в формах площадки */
  compact?: boolean;
  /** Иконка слева от подписи (покрытие) */
  renderLeading?: (option: MultiChipOption, isSelected: boolean) => React.ReactNode;
}

/**
 * ✅ P2: мультивыбор чипами (удобства, покрытие).
 * Раньше этот блок вместе со StyleSheet дублировался в трёх экранах площадки.
 */
export default function MultiChipGroup({
  options,
  values,
  onToggle,
  compact = false,
  renderLeading,
}: MultiChipGroupProps) {
  const { colors } = useTheme();
  const hasLeading = typeof renderLeading === 'function';

  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <Pressable
            key={option.value}
            onPress={() => onToggle(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={option.label}
            style={[
              styles.chip,
              compact ? styles.chipCompact : styles.chipRegular,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            {hasLeading
              ? renderLeading(option, isSelected)
              : null}
            <Text
              style={[
                styles.text,
                { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                isSelected && styles.textSelected,
                hasLeading && styles.textWithLeading,
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
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  chipRegular: { paddingHorizontal: 14 },
  chipCompact: { paddingHorizontal: 12 },
  text: { fontSize: 13, fontWeight: '500' },
  textSelected: { fontWeight: '600' },
  textWithLeading: { marginLeft: 6 },
});
