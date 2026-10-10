// src/components/ui/LocationFilterSheet.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import { $locationFilter, setLocationFilter } from '@/effector/store';
import type { LocationFilter } from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface LocationFilterSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface FilterOption {
  code: LocationFilter;
  labelKey: string;
  icon: string;
}

const OPTIONS: FilterOption[] = [
  { code: 'all', labelKey: 'locationFilter.all', icon: 'globe-outline' },
  { code: 'visible', labelKey: 'locationFilter.visible', icon: 'map-outline' },
  { code: 'near', labelKey: 'locationFilter.near', icon: 'navigate-outline' },
  { code: 'city', labelKey: 'locationFilter.city', icon: 'business-outline' },
];

export default function LocationFilterSheet({
  visible,
  onClose,
}: LocationFilterSheetProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const current = useUnit($locationFilter);
  const setFilter = useUnit(setLocationFilter);

  const handleSelect = (code: LocationFilter) => {
    setFilter(code);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <Pressable style={styles.overlay} onPress={onClose}>
        {/* Карточка снизу — не закрывается при клике внутри */}
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              paddingBottom: insets.bottom + 16,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header (без handle) */}
          <View
            style={[
              styles.header,
              {
                borderBottomColor: colors.borderSubtle,
                paddingTop: 18,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {t('locationFilter.title')}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                {t('locationFilter.subtitle')}
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

          {/* Options */}
          <View style={styles.listContent}>
            {OPTIONS.map((item, idx) => {
              const isActive = item.code === current;
              const isLast = idx === OPTIONS.length - 1;
              return (
                <Pressable
                  key={item.code}
                  style={[
                    styles.row,
                    { borderBottomColor: colors.borderSubtle },
                    isLast && styles.rowLast,
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
                        {
                          color: isActive ? colors.primary : colors.textPrimary,
                          fontWeight: isActive ? '700' : '600',
                        },
                      ]}
                    >
                      {t(item.labelKey)}
                    </Text>
                  </View>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '70%',
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
  subtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  listContent: { paddingHorizontal: 12, paddingTop: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderBottomWidth: 1,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15 },
});