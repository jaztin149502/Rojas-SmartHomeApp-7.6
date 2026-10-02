import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function DashboardScreen() {
  const {
    devices,
    sensors,
    sensorsLoading,
    sensorError,
    devicesLoading,
    deviceError,
    toggleDevice,
    gatewayConnected,
    gatewayConnecting,
    gatewayError,
    refreshDevices,
    refreshSensors,
    connectToGateway,
    disconnectFromGateway,
    updatingDeviceId,
    darkMode,
  } = useIoT();

  const palette = darkMode ? darkPalette : lightPalette;

  return (
    <ScrollView style={[styles.screen, { backgroundColor: palette.background }]} contentContainerStyle={styles.content}>
      <View style={styles.heading}>
        <View>
          <Text style={[styles.eyebrow, { color: palette.secondary }]}>HOME OVERVIEW</Text>
          <Text style={[styles.title, { color: palette.text }]}>Smart home</Text>
          <Text style={[styles.subtitle, { color: palette.secondary }]}>Your home at a glance</Text>
        </View>
        <View style={[styles.statusPill, { backgroundColor: gatewayConnected ? palette.successSoft : palette.warningSoft }]}>
          <View style={[styles.statusDot, { backgroundColor: gatewayConnected ? palette.success : palette.warning }]} />
          <Text style={[styles.statusText, { color: gatewayConnected ? palette.success : palette.warning }]}>
            {gatewayConnected ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <View style={[styles.gatewayPanel, { backgroundColor: palette.panel, borderColor: palette.border }]}>
        <View style={styles.gatewayCopy}>
          <View style={[styles.gatewayIcon, { backgroundColor: palette.accentSoft }]}>
            <Ionicons name="wifi-outline" size={22} color={palette.accent} />
          </View>
          <View style={styles.gatewayText}>
            <Text style={[styles.gatewayTitle, { color: palette.text }]}>IoT Gateway</Text>
            <Text style={[styles.gatewayDescription, { color: palette.secondary }]}>
              {gatewayConnected ? 'Your devices are ready to control.' : 'Connect to load live home data and control devices.'}
            </Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={gatewayConnecting}
          onPress={() => void (gatewayConnected ? disconnectFromGateway() : connectToGateway())}
          style={({ pressed }) => [
            styles.gatewayButton,
            { backgroundColor: gatewayConnected ? palette.panel : palette.accent, borderColor: palette.accent },
            pressed && styles.pressed,
            gatewayConnecting && styles.disabled,
          ]}
        >
          {gatewayConnecting ? (
            <ActivityIndicator size="small" color={gatewayConnected ? palette.accent : '#ffffff'} />
          ) : (
            <Text style={[styles.gatewayButtonText, { color: gatewayConnected ? palette.accent : '#ffffff' }]}>
              {gatewayConnected ? 'Disconnect' : 'Connect'}
            </Text>
          )}
        </Pressable>
      </View>
      {gatewayError && <Text style={styles.errorText}>{gatewayError}</Text>}

      <View style={styles.sectionHeading}>
        <View>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Environment</Text>
          <Text style={[styles.sectionSubtitle, { color: palette.secondary }]}>Latest sensor readings</Text>
        </View>
        {sensorsLoading && <ActivityIndicator color={palette.accent} />}
      </View>
      {sensorError && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{sensorError}</Text>
          <Button title="Retry" onPress={() => void refreshSensors()} />
        </View>
      )}
      <View style={styles.metricsRow}>
        <Metric icon="thermometer-outline" label="Temperature" value={sensors ? `${sensors.temperature}°` : '--'} unit="C" palette={palette} />
        <Metric icon="water-outline" label="Humidity" value={sensors ? `${sensors.humidity}` : '--'} unit="%" palette={palette} />
        <Metric icon="sunny-outline" label="Light" value={sensors ? `${sensors.lightLevel}` : '--'} unit="lux" palette={palette} />
      </View>

      <View style={styles.sectionHeading}>
        <View>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Devices</Text>
          <Text style={[styles.sectionSubtitle, { color: palette.secondary }]}>
            {devices.filter((device) => device.status).length} of {devices.length} active
          </Text>
        </View>
        {devicesLoading && <ActivityIndicator color={palette.accent} />}
      </View>
      {deviceError && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{deviceError}</Text>
          <Button title="Retry" onPress={() => void refreshDevices()} />
        </View>
      )}

      {devices.map((device) => (
        <View key={device.id} style={[styles.deviceRow, { backgroundColor: palette.panel, borderColor: palette.border }]}>
          <View style={[styles.deviceIcon, { backgroundColor: palette.iconSurface }]}>
            <Ionicons name={device.icon} size={21} color={palette.accent} />
          </View>
          <View style={styles.deviceCopy}>
            <Text style={[styles.deviceName, { color: palette.text }]}>{device.name}</Text>
            <Text style={[styles.deviceType, { color: palette.secondary }]}>{device.type}</Text>
          </View>
          <View style={styles.deviceAction}>
            <Text style={[styles.deviceState, { color: device.status ? palette.success : palette.secondary }]}>
              {updatingDeviceId === device.id ? 'Updating' : device.status ? 'On' : 'Off'}
            </Text>
            <Switch
              value={device.status}
              disabled={!gatewayConnected || updatingDeviceId === device.id}
              onValueChange={(value) => void toggleDevice(device.id, value)}
              trackColor={{ false: palette.switchOff, true: palette.accent }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

function Metric({ icon, label, value, unit, palette }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  unit: string;
  palette: typeof lightPalette;
}) {
  return (
    <View style={[styles.metric, { backgroundColor: palette.panel, borderColor: palette.border }]}>
      <Ionicons name={icon} size={19} color={palette.accent} />
      <Text style={[styles.metricLabel, { color: palette.secondary }]} numberOfLines={1}>{label}</Text>
      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, { color: palette.text }]}>{value}</Text>
        <Text style={[styles.metricUnit, { color: palette.secondary }]}>{unit}</Text>
      </View>
    </View>
  );
}

const lightPalette = {
  background: '#f4f7f8', panel: '#ffffff', border: '#e1e8eb', text: '#14232b',
  secondary: '#647780', accent: '#087e75', accentSoft: '#e4f3f1', iconSurface: '#edf6f5',
  success: '#16805d', successSoft: '#e7f5ee', warning: '#a56313', warningSoft: '#fff3df',
  switchOff: '#b8c4c8',
};
const darkPalette: typeof lightPalette = {
  background: '#101a20', panel: '#18262e', border: '#2a3a43', text: '#f2f6f7',
  secondary: '#a3b4ba', accent: '#6bd1c1', accentSoft: '#1e3b3b', iconSurface: '#21363b',
  success: '#76d4ae', successSoft: '#193b32', warning: '#f0bd68', warningSoft: '#40321f',
  switchOff: '#52646c',
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, paddingBottom: 36, gap: 14 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  title: { fontSize: 30, fontWeight: '700', marginTop: 5 },
  subtitle: { fontSize: 14, marginTop: 3 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  gatewayPanel: { borderWidth: 1, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  gatewayCopy: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 11 },
  gatewayIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  gatewayText: { flex: 1 },
  gatewayTitle: { fontSize: 14, fontWeight: '700' },
  gatewayDescription: { fontSize: 12, lineHeight: 17, marginTop: 3 },
  gatewayButton: { minWidth: 88, minHeight: 38, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  gatewayButtonText: { fontSize: 13, fontWeight: '700' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.6 },
  sectionHeading: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 19, fontWeight: '700' },
  sectionSubtitle: { fontSize: 12, marginTop: 3 },
  metricsRow: { flexDirection: 'row', gap: 9 },
  metric: { flex: 1, minWidth: 0, borderWidth: 1, borderRadius: 10, padding: 12, gap: 8 },
  metricLabel: { fontSize: 11 },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  metricValue: { fontSize: 23, fontWeight: '700' },
  metricUnit: { fontSize: 11 },
  deviceRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, gap: 11 },
  deviceIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  deviceCopy: { flex: 1 },
  deviceName: { fontSize: 14, fontWeight: '700' },
  deviceType: { fontSize: 12, marginTop: 3 },
  deviceAction: { alignItems: 'flex-end', gap: 2 },
  deviceState: { fontSize: 11, fontWeight: '700' },
  errorText: { color: '#b42318', fontSize: 13 },
  errorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
});
