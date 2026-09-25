import React from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {
  const {
    devices,
    toggleDevice,
    devicesLoading,
    deviceError,
    gatewayConnected,
    updatingDeviceId,
    refreshDevices,
    darkMode,
  } = useIoT();

  return (
    <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>
      <Text style={[styles.title, darkMode && styles.darkText]}>Devices</Text>
      <Text style={[styles.subtitle, darkMode && styles.darkTextSecondary]}>Control your connected devices</Text>

      {!gatewayConnected && <Text style={styles.errorText}>IoT Gateway is disconnected.</Text>}

      {devicesLoading ? (
        <View style={styles.feedback}>
          <ActivityIndicator />
          <Text style={darkMode && styles.darkText}>Loading devices...</Text>
        </View>
      ) : deviceError ? (
        <View style={styles.feedback}>
          <Text style={styles.errorText}>{deviceError}</Text>
          <Button title="Retry" onPress={() => void refreshDevices()} />
        </View>
      ) : null}

      {devices.map((device) => (
        <View key={device.id} style={[styles.deviceCard, darkMode && styles.darkCard]}>
          <View style={styles.deviceInfo}>
            <View style={styles.iconContainer}>
              <Ionicons name={device.icon} size={28} color={darkMode ? '#b8c7d9' : '#1f2937'} />
            </View>
            <View style={styles.deviceDetails}>
              <Text style={[styles.deviceName, darkMode && styles.darkText]}>{device.name}</Text>
              <Text style={[styles.deviceType, darkMode && styles.darkTextSecondary]}>{device.type}</Text>
              <Text style={[styles.deviceState, darkMode && styles.darkTextSecondary]}>{device.status ? 'ON' : 'OFF'}</Text>
            </View>
          </View>
          <View style={styles.control}>
            {updatingDeviceId === device.id && <Text style={darkMode && styles.darkText}>Updating...</Text>}
            <Switch
              value={device.status}
              disabled={!gatewayConnected || updatingDeviceId === device.id}
              onValueChange={(value) => void toggleDevice(device.id, value)}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginTop: 5, marginBottom: 25 },
  feedback: { alignItems: 'center', gap: 8, marginBottom: 16 },
  errorText: { color: '#b42318', marginBottom: 8 },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },
  deviceInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  deviceDetails: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: 'bold' },
  deviceType: { fontSize: 13, marginTop: 3 },
  deviceState: { fontSize: 12, marginTop: 5 },
  control: { alignItems: 'flex-end', gap: 4 },
  darkContainer: { backgroundColor: '#101820' },
  darkCard: { backgroundColor: '#1d2a36' },
  darkText: { color: '#f4f7fb' },
  darkTextSecondary: { color: '#b8c7d9' },
});
