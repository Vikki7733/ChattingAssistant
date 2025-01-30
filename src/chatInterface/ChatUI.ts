import * as vscode from 'vscode';
import { getAvailableModels } from '../api/QbraidAPI';
import { ChatHandler } from '../chatHandler/assistantMessageHandler';
import { getNonce } from '../utils/nonce';
import { ChatModel } from '../utils/interface';
import { submitQuantumJob } from '../api/QbraidJobAPI';


/* TODO: Modularize this code. Below is the idea of how we can do it:
1. Create Separate export functions to render the Tables based on the provided table header(key) and table row body(value)
2. Create Separate export functions for appendMessage, appendError, sendMessage, appendSubmitJobButton, openModal, appendDynamicResponse
3. Create Separate export functions to handle the modal event listener, job form submission event listener
4. Call these exported functions in the html tag
This approach makes the code more readable and modularize.
*/
export async function createChatPanel(context: vscode.ExtensionContext): Promise<vscode.WebviewPanel> {
  const panel = vscode.window.createWebviewPanel(
    'qbraid-chat',
    'qBraid Quantum Assistant',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.file(context.extensionPath + '/src')],

    }
  );
  const chatHandler = new ChatHandler();
  try {
    const nonce = getNonce();
    const models = await getAvailableModels();
    panel.webview.html = getWebviewContent(panel.webview, nonce, context, models);
    // Set up message handling
    panel.webview.onDidReceiveMessage(
      async (message) => {
        try {
          switch (message.type) {
            case 'processUserMessage':
              const response = await chatHandler.processMessage(message.text);
              console.log('Sending response to webview:', response);
              panel.webview.postMessage({
                type: 'chatResponse',
                userMessage: message.text,
                assistantReply: response
              });
              break;
            case 'modelSelected':
              chatHandler.setModel(message.model);
              panel.webview.postMessage({
                type: 'modelSelected',
                model: message.model
              });
              break;
            case 'jobSubmissionResponse':
              const jobResponse = await submitQuantumJob(message.payload);
              panel.webview.postMessage({
                type: 'jobSubmissionResponse',
                response: jobResponse
              });
              break;
          }
        } catch (error) {
          console.error('Error processing message:', error);
          panel.webview.postMessage({
            type: 'error',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      },
      undefined,
      context.subscriptions
    );

  } catch (error) {
    console.error('Error initializing chat panel:', error);
    panel.webview.html = `<div>Error loading resources: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
  }

  return panel;
}

function getWebviewContent(webview: vscode.Webview, nonce: string, context: vscode.ExtensionContext,
  models: ChatModel[]): string {
  const styleUri = webview.asWebviewUri(
    vscode.Uri.joinPath(context.extensionUri, 'src', 'index.css')
  );

  const modelOptions = `
  <option value="" >Select Model</option>
  ${models.map(model =>
    `<option value="${model.model}">${model.model}</option>`
  ).join('')}
`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
    <title>qBraid Quantum Assistant</title>
    <link href="${styleUri}" rel="stylesheet">
  </head>
  <body>
    <div class="chat-container">
         
      <div class="messages" id="messages">
       
       </div>
      <div id="errorContainer" class="error-container" style="display: none;"></div>
      <div class="input-container">
        <input 
          type="text" 
          id="messageInput" 
          placeholder="Type your message..." 
        />
        <select id="modelSelect">
          ${modelOptions}
        </select>
        <button id="sendButton">Send</button>
      </div>
    </div>
    <div id="jobModal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <form id="jobSubmissionForm" class="job-form">
          <div class="form-group">
            <label for="deviceId">Quantum Device ID *</label>
            <input type="text" id="deviceId" name="deviceId" required placeholder="e.g., qbraid_qir_simulator" />
          </div>
          <div class="form-group">
            <label for="shots">Number of Shots</label>
            <input type="number" id="shots" name="shots" placeholder="Enter number of shots"></input>
          </div>
          <div class="form-group">
            <label for="qubits">Number of Qubits</label>
            <input type="number" id="qubits" name="qubits" placeholder="Enter number of qubits"></input>
          </div>
          <div class="form-group">
            <label for="bitcodeText">QIR Bitcode</label>
            <textarea id="bitcodeText" name="bitcodeText" placeholder="Enter your base64 encoded QIR bitcode"></textarea>
          </div>
          <div class="form-group">
            <label for="qasmText">OpenQASM Code</label>
            <textarea id="qasmText" name="qasmText" placeholder="Enter your OpenQASM code"></textarea>
          </div>
          <button type="submit" class="submit-btn">Submit Job</button>
        </form>
      </div>
    </div>
    <script nonce="${nonce}">
      (function() {
        const vscode = acquireVsCodeApi();
        const messagesContainer = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const modelSelect = document.getElementById('modelSelect');

        let chatState = {
          messages: []
        };

        // Restore previous state if it exists
        const previousState = vscode.getState();
        if (previousState) {
          chatState = previousState;
          renderMessages();
        }

        function sendMessage() {
          const text = messageInput.value.trim();
          if (text) {
            vscode.postMessage({
              type: 'processUserMessage',
              text: text
            });
            messageInput.value = '';
            
          }
        }

        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });

        modelSelect.addEventListener('change', function() {
          const selectedModel = modelSelect.value;
          vscode.postMessage({
            type: 'modelSelected',
            model: selectedModel
          });
        });

        window.addEventListener('message', function(event) {
          const message = event.data;

          switch (message.type) {
            case 'chatResponse':
              appendMessage('user', message.userMessage);
              appendDynamicResponse('assistant', message.assistantReply);
              break;

            case 'error':
              handleErrorMessage(message.text);
              break;

            case 'modelSelected':
              appendMessage('system', 'Model selected: ' + message.model);
              break;
            case 'jobSubmissionResponse':
              appendMessage('system', \`Job submitted successfully: \${JSON.stringify(message.response.qbraidJobId)}\`);
              clearErrors(); 
              break;
            }

          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });

        const errorHandlers = {
          bitcode: {
            required: 'This device requires QIR bitcode',
            notSupported: 'Bitcode is not supported for this device. Please remove bitcode.',
            field: 'bitcodeText'
          },
          qasm: {
            required: 'This device requires OpenQASM code',
            notSupported: 'OpenQASM is not supported for this device. Please remove QASM code.',
            field: 'qasmText'
          }
        };

        function clearErrors() {
          const errorContainer = document.getElementById('errorContainer');
          if (errorContainer) {
            while (errorContainer.firstChild) {
              errorContainer.removeChild(errorContainer.firstChild);
            }
          }
          errorContainer.style.display='none'
          Object.values(errorHandlers).forEach(handler => {
            const field = document.getElementById(handler.field);
            if (field) {
              field.classList.remove('error-field');
            }
          });
        }

        function handleErrorMessage(errorMessage) {
          const errorContainer = document.getElementById('errorContainer');
          if (!errorContainer) return;
          clearErrors();

          // If no error message, just return after clearing
          if (!errorMessage) return;

          // Find the appropriate handler
          for (const [key, handler] of Object.entries(errorHandlers)) {
            if (errorMessage.includes(key)) {
              const field = document.getElementById(handler.field);
              if (field) {
                field.classList.add('error-field');

                if (errorMessage.includes('not supported') || errorMessage.includes('not required')) {
                  appendError(handler.notSupported);
                  field.value = ''; // Clear the field
                } else {
                  appendError(handler.required);
                }
              }
            return;
            }
          }
          appendError(errorMessage);
        }

        function appendSubmitJobButton() {
          const submitButton = document.createElement('button');
          submitButton.textContent = 'Submit Quantum Job';
          submitButton.className = 'submit-job-btn';
          submitButton.onclick = openModal;
          messagesContainer.appendChild(submitButton);
        }

        function renderQuantumJobsTable(devices) {
          const convertToArray = JSON.parse(devices);
          const rows = convertToArray
            .map((device) => \`
              <tr>
                <td>\${device.vendorName}</td>
                <td>\${device.providerName}</td>
                <td>\${device.qbraidJobId}</td>
                <td>\${device.status}</td>
                <td>\${device.createdDate}</td>
                <td>\${device.qbraidDeviceId}</td>
                <td>\${device.openQasm}</td>
                <td>\${device.statusText}</td>
              </tr>
            \`).join('');

        return \`
          <table class="response-table">
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Provider Name</th>
                <th>Qbraid JobId</th>
                <th>Status</th>
                <th>Job Created Date</th>
                <th>Qbraid Device Id</th>
                <th> Open Qasm</th>
                <th> Status Text</th>
              </tr>
            </thead>
          <tbody>
            \${rows}
          </tbody>
          </table>
        \`;
        }

        function formatAIResponse(text) {
          let formattedText = text;
          const hasNumberedList = /^\d+\.\s/m.test(formattedText);
          if (!hasNumberedList) {
            formattedText = formattedText.split('\\n\\n').map(para => 
            \`<p>\${para.trim()}</p>\`).join('');
          }
          return formattedText;
        }

        function openModal() {
          const modal = document.getElementById('jobModal');
          const closeBtn = modal.querySelector('.close');
          modal.style.display = 'block';

          closeBtn.onclick = function() {
            modal.style.display = 'none';
          };

          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = 'none';
            }
          };

          const form = document.getElementById('jobSubmissionForm');
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            const qbraidDeviceId = document.getElementById('deviceId').value;
            const shots = document.getElementById('shots').value;
            const qubits = document.getElementById('qubits').value;
            const bitcodeText = document.getElementById('bitcodeText').value;
            const qasmText = document.getElementById('qasmText').value;

            let payload = {
              qbraidDeviceId: qbraidDeviceId,
              shots: shots ? parseInt(shots, 10) : undefined,
              circuitNumQubits: qubits ? parseInt(qubits, 10) : undefined,
              bitcode: bitcodeText || undefined,
              openQasm: qasmText || undefined,
            };
            if (!qbraidDeviceId) {
              appendError('Device ID is required');
              return;
            }

            vscode.postMessage({
              type: 'jobSubmissionResponse',
              payload: payload
            });

            modal.style.display = 'none';
          });
        }

        function renderQuantumDeviceTable(devices) {
          const convertToArray = JSON.parse(devices);
          const rows = convertToArray
          .map((device) => \`
            <tr>
              <td>\${device.deviceName}</td>
              <td>\${device.status}</td>
              <td>\${device.qubits}</td>
              <td>\${device.vendorName}</td>
              <td>\${device.description}</td>
              <td>\${device.updatedAt}</td>
              <td>
              \${
                device.learnMore
                  ? \`<a href="\${device.learnMore}" target="_blank" rel="noopener noreferrer">Learn More</a>\`
                  : "Stay Tuned!"
                }
              </td>

            </tr>
          \`).join('');

          return \`
          <table class="response-table">
            <thead>
            <tr>
              <th>Device Name</th>
              <th>Status</th>
              <th>Qubits</th>
              <th>Vendor Name</th>
              <th>Device Description</th>
              <th>Last Updated Time</th>
              <th> Learn More</th>
            </tr>
            </thead>
            <tbody>
              \${rows}
            </tbody>
          </table>
         \`;
        }

        function appendDynamicResponse(role, { content, format }) {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'message ' + role + '-message';
          const contentText = typeof content === 'object' && 'content' in content ? content.content : content;

          // Ensure content is a string
          if (typeof contentText !== 'string') {
            content = String(content || '');
          }

          switch (format) {
            case 'deviceTable':
            messageDiv.innerHTML = renderQuantumDeviceTable(contentText);
            break;

            case 'jobTable':
            messageDiv.innerHTML = renderQuantumJobsTable(contentText);
            break;

            case 'paragraph':
            default:
            messageDiv.innerHTML = formatAIResponse(contentText);
            break;
          }

          messagesContainer.appendChild(messageDiv);

        // Update state
        chatState.messages.push({ role, contentText });
        vscode.setState(chatState);
        appendSubmitJobButton();
   
      }
      function appendMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + role + '-message';
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        chatState.messages.push({ role, content });
        vscode.setState(chatState);
      }


      function appendError(errorText) {
        const errorContainer = document.getElementById('errorContainer');
        if (errorContainer) {
          errorContainer.innerText = errorText;
          errorContainer.style.display = 'block';
        }
      }

      function renderMessages() {
        messagesContainer.innerHTML = '';
        chatState.messages.forEach(msg => {
          appendMessage(msg.role, msg.content);
        });
      }


      appendMessage('assistant', 
        'Welcome to qBraid Quantum Assistant! 👋\\n\\n'
        );
    })();
  </script>

</body>
</html>`;
}
