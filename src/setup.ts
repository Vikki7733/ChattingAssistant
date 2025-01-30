import * as vscode from 'vscode';
import { openChatWindow } from './chatInterface/ChatWindow';

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "qbraid-chat" is now active.');

  const disposable = vscode.commands.registerCommand('qbraid-chat.openChat', () => {
    openChatWindow(context);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log('Extension "qbraid-chat" is now deactivated.');
}
