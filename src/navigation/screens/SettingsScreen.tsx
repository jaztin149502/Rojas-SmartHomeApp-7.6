import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Button,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function SettingsScreen() {

  const {
    gatewayConnected,
    gatewayConnecting,
    connectToGateway,
    disconnectFromGateway,
    darkMode,
    toggleDarkMode,
  } = useIoT();

  const [notifications, setNotifications] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);

  return (
    <ScrollView style={[styles.container, darkMode && styles.darkContainer]}>

      {/* Header */}

      <Text style={[styles.title, darkMode && styles.darkText]}>
        Settings
      </Text>

      <Text style={[styles.subtitle, darkMode && styles.darkTextSecondary]}>
        Configure your IoT application
      </Text>


      {/* General Settings */}

      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        General
      </Text>


      {/* Notifications */}

      <View style={[styles.settingCard, darkMode && styles.darkCard]}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="notifications-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={[styles.settingName, darkMode && styles.darkText]}>
              Notifications
            </Text>

            <Text style={[styles.settingDescription, darkMode && styles.darkTextSecondary]}>
              Receive alerts from your IoT devices
            </Text>

          </View>

        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />

      </View>


      {/* Auto Connect */}

      <View style={[styles.settingCard, darkMode && styles.darkCard]}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="wifi-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={[styles.settingName, darkMode && styles.darkText]}>
              Auto Connect
            </Text>

            <Text style={[styles.settingDescription, darkMode && styles.darkTextSecondary]}>
              Automatically connect to the IoT gateway
            </Text>

          </View>

        </View>

        <Switch
          value={autoConnect}
          onValueChange={setAutoConnect}
        />

      </View>


      {/* Dark Mode */}

      <View style={[styles.settingCard, darkMode && styles.darkCard]}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="moon-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={[styles.settingName, darkMode && styles.darkText]}>
              Dark Mode
            </Text>

            <Text style={[styles.settingDescription, darkMode && styles.darkTextSecondary]}>
              Use a darker application appearance
            </Text>

          </View>

        </View>

        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
        />

      </View>


      {/* Connection */}

      <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
        Connection
      </Text>


      <View style={[styles.connectionCard, darkMode && styles.darkCard]}>

        <View style={styles.connectionInfo}>

          <Ionicons
            name="cloud-done-outline"
            size={30}
          />

          <View>

            <Text style={[styles.connectionTitle, darkMode && styles.darkText]}>
              IoT Gateway
            </Text>

            <Text style={[styles.connectionStatus, darkMode && styles.darkTextSecondary]}>
              {gatewayConnected ? 'Connected' : 'IoT Gateway is disconnected.'}
            </Text>

          </View>

        </View>

        <Button
          title={gatewayConnecting ? 'Working...' : gatewayConnected ? 'Disconnect' : 'Connect'}
          disabled={gatewayConnecting}
          onPress={() => void (gatewayConnected ? disconnectFromGateway() : connectToGateway())}
        />

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },

  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 12,
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingText: {
    marginLeft: 15,
    flex: 1,
  },

  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },

  connectionCard: {
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
  },

  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  connectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },

  connectionStatus: {
    fontSize: 13,
    marginLeft: 15,
    marginTop: 3,
  },

  darkContainer: {
    backgroundColor: '#101820',
  },

  darkCard: {
    backgroundColor: '#1d2a36',
  },

  darkText: {
    color: '#f4f7fb',
  },

  darkTextSecondary: {
    color: '#b8c7d9',
  },

});