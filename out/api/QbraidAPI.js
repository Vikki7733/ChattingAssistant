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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQbraidAPIKey = getQbraidAPIKey;
exports.sendChatMessage = sendChatMessage;
exports.getAvailableModels = getAvailableModels;
var axios_1 = __importDefault(require("axios"));
var vscode = __importStar(require("vscode"));
var apiKey = null;
//function to authenticate the user based on Qbraid API Key
function getQbraidAPIKey() {
    return __awaiter(this, void 0, Promise, function () {
        var enteredKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!apiKey) return [3 /*break*/, 2];
                    return [4 /*yield*/, vscode.window.showInputBox({
                            prompt: 'Enter your qBraid API Key:',
                            ignoreFocusOut: true,
                        })];
                case 1:
                    enteredKey = _a.sent();
                    if (!enteredKey) {
                        vscode.window.showErrorMessage('API Key is required.');
                        return [2 /*return*/, null];
                    }
                    apiKey = enteredKey;
                    _a.label = 2;
                case 2: return [2 /*return*/, apiKey];
            }
        });
    });
}
//function to allow users to send prompts to the ai model
function sendChatMessage(message, model) {
    return __awaiter(this, void 0, void 0, function () {
        var apiKey, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getQbraidAPIKey()];
                case 1:
                    apiKey = _a.sent();
                    if (!apiKey) {
                        throw new Error('API Key is missing!');
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.post('https://api.qbraid.com/api/chat', {
                            prompt: message,
                            model: model,
                            stream: false,
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'api-key': apiKey,
                            },
                        })];
                case 3:
                    response = _a.sent();
                    if (response.data && response.data.content) {
                        return [2 /*return*/, response.data.content];
                    }
                    else {
                        throw new Error('Invalid response format');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    throw new Error("Request failed: ".concat(error_1.message));
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Function to get available models from the API
function getAvailableModels() {
    return __awaiter(this, void 0, Promise, function () {
        var apiKey, response, models, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getQbraidAPIKey()];
                case 1:
                    apiKey = _a.sent();
                    if (!apiKey) {
                        throw new Error('API Key is missing.');
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios_1.default.get('https://api.qbraid.com/api/chat/models', {
                            headers: {
                                'api-key': apiKey,
                            },
                        })];
                case 3:
                    response = _a.sent();
                    models = response.data.map(function (modelObj) { return ({
                        model: modelObj.model,
                        description: modelObj.description,
                        pricing: modelObj.pricing,
                    }); });
                    return [2 /*return*/, models];
                case 4:
                    error_2 = _a.sent();
                    throw new Error('Failed to fetch models: ' + error_2.message);
                case 5: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=QbraidAPI.js.map