import { CacheManager } from "./MessageCacheManager";
import { sendChatMessage } from "../api/QbraidAPI";
import { QueryHandler } from "./QueryHandler";
import { ResponseFormatter } from "./ResponseFormatter";
import { ChatState, QueryResponse } from "../utils/interface";

export class ChatHandler {
  private state: ChatState;
  private cacheManager: CacheManager;

  constructor() {
    this.state = {
      selectedModel: '',
      context: [],
      lastJobId: undefined
    };
    this.cacheManager = new CacheManager();
  }

  async processMessage(message: string): Promise<QueryResponse> {
    await this.cacheManager.refreshIfNeeded();
    this.state.context.push(message);
    const lowerMessage = message.toLowerCase();

    try {
      if (QueryHandler.isDeviceQuery(lowerMessage)) {
        return await this.handleDeviceQuery(lowerMessage);
      }
      if (QueryHandler.isJobQuery(lowerMessage)) {
        return await this.handleJobQuery(lowerMessage);
      }
      if (QueryHandler.isHelpQuery(lowerMessage)) {
        return {
          content: ResponseFormatter.getHelpMessage(),
          format: 'paragraph'
        };
      }

      if (this.isSimpleGreeting(lowerMessage)) {
        return {
          content: "Hello! How can I assist you with <em>quantum computing</em> today?",
          format: 'paragraph'
        };
      }

      if (this.state.selectedModel) {
        const response = await sendChatMessage(message, this.state.selectedModel);
        return {
          content: response || "I couldn't process your message, please try again.",
          format: 'paragraph'
        };
      }

      return {
        content: "Please select an AI model first using 'list models'.\nYou can also type 'help' to see available commands.",
        format: 'paragraph'
      };
    } catch (error) {
      return {
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        format: 'paragraph'
      };
    }
  }

  private async handleDeviceQuery(message: string): Promise<QueryResponse> {
    const devices = this.cacheManager.getDevices();

    // TODO: expand to show devices based on the different status types
    const onlineDevices = message.includes('online') || message.includes('available')
      ? devices.filter(d => d.status === 'ONLINE')
      : devices;

    return {
      content: JSON.stringify(ResponseFormatter.formatDevices(onlineDevices), null, 2),
      format: 'deviceTable'
    };
  }

  private async handleJobQuery(message: string): Promise<QueryResponse> {
    const jobs = this.cacheManager.getJobs();
    const deviceIdMatch = message.match(/deviceId\s*[:=]?\s*([a-zA-Z0-9_-]+)/);
    const deviceId = deviceIdMatch ? deviceIdMatch[1] : null;

    let filteredJobs = deviceId
      ? jobs.filter(job => job.qbraidDeviceId === deviceId)
      : jobs;

    // TODO: expand to show jobs based on the different status types
    if (message.includes("completed")) {
      filteredJobs = filteredJobs.filter(job => job.status === 'completed');
    }

    if (message.includes("last submitted")) {
      filteredJobs = [filteredJobs.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0]];
    }

    return {
      content: JSON.stringify(ResponseFormatter.formatJobs(filteredJobs), null, 2),
      format: 'jobTable'
    };
  }

  private isSimpleGreeting(message: string): boolean {
    return message === 'hello' || message.includes('hi');
  }

  setModel(modelName: string): void {
    this.state.selectedModel = modelName;
  }

  getSelectedModel(): string {
    return this.state.selectedModel;
  }
}