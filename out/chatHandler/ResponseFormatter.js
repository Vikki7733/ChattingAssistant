"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseFormatter = void 0;
var ResponseFormatter = /** @class */ (function () {
    function ResponseFormatter() {
    }
    ResponseFormatter.formatDevices = function (devices) {
        if (devices.length === 0)
            return [];
        return devices.map(function (d) { return ({
            deviceName: d.name,
            vendorName: d.vendor,
            status: d.status,
            qubits: d.numberQubits,
            qbraidDeviceId: d.qbraidDeviceId,
            description: d.deviceDescription || null,
            learnMore: d.deviceAbout || null,
            updatedAt: d.updatedAt
        }); });
    };
    ResponseFormatter.formatJobs = function (jobs) {
        if (!Array.isArray(jobs) || jobs.length === 0)
            return [];
        return jobs.map(function (e) { return ({
            vendorName: e.vendor,
            qbraidJobId: e.qbraidJobId,
            providerName: e.provider,
            status: e.status,
            createdDate: e.createdAt,
            qbraidDeviceId: e.qbraidDeviceId,
            jobsShots: e.shots || null,
            endedDate: e.endedAt || null,
            openQasm: e.openQasm || null,
            statusText: e.statusText || ''
        }); });
    };
    ResponseFormatter.getHelpMessage = function () {
        return "\n        Available commands and features:\n\n        \n        1. Quantum Devices\n\n           - \"List quantum devices\"\n\n           - \"Show online devices\"\n\n           - \"What quantum computers are available?\"\n\n        \n        2. Quantum Jobs\n\n           - \"Show my recent job\"\n\n           - \"List all jobs\"\n\n           - \"What's the status of my last job?\"\n\n        \n        3. General Chat\n\n           - Once you've selected a model, you can ask any question!\n\n           - The assistant will help with quantum computing concepts\n\n           - Get help with quantum circuits and algorithms\n\n        \n        Type any of these commands or ask questions naturally.\n        Need more specific help? Just ask!\n      ";
    };
    return ResponseFormatter;
}());
exports.ResponseFormatter = ResponseFormatter;
//# sourceMappingURL=ResponseFormatter.js.map