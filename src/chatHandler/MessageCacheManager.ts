import { ChatModel, QuantumDevice, QuantumJob } from "../utils/interface";
import { getAvailableModels } from "../api/QbraidAPI";
import { getAvailableQuantumDevices } from "../api/QbraidDevicesAPI";
import { getQuantumJobs } from "../api/QbraidJobAPI";

export class CacheManager {
  private deviceCache: QuantumDevice[] = [];
  private modelCache: ChatModel[] = [];
  private jobCache: QuantumJob[] = [];
  private lastUpdateTime: number = 0;
  private readonly CACHE_DURATION = 1 * 60 * 100; // 6 seconds

  async refreshIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.lastUpdateTime > this.CACHE_DURATION) {
      await this.refreshCaches();
    }
  }

  private async refreshCaches(): Promise<void> {
    const [devices, models, jobs] = await Promise.all([
      getAvailableQuantumDevices(),
      getAvailableModels(),
      getQuantumJobs()
    ]);

    this.deviceCache = devices;
    this.modelCache = models;
    this.jobCache = jobs;
    this.lastUpdateTime = Date.now();
  }

  getDevices(): QuantumDevice[] {
    return this.deviceCache;
  }

  getModels(): ChatModel[] {
    return this.modelCache;
  }

  getJobs(): QuantumJob[] {
    return this.jobCache;
  }
}