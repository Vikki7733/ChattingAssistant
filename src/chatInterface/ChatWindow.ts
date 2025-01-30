import * as vscode from 'vscode';
import { createChatPanel } from './ChatUI';
import { getQbraidAPIKey } from '../api/QbraidAPI';

export async function openChatWindow(context: vscode.ExtensionContext) {
  const apiKey = getQbraidAPIKey();

  if (!apiKey) {
    vscode.window.showErrorMessage('API Key is missing or invalid!');
    return;
  }

  const panel = await createChatPanel(context);
  panel.webview.postMessage({ type: 'setApiKey', apiKey });
}
