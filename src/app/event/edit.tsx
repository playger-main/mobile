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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  fetchEventByIdFx,
  updateEventFx,
} from '@/effector/events/async/events';
import {
  $currentEvent,
  $isEventDetailLoading,
  $grounds,
  $userSession,
} from '@/effector/store';

import GroundPickerModal from '@/components/ui/GroundPickerModal';

export default function EditEventScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
  const [skillLevel, setSkillLevel] = useState('All levels');
  const [playersNeeded, setPlayersNeeded] = useState(10);
  const [duration, setDuration] = useState(90);
  const [description, setDescription] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showGroundPicker, setShowGroundPicker] = useState(false);

  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState<Date>(new Date());

  // ✅ Загружаем событие
  useEffect(() => {
    if (id) fetchEventByIdFx(id);
  }, [id]);

  // ✅ Предзаполняем форму
  useEffect(() => {
    if (!event) return;
    setTitle(event.name || '');
    setSelectedGroundId(event.ground?.id || '');
    setDescription(event.description || '');
    setSkillLevel(event.level || 'All levels');
    setPlayersNeeded(event.maxPlayers || 10);

    // Парсим дату "2025-10-12" -> Date
    if (event.date) {
      const [y, m, d] = event.date.split('-').map(Number);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        setDate(new Date(y, m - 1, d));
      }
    }

    // Парсим время "18:00" -> Date
    if (event.startTime) {
      const [h, min] = event.startTime.split(':').map(Number);
      if (!isNaN(h) && !isNaN(min)) {
        const t = new Date();
        t.setHours(h, min, 0, 0);
        setTime(t);
      }
    }

    // Парсим duration "90 min" -> 90
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

  const handleDateValueChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (Platform.OS === 'ios') setTempDate(selectedDate);
      else {
        setDate(selectedDate);
        setShowDatePicker(false);
      }
    } else if (Platform.OS === 'android') setShowDatePicker(false);
  };

  const handleTimeValueChange = (event: any, selectedTime?: Date) => {
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
    if (!title.trim()) return Alert.alert('Error', 'Please enter an event title.');
    if (!selectedGroundId)
      return Alert.alert('Error', 'Please select a playground.');

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

      Alert.alert('Success', 'Event updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Failed to update event.',
      );
    }
  };

  const isFormValid =
    title.trim().length > 0 && selectedGroundId.length > 0;

  if (isLoading && !event) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
      </View>
    );
  }

  const selectedGround = grounds.find((g) => g.id === selectedGroundId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Edit event</Text>
          <Text style={styles.headerSubtitle}>Update details</Text>
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
        <Text style={styles.inputLabel}>Event title</Text>
        <TextInput
          style={styles.textField}
          placeholder="e.g. Evening pickup basketball"
          placeholderTextColor="#BACAD6"
          value={title}
          onChangeText={setTitle}
        />

        <View style={styles.groundLabelRow}>
          <Text style={styles.inputLabel}>Ground</Text>
          <Pressable
            style={styles.pickOnMapLink}
            onPress={() => setShowGroundPicker(true)}
            hitSlop={6}
          >
            <Ionicons name="map-outline" size={14} color="#208AEF" />
            <Text style={styles.pickOnMapText}>Pick on map</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.selectorField}
          onPress={() => setShowGroundPicker(true)}
        >
          <Text
            style={[
              styles.selectorText,
              !selectedGround && styles.selectorPlaceholder,
            ]}
            numberOfLines={1}
          >
            {selectedGround?.name || 'Select playground court'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6080A8" />
        </Pressable>

        <View style={styles.rowContainer}>
          <View style={styles.flexItem}>
            <Text style={styles.inputLabel}>Date</Text>
            <Pressable style={styles.iconInputField} onPress={handleOpenDatePicker}>
              <Text style={styles.iconInputText}>{formattedDate}</Text>
              <Ionicons name="calendar-outline" size={16} color="#334A77" />
            </Pressable>
          </View>

          <View style={styles.flexItem}>
            <Text style={styles.inputLabel}>Time</Text>
            <Pressable style={styles.iconInputField} onPress={handleOpenTimePicker}>
              <Text style={styles.iconInputText}>{formattedTime}</Text>
              <Ionicons name="time-outline" size={16} color="#334A77" />
            </Pressable>
          </View>
        </View>

        <Text style={styles.inputLabel}>Skill level</Text>
        <View style={styles.chipsWrapContainer}>
          {['All levels', 'Beginner', 'Intermediate', 'Advanced'].map((level) => {
            const isSelected = skillLevel === level;
            return (
              <Pressable
                key={level}
                onPress={() => setSkillLevel(level)}
                style={[styles.chipItem, isSelected && styles.chipItemSelected]}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                  {level}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.flexItem}>
            <Text style={styles.inputLabel}>Players needed</Text>
            <View style={styles.counterBlock}>
              <Pressable
                style={styles.counterButton}
                onPress={() => setPlayersNeeded(Math.max(2, playersNeeded - 1))}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </Pressable>
              <Text style={styles.counterValue}>{playersNeeded}</Text>
              <Pressable
                style={styles.counterButton}
                onPress={() => setPlayersNeeded(playersNeeded + 1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.flexItem}>
            <Text style={styles.inputLabel}>Duration (min)</Text>
            <View style={styles.counterBlock}>
              <Pressable
                style={styles.counterButton}
                onPress={() => setDuration(Math.max(15, duration - 15))}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </Pressable>
              <Text style={styles.counterValue}>{duration}</Text>
              <Pressable
                style={styles.counterButton}
                onPress={() => setDuration(duration + 15)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Text style={styles.inputLabel}>Description (optional)</Text>
        <TextInput
          style={styles.textareaField}
          placeholder="Format, what to bring, meeting point..."
          placeholderTextColor="#BACAD6"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[
            styles.publishButton,
            isFormValid ? styles.publishButtonActive : styles.publishButtonDisabled,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.publishButtonText}>Save changes</Text>
          )}
        </Pressable>
      </View>

      <GroundPickerModal
        visible={showGroundPicker}
        initialGroundId={selectedGroundId}
        onConfirm={handleConfirmGround}
        onClose={() => setShowGroundPicker(false)}
      />

      {/* iOS Date Picker */}
      {Platform.OS === 'ios' && (
        <>
          <Modal visible={showDatePicker} animationType="slide" transparent>
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosModalContent}>
                <View style={styles.iosModalHeaderRow}>
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.iosCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setDate(tempDate);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text style={styles.iosConfirmText}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onValueChange={handleDateValueChange}
                />
              </View>
            </View>
          </Modal>

          <Modal visible={showTimePicker} animationType="slide" transparent>
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosModalContent}>
                <View style={styles.iosModalHeaderRow}>
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.iosCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setTime(tempTime);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={styles.iosConfirmText}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  is24Hour
                  display="spinner"
                  onValueChange={handleTimeValueChange}
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
          is24Hour
          display="default"
          onValueChange={handleTimeValueChange}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#F0F6FC',
    backgroundColor: '#FFFFFF',
  },
  backButton: { padding: 4 },
  headerTitleContainer: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#334A77' },
  headerSubtitle: {
    fontSize: 12,
    color: '#BACAD6',
    fontWeight: '500',
    marginTop: 1,
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    marginTop: 16,
  },
  textField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#334A77',
    backgroundColor: '#FFFFFF',
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
  pickOnMapText: { fontSize: 13, fontWeight: '700', color: '#208AEF' },
  selectorField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  selectorText: {
    fontSize: 14,
    color: '#334A77',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  selectorPlaceholder: { color: '#BACAD6', fontWeight: '400' },
  rowContainer: { flexDirection: 'row', gap: 12 },
  flexItem: { flex: 1 },
  iconInputField: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  iconInputText: { fontSize: 14, color: '#334A77', fontWeight: '500' },
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
    borderColor: '#E6F4FE',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  chipItemSelected: { backgroundColor: '#006EE6', borderColor: '#006EE6' },
  chipText: { fontSize: 13, color: '#334A77', fontWeight: '600' },
  chipTextSelected: { color: '#FFFFFF' },
  counterBlock: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  counterButton: {
    width: 44,
    height: '100%',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButtonText: { fontSize: 20, fontWeight: '600', color: '#334A77' },
  counterValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#334A77',
  },
  textareaField: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#334A77',
    backgroundColor: '#FFFFFF',
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F0F6FC',
    zIndex: 99,
  },
  publishButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  publishButtonActive: { backgroundColor: '#006EE6' },
  publishButtonDisabled: { backgroundColor: '#BACAD6' },
  publishButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  buttonDisabled: { backgroundColor: '#BACAD6' },
  iosModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  iosModalContent: {
    backgroundColor: '#FFFFFF',
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
    borderColor: '#F0F6FC',
  },
  iosCancelText: { fontSize: 16, color: '#6080A8', fontWeight: '500' },
  iosConfirmText: { fontSize: 16, color: '#006EE6', fontWeight: '700' },
});