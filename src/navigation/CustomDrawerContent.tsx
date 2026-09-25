import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';

import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../context/IoTContext';

export default function CustomDrawerContent(props: any) {
    const { darkMode } = useIoT();

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={[styles.container, darkMode && styles.darkContainer]}
        >

            {/* Header */}
            <View style={styles.header}>

                <View style={styles.logoContainer}>
                    <Ionicons
                        name="hardware-chip-outline"
                        size={40}
                        color={darkMode ? '#b8c7d9' : '#1f2937'}
                    />
                </View>

                <Text style={[styles.title, darkMode && styles.darkText]}>
                    IoT Home
                </Text>

                <Text style={[styles.subtitle, darkMode && styles.darkTextSecondary]}>
                    Smart Environment
                </Text>

            </View>

            {/* Navigation Items */}
            <View style={styles.menu}>
                <DrawerItemList {...props} />
            </View>

        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    header: {
        padding: 20,
        alignItems: 'center',
    },

    logoContainer: {
        marginBottom: 10,
    },

    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },

    subtitle: {
        fontSize: 13,
        marginTop: 4,
    },

    menu: {
        marginTop: 10,
    },

    darkContainer: {
        backgroundColor: '#101820',
    },

    darkText: {
        color: '#f4f7fb',
    },

    darkTextSecondary: {
        color: '#b8c7d9',
    },

});