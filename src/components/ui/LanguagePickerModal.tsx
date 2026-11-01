// src/components/ui/LanguagePickerModal.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Ionicons from "@react-native-vector-icons/ionicons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import { $appLanguage, changeLanguage } from '@/effector/domains/settings';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import type { Language } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface LanguagePickerModalProps {
  visible: boolean;
  onClose: () => void;
}

interface LanguageItem {
  code: Language;
  label: string;
}

export default function LanguagePickerModal({
  visible,
  onClose,
}: LanguagePickerModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['55%', '80%'], []);

  const current = useUnit($appLanguage);
  const setLanguage = useUnit(changeLanguage);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        bottomSheetRef.current?.snapToIndex(0);
      });
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  if (!visible) return null;

  const handleSelect = (code: Language) => {
    if (code === current) {
      onClose();
      return;
    }
    setLanguage(code);
    setTimeout(() => onClose(), 80);
  };

  const renderItem = ({ item }: { item: LanguageItem }) => {
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
              styles.flag,
              {
                backgroundColor: isActive
                  ? colors.primaryBg
                  : colors.surfaceSecondary,
              },
            ]}
          >
            <Text style={[styles.flagText, { color: colors.textSecondary }]}>
              {item.code.toUpperCase()}
            </Text>
          </View>
          <Text
            style={[
              styles.label,
              {
                color: isActive ? colors.primary : colors.textPrimary,
                fontWeight: isActive ? '700' : '600',
              },
            ]}
          >
            {item.label}
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
            Language
          </Text>
          <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
            Choose your preferred language
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
        data={SUPPORTED_LANGUAGES as LanguageItem[]}
        keyExtractor={(item: LanguageItem) => item.code}
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
  handlePill: {
    width: 55,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '700' },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  separator: {
    height: 1,
    marginLeft: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  flag: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 15,
  },
});