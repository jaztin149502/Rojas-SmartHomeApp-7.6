import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './screens/DashboardScreen';
import SensorsScreen from './screens/SensorsScreen';
import DevicesScreen from './screens/DevicesScreen';
import SettingsScreen from './screens/SettingsScreen';
import CustomDrawerContent from './CustomDrawerContent';
import { useIoT } from '../context/IoTContext';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { darkMode } = useIoT();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: darkMode ? '#17232e' : '#ffffff' },
        headerTintColor: darkMode ? '#f4f7fb' : '#1f2937',
        drawerStyle: { backgroundColor: darkMode ? '#101820' : '#ffffff' },
        drawerActiveTintColor: darkMode ? '#7dd3fc' : '#2563eb',
        drawerInactiveTintColor: darkMode ? '#b8c7d9' : '#4b5563',
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}>

      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="grid-outline"
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Sensors"
        component={SensorsScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="analytics-outline"
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Devices"
        component={DevicesScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="hardware-chip-outline"
              size={size}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
            />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}