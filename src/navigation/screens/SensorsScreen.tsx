import React from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function SensorsScreen() {
  const { sensors, sensorsLoading, sensorError, refreshSensors, darkMode } = useIoT();

  return (
    <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.title, darkMode && styles.darkText]}>Sensors</Text>
      <Text style={[styles.subtitle, darkMode && styles.darkTextSecondary]}>Monitor your environment</Text>

      {sensorsLoading && (
        <View style={styles.feedback}>
          <ActivityIndicator />
          <Text style={darkMode && styles.darkText}>Refreshing Sensors...</Text>
        </View>
      )}

      {sensorError && (
        <View style={styles.feedback}>
          <Text style={styles.errorText}>{sensorError}</Text>
          <Button title="Retry" onPress={() => void refreshSensors()} />
        </View>
      )}

      <SensorCard darkMode={darkMode} icon="thermometer-outline" name="Temperature" value={sensors ? `${sensors.temperature} °C` : '--'} description="Current room temperature" />
      <SensorCard darkMode={darkMode} icon="water-outline" name="Humidity" value={sensors ? `${sensors.humidity} %` : '--'} description="Current relative humidity" />
      <SensorCard darkMode={darkMode} icon="sunny-outline" name="Light Level" value={sensors ? `${sensors.lightLevel} lux` : '--'} description="Current ambient light" />

      <Button
        title={sensorsLoading ? 'Refreshing Sensors...' : 'Refresh Sensors'}
        disabled={sensorsLoading}
        onPress={() => void refreshSensors()}
      />
    </ScrollView>
  );
}

function SensorCard({ icon, name, value, description, darkMode }: {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  value: string;
  description: string;
  darkMode: boolean;
}) {
  return (
    <View style={[styles.sensorCard, darkMode && styles.darkCard]}>
      <View style={styles.sensorHeader}>
        <Ionicons name={icon} size={30} color={darkMode ? '#b8c7d9' : '#1f2937'} />
        <Text style={[styles.sensorName, darkMode && styles.darkText]}>{name}</Text>
      </View>
      <Text style={[styles.sensorValue, darkMode && styles.darkText]}>{value}</Text>
      <Text style={[styles.sensorDescription, darkMode && styles.darkTextSecondary]}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 5, marginBottom: 25 },
  feedback: { alignItems: 'center', gap: 8, marginBottom: 16 },
  errorText: { color: '#b42318', marginBottom: 8 },
  sensorCard: { padding: 20, borderRadius: 15, backgroundColor: '#eeeeee', marginBottom: 15 },
  sensorHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sensorName: { fontSize: 17, fontWeight: 'bold' },
  sensorValue: { fontSize: 32, fontWeight: 'bold', marginTop: 20 },
  sensorDescription: { fontSize: 13, marginTop: 5 },
  darkContainer: { backgroundColor: '#101820' },
  darkCard: { backgroundColor: '#1d2a36' },
  darkText: { color: '#f4f7fb' },
  darkTextSecondary: { color: '#b8c7d9' },
});
