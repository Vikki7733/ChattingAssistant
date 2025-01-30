export class QueryHandler {
  private static readonly DEVICE_KEYWORDS = ['device', 'deviceId', 'quantum computer', 'qpu', 'offline', 'online'];
  private static readonly JOB_KEYWORDS = ['jobs', 'task', 'submitted jobs', 'created jobs', 'quantum jobs', 'jobId'];

  static isDeviceQuery(message: string): boolean {
    return this.checkKeywords(message, this.DEVICE_KEYWORDS);
  }

  static isJobQuery(message: string): boolean {
    return this.checkKeywords(message, this.JOB_KEYWORDS);
  }

  static isHelpQuery(message: string): boolean {
    return message === 'help' || message.includes('help me') || message.includes('what can you do');
  }

  private static checkKeywords(message: string, keywords: string[]): boolean {
    return keywords.some(k => message.toLowerCase().includes(k));
  }
}