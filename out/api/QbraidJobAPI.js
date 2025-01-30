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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuantumJobs = getQuantumJobs;
exports.submitQuantumJob = submitQuantumJob;
exports.cancelQuantumJob = cancelQuantumJob;
exports.deleteQuantumJob = deleteQuantumJob;
var axios_1 = __importDefault(require("axios"));
var QbraidAPI_1 = require("./QbraidAPI");
var ApiHelper_1 = require("./ApiHelper");
//to get the quantum jobs
function getQuantumJobs() {
    return __awaiter(this, void 0, Promise, function () {
        var url, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://api.qbraid.com/api/quantum-jobs';
                    return [4 /*yield*/, (0, ApiHelper_1.apiRequest)('GET', url)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, (response === null || response === void 0 ? void 0 : response.jobsArray) || []];
            }
        });
    });
}
// to submit quantum jobs based on qbraidDeviceId
function submitQuantumJob(payload) {
    return __awaiter(this, void 0, Promise, function () {
        var apiKey, url, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, QbraidAPI_1.getQbraidAPIKey)()];
                case 1:
                    apiKey = _a.sent();
                    if (!apiKey) {
                        throw new Error("API Key is missing.");
                    }
                    url = "https://api.qbraid.com/api/quantum-jobs";
                    return [4 /*yield*/, axios_1.default.post(url, payload, // Payload contains job details
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "api-key": apiKey,
                            },
                        })];
                case 2:
                    response = _a.sent();
                    return [2 /*return*/, response.data];
                case 3:
                    error_1 = _a.sent();
                    if (error_1.response) {
                        console.error("Failed to submit job: ".concat(error_1.response.status, " - ").concat(JSON.stringify(error_1.response.data)));
                        throw new Error("Failed to submit job: ".concat(error_1.response.statusText, " - ").concat(JSON.stringify(error_1.response.data)));
                    }
                    else {
                        console.error("Error submitting quantum job:", error_1.message);
                        throw error_1;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// to cancel a quantum job based on jobId
function cancelQuantumJob(jobId) {
    return __awaiter(this, void 0, Promise, function () {
        var url;
        return __generator(this, function (_a) {
            url = "https://api.qbraid.com/api/quantum-jobs/cancel/".concat(jobId);
            return [2 /*return*/, (0, ApiHelper_1.apiRequest)('PUT', url)];
        });
    });
}
//to delete list of quantum job based on jobId
function deleteQuantumJob(jobId) {
    return __awaiter(this, void 0, Promise, function () {
        var url;
        return __generator(this, function (_a) {
            url = "https://api.qbraid.com/api/quantum-jobs/".concat(jobId);
            return [2 /*return*/, (0, ApiHelper_1.apiRequest)('DELETE', url)];
        });
    });
}
//# sourceMappingURL=QbraidJobAPI.js.map