// src/components/ui/LanguagePickerModal.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import BottomSheet, {
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import { $appLanguage, changeLanguage } from '@/effector/domains/settings';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import type { Language } from '@/i18n';

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
    // Даём UI обновиться, потом закрываем
    setTimeout(() => onClose(), 80);
  };

  const renderItem = ({ item }: { item: LanguageItem }) => {
    const isActive = item.code === current;
    return (
      <Pressable
        style={[styles.row, isActive && styles.rowActive]}
        onPress={() => handleSelect(item.code)}
      >
        <View style={styles.rowLeft}>
          <View
            style={[styles.flag, isActive && styles.flagActive]}
          >
            <Text style={styles.flagText}>
              {item.code.toUpperCase()}
            </Text>
          </View>
          <Text
            style={[styles.label, isActive && styles.labelActive]}
          >
            {item.label}
          </Text>
        </View>

        {isActive && (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color="#208AEF"
          />
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
      backgroundStyle={styles.sheetBackground}
      handleComponent={() => (
        <View style={styles.handleContainer}>
          <View style={styles.handlePill} />
        </View>
      )}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Language</Text>
          <Text style={styles.subtitle}>Choose your preferred language</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
          <Ionicons name="close" size={20} color="#6080A8" />
        </Pressable>
      </View>

      {/* List */}
      <BottomSheetFlatList
        data={SUPPORTED_LANGUAGES as LanguageItem[]}
        keyExtractor={(item: LanguageItem) => item.code}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handleContainer: { alignItems: 'center', paddingVertical: 10 },
  handlePill: {
    width: 55,
    height: 4,
    backgroundColor: '#BACAD6',
    borderRadius: 2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F6FC',
  },
  title: { fontSize: 18, fontWeight: '700', color: '#334A77' },
  subtitle: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F6FC',
    marginLeft: 8,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F6FC',
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
  rowActive: {
    backgroundColor: '#F8FBFF',
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
    backgroundColor: '#F0F6FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagActive: {
    backgroundColor: '#EBF3FF',
  },
  flagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6080A8',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334A77',
  },
  labelActive: {
    color: '#208AEF',
    fontWeight: '700',
  },
});