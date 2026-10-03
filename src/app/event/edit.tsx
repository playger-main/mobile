// src/app/event/edit.tsx
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Modal,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import { fetchEventByIdFx, updateEventFx } from '@/effector/events/async/events';
import {
  $currentEvent,
  $isEventDetailLoading,
  $grounds,
  $userSession,
} from '@/effector/store';

import GroundPickerModal from '@/components/ui/GroundPickerModal';
import { useTranslation } from '@/i18n';
import { SKILL_LEVELS, getSkillLevelKey } from '@/constants/skillLevels';
import { useTheme } from '@/hooks/useTheme';

export default function EditEventScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { theme, colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const event = useUnit($currentEvent);
  const isLoading = useUnit($isEventDetailLoading);
  const isSubmitting = useUnit(updateEventFx.pending);
  const grounds = useUnit($grounds);
  const user = useUnit($userSession);

  const [title, setTitle] = useState('');
  const [selectedGroundId, setSelectedGroundId] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [skillLevel, setSkillLevel] = useState<string>('all');
  const [playersNeeded, setPlayersNeeded] = useState(10);
  const [duration, setDuration] = useState(90);
  const [description, setDescription] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGroundPicker, setShowGroundPicker] = useState(false);

  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState<Date>(new Date());

  useEffect(() => {
    if (id) fetchEventByIdFx(id);
  }, [id]);

  useEffect(() => {
    if (!event) return;
    setTitle(event.name || '');
    setSelectedGroundId(event.ground?.id || '');
    setDescription(event.description || '');
    setSkillLevel(event.level || 'all');
    setPlayersNeeded(event.maxPlayers || 10);

    if (event.date) {
      const [y, m, d] = event.date.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        setDate(new Date(y, m - 1, d));
      }
    }

    if (event.startTime) {
      const [h, min] = event.startTime.split(':').map(Number);
      if (!isNaN(h) && !isNaN(min)) {
        const timeDate = new Date();
        timeDate.setHours(h, min, 0, 0);
        setTime(timeDate);
      }
    }

    if (event.duration) {
      const num = parseInt(event.duration, 10);
      if (!isNaN(num)) setDuration(num);
    }
  }, [event]);

  const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  const handleOpenDatePicker = () => {
    setTempDate(date);
    setShowDatePicker(true);
  };
  const handleOpenTimePicker = () => {
    setTempTime(time);
    setShowTimePicker(true);
  };

  const handleDateValueChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (Platform.OS === 'ios') setTempDate(selectedDate);
      else {
        setDate(selectedDate);
        setShowDatePicker(false);
      }
    } else if (Platform.OS === 'android') setShowDatePicker(false);
  };

  const handleTimeValueChange = (_event: any, selectedTime?: Date) => {
    if (selectedTime) {
      if (Platform.OS === 'ios') setTempTime(selectedTime);
      else {
        setTime(selectedTime);
        setShowTimePicker(false);
      }
    } else if (Platform.OS === 'android') setShowTimePicker(false);
  };

  const handleConfirmGround = (ground: any) => {
    setSelectedGroundId(ground.id);
    setShowGroundPicker(false);
  };

  const handleSave = async () => {
    Keyboard.dismiss();

    if (!title.trim()) {
      Alert.alert(t('common.error'), t('events.form.titleRequired'));
      return;
    }
    if (!selectedGroundId) {
      Alert.alert(t('common.error'), t('events.form.groundRequired'));
      return;
    }

    const backendDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try {
      await updateEventFx({
        id: id!,
        name: title.trim(),
        description: description.trim(),
        date: backendDate,
        startTime: formattedTime,
        duration: `${duration} min`,
        level: skillLevel,
        maxPlayers: playersNeeded,
        groundId: selectedGroundId,
      });

      Alert.alert(t('common.success'), t('events.form.updateSuccess'), [
        {
          text: t('common.ok'),
          onPress: () => {
            setTimeout(() => router.back(), 150);
          },
        },
      ]);
    } catch (err: any) {
      const raw = err?.response?.data?.message ?? err?.message;
      const message = Array.isArray(raw)
        ? raw.join('\n')
        : typeof raw === 'string'
          ? raw
          : t('common.tryAgain');
      Alert.alert(t('common.error'), message);
    }
  };

  const isFormValid = title.trim().length > 0 && selectedGroundId.length > 0;

  if (isLoading && !event) {
    return (
      <View
        style={[styles.loaderContainer, { backgroundColor: colors.listBackground }]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const selectedGround = grounds.find((g) => g.id === selectedGroundId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.listBackground }]}
    >
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 6,
            backgroundColor: colors.background,
            borderColor: colors.borderSubtle,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t('events.edit.title')}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>
            {t('events.edit.subtitle')}
          </Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
      >
        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('events.form.titleLabel')}
        </Text>
        <TextInput
          style={[
            styles.textField,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          placeholder={t('events.form.titlePlaceholder')}
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.groundLabelRow}>
          <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
            {t('events.form.ground')}
          </Text>
          <Pressable
            style={styles.pickOnMapLink}
            onPress={() => setShowGroundPicker(true)}
            hitSlop={6}
          >
            <Ionicons name="map-outline" size={14} color={colors.primary} />
            <Text style={[styles.pickOnMapText, { color: colors.primary }]}>
              {t('events.form.pickOnMap')}
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.selectorField,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowGroundPicker(true)}
        >
          <Text
            style={[
              styles.selectorText,
              { color: colors.textPrimary },
              !selectedGround && {
                color: colors.textTertiary,
                fontWeight: '400',
              },
            ]}
            numberOfLines={1}
          >
            {selectedGround?.name || t('events.form.selectGround')}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>

        <View style={styles.rowContainer}>
          <View style={styles.flexItem}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
              {t('events.form.date')}
            </Text>
            <Pressable
              style={[
                styles.iconInputField,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleOpenDatePicker}
            >
              <Text
                style={[styles.iconInputText, { color: colors.textPrimary }]}
              >
                {formattedDate}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          <View style={styles.flexItem}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
              {t('events.form.time')}
            </Text>
            <Pressable
              style={[
                styles.iconInputField,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={handleOpenTimePicker}
            >
              <Text
                style={[styles.iconInputText, { color: colors.textPrimary }]}
              >
                {formattedTime}
              </Text>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('events.form.skillLevel')}
        </Text>
        <View style={styles.chipsWrapContainer}>
          {SKILL_LEVELS.map((level) => {
            const isSelected = skillLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => setSkillLevel(level)}
                style={[
                  styles.chipItem,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isSelected ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {t(getSkillLevelKey(level))}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.flexItem}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
              {t('events.form.playersNeeded')}
            </Text>
            <View
              style={[
                styles.counterBlock,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.counterButton,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() =>
                  setPlayersNeeded(Math.max(2, playersNeeded - 1))
                }
              >
                <Text
                  style={[
                    styles.counterButtonText,
                    { color: colors.textPrimary },
                  ]}
                >
                  -
                </Text>
              </Pressable>
              <Text
                style={[styles.counterValue, { color: colors.textPrimary }]}
              >
                {playersNeeded}
              </Text>
              <Pressable
                style={[
                  styles.counterButton,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() => setPlayersNeeded(playersNeeded + 1)}
              >
                <Text
                  style={[
                    styles.counterButtonText,
                    { color: colors.textPrimary },
                  ]}
                >
                  +
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.flexItem}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
              {t('events.form.duration')}
            </Text>
            <View
              style={[
                styles.counterBlock,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Pressable
                style={[
                  styles.counterButton,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() => setDuration(Math.max(15, duration - 15))}
              >
                <Text
                  style={[
                    styles.counterButtonText,
                    { color: colors.textPrimary },
                  ]}
                >
                  -
                </Text>
              </Pressable>
              <Text
                style={[styles.counterValue, { color: colors.textPrimary }]}
              >
                {duration}
              </Text>
              <Pressable
                style={[
                  styles.counterButton,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() => setDuration(duration + 15)}
              >
                <Text
                  style={[
                    styles.counterButtonText,
                    { color: colors.textPrimary },
                  ]}
                >
                  +
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('events.form.description')}
        </Text>
        <TextInput
          style={[
            styles.textareaField,
            {
              color: colors.textPrimary,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          placeholder={t('events.form.descriptionPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>

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
          style={[styles.publishButton, { backgroundColor: colors.primaryDark }]}
          onPress={handleSave}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.publishButtonText, { color: '#FFFFFF' }]}>
              {t('common.saveChanges')}
            </Text>
          )}
        </Pressable>
      </View>

      <GroundPickerModal
        visible={showGroundPicker}
        initialGroundId={selectedGroundId}
        onConfirm={handleConfirmGround}
        onClose={() => setShowGroundPicker(false)}
      />

      {Platform.OS === 'ios' && (
        <>
          <Modal visible={showDatePicker} animationType="slide" transparent>
            <View style={styles.iosModalOverlay}>
              <View
                style={[
                  styles.iosModalContent,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.iosModalHeaderRow,
                    { borderColor: colors.borderSubtle },
                  ]}
                >
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text
                      style={[
                        styles.iosCancelText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {t('common.cancel')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setDate(tempDate);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text
                      style={[styles.iosConfirmText, { color: colors.primary }]}
                    >
                      {t('common.ok')}
                    </Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onValueChange={handleDateValueChange}
                  themeVariant={theme === 'dark' ? 'dark' : 'light'}
                />
              </View>
            </View>
          </Modal>

          <Modal visible={showTimePicker} animationType="slide" transparent>
            <View style={styles.iosModalOverlay}>
              <View
                style={[
                  styles.iosModalContent,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View
                  style={[
                    styles.iosModalHeaderRow,
                    { borderColor: colors.borderSubtle },
                  ]}
                >
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <Text
                      style={[
                        styles.iosCancelText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {t('common.cancel')}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTime(tempTime);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text
                      style={[styles.iosConfirmText, { color: colors.primary }]}
                    >
                      {t('common.ok')}
                    </Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onValueChange={handleTimeValueChange}
                  themeVariant={theme === 'dark' ? 'dark' : 'light'}
                />
              </View>
            </View>
          </Modal>
        </>
      )}

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onValueChange={handleDateValueChange}
        />
      )}
      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onValueChange={handleTimeValueChange}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, fontWeight: '500', marginTop: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  textField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  groundLabelRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  pickOnMapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingBottom: 2,
  },
  pickOnMapText: { fontSize: 13, fontWeight: '700' },
  selectorField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  rowContainer: { flexDirection: 'row', gap: 12 },
  flexItem: { flex: 1 },
  iconInputField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconInputText: { fontSize: 14, fontWeight: '500' },
  chipsWrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 4,
  },
  chipItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
  },
  chipText: { fontSize: 13, fontWeight: '600' },
  counterBlock: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  counterButton: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: { fontSize: 20, fontWeight: '600' },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
  },
  textareaField: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
  },
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
  publishButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  iosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  iosModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  iosModalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  iosCancelText: { fontSize: 16, fontWeight: '500' },
  iosConfirmText: { fontSize: 16, fontWeight: '700' },
});