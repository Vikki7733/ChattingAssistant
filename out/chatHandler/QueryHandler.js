"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandler = void 0;
var QueryHandler = /** @class */ (function () {
    function QueryHandler() {
    }
    QueryHandler.isDeviceQuery = function (message) {
        return this.checkKeywords(message, this.DEVICE_KEYWORDS);
    };
    QueryHandler.isJobQuery = function (message) {
        return this.checkKeywords(message, this.JOB_KEYWORDS);
    };
    QueryHandler.isHelpQuery = function (message) {
        return message === 'help' || message.includes('help me') || message.includes('what can you do');
    };
    QueryHandler.checkKeywords = function (message, keywords) {
        return keywords.some(function (k) { return message.toLowerCase().includes(k); });
    };
    QueryHandler.DEVICE_KEYWORDS = ['device', 'deviceId', 'quantum computer', 'qpu', 'offline', 'online'];
    QueryHandler.JOB_KEYWORDS = ['jobs', 'task', 'submitted jobs', 'created jobs', 'quantum jobs', 'jobId'];
    return QueryHandler;
}());
exports.QueryHandler = QueryHandler;
//# sourceMappingURL=QueryHandler.js.map