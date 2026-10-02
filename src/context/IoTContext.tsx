import React, { createContext, useContext, useState } from 'react';
import { Device, sampleDevices, SensorData } from '../models/IoTModels';
import {
  connectGateway,
  disconnectGateway,
  getDevices,
  getSensorData,
  updateDeviceStatus,
} from '../services/IoTService';

type IoTContextType = {
  devices: Device[];
  sensors: SensorData | null;
  gatewayConnected: boolean;
  gatewayConnecting: boolean;
  darkMode: boolean;
  devicesLoading: boolean;
  sensorsLoading: boolean;
  deviceError: string | null;
  sensorError: string | null;
  gatewayError: string | null;
  updatingDeviceId: number | null;
  refreshDevices: () => Promise<void>;
  refreshSensors: () => Promise<void>;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  connectToGateway: () => Promise<void>;
  disconnectFromGateway: () => Promise<void>;
  toggleDarkMode: (value: boolean) => void;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [sensors, setSensors] = useState<SensorData | null>(null);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [sensorsLoading, setSensorsLoading] = useState(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [gatewayConnected, setGatewayConnected] = useState(false);
  const [gatewayConnecting, setGatewayConnecting] = useState(false);
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);

  const refreshDevices = async () => {
    setDevicesLoading(true);
    setDeviceError(null);
    try {
      setDevices(await getDevices());
      setGatewayConnected(true);
    } catch (error) {
      setGatewayConnected(false);
      setDeviceError(error instanceof Error ? error.message : 'Unable to retrieve devices.');
    } finally {
      setDevicesLoading(false);
    }
  };

  const refreshSensors = async () => {
    setSensorsLoading(true);
    setSensorError(null);
    try {
      setSensors(await getSensorData());
      setGatewayConnected(true);
    } catch (error) {
      setGatewayConnected(false);
      setSensorError('Unable to retrieve sensor data.');
    } finally {
      setSensorsLoading(false);
    }
  };

  const toggleDevice = async (id: number, value: boolean) => {
    const previousDevice = devices.find((device) => device.id === id);
    if (!previousDevice) {
      return;
    }

    setDevices((currentDevices) => currentDevices.map((device) =>
      device.id === id ? { ...device, status: value } : device,
    ));
    setUpdatingDeviceId(id);
    setDeviceError(null);
    try {
      const updatedDevice = await updateDeviceStatus(id, value);
      setDevices((currentDevices) => currentDevices.map((device) =>
        device.id === id ? updatedDevice : device,
      ));
      setGatewayConnected(true);
    } catch (error) {
      setDevices((currentDevices) => currentDevices.map((device) =>
        device.id === id ? previousDevice : device,
      ));
      setGatewayConnected(false);
      setDeviceError(`Unable to update ${previousDevice.name}.`);
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  const connectToGateway = async () => {
    setGatewayConnecting(true);
    setGatewayError(null);
    try {
      await connectGateway();
      setGatewayConnected(true);
      setDeviceError(null);
      setSensorError(null);
      await Promise.all([refreshDevices(), refreshSensors()]);
    } catch (error) {
      setGatewayConnected(false);
      setGatewayError(error instanceof Error ? error.message : 'Unable to connect to the IoT gateway.');
    } finally {
      setGatewayConnecting(false);
    }
  };

  const disconnectFromGateway = async () => {
    setGatewayConnecting(true);
    setGatewayError(null);
    try {
      await disconnectGateway();
      setGatewayConnected(false);
      setDeviceError(null);
      setSensorError(null);
    } catch (error) {
      setGatewayError(error instanceof Error ? error.message : 'Unable to disconnect from the IoT gateway.');
    } finally {
      setGatewayConnecting(false);
    }
  };

  const toggleDarkMode = (value: boolean) => {
    setDarkMode(value);
  };

  return (
    <IoTContext.Provider value={{
      devices,
      sensors,
      gatewayConnected,
      gatewayConnecting,
      darkMode,
      devicesLoading,
      sensorsLoading,
      deviceError,
      sensorError,
      gatewayError,
      updatingDeviceId,
      refreshDevices,
      refreshSensors,
      toggleDevice,
      connectToGateway,
      disconnectFromGateway,
      toggleDarkMode,
    }}>
      {children}
    </IoTContext.Provider>
  );
}

export function useIoT() {
  const context = useContext(IoTContext);
  if (!context) {
    throw new Error('useIoT must be used inside IoTProvider');
  }
  return context;
}
