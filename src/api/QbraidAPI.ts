import axios from 'axios';
import * as vscode from 'vscode';
import { ChatModel } from '../utils/interface';

let apiKey: string | null = null;

//function to authenticate the user based on Qbraid API Key
export async function getQbraidAPIKey(): Promise<string | null> {
  if (!apiKey) {
    const enteredKey = await vscode.window.showInputBox({
      prompt: 'Enter your qBraid API Key:',
      ignoreFocusOut: true,
    });
    if (!enteredKey) {
      vscode.window.showErrorMessage('API Key is required.');
      return null;
    }
    apiKey = enteredKey;
  }
  return apiKey;
}

//function to allow users to send prompts to the ai model
export async function sendChatMessage(message: string, model: string) {
  const apiKey = await getQbraidAPIKey();
  if (!apiKey) {
    throw new Error('API Key is missing!');
  }

  try {
    const response = await axios.post(
      'https://api.qbraid.com/api/chat',
      {
        prompt: message,
        model: model,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey, 
        },
      }
    );

    if (response.data && response.data.content) {
      return response.data.content;
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    throw new Error(`Request failed: ${(error as Error).message}`);
  }
}

// Function to get available models from the API
export async function getAvailableModels(): Promise<ChatModel[]> {
  const apiKey = await getQbraidAPIKey();
  if (!apiKey) {
    throw new Error('API Key is missing.');
  }

  try {
    const response = await axios.get('https://api.qbraid.com/api/chat/models', {
      headers: {
        'api-key': apiKey,
      },
    });
    const models = response.data.map((modelObj: { model: string, description: string, pricing: { input: number, output: number, units: string } }) => ({
      model: modelObj.model,
      description: modelObj.description,
      pricing: modelObj.pricing,
    }));

    return models;
  } catch (error) {
    throw new Error('Failed to fetch models: ' + (error as Error).message);
  }
}
