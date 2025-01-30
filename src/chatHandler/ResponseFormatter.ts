import { QuantumDevice, QuantumJob } from "../utils/interface";

export class ResponseFormatter {
  static formatDevices(devices: QuantumDevice[]): any[] {
    if (devices.length === 0) return [];

    return devices.map(d => ({
      deviceName: d.name,
      vendorName: d.vendor,
      status: d.status,
      qubits: d.numberQubits,
      qbraidDeviceId: d.qbraidDeviceId,
      description: d.deviceDescription || null,
      learnMore: d.deviceAbout || null,
      updatedAt: d.updatedAt
    }));
  }

  static formatJobs(jobs: QuantumJob[]): any[] {
    if (!Array.isArray(jobs) || jobs.length === 0) return [];

    return jobs.map(e => ({
      vendorName: e.vendor,
      qbraidJobId: e.qbraidJobId,
      providerName: e.provider,
      status: e.status,
      createdDate: e.createdAt,
      qbraidDeviceId: e.qbraidDeviceId,
      jobsShots: e.shots || null,
      endedDate: e.endedAt || null,
      openQasm: e.openQasm || null,
      statusText: e.statusText || ''
    }));
  }

  static getHelpMessage(): string {
    return `
        Available commands and features:\n
        
        1. Quantum Devices\n
           - "List quantum devices"\n
           - "Show online devices"\n
           - "What quantum computers are available?"\n
        
        2. Quantum Jobs\n
           - "Show my recent job"\n
           - "List all jobs"\n
           - "What's the status of my last job?"\n
        
        3. General Chat\n
           - Once you've selected a model, you can ask any question!\n
           - The assistant will help with quantum computing concepts\n
           - Get help with quantum circuits and algorithms\n
        
        Type any of these commands or ask questions naturally.
        Need more specific help? Just ask!
      `;
  }
}