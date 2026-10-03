// src/components/ui/ThemePickerModal.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import {
  $themeMode,
  changeThemeMode,
} from '@/effector/store';
import type { ThemeMode } from '@/effector/domains/settings';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface ThemePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ThemeOption {
  code: ThemeMode;
  labelKey: string;
  icon: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    code: 'system',
    labelKey: 'settings.themeSystem',
    icon: 'phone-portrait-outline',
  },
  { code: 'light', labelKey: 'settings.themeLight', icon: 'sunny-outline' },
  { code: 'dark', labelKey: 'settings.themeDark', icon: 'moon-outline' },
];

export default function ThemePickerModal({
  visible,
  onClose,
}: ThemePickerModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['51%', '70%'], []);

  const current = useUnit($themeMode);
  const setTheme = useUnit(changeThemeMode);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => bottomSheetRef.current?.snapToIndex(0));
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!visible) return null;

  const handleSelect = (code: ThemeMode) => {
    if (code === current) {
      onClose();
      return;
    }
    setTheme(code);
    setTimeout(() => onClose(), 80);
  };

  const renderItem = ({ item }: { item: ThemeOption }) => {
    const isActive = item.code === current;

    return (
      <Pressable
        style={[
          styles.row,
          isActive && { backgroundColor: colors.primaryBg },
        ]}
        onPress={() => handleSelect(item.code)}
      >
        <View style={styles.rowLeft}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: isActive
                  ? colors.primaryBg
                  : colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name={item.icon as any}
              size={18}
              color={isActive ? colors.primary : colors.textSecondary}
            />
          </View>
          <Text
            style={[
              styles.label,
              { color: isActive ? colors.primary : colors.textPrimary },
            ]}
          >
            {t(item.labelKey)}
          </Text>
        </View>

        {isActive && (
          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
        )}
      </Pressable>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: colors.border,
      }}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View
            style={[styles.handlePill, { backgroundColor: colors.textTertiary }]}
          />
        </View>
      )}
    >
      <View
        style={[styles.header, { borderBottomColor: colors.borderSubtle }]}
      >
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('settings.theme')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            {t('settings.selectTheme')}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={10}
          style={[
            styles.closeBtn,
            { backgroundColor: colors.surfaceSecondary },
          ]}
        >
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <BottomSheetFlatList
        data={THEME_OPTIONS}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.borderSubtle }]}
          />
        )}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  handleContainer: { alignItems: 'center', paddingVertical: 10 },
  handlePill: { width: 55, height: 4, borderRadius: 2 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  separator: { height: 1, marginLeft: 60 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '600' },
});