import { Device, sampleDevices, SensorData } from '../models/IoTModels';

let serviceDevices = [...sampleDevices];
let simulatedGatewayConnected = false;
const apiBaseUrl = process.env.EXPO_PUBLIC_IOT_API_URL?.replace(/\/$/, '');
const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('IoT API URL is not configured.');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const responseBody = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(responseBody?.message ?? `IoT API request failed (${response.status}).`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function connectGateway(): Promise<void> {
  if (apiBaseUrl) {
    await request<void>('/gateway/connect', { method: 'POST' });
    return;
  }

  await delay(500);
  simulatedGatewayConnected = true;
}

export async function disconnectGateway(): Promise<void> {
  if (apiBaseUrl) {
    await request<void>('/gateway/disconnect', { method: 'POST' });
    return;
  }

  await delay(300);
  simulatedGatewayConnected = false;
}

const maybeFail = () => {
  if (Math.random() < 0.1) {
    throw new Error('The IoT gateway could not complete the request.');
  }
};

export async function getDevices(): Promise<Device[]> {
  if (apiBaseUrl) {
    return request<Device[]>('/devices');
  }

  await delay(700);
  if (!simulatedGatewayConnected) {
    throw new Error('IoT Gateway is disconnected.');
  }
  maybeFail();
  return serviceDevices.map((device) => ({ ...device }));
}

export async function getSensorData(): Promise<SensorData> {
  if (apiBaseUrl) {
    return request<SensorData>('/sensors');
  }

  await delay(900);
  if (!simulatedGatewayConnected) {
    throw new Error('IoT Gateway is disconnected.');
  }
  maybeFail();
  return {
    temperature: Math.round(24 + Math.random() * 8),
    humidity: Math.round(45 + Math.random() * 30),
    lightLevel: Math.round(500 + Math.random() * 450),
  };
}

export async function updateDeviceStatus(id: number, status: boolean): Promise<Device> {
  if (apiBaseUrl) {
    return request<Device>(`/devices/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  await delay(600);
  if (!simulatedGatewayConnected) {
    throw new Error('IoT Gateway is disconnected.');
  }
  maybeFail();
  const device = serviceDevices.find((item) => item.id === id);
  if (!device) {
    throw new Error('Device was not found.');
  }
  device.status = status;
  return { ...device };
}
