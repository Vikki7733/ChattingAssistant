import { apiRequest } from "./ApiHelper";

export async function getAvailableQuantumDevices(): Promise<any[]> {
  const url = 'https://api.qbraid.com/api/quantum-devices';
  return apiRequest('GET', url);
}
