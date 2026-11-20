// src/components/ui/LocationFilterSheet.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Ionicons from "@react-native-vector-icons/ionicons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnit } from 'effector-react';

import {
  $locationFilter,
  $useLocation,
  $eventFilter,
  setLocationFilter,
  setEventFilter,
} from '@/effector/store';
import type { LocationFilter, EventFilter } from '@/effector/store';
import { useTranslation } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';

interface LocationFilterSheetProps {
  visible: boolean;
  onClose: () => void;
}

type FilterTone = 'primary' | 'accent' | 'warning';

interface FilterOption<T> {
  code: T;
  labelKey: string;
  icon: string;
  /** ✅ Цвет по смыслу: как в легенде карты (зелёный/оранжевый) */
  tone?: FilterTone;
}

const LOCATION_OPTIONS: FilterOption<LocationFilter>[] = [
  { code: 'all', labelKey: 'locationFilter.all', icon: 'globe-outline' },
  { code: 'visible', labelKey: 'locationFilter.visible', icon: 'map-outline' },
  { code: 'near', labelKey: 'locationFilter.near', icon: 'navigate-outline' },
  { code: 'city', labelKey: 'locationFilter.city', icon: 'business-outline' },
];

// ✅ Фильтр по событиям: подсказывает, где вообще есть что-то живое
const EVENT_OPTIONS: FilterOption<EventFilter>[] = [
  // ✅ полная палитра: зелёный — события сегодня, оранжевый — есть события
  { code: 'all', labelKey: 'filters.eventsAll', icon: 'albums-outline', tone: 'primary' },
  { code: 'today', labelKey: 'filters.eventsToday', icon: 'flash', tone: 'accent' },
  { code: 'any', labelKey: 'filters.eventsAny', icon: 'calendar', tone: 'warning' },
];

export default function LocationFilterSheet({
  visible,
  onClose,
}: LocationFilterSheetProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const useLocation = useUnit($useLocation);
  const currentLocation = useUnit($locationFilter);
  const currentEvents = useUnit($eventFilter);
  const setLocation = useUnit(setLocationFilter);
  const setEvents = useUnit(setEventFilter);

  // ✅ near/city считаются от координат пользователя — без них они бессмысленны
  const locationOptions = useLocation
    ? LOCATION_OPTIONS
    : LOCATION_OPTIONS.filter(
        (option) => option.code !== 'near' && option.code !== 'city',
      );

  const handleSelectLocation = (code: LocationFilter) => {
    setLocation(code);
    onClose();
  };

  const handleSelectEvents = (code: EventFilter) => {
    setEvents(code);
    onClose();
  };

  const renderRow = <T extends string>(params: {
    item: FilterOption<T>;
    isActive: boolean;
    isLast: boolean;
    onPress: (code: T) => void;
  }) => {
    const { item, isActive, isLast, onPress } = params;

    // ✅ Цвет выбранного = цвет смысла опции (легенда карты),
    //    «Все площадки» остаётся нейтральным (primary).
    const toneFg =
      item.tone === 'accent'
        ? colors.accent
        : item.tone === 'warning'
          ? colors.warning
          : colors.primary;
    const toneBg =
      item.tone === 'accent'
        ? colors.accentBg
        : item.tone === 'warning'
          ? colors.warningBg
          : colors.primaryBg;

    return (
      <Pressable
        key={item.code}
        style={[
          styles.row,
          { borderBottomColor: colors.borderSubtle },
          isLast && styles.rowLast,
          isActive && { backgroundColor: toneBg },
        ]}
        onPress={() => onPress(item.code)}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={t(item.labelKey)}
      >
        <View style={styles.rowLeft}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: isActive
                  ? toneBg
                  : colors.surfaceSecondary,
              },
            ]}
          >
            <Ionicons
              name={item.icon as any}
              size={18}
              // ✅ иконка всегда в цвете смысла (зелёный / оранжевый / синий)
              color={toneFg}
            />
          </View>
          <Text
            style={[
              styles.label,
              {
                color: isActive ? toneFg : colors.textPrimary,
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
            color={toneFg}
          />
        )}
      </Pressable>
    );
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
                {t('filters.title')}
              </Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                {t('filters.subtitle')}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={[
                styles.closeBtn,
                { backgroundColor: colors.surfaceSecondary },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.listContent}
            contentContainerStyle={{ paddingBottom: 8 }}
            showsVerticalScrollIndicator={false}
          >
            {/* ===== ЛОКАЦИЯ ===== */}
            {locationOptions.map((item, idx) =>
              renderRow({
                item,
                isActive: item.code === currentLocation,
                isLast: idx === locationOptions.length - 1,
                onPress: handleSelectLocation,
              }),
            )}

            {/* ===== СОБЫТИЯ ===== */}
            <Text
              style={[styles.sectionTitle, { color: colors.textTertiary }]}
            >
              {t('filters.eventsSection')}
            </Text>

            {EVENT_OPTIONS.map((item, idx) =>
              renderRow({
                item,
                isActive: item.code === currentEvents,
                isLast: idx === EVENT_OPTIONS.length - 1,
                onPress: handleSelectEvents,
              }),
            )}
          </ScrollView>
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
    maxHeight: '80%',
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
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 14,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
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
