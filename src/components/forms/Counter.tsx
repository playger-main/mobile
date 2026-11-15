// src/components/forms/Counter.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Шаг изменения (для длительности — 15 минут) */
  step?: number;
  /** Подпись для screen reader'ов, например «Игроков» */
  label?: string;
}

/**
 * ✅ P2: счётчик «− значение +» с границами.
 * Раньше эта разметка (и 5 правил StyleSheet) копировалась в каждой форме,
 * а границы задавались инлайном в onPress.
 */
export default function Counter({
  value,
  onChange,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  label,
}: CounterProps) {
  const { colors } = useTheme();

  const decrease = () => onChange(Math.max(min, value - step));
  const increase = () => onChange(Math.min(max, value + step));

  return (
    <View
      style={[
        styles.block,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Pressable
        style={[styles.button, { backgroundColor: colors.surfaceSecondary }]}
        onPress={decrease}
        disabled={value <= min}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label} −` : '−'}
        accessibilityState={{ disabled: value <= min }}
      >
        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
          -
        </Text>
      </Pressable>

      <Text
        style={[styles.value, { color: colors.textPrimary }]}
        accessibilityLabel={label ? `${label}: ${value}` : String(value)}
      >
        {value}
      </Text>

      <Pressable
        style={[styles.button, { backgroundColor: colors.surfaceSecondary }]}
        onPress={increase}
        disabled={value >= max}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label} +` : '+'}
        accessibilityState={{ disabled: value >= max }}
      >
        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  button: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 20, fontWeight: '600' },
  value: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
});
