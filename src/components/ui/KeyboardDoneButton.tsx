// src/components/ui/KeyboardDoneButton.tsx
import React from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

const TOOLBAR_HEIGHT = 40;

export default function KeyboardDoneButton() {
  const { t } = useTranslation();
  const { theme, colors } = useTheme();

  // ✅ Reanimated сам следит за клавиатурой — точная синхронизация
  const keyboard = useAnimatedKeyboard();

  const animatedStyle = useAnimatedStyle(() => {
    // keyboard.height — высота клавиатуры (анимированная)
    // На iOS может быть со знаком; берём максимальное
    const kbHeight = Math.max(keyboard.height.value, 0);

    return {
      transform: [{ translateY: -kbHeight }],
      opacity: kbHeight > 0 ? 1 : 0,
    };
  });

  const keyboardBg = theme === 'dark' ? '#2E2F31' : '#D1D3D9';
  const borderColor = theme === 'dark' ? '#3A3A3C' : '#C5C7CC';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, animatedStyle]}
    >
      <View
        style={[styles.toolbar, { backgroundColor: keyboardBg }]}
      >
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={({ pressed }) => [
            styles.btn,
            { opacity: pressed ? 0.5 : 1 },
          ]}
          hitSlop={12}
        >
          <Text style={[styles.btnText, { color: colors.primary }]}>
            {t('common.ok')}
          </Text>
        </Pressable>

        <View
          style={[styles.bottomBorder, { backgroundColor: borderColor }]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  toolbar: {
    width: '100%',
    height: TOOLBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    position: 'relative',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  btn: {
    height: 32,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});