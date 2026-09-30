// src/app/ground/create.tsx
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
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUnit } from 'effector-react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { createGroundFx } from '@/effector/events/async/grounds';
import { $userSession } from '@/effector/store';
import LocationPickerModal from '@/components/ui/LocationPickerModal';

import { SPORT_OPTIONS } from '@/constants/sports';
import { AMENITIES_OPTIONS } from '@/constants/amenities';

export default function CreateGroundScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const isSubmitting = useUnit(createGroundFx.pending);
  const user = useUnit($userSession);

  const [name, setName] = useState('');
  const [selectedSport, setSelectedSport] = useState('basketball');
  const [address, setAddress] = useState('');
  const [surface, setSurface] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // ✅ Видимость модалки выбора локации
  const [locationPickerVisible, setLocationPickerVisible] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to upload a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
    );
  };

  // ✅ Открыть модалку
  const handleOpenMap = () => {
    setLocationPickerVisible(true);
  };

  // ✅ Приём координат из модалки
  const handleConfirmLocation = (data: {
  latitude: number;
  longitude: number;
  address?: string;
}) => {
  setLocation({
    lat: data.latitude,
    lng: data.longitude,
  });

  // Автозаполнение адреса, если он ещё не введён вручную
  if (data.address && !address.trim()) {
    setAddress(data.address);
  }

  setLocationPickerVisible(false);
};

  const handlePublish = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Please enter a ground name.');
    if (!address.trim()) return Alert.alert('Error', 'Please enter an address.');
    if (!location) return Alert.alert('Error', 'Please select a location on the map.');

    try {
      await createGroundFx({
        name: name.trim(),
        kindofsport: [selectedSport],
        address: address.trim(),
        coverage: surface.trim() || undefined,
        description: description.trim() || undefined,
        amenities,
        geolocation: {
          lat: location.lat,
          lng: location.lng,
        },
        avatar: avatar
          ? {
              uri: avatar,
              name: 'ground_photo.jpg',
              type: 'image/jpeg',
            }
          : null,
      });
      Alert.alert('Success', 'Ground published successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to create ground.');
    }
  };

  const isFormValid =
    name.trim().length > 0 && address.trim().length > 0 && location !== null;

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
          <Text style={styles.headerTitle}>Add a ground</Text>
          <Text style={styles.headerSubtitle}>Share a spot with the community</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
      >
        <Text style={styles.inputLabel}>Ground name</Text>
        <TextInput
          style={styles.textField}
          placeholder="e.g. Riverside Court"
          placeholderTextColor="#BACAD6"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.inputLabel}>Sport</Text>
        <View style={styles.gridContainer}>
          {SPORT_OPTIONS.map((sport) => {
            const isSelected = selectedSport === sport.id;
            return (
              <Pressable
                key={sport.id}
                onPress={() => setSelectedSport(sport.id)}
                style={[styles.sportCard, isSelected && styles.sportCardSelected]}
              >
                <Ionicons
                  name={sport.icon as any}
                  size={24}
                  color={isSelected ? '#208AEF' : '#6080A8'}
                />
                <Text
                  style={[styles.sportLabel, isSelected && styles.sportLabelSelected]}
                >
                  {sport.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.inputLabel}>Address</Text>
        <TextInput
          style={styles.textField}
          placeholder="Street, area"
          placeholderTextColor="#BACAD6"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.inputLabel}>Surface (optional)</Text>
        <TextInput
          style={styles.textField}
          placeholder="e.g. Artificial turf"
          placeholderTextColor="#BACAD6"
          value={surface}
          onChangeText={setSurface}
        />

        <Text style={styles.inputLabel}>Description (optional)</Text>
        <TextInput
          style={styles.textareaField}
          placeholder="Tell players what makes this spot great..."
          placeholderTextColor="#BACAD6"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.inputLabel}>Amenities</Text>
        <View style={styles.amenitiesWrap}>
          {AMENITIES_OPTIONS.map((amenity) => {
            const isSelected = amenities.includes(amenity);
            return (
              <Pressable
                key={amenity}
                onPress={() => toggleAmenity(amenity)}
                style={[styles.amenityChip, isSelected && styles.amenityChipSelected]}
              >
                <Text
                  style={[styles.amenityText, isSelected && styles.amenityTextSelected]}
                >
                  {amenity}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.inputLabel}>Photo</Text>
        <Pressable style={styles.photoUploadBox} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={32} color="#BACAD6" />
              <Text style={styles.photoPlaceholderText}>Tap to upload a photo</Text>
            </View>
          )}
        </Pressable>

        {/* ✅ Location on map — теперь с реальным выбором */}
        <Text style={styles.inputLabel}>Location on map</Text>
        <Pressable style={styles.mapPickerBox} onPress={handleOpenMap}>
          {location ? (
            <View style={styles.locationSetContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationSetText}>
                  Coordinates: {location.lat.toFixed(5)},{' '}
                  {location.lng.toFixed(5)}
                </Text>
                <Text style={styles.locationChangeHint}>Tap to change</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#BACAD6" />
            </View>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={24} color="#208AEF" />
              <Text style={styles.mapPlaceholderText}>
                Tap to select location on map
              </Text>
            </View>
          )}
        </Pressable>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[
            styles.publishButton,
            isFormValid ? styles.publishButtonActive : styles.publishButtonDisabled,
            isSubmitting && styles.buttonDisabled,
          ]}
          onPress={handlePublish}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.publishButtonText}>Publish ground</Text>
          )}
        </Pressable>
      </View>

      {/* ✅ Модалка выбора локации */}
      <LocationPickerModal
        visible={locationPickerVisible}
        initialLatitude={location?.lat ?? null}
        initialLongitude={location?.lng ?? null}
        onConfirm={handleConfirmLocation}
        onClose={() => setLocationPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sportCard: {
    width: '30%',
    height: 70,              // фиксированная высота вместо aspectRatio
    alignSelf: 'flex-start',  // запрещает растягивание по вертикали
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  sportCardSelected: { borderColor: '#208AEF', backgroundColor: '#F0F6FC' },
  sportLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6080A8',
    marginTop: 4,
    textAlign: 'center',
  },
  sportLabelSelected: { color: '#208AEF', fontWeight: '700' },
  amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  amenityChipSelected: { backgroundColor: '#208AEF', borderColor: '#208AEF' },
  amenityText: { fontSize: 13, color: '#334A77', fontWeight: '500' },
  amenityTextSelected: { color: '#FFFFFF', fontWeight: '600' },
  photoUploadBox: {
    width: '100%',
    height: 160,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  photoPlaceholder: { alignItems: 'center', gap: 8 },
  photoPlaceholderText: { fontSize: 13, color: '#BACAD6', fontWeight: '500' },
  mapPickerBox: {
    width: '100%',
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#E6F4FE',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  mapPlaceholder: { alignItems: 'center', gap: 6 },
  mapPlaceholderText: { fontSize: 13, color: '#208AEF', fontWeight: '600' },
  locationSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  locationSetText: { fontSize: 13, color: '#27AE60', fontWeight: '700' },
  locationChangeHint: {
    fontSize: 11,
    color: '#6080A8',
    fontWeight: '500',
    marginTop: 2,
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
});