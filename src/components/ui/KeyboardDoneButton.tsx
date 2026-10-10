// src/components/ui/KeyboardDoneButton.tsx
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

/**
 * ✅ Глобальная кнопка «ОК» над клавиатурой.
 * Появляется, когда открыта клавиатура, на любом экране.
 * По нажатию — закрывает клавиатуру.
 */
export default function KeyboardDoneButton() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvt =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      setVisible(true);
      setHeight(e?.endCoordinates?.height ?? 0);
    };
    const onHide = () => {
      setVisible(false);
      setHeight(0);
    };

    const subShow = Keyboard.addListener(showEvt, onShow);
    const subHide = Keyboard.addListener(hideEvt, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, []);

  if (!visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, { bottom: height + 8 }]}
    >
      <Pressable
        onPress={() => Keyboard.dismiss()}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: colors.primaryDark,
            opacity: pressed ? 0.85 : 1,
            shadowColor: colors.shadow,
          },
        ]}
        hitSlop={8}
      >
        <Text style={styles.btnText}>{t('common.ok')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    zIndex: 9999,
  },
  btn: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});