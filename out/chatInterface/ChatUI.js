"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatPanel = createChatPanel;
var vscode = __importStar(require("vscode"));
var QbraidAPI_1 = require("../api/QbraidAPI");
var assistantMessageHandler_1 = require("../chatHandler/assistantMessageHandler");
var nonce_1 = require("../utils/nonce");
var QbraidJobAPI_1 = require("../api/QbraidJobAPI");
/* TODO: Modularize this code. Below is the idea of how we can do it:
1. Create Separate export functions to render the Tables based on the provided table header(key) and table row body(value)
2. Create Separate export functions for appendMessage, appendError, sendMessage, appendSubmitJobButton, openModal, appendDynamicResponse
3. Create Separate export functions to handle the modal event listener, job form submission event listener
4. Call these exported functions in the html tag
This approach makes the code more readable and modularize.
*/
function createChatPanel(context) {
    return __awaiter(this, void 0, Promise, function () {
        var panel, chatHandler, nonce, models, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    panel = vscode.window.createWebviewPanel('qbraid-chat', 'qBraid Quantum Assistant', vscode.ViewColumn.One, {
                        enableScripts: true,
                        localResourceRoots: [vscode.Uri.file(context.extensionPath + '/src')],
                    });
                    chatHandler = new assistantMessageHandler_1.ChatHandler();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    nonce = (0, nonce_1.getNonce)();
                    return [4 /*yield*/, (0, QbraidAPI_1.getAvailableModels)()];
                case 2:
                    models = _a.sent();
                    panel.webview.html = getWebviewContent(panel.webview, nonce, context, models);
                    // Set up message handling
                    panel.webview.onDidReceiveMessage(function (message) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, response, jobResponse, error_2;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 7, , 8]);
                                    _a = message.type;
                                    switch (_a) {
                                        case 'processUserMessage': return [3 /*break*/, 1];
                                        case 'modelSelected': return [3 /*break*/, 3];
                                        case 'jobSubmissionResponse': return [3 /*break*/, 4];
                                    }
                                    return [3 /*break*/, 6];
                                case 1: return [4 /*yield*/, chatHandler.processMessage(message.text)];
                                case 2:
                                    response = _b.sent();
                                    console.log('Sending response to webview:', response);
                                    panel.webview.postMessage({
                                        type: 'chatResponse',
                                        userMessage: message.text,
                                        assistantReply: response
                                    });
                                    return [3 /*break*/, 6];
                                case 3:
                                    chatHandler.setModel(message.model);
                                    panel.webview.postMessage({
                                        type: 'modelSelected',
                                        model: message.model
                                    });
                                    return [3 /*break*/, 6];
                                case 4: return [4 /*yield*/, (0, QbraidJobAPI_1.submitQuantumJob)(message.payload)];
                                case 5:
                                    jobResponse = _b.sent();
                                    panel.webview.postMessage({
                                        type: 'jobSubmissionResponse',
                                        response: jobResponse
                                    });
                                    return [3 /*break*/, 6];
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    error_2 = _b.sent();
                                    console.error('Error processing message:', error_2);
                                    panel.webview.postMessage({
                                        type: 'error',
                                        text: "Error: ".concat(error_2 instanceof Error ? error_2.message : 'Unknown error')
                                    });
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); }, undefined, context.subscriptions);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error initializing chat panel:', error_1);
                    panel.webview.html = "<div>Error loading resources: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error', "</div>");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, panel];
            }
        });
    });
}
function getWebviewContent(webview, nonce, context, models) {
    var styleUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'index.css'));
    var modelOptions = "\n  <option value=\"\" >Select Model</option>\n  ".concat(models.map(function (model) {
        return "<option value=\"".concat(model.model, "\">").concat(model.model, "</option>");
    }).join(''), "\n");
    return "\n  <!DOCTYPE html>\n  <html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"Content-Security-Policy\" content=\"style-src ".concat(webview.cspSource, "; script-src 'nonce-").concat(nonce, "';\">\n    <title>qBraid Quantum Assistant</title>\n    <link href=\"").concat(styleUri, "\" rel=\"stylesheet\">\n  </head>\n  <body>\n    <div class=\"chat-container\">\n         \n      <div class=\"messages\" id=\"messages\">\n       \n       </div>\n      <div id=\"errorContainer\" class=\"error-container\" style=\"display: none;\"></div>\n      <div class=\"input-container\">\n        <input \n          type=\"text\" \n          id=\"messageInput\" \n          placeholder=\"Type your message...\" \n        />\n        <select id=\"modelSelect\">\n          ").concat(modelOptions, "\n        </select>\n        <button id=\"sendButton\">Send</button>\n      </div>\n    </div>\n    <div id=\"jobModal\" class=\"modal\">\n      <div class=\"modal-content\">\n        <span class=\"close\">&times;</span>\n        <form id=\"jobSubmissionForm\" class=\"job-form\">\n          <div class=\"form-group\">\n            <label for=\"deviceId\">Quantum Device ID *</label>\n            <input type=\"text\" id=\"deviceId\" name=\"deviceId\" required placeholder=\"e.g., qbraid_qir_simulator\" />\n          </div>\n          <div class=\"form-group\">\n            <label for=\"shots\">Number of Shots</label>\n            <input type=\"number\" id=\"shots\" name=\"shots\" placeholder=\"Enter number of shots\"></input>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"qubits\">Number of Qubits</label>\n            <input type=\"number\" id=\"qubits\" name=\"qubits\" placeholder=\"Enter number of qubits\"></input>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"bitcodeText\">QIR Bitcode</label>\n            <textarea id=\"bitcodeText\" name=\"bitcodeText\" placeholder=\"Enter your base64 encoded QIR bitcode\"></textarea>\n          </div>\n          <div class=\"form-group\">\n            <label for=\"qasmText\">OpenQASM Code</label>\n            <textarea id=\"qasmText\" name=\"qasmText\" placeholder=\"Enter your OpenQASM code\"></textarea>\n          </div>\n          <button type=\"submit\" class=\"submit-btn\">Submit Job</button>\n        </form>\n      </div>\n    </div>\n    <script nonce=\"").concat(nonce, "\">\n      (function() {\n        const vscode = acquireVsCodeApi();\n        const messagesContainer = document.getElementById('messages');\n        const messageInput = document.getElementById('messageInput');\n        const sendButton = document.getElementById('sendButton');\n        const modelSelect = document.getElementById('modelSelect');\n\n        let chatState = {\n          messages: []\n        };\n\n        // Restore previous state if it exists\n        const previousState = vscode.getState();\n        if (previousState) {\n          chatState = previousState;\n          renderMessages();\n        }\n\n        function sendMessage() {\n          const text = messageInput.value.trim();\n          if (text) {\n            vscode.postMessage({\n              type: 'processUserMessage',\n              text: text\n            });\n            messageInput.value = '';\n            \n          }\n        }\n\n        sendButton.addEventListener('click', sendMessage);\n        messageInput.addEventListener('keypress', function(e) {\n          if (e.key === 'Enter') {\n            sendMessage();\n          }\n        });\n\n        modelSelect.addEventListener('change', function() {\n          const selectedModel = modelSelect.value;\n          vscode.postMessage({\n            type: 'modelSelected',\n            model: selectedModel\n          });\n        });\n\n        window.addEventListener('message', function(event) {\n          const message = event.data;\n\n          switch (message.type) {\n            case 'chatResponse':\n              appendMessage('user', message.userMessage);\n              appendDynamicResponse('assistant', message.assistantReply);\n              break;\n\n            case 'error':\n              handleErrorMessage(message.text);\n              break;\n\n            case 'modelSelected':\n              appendMessage('system', 'Model selected: ' + message.model);\n              break;\n            case 'jobSubmissionResponse':\n              appendMessage('system', `Job submitted successfully: ${JSON.stringify(message.response.qbraidJobId)}`);\n              clearErrors(); \n              break;\n            }\n\n          messagesContainer.scrollTop = messagesContainer.scrollHeight;\n        });\n\n        const errorHandlers = {\n          bitcode: {\n            required: 'This device requires QIR bitcode',\n            notSupported: 'Bitcode is not supported for this device. Please remove bitcode.',\n            field: 'bitcodeText'\n          },\n          qasm: {\n            required: 'This device requires OpenQASM code',\n            notSupported: 'OpenQASM is not supported for this device. Please remove QASM code.',\n            field: 'qasmText'\n          }\n        };\n\n        function clearErrors() {\n          const errorContainer = document.getElementById('errorContainer');\n          if (errorContainer) {\n            while (errorContainer.firstChild) {\n              errorContainer.removeChild(errorContainer.firstChild);\n            }\n          }\n          errorContainer.style.display='none'\n          Object.values(errorHandlers).forEach(handler => {\n            const field = document.getElementById(handler.field);\n            if (field) {\n              field.classList.remove('error-field');\n            }\n          });\n        }\n\n        function handleErrorMessage(errorMessage) {\n          const errorContainer = document.getElementById('errorContainer');\n          if (!errorContainer) return;\n          clearErrors();\n\n          // If no error message, just return after clearing\n          if (!errorMessage) return;\n\n          // Find the appropriate handler\n          for (const [key, handler] of Object.entries(errorHandlers)) {\n            if (errorMessage.includes(key)) {\n              const field = document.getElementById(handler.field);\n              if (field) {\n                field.classList.add('error-field');\n\n                if (errorMessage.includes('not supported') || errorMessage.includes('not required')) {\n                  appendError(handler.notSupported);\n                  field.value = ''; // Clear the field\n                } else {\n                  appendError(handler.required);\n                }\n              }\n            return;\n            }\n          }\n          appendError(errorMessage);\n        }\n\n        function appendSubmitJobButton() {\n          const submitButton = document.createElement('button');\n          submitButton.textContent = 'Submit Quantum Job';\n          submitButton.className = 'submit-job-btn';\n          submitButton.onclick = openModal;\n          messagesContainer.appendChild(submitButton);\n        }\n\n        function renderQuantumJobsTable(devices) {\n          const convertToArray = JSON.parse(devices);\n          const rows = convertToArray\n            .map((device) => `\n              <tr>\n                <td>${device.vendorName}</td>\n                <td>${device.providerName}</td>\n                <td>${device.qbraidJobId}</td>\n                <td>${device.status}</td>\n                <td>${device.createdDate}</td>\n                <td>${device.qbraidDeviceId}</td>\n                <td>${device.openQasm}</td>\n                <td>${device.statusText}</td>\n              </tr>\n            `).join('');\n\n        return `\n          <table class=\"response-table\">\n            <thead>\n              <tr>\n                <th>Vendor Name</th>\n                <th>Provider Name</th>\n                <th>Qbraid JobId</th>\n                <th>Status</th>\n                <th>Job Created Date</th>\n                <th>Qbraid Device Id</th>\n                <th> Open Qasm</th>\n                <th> Status Text</th>\n              </tr>\n            </thead>\n          <tbody>\n            ${rows}\n          </tbody>\n          </table>\n        `;\n        }\n\n        function formatAIResponse(text) {\n          let formattedText = text;\n          const hasNumberedList = /^d+.s/m.test(formattedText);\n          if (!hasNumberedList) {\n            formattedText = formattedText.split('\\n\\n').map(para => \n            `<p>${para.trim()}</p>`).join('');\n          }\n          return formattedText;\n        }\n\n        function openModal() {\n          const modal = document.getElementById('jobModal');\n          const closeBtn = modal.querySelector('.close');\n          modal.style.display = 'block';\n\n          closeBtn.onclick = function() {\n            modal.style.display = 'none';\n          };\n\n          window.onclick = function(event) {\n            if (event.target == modal) {\n              modal.style.display = 'none';\n            }\n          };\n\n          const form = document.getElementById('jobSubmissionForm');\n          form.addEventListener('submit', function(e) {\n            e.preventDefault();\n            const qbraidDeviceId = document.getElementById('deviceId').value;\n            const shots = document.getElementById('shots').value;\n            const qubits = document.getElementById('qubits').value;\n            const bitcodeText = document.getElementById('bitcodeText').value;\n            const qasmText = document.getElementById('qasmText').value;\n\n            let payload = {\n              qbraidDeviceId: qbraidDeviceId,\n              shots: shots ? parseInt(shots, 10) : undefined,\n              circuitNumQubits: qubits ? parseInt(qubits, 10) : undefined,\n              bitcode: bitcodeText || undefined,\n              openQasm: qasmText || undefined,\n            };\n            if (!qbraidDeviceId) {\n              appendError('Device ID is required');\n              return;\n            }\n\n            vscode.postMessage({\n              type: 'jobSubmissionResponse',\n              payload: payload\n            });\n\n            modal.style.display = 'none';\n          });\n        }\n\n        function renderQuantumDeviceTable(devices) {\n          const convertToArray = JSON.parse(devices);\n          const rows = convertToArray\n          .map((device) => `\n            <tr>\n              <td>${device.deviceName}</td>\n              <td>${device.status}</td>\n              <td>${device.qubits}</td>\n              <td>${device.vendorName}</td>\n              <td>${device.description}</td>\n              <td>${device.updatedAt}</td>\n              <td>\n              ${\n                device.learnMore\n                  ? `<a href=\"${device.learnMore}\" target=\"_blank\" rel=\"noopener noreferrer\">Learn More</a>`\n                  : \"Stay Tuned!\"\n                }\n              </td>\n\n            </tr>\n          `).join('');\n\n          return `\n          <table class=\"response-table\">\n            <thead>\n            <tr>\n              <th>Device Name</th>\n              <th>Status</th>\n              <th>Qubits</th>\n              <th>Vendor Name</th>\n              <th>Device Description</th>\n              <th>Last Updated Time</th>\n              <th> Learn More</th>\n            </tr>\n            </thead>\n            <tbody>\n              ${rows}\n            </tbody>\n          </table>\n         `;\n        }\n\n        function appendDynamicResponse(role, { content, format }) {\n          const messageDiv = document.createElement('div');\n          messageDiv.className = 'message ' + role + '-message';\n          const contentText = typeof content === 'object' && 'content' in content ? content.content : content;\n\n          // Ensure content is a string\n          if (typeof contentText !== 'string') {\n            content = String(content || '');\n          }\n\n          switch (format) {\n            case 'deviceTable':\n            messageDiv.innerHTML = renderQuantumDeviceTable(contentText);\n            break;\n\n            case 'jobTable':\n            messageDiv.innerHTML = renderQuantumJobsTable(contentText);\n            break;\n\n            case 'paragraph':\n            default:\n            messageDiv.innerHTML = formatAIResponse(contentText);\n            break;\n          }\n\n          messagesContainer.appendChild(messageDiv);\n\n        // Update state\n        chatState.messages.push({ role, contentText });\n        vscode.setState(chatState);\n        appendSubmitJobButton();\n   \n      }\n      function appendMessage(role, content) {\n        const messageDiv = document.createElement('div');\n        messageDiv.className = 'message ' + role + '-message';\n        messageDiv.textContent = content;\n        messagesContainer.appendChild(messageDiv);\n        chatState.messages.push({ role, content });\n        vscode.setState(chatState);\n      }\n\n\n      function appendError(errorText) {\n        const errorContainer = document.getElementById('errorContainer');\n        if (errorContainer) {\n          errorContainer.innerText = errorText;\n          errorContainer.style.display = 'block';\n        }\n      }\n\n      function renderMessages() {\n        messagesContainer.innerHTML = '';\n        chatState.messages.forEach(msg => {\n          appendMessage(msg.role, msg.content);\n        });\n      }\n\n\n      appendMessage('assistant', \n        'Welcome to qBraid Quantum Assistant! \uD83D\uDC4B\\n\\n'\n        );\n    })();\n  </script>\n\n</body>\n</html>");
}
//# sourceMappingURL=ChatUI.js.map