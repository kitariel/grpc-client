"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var append = util_1.log("Grpc Client");
var loggers = {
    logStarting: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Started");
        }
    },
    logHeartBeatStarted: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Heart Beat Started");
        }
    },
    logInitialized: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Initialized");
        }
    },
    logRunning: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Running");
        }
    },
    logConnected: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Connected");
        }
    },
    logAssignClientToContext: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Client assigned");
        }
    },
    logAssignStreamToContext: function (_a) {
        var verbose = _a.config.verbose;
        if (verbose) {
            console.log(append(), "Stream assigned");
        }
    },
    logMessage: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_1 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message", info_1);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message", info);
    },
    logMessageDecryptAndSendPayloadToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_2 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Decrypt And Wrap SendToParent", info_2);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Decrypt And Wrap SendToParent", info);
    },
    logMessageDecryptAndWrapSendToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_3 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Decrypt And Wrap SendToParent", info_3);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Decrypt And Wrap SendToParent", info);
    },
    logMessageSendPayloadToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_4 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Send PayloadToParent", info_4);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Send PayloadToParent", info);
    },
    logMessageWrapAndSendToParent: function (_a, _b) {
        var _c = _a.config, verbose = _c.verbose, encryption = _c.encryption;
        var payload = _b.payload;
        if (!verbose) {
            return;
        }
        if (!!encryption) {
            var _d = encryption, encryption_iv = _d.encryption_iv, encryption_key = _d.encryption_key;
            var new_log = util_1.decrypt(payload, encryption_key, encryption_iv);
            var info_5 = util_1.deserializeFromJSON(new_log);
            console.log(append(), "Message Wrap And SendToParent", info_5);
            return;
        }
        var info = util_1.deserializeFromJSON(payload);
        console.log(append(), "Message Wrap And SendToParent", info);
    },
    logSend: function (_a, _b) {
        var verbose = _a.config.verbose;
        var payload = _b.payload;
        if (verbose) {
            console.log(append(), "[Encrypted] Writing to client stream", payload);
        }
    },
    logSendEncrypted: function (_a, _b) {
        var verbose = _a.config.verbose;
        var payload = _b.payload;
        if (verbose) {
            console.log(append(), "[Encrypted] Sending message to client stream", payload);
        }
    },
    logSendNotEncrypted: function (_a, _b) {
        var verbose = _a.config.verbose;
        var payload = _b.payload;
        if (verbose) {
            console.log(append(), "[Not Encrypted] Sending message to client stream", payload);
        }
    },
    logError: function (_a, _b) {
        var verbose = _a.config.verbose;
        var error = _b.error;
        if (verbose) {
            console.error(append(), "Error", error.message, "\n", error.stack);
        }
    },
    logIncrementConnectionAttempts: function (_a) {
        var verbose = _a.config.verbose, data = _a.data;
        var attempts = data.attempts;
        if (verbose) {
            console.log(append(), "Attempts", attempts);
        }
    },
    logClosedConnection: function (_a, _b) {
        var verbose = _a.config.verbose;
        var client_id = _b.client_id;
        if (verbose) {
            console.log(append(), "Connection Closed", client_id);
        }
    },
};
exports.default = loggers;
