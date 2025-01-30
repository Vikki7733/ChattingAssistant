"use strict";
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
exports.ChatHandler = void 0;
var MessageCacheManager_1 = require("./MessageCacheManager");
var QbraidAPI_1 = require("../api/QbraidAPI");
var QueryHandler_1 = require("./QueryHandler");
var ResponseFormatter_1 = require("./ResponseFormatter");
var ChatHandler = /** @class */ (function () {
    function ChatHandler() {
        this.state = {
            selectedModel: '',
            context: [],
            lastJobId: undefined
        };
        this.cacheManager = new MessageCacheManager_1.CacheManager();
    }
    ChatHandler.prototype.processMessage = function (message) {
        return __awaiter(this, void 0, Promise, function () {
            var lowerMessage, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.cacheManager.refreshIfNeeded()];
                    case 1:
                        _a.sent();
                        this.state.context.push(message);
                        lowerMessage = message.toLowerCase();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 9, , 10]);
                        if (!QueryHandler_1.QueryHandler.isDeviceQuery(lowerMessage)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.handleDeviceQuery(lowerMessage)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        if (!QueryHandler_1.QueryHandler.isJobQuery(lowerMessage)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.handleJobQuery(lowerMessage)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        if (QueryHandler_1.QueryHandler.isHelpQuery(lowerMessage)) {
                            return [2 /*return*/, {
                                    content: ResponseFormatter_1.ResponseFormatter.getHelpMessage(),
                                    format: 'paragraph'
                                }];
                        }
                        if (this.isSimpleGreeting(lowerMessage)) {
                            return [2 /*return*/, {
                                    content: "Hello! How can I assist you with <em>quantum computing</em> today?",
                                    format: 'paragraph'
                                }];
                        }
                        if (!this.state.selectedModel) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, QbraidAPI_1.sendChatMessage)(message, this.state.selectedModel)];
                    case 7:
                        response = _a.sent();
                        return [2 /*return*/, {
                                content: response || "I couldn't process your message, please try again.",
                                format: 'paragraph'
                            }];
                    case 8: return [2 /*return*/, {
                            content: "Please select an AI model first using 'list models'.\nYou can also type 'help' to see available commands.",
                            format: 'paragraph'
                        }];
                    case 9:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                content: "Error: ".concat(error_1 instanceof Error ? error_1.message : 'Unknown error occurred'),
                                format: 'paragraph'
                            }];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ChatHandler.prototype.handleDeviceQuery = function (message) {
        return __awaiter(this, void 0, Promise, function () {
            var devices, onlineDevices;
            return __generator(this, function (_a) {
                devices = this.cacheManager.getDevices();
                onlineDevices = message.includes('online') || message.includes('available')
                    ? devices.filter(function (d) { return d.status === 'ONLINE'; })
                    : devices;
                return [2 /*return*/, {
                        content: JSON.stringify(ResponseFormatter_1.ResponseFormatter.formatDevices(onlineDevices), null, 2),
                        format: 'deviceTable'
                    }];
            });
        });
    };
    ChatHandler.prototype.handleJobQuery = function (message) {
        return __awaiter(this, void 0, Promise, function () {
            var jobs, deviceIdMatch, deviceId, filteredJobs;
            return __generator(this, function (_a) {
                jobs = this.cacheManager.getJobs();
                deviceIdMatch = message.match(/deviceId\s*[:=]?\s*([a-zA-Z0-9_-]+)/);
                deviceId = deviceIdMatch ? deviceIdMatch[1] : null;
                filteredJobs = deviceId
                    ? jobs.filter(function (job) { return job.qbraidDeviceId === deviceId; })
                    : jobs;
                // TODO: expand to show jobs based on the different status types
                if (message.includes("completed")) {
                    filteredJobs = filteredJobs.filter(function (job) { return job.status === 'completed'; });
                }
                if (message.includes("last submitted")) {
                    filteredJobs = [filteredJobs.sort(function (a, b) {
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                        })[0]];
                }
                return [2 /*return*/, {
                        content: JSON.stringify(ResponseFormatter_1.ResponseFormatter.formatJobs(filteredJobs), null, 2),
                        format: 'jobTable'
                    }];
            });
        });
    };
    ChatHandler.prototype.isSimpleGreeting = function (message) {
        return message === 'hello' || message.includes('hi');
    };
    ChatHandler.prototype.setModel = function (modelName) {
        this.state.selectedModel = modelName;
    };
    ChatHandler.prototype.getSelectedModel = function () {
        return this.state.selectedModel;
    };
    return ChatHandler;
}());
exports.ChatHandler = ChatHandler;
//# sourceMappingURL=assistantMessageHandler.js.map