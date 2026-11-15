// src/app/event/create.tsx
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
  Modal,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUnit } from 'effector-react';
import Ionicons from "@react-native-vector-icons/ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';

import { createEventFx } from '@/effector/events/async/events';
import { $grounds, fetchGroundsFx } from '@/effector/store';
import GroundPickerModal from '@/components/ui/GroundPickerModal';
import ScreenHeader from '@/components/forms/ScreenHeader';
import ChipGroup from '@/components/forms/ChipGroup';
import Counter from '@/components/forms/Counter';
import FormBottomBar from '@/components/forms/FormBottomBar';
import { useTranslation } from '@/i18n';
import { SKILL_LEVELS, getSkillLevelKey } from '@/constants/skillLevels';
import { useTheme } from '@/hooks/useTheme';

export default function CreateEventScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useTranslation();
  const { theme, colors } = useTheme();
  const { groundId: initialGroundId } = useLocalSearchParams<{ groundId: string }>();

  const grounds = useUnit($grounds);
  const isSubmitting = useUnit(createEventFx.pending);

  const [title, setTitle] = useState('');
  const [selectedGroundId, setSelectedGroundId] = useState(
    initialGroundId || grounds?.[0]?.id || '',
  );
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

  const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  useEffect(() => {
    if (grounds.length === 0) {
      fetchGroundsFx();
    }
  }, []);

  useEffect(() => {
    if (!initialGroundId || grounds.length === 0) return;
    const g = grounds.find((x) => x.id === initialGroundId);
    if (g && g.confirmed === false) {
      Alert.alert(
        t('events.form.groundPending'),
        t('events.form.groundPendingHint'),
        [{ text: t('common.ok'), onPress: () => setSelectedGroundId('') }],
      );
    }
  }, [initialGroundId, grounds]);

  const selectedGround = grounds.find((g) => g.id === selectedGroundId);
  const isGroundUnconfirmed = selectedGround?.confirmed === false;

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

  const handlePublish = async () => {
    Keyboard.dismiss();

    if (!title.trim()) {
      Alert.alert(t('common.error'), t('events.form.titleRequired'));
      return;
    }
    if (!selectedGroundId) {
      Alert.alert(t('common.error'), t('events.form.groundRequired'));
      return;
    }
    if (selectedGround?.confirmed === false) {
      Alert.alert(
        t('events.form.groundPending'),
        t('events.form.groundPendingHint'),
      );
      return;
    }

    const backendDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    try {
      await createEventFx({
        name: title.trim(),
        description: description.trim(),
        date: backendDate,
        startTime: formattedTime,
        duration: `${duration} min`,
        level: skillLevel,
        maxPlayers: playersNeeded,
        groundId: selectedGroundId,
      });

      Alert.alert(t('common.success'), t('events.form.publishMessage'), [
        {
          text: t('common.ok'),
          onPress: () => {
            setTimeout(() => {
              router.replace('/(drawer)/(tabs)/events');
            }, 150);
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

  const isFormValid =
    title.trim().length > 0 &&
    selectedGroundId.length > 0 &&
    !isGroundUnconfirmed;

  // ✅ №20: кнопка визуально отражает доступность
  const publishDisabled = isSubmitting || !isFormValid;
  const publishBg = publishDisabled ? colors.disabledBg : colors.primaryDark;
  const publishTextColor = publishDisabled ? colors.textTertiary : '#FFFFFF';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.listBackground }]}
    >
      <ScreenHeader
        title={t('events.create.title')}
        subtitle={t('events.create.subtitle')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
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
              !selectedGround && { color: colors.textTertiary, fontWeight: '400' },
            ]}
            numberOfLines={1}
          >
            {selectedGround?.name || t('events.form.selectGround')}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </Pressable>

        {selectedGround?.address ? (
          <Text
            style={[styles.selectedGroundAddress, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />{' '}
            {selectedGround.address}
          </Text>
        ) : null}

        {isGroundUnconfirmed && (
          <View
            style={[
              styles.warningNotice,
              {
                backgroundColor: colors.warningBg,
                borderColor: colors.warning + '80',
              },
            ]}
          >
            <Ionicons name="warning-outline" size={18} color={colors.warning} />
            <Text style={[styles.warningNoticeText, { color: colors.warning }]}>
              {t('events.form.groundPendingHint')}
            </Text>
          </View>
        )}

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
              <Text style={[styles.iconInputText, { color: colors.textPrimary }]}>
                {formattedDate}
              </Text>
              <Ionicons name="calendar-outline" size={16} color={colors.textPrimary} />
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
              <Text style={[styles.iconInputText, { color: colors.textPrimary }]}>
                {formattedTime}
              </Text>
              <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
          {t('events.form.skillLevel')}
        </Text>
        <ChipGroup
          options={SKILL_LEVELS.map((level) => ({
            value: level,
            label: t(getSkillLevelKey(level)),
          }))}
          value={skillLevel}
          onChange={setSkillLevel}
        />

        <View style={styles.rowContainer}>
          <View style={styles.flexItem}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
              {t('events.form.playersNeeded')}
            </Text>
            <Counter
              value={playersNeeded}
              onChange={setPlayersNeeded}
              min={2}
              label={t('events.form.playersNeeded')}
            />
          </View>

          <View style={styles.flexItem}>
            <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
              {t('events.form.duration')}
            </Text>
            <Counter
              value={duration}
              onChange={setDuration}
              min={15}
              step={15}
              label={t('events.form.duration')}
            />
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

      {Platform.OS === 'ios' && (
        <>
          <Modal visible={showDatePicker} animationType="slide" transparent>
            <View style={styles.iosModalOverlay}>
              <View
                style={[styles.iosModalContent, { backgroundColor: colors.surface }]}
              >
                <View
                  style={[
                    styles.iosModalHeaderRow,
                    { borderColor: colors.borderSubtle },
                  ]}
                >
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text
                      style={[styles.iosCancelText, { color: colors.textSecondary }]}
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
                  minimumDate={new Date()}
                  onValueChange={handleDateValueChange}
                  themeVariant={theme === 'dark' ? 'dark' : 'light'}
                />
              </View>
            </View>
          </Modal>

          <Modal visible={showTimePicker} animationType="slide" transparent>
            <View style={styles.iosModalOverlay}>
              <View
                style={[styles.iosModalContent, { backgroundColor: colors.surface }]}
              >
                <View
                  style={[
                    styles.iosModalHeaderRow,
                    { borderColor: colors.borderSubtle },
                  ]}
                >
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <Text
                      style={[styles.iosCancelText, { color: colors.textSecondary }]}
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
          minimumDate={new Date()}
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

      <FormBottomBar
        label={t('events.form.publishButton')}
        onPress={handlePublish}
        disabled={publishDisabled}
        loading={isSubmitting}
        backgroundColor={publishBg}
        textColor={publishTextColor}
      />

      <GroundPickerModal
        visible={showGroundPicker}
        initialGroundId={selectedGroundId}
        onConfirm={handleConfirmGround}
        onClose={() => setShowGroundPicker(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  selectedGroundAddress: { fontSize: 12, marginTop: 6, marginLeft: 2 },
  warningNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  warningNoticeText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 17,
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
  textareaField: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    lineHeight: 20,
  },
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