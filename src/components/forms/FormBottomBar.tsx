// src/components/forms/FormBottomBar.tsx
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';

interface FormBottomBarProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Цвет кнопки (по умолчанию — primary) */
  backgroundColor?: string;
  /** Цвет текста (по умолчанию — белый) */
  textColor?: string;
}

/**
 * ✅ P2: единая нижняя панель форм (кнопка публикации/сохранения).
 * Раньше дублировалась в create/edit/moderate вместе со StyleSheet-правилами.
 */
export default function FormBottomBar({
  label,
  onPress,
  disabled = false,
  loading = false,
  backgroundColor,
  textColor = '#FFFFFF',
}: FormBottomBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.bottomBar,
        {
          paddingBottom: insets.bottom + 12,
          backgroundColor: colors.background,
          borderColor: colors.borderSubtle,
        },
      ]}
    >
      <Pressable
        style={[
          styles.button,
          { backgroundColor: backgroundColor ?? colors.primary },
        ]}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <Text style={[styles.buttonText, { color: textColor }]}>
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    zIndex: 99,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
