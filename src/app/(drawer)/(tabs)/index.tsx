import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';

// ✅ Импортируем наш кастомный компонент карты и интерфейс данных
import MapComponent, { GroundItem } from '@/components/MapComponent';

export default function GroundsScreen() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Массив спортивных площадок (сюда вы вставите данные из v0)
  const [mockGrounds, setMockGrounds] = useState<GroundItem[]>([]);

  const [region, setRegion] = useState({
    latitude: 55.7558,
    longitude: 37.6173,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  useEffect(() => {
    async function initScreen() {
      // 1. Запрашиваем геопозицию
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setIsLoading(false);
        Alert.alert('Внимание', 'Разрешите доступ к GPS в настройках телефона.');
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        const userLat = currentLocation.coords.latitude;
        const userLng = currentLocation.coords.longitude;

        // Центрируем карту на пользователе
        setRegion({
          latitude: userLat,
          longitude: userLng,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        });

        // 2. Генерируем тестовые площадки вокруг пользователя для примера
        setMockGrounds([
          {
            id: '1',
            title: 'PlayG Arena (Футбол)',
            description: 'Открытое поле с искусственным газоном',
            latitude: userLat + 0.002,
            longitude: userLng + 0.002,
          },
          {
            id: '2',
            title: 'Стритбольная площадка',
            description: '2 кольца, резиновое покрытие',
            latitude: userLat - 0.003,
            longitude: userLng + 0.004,
          }
        ]);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    initScreen();
  }, []);

  // Функция обработки нажатия на маркер
  const handleGroundSelect = (ground: GroundItem) => {
    console.log('Выбрана площадка:', ground.title);
    // Сюда можно добавить открытие карточки с деталями площадки
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#208AEF" />
        <Text style={styles.loadingText}>Загрузка данных...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ✅ Используем карту как чистый изолированный компонент */}
      <MapComponent 
        region={region} 
        grounds={mockGrounds} 
        onMarkerPress={handleGroundSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF7F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#334A77',
    fontWeight: '500',
  },
});
