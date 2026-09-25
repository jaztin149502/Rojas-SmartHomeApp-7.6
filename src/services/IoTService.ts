import { Device, sampleDevices, SensorData } from '../models/IoTModels';

let serviceDevices = [...sampleDevices];
const delay = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export async function connectGateway(): Promise<void> {
  await delay(500);
}

export async function disconnectGateway(): Promise<void> {
  await delay(300);
}

const maybeFail = () => {
  if (Math.random() < 0.1) {
    throw new Error('The IoT gateway could not complete the request.');
  }
};

export async function getDevices(): Promise<Device[]> {
  await delay(700);
  maybeFail();
  return serviceDevices.map((device) => ({ ...device }));
}

export async function getSensorData(): Promise<SensorData> {
  await delay(900);
  maybeFail();
  return {
    temperature: Math.round(24 + Math.random() * 8),
    humidity: Math.round(45 + Math.random() * 30),
    lightLevel: Math.round(500 + Math.random() * 450),
  };
}

export async function updateDeviceStatus(id: number, status: boolean): Promise<Device> {
  await delay(600);
  maybeFail();
  const device = serviceDevices.find((item) => item.id === id);
  if (!device) {
    throw new Error('Device was not found.');
  }
  device.status = status;
  return { ...device };
}
