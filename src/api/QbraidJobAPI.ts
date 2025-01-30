import axios from 'axios';
import { getQbraidAPIKey } from './QbraidAPI';
import { JobsResponse } from '../utils/interface';
import { apiRequest } from './ApiHelper';

//to get the quantum jobs
export async function getQuantumJobs(): Promise<any[]> {
  const url = 'https://api.qbraid.com/api/quantum-jobs';
  const response: JobsResponse = await apiRequest('GET', url);
  return response?.jobsArray || [];
}

// to submit quantum jobs based on qbraidDeviceId
export async function submitQuantumJob(payload: {
  qbraidDeviceId: string;
  bitcode?: string;
  openQasm?: string;
  circuitNumQubits: number;
  shots: number;
  tags?: Record<string, any>;
}): Promise<any> {
  try {
    const apiKey = await getQbraidAPIKey(); // Retrieve the API key
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const url = "https://api.qbraid.com/api/quantum-jobs";

    const response = await axios.post(
      url,
      payload, // Payload contains job details
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      }
    );
    return response.data;

  } catch (error: any) {
    if (error.response) {
      console.error(
        `Failed to submit job: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
      throw new Error(
        `Failed to submit job: ${error.response.statusText} - ${JSON.stringify(
          error.response.data
        )}`
      );
    } else {
      console.error("Error submitting quantum job:", error.message);
      throw error;
    }
  }
}

// to cancel a quantum job based on jobId
export async function cancelQuantumJob(jobId: string): Promise<any> {
  const url = `https://api.qbraid.com/api/quantum-jobs/cancel/${jobId}`;
  return apiRequest('PUT', url);
}

//to delete list of quantum job based on jobId
export async function deleteQuantumJob(jobId: string): Promise<any> {
  const url = `https://api.qbraid.com/api/quantum-jobs/${jobId}`;
  return apiRequest('DELETE', url);
}

