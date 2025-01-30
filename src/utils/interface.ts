export interface ChatModel {
  model: string;
  description: string;
  pricing: {
    input: number;
    output: number;
    units: string;
  }
}

export interface JobsResponse {
  jobsArray: QuantumJob[];
  statusGroup: string;
  provider: string;
  total: number;
}

export interface QuantumDevice {
  id: string;
  name: string;
  status: string;
  vendor: string;
  qbraidDeviceId: string;
  numberQubits: number;
  deviceDescription?: string;
  deviceAbout?: string;
  updatedAt?: EpochTimeStamp;
}


export interface QuantumJob {
  vendor: string;
  provider: string;
  status: string;
  qbraidJobId?: string;
  createdAt: string;
  endedAt?: string;
  executionDuration?: number;
  qbraidDeviceId: string;
  openQasm?: string;
  shots?: number;
  cost?: number;
  statusText?: string;
  queuePosition?: number;
  timeStamps: {
    createdAt: string;
    endedAt: string;
    executionDuration: number | null;
  };
}

export interface ChatState {
  selectedModel: string;
  context: string[];
  lastJobId?: string;
  format?: string;
}

export interface JobSubmissionData {
  deviceId: string;
  shots: number;
  qubits: number;
  programType: string;
  bitcodeText: string;
  qasmText: string;
}

export interface QueryResponse {
  content: string;
  format: 'deviceTable' | 'jobTable' | 'table' | 'bullet' | 'paragraph' | 'form';
}

export interface ChatMessage {
  role: string;
  content: string;
}
