// src/app/event/create.tsx
import React, { useState } from 'react';
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
  Modal
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { createEventFx } from '@/effector/events/async/events';
import { $grounds } from '@/effector/store';

export default function CreateEventScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { groundId: initialGroundId } = useLocalSearchParams<{ groundId: string }>();

  const grounds = useUnit($grounds);
  const isSubmitting = useUnit(createEventFx.pending);

  // --- Form Field States ---
  const [title, setTitle] = useState('');
  const [selectedGroundId, setSelectedGroundId] = useState(initialGroundId || (grounds?.[0]?.id || ''));
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [skillLevel, setSkillLevel] = useState('All levels');
  const [playersNeeded, setPlayersNeeded] = useState(10);
  const [duration, setDuration] = useState(90);
  const [description, setDescription] = useState('');

  // Visibility triggers for full-screen picker sheets
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Temporary container states specifically for iOS picker adjustments before pressing 'Done'
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [tempTime, setTempTime] = useState<Date>(new Date());

  const formattedDate = `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
  const formattedTime = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

  // Open triggers that safely capture baseline context timestamps
  const handleOpenDatePicker = () => {
    setTempDate(date);
    setShowDatePicker(true);
  };

  const handleOpenTimePicker = () => {
    setTempTime(time);
    setShowTimePicker(true);
  };
  
  // --- Safe compliant DATE Handlers ---
  const handleDateValueChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (Platform.OS === 'ios') {
        setTempDate(selectedDate); // Smoothly mutates ios spinner container
      } else {
        setDate(selectedDate); // Android instantly mutates core timestamp
        setShowDatePicker(false);
      }
    } else if (Platform.OS === 'android') {
      setShowDatePicker(false); // Closes on Android dismiss/outside press
    }
  };

  const handleDateDismiss = () => {
    setShowDatePicker(false);
  };

  // --- Safe compliant TIME Handlers ---
  const handleTimeValueChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      if (Platform.OS === 'ios') {
        setTempTime(selectedTime);
      } else {
        setTime(selectedTime);
        setShowTimePicker(false);
      }
    } else if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
  };

  const handleTimeDismiss = () => {
    setShowTimePicker(false);
  };


  const handlePublish = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an event title.');
      return;
    }
    if (!selectedGroundId) {
      Alert.alert('Error', 'Please select a playground.');
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

      Alert.alert('Success', 'Your match has been successfully published!', [
        { text: 'Awesome', onPress: () => router.replace('/(drawer)/(tabs)/events') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create event. Try again.');
    }
  };

  const isFormValid = title.trim().length > 0 && selectedGroundId.length > 0;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
      style={styles.container}
    >
      {/* Header bar layout configuration */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#006EE6" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Create event</Text>
          <Text style={styles.headerSubtitle}>Organise a game</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        {/* Event Title */}
        <Text style={styles.inputLabel}>Event title</Text>
        <TextInput 
          style={styles.textField}
          placeholder="e.g. Evening pickup basketball"
          placeholderTextColor="#BACAD6"
          value={title}
          onChangeText={setTitle}
        />

        {/* Ground Selector */}
        <Text style={styles.inputLabel}>Ground</Text>
        <View style={styles.selectorField}>
          <Text style={styles.selectorText}>
            {grounds.find(g => g.id === selectedGroundId)?.name || 'Select playground court'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6080A8" />
        </View>

        {/* Date and Time Form Block Elements */}
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

        {/* Skill level */}
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

        {/* Counters */}
        <View style={styles.rowContainer}>
          <View style={styles.flexItem}>
            <Text style={styles.inputLabel}>Players needed</Text>
            <View style={styles.counterBlock}>
              <Pressable style={styles.counterButton} onPress={() => setPlayersNeeded(Math.max(2, playersNeeded - 1))}>
                <Text style={styles.counterButtonText}>-</Text>
              </Pressable>
              <Text style={styles.counterValue}>{playersNeeded}</Text>
              <Pressable style={styles.counterButton} onPress={() => setPlayersNeeded(playersNeeded + 1)}>
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.flexItem}>
            <Text style={styles.inputLabel}>Duration (min)</Text>
            <View style={styles.counterBlock}>
              <Pressable style={styles.counterButton} onPress={() => setDuration(Math.max(15, duration - 15))}>
                <Text style={styles.counterButtonText}>-</Text>
              </Pressable>
              <Text style={styles.counterValue}>{duration}</Text>
              <Pressable style={styles.counterButton} onPress={() => setDuration(duration + 15)}>
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Description */}
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

      {/* ======================================================== */}
      {/* ✅ RESOLVED: OS-SPECIFIC FULL-SCREEN DATE SHEET MODALS   */}
      {/* ======================================================== */}

     
            {/* Native iOS Picker Sheet Interface Wrapper */}
      {Platform.OS === 'ios' && (
        <>
          {/* iOS Date Picker Modal */}
          <Modal visible={showDatePicker} animationType="slide" transparent={true}>
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosModalContent}>
                <View style={styles.iosModalHeaderRow}>
                  <Pressable onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.iosCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={() => { setDate(tempDate); setShowDatePicker(false); }}>
                    <Text style={styles.iosConfirmText}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  minimumDate={new Date()}
                  onValueChange={handleDateValueChange}
                  onDismiss={handleDateDismiss}
                />
              </View>
            </View>
          </Modal>

          {/* iOS Time Picker Modal */}
          <Modal visible={showTimePicker} animationType="slide" transparent={true}>
            <View style={styles.iosModalOverlay}>
              <View style={styles.iosModalContent}>
                <View style={styles.iosModalHeaderRow}>
                  <Pressable onPress={() => setShowTimePicker(false)}>
                    <Text style={styles.iosCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={() => { setTime(tempTime); setShowTimePicker(false); }}>
                    <Text style={styles.iosConfirmText}>Done</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onValueChange={handleTimeValueChange} // ✅ ИСПРАВЛЕНО
                  onDismiss={handleTimeDismiss}         // ✅ ИСПРАВЛЕНО
                />
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* Native Android Dialog Pickers Trigger Elements */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker 
          value={date} 
          mode="date" 
          display="default" 
          minimumDate={new Date()} 
          onValueChange={handleDateValueChange} // ✅ ИСПРАВЛЕНО
          onDismiss={handleDateDismiss}         // ✅ ИСПРАВЛЕНО 
        />
      )}
      {Platform.OS === 'android' && showTimePicker && (
        <DateTimePicker 
          value={time} 
          mode="time" 
          is24Hour={true} 
          display="default" 
          onValueChange={handleTimeValueChange} // ✅ ИСПРАВЛЕНО
          onDismiss={handleTimeDismiss}         // ✅ ИСПРАВЛЕНО 
        />
      )}

      {/* Fixed bottom interactive submit panel bar container */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable 
          style={[
            styles.publishButton, 
            isFormValid ? styles.publishButtonActive : styles.publishButtonDisabled,
            isSubmitting && styles.buttonDisabled
          ]} 
          onPress={handlePublish}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.publishButtonText}>Publish event</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 12, 
    paddingBottom: 12, 
    borderBottomWidth: 1, 
    borderColor: '#F0F6FC', 
    backgroundColor: '#FFFFFF' 
  },
  backButton: { 
    padding: 4 
  },
  headerTitleContainer: { 
    flex: 1, 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#334A77' 
  },
  headerSubtitle: { 
    fontSize: 12, 
    color: '#BACAD6', 
    fontWeight: '500', 
    marginTop: 1 
  },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingTop: 20 
  },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#000000', 
    marginBottom: 8, 
    marginTop: 16 
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
    backgroundColor: '#FFFFFF' 
  },
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
    backgroundColor: '#FFFFFF' 
  },
  selectorText: { 
    fontSize: 14, 
    color: '#334A77', 
    fontWeight: '500' 
  },
  rowContainer: { 
    flexDirection: 'row', 
    gap: 12 
  },
  flexItem: { 
    flex: 1 
  },
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
    backgroundColor: '#FFFFFF' 
  },
  iconInputText: { 
    fontSize: 14, 
    color: '#334A77', 
    fontWeight: '500' 
  },
  chipsWrapContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginVertical: 4 
  },
  chipItem: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderWidth: 1, 
    borderColor: '#E6F4FE', 
    borderRadius: 20, 
    backgroundColor: '#FFFFFF' 
  },
  chipItemSelected: { 
    backgroundColor: '#006EE6', 
    borderColor: '#006EE6' 
  },
  chipText: { 
    fontSize: 13, 
    color: '#334A77', 
    fontWeight: '600' 
  },
  chipTextSelected: { 
    color: '#FFFFFF' 
  },
  counterBlock: { 
    height: 48, 
    borderWidth: 1, 
    borderColor: '#E6F4FE', 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    overflow: 'hidden' 
  },
  counterButton: { 
    width: 44, 
    height: '100%', 
    backgroundColor: '#F8FAFC', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  counterButtonText: { 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#334A77' 
  },
  counterValue: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 15, 
    fontWeight: '700', 
    color: '#334A77' 
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
    lineHeight: 20 
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
    zIndex: 99 
  },
  publishButton: { 
    width: '100%', 
    height: 50, 
    borderRadius: 14, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  publishButtonActive: { 
    backgroundColor: '#006EE6' 
  },
  publishButtonDisabled: { 
    backgroundColor: '#BACAD6' 
  },
  publishButtonText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: '700' 
  },
  buttonDisabled: { 
    backgroundColor: '#BACAD6' 
  },

  // Backdrop Overlay Configurations
  iosModalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'flex-end' 
  },
  iosModalContent: { 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingBottom: 40, 
    paddingHorizontal: 16 
  },
  iosModalHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderColor: '#F0F6FC' 
  },
  iosCancelText: { 
    fontSize: 16, 
    color: '#6080A8', 
    fontWeight: '500' 
  },
  iosConfirmText: { 
    fontSize: 16, 
    color: '#006EE6', 
    fontWeight: '700' 
  }
});
