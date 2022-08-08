"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xstate_1 = require("xstate");
var util_1 = require("../../../util");
var logger_1 = __importDefault(require("./logger"));
var actions = __assign(__assign({}, logger_1.default), { incrementConnectionAttempts: xstate_1.assign(function (context) {
        var new_data = context.data;
        return {
            data: __assign(__assign({}, new_data), { attempts: ++new_data.attempts }),
        };
    }), assignClientToContext: xstate_1.assign(function (context, _a) {
        var payload = _a.payload;
        var new_data = context.data;
        return {
            data: __assign(__assign({}, new_data), { client: payload }),
        };
    }), assignStreamToContext: xstate_1.assign(function (context, _a) {
        var payload = _a.payload;
        var new_data = context.data;
        return {
            data: __assign(__assign({}, new_data), { stream: payload }),
        };
    }), enqueueMessage: function (_a, event) {
        var data = _a.data;
        var buffer = data.buffer;
        buffer.push(event);
    }, encryptAndSendToComm: function (_a, _b) {
        var data = _a.data, encryption = _a.config.encryption;
        var payload = _b.payload, client_id = _b.client_id;
        var stream = data.stream;
        var message = util_1.serializeToJSON(payload);
        var createEnvelope = util_1.encrypt(message, encryption.encryption_key, encryption.encryption_iv);
        stream === null || stream === void 0 ? void 0 : stream.write({
            type: "MESSAGE",
            client_id: client_id,
            payload: createEnvelope,
        });
    }, sendToComm: function (_a, _b) {
        var data = _a.data;
        var payload = _b.payload, client_id = _b.client_id;
        var stream = data.stream;
        stream === null || stream === void 0 ? void 0 : stream.write({
            type: "MESSAGE",
            client_id: client_id,
            payload: util_1.serializeToJSON(payload),
        });
    }, sendHearBeatIntervalToServer: xstate_1.send(function (_a, event) {
        var data = _a.data;
        return event;
    }, { to: "on-event-handler-heartbeat" }), decryptAndSendPayloadToParent: xstate_1.sendParent(function (_a, _b) {
        var encryption = _a.config.encryption;
        var payload = _b.payload;
        var createEnvelope = util_1.decrypt(payload, encryption.encryption_key, encryption.encryption_iv);
        var message = util_1.deserializeFromJSON(createEnvelope);
        return message;
    }), decryptAndWrapSendToParent: xstate_1.sendParent(function (_a, _b) {
        var encryption = _a.config.encryption;
        var payload = _b.payload, client_id = _b.client_id;
        var createEnvelope = util_1.decrypt(payload, encryption.encryption_key, encryption.encryption_iv);
        var message = util_1.deserializeFromJSON(createEnvelope);
        return {
            type: "MESSAGE",
            client_id: client_id,
            payload: message,
        };
    }), sendPayloadToParent: xstate_1.sendParent(function (_, _a) {
        var payload = _a.payload;
        var message = util_1.deserializeFromJSON(payload);
        return message;
    }), wrapAndSendToParent: xstate_1.sendParent(function (_, _a) {
        var payload = _a.payload, client_id = _a.client_id;
        var message = util_1.deserializeFromJSON(payload);
        return {
            type: "MESSAGE",
            client_id: client_id,
            payload: message,
        };
    }), unassignedAttempts: xstate_1.assign(function (context) {
        var new_data = context.data;
        return {
            data: __assign(__assign({}, new_data), { attempts: 0 }),
        };
    }), unassignStreamFromClient: xstate_1.assign(function (context) {
        var new_data = context.data;
        return {
            data: __assign(__assign({}, new_data), { stream: undefined }),
        };
    }), incrementPingCounter: xstate_1.assign({
        data: function (_a) {
            var data = _a.data;
            var _b = data.ping_counter, ping_counter = _b === void 0 ? 0 : _b;
            var new_data = __assign(__assign({}, data), { ping_counter: ping_counter + 1 });
            return new_data;
        },
    }), decrementPingCounter: xstate_1.assign({
        data: function (_a) {
            var data = _a.data;
            var new_data = __assign(__assign({}, data), { ping_counter: 0 });
            return new_data;
        },
    }), processExit: function () {
        process.exit(1);
    } });
exports.default = actions;
