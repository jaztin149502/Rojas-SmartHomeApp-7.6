import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';



export default function DashboardScreen() {
    // const [deviceStatus, setDeviceStatus] = useState(
    //     devices.reduce((acc, device) => {
    //         acc[device.id] = device.status;
    //         return acc;
    //     }, {} as Record<number, boolean>)
    // );

    const {
        devices,
        sensors,
        toggleDevice,
        gatewayConnected,
        updatingDeviceId,
        darkMode,
    } = useIoT();

    return (
        <View style={[styles.container, darkMode && styles.darkContainer]}>

            <Text style={[styles.greeting, darkMode && styles.darkText]}>
                Good evening
            </Text>

            <Text style={[styles.title, darkMode && styles.darkText]}>
                IoT Dashboard
            </Text>

            <View style={styles.sensorRow}>

                <View style={[styles.sensorCard, darkMode && styles.darkCard]}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                            color={darkMode ? '#b8c7d9' : '#1f2937'}
                        />

                        <Text style={[styles.sensorLabel, darkMode && styles.darkText]}>
                            Temperature
                        </Text>
                    </View>

                    <Text style={[styles.sensorValue, darkMode && styles.darkText]}>
                        {sensors ? `${sensors.temperature}°C` : '--'}
                    </Text>
                </View>

                <View style={[styles.sensorCard, darkMode && styles.darkCard]}>
                    <View style={styles.sensorHeader}>
                        <Ionicons
                            name="water-outline"
                            size={22}
                            color={darkMode ? '#b8c7d9' : '#1f2937'}
                        />

                        <Text style={[styles.sensorLabel, darkMode && styles.darkText]}>
                            Humidity
                        </Text>
                    </View>

                    <Text style={[styles.sensorValue, darkMode && styles.darkText]}>
                        {sensors ? `${sensors.humidity}%` : '--'}
                    </Text>
                </View>

            </View>

            <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>
                Device Status
            </Text>

            {/* <View style={styles.deviceCard}>

                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceIcon}>
                        💡
                    </Text>

                    <View>
                        <Text style={styles.deviceName}>
                            Living Room Light
                        </Text>

                        <Text style={styles.deviceType}>
                            Smart Light
                        </Text>
                    </View>
                </View>

                <Text style={styles.deviceStatus}>
                    ON
                </Text>

            </View>

        </View>
    ); */}

            {devices.map((device) => (

                <View
                    key={device.id}
                    style={[styles.deviceCard, darkMode && styles.darkCard]}
                >

                    <View style={styles.deviceInfo}>

                        <Ionicons
                            name={device.icon}
                            size={28}
                            style={[styles.deviceIcon, darkMode && styles.darkIcon]}
                        />

                        <View>
                            <Text style={[styles.deviceName, darkMode && styles.darkText]}>
                                {device.name}
                            </Text>

                            <Text style={[styles.deviceType, darkMode && styles.darkTextSecondary]}>
                                {device.type} - {device.status ? 'ON' : 'OFF'}
                            </Text>
                            {updatingDeviceId === device.id && (
                                <Text style={[styles.deviceState, darkMode && styles.darkTextSecondary]}>Updating...</Text>
                            )}
                        </View>

                    </View>

                    <Switch
                        value={device.status}
                        disabled={!gatewayConnected || updatingDeviceId === device.id}
                        onValueChange={(value) => void toggleDevice(device.id, value)}
                    />

                </View>

            ))}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
    },

    greeting: {
        fontSize: 14,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 5,
    },

    sensorRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
    },

    sensorCard: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
    },

    sensorLabel: {
        fontSize: 14,
    },

    sensorValue: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 10,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 30,
        marginBottom: 12,
    },

    deviceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderRadius: 12,
        backgroundColor: '#eeeeee',
    },

    deviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    deviceIcon: {
        fontSize: 28,
        marginRight: 12,
    },

    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
    },

    deviceType: {
        fontSize: 13,
        marginTop: 3,
    },

    deviceStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    deviceState:{

    }

    ,darkContainer: {
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

    darkIcon: {
        color: '#b8c7d9',
    },


});