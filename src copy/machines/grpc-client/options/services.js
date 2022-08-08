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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../../util");
var _a = process.env, _b = _a.RECONNECT_WAIT_MS, RECONNECT_WAIT_MS = _b === void 0 ? "10000" : _b, _c = _a.HEARTBEAT_MS, HEARTBEAT_MS = _c === void 0 ? "5000" : _c;
var services = {
    createGRPCCLient: function (_a) {
        var _b = _a.config, host = _b.host, port = _b.port;
        return function (send) {
            var client = util_1.createClient(host + ":" + port);
            send({
                type: "CLIENT_CREATED",
                payload: client,
            });
        };
    },
    initializedGRPCStream: function (_a) {
        var data = _a.data;
        return function (send) {
            var client = data.client;
            var waitTime = parseInt(RECONNECT_WAIT_MS);
            var unix_time_now = new Date().getTime();
            var unix_time_wait = unix_time_now + waitTime;
            client === null || client === void 0 ? void 0 : client.waitForReady(unix_time_wait, function (error) {
                if (!error) {
                    var stream = client === null || client === void 0 ? void 0 : client.startConnection();
                    send({
                        type: "STREAM_CREATED",
                        payload: stream,
                    });
                }
                send({
                    type: "ERROR",
                    error: error,
                });
            });
        };
    },
    loadServices: function (_a) {
        var data = _a.data;
        return function (send) {
            var _a = data, client = _a.client, stream = _a.stream;
            stream === null || stream === void 0 ? void 0 : stream.on("data", send);
            stream === null || stream === void 0 ? void 0 : stream.on("error", function (error) {
                if (error.code === 2) {
                    client === null || client === void 0 ? void 0 : client.close();
                    send({
                        type: "CONNECTION_CLOSED",
                    });
                }
                else {
                    send({
                        type: "ERROR",
                        error: error,
                    });
                }
            });
            return function () { return stream === null || stream === void 0 ? void 0 : stream.removeListener("data", send); };
        };
    },
    onEventHandlerHeartBeat: function (c, e) { return function (send, onEvent) {
        var stream = c.data.stream;
        var handler = function (event) {
            var interval = setInterval(function () {
                stream === null || stream === void 0 ? void 0 : stream.write(__assign(__assign({}, event), { type: "HEARTBEAT" }));
                send({
                    type: "INCREMENT_PING",
                });
            }, Number(HEARTBEAT_MS));
            return function () {
                clearInterval(interval);
            };
        };
        onEvent(handler);
    }; },
    unloadEnqueuedMessages: function (_a) {
        var data = _a.data;
        return function (send) {
            var buffer = data.buffer;
            var item = buffer.shift();
            while (item) {
                send(item);
                item = buffer.shift();
            }
        };
    },
};
exports.default = services;
