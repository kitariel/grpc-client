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
var _a = process.env, _b = _a.RECONNECT_WAIT_MS, RECONNECT_WAIT_MS = _b === void 0 ? '10000' : _b, _c = _a.HEARTBEAT_MS, HEARTBEAT_MS = _c === void 0 ? '5000' : _c;
var error_log = function (error) {
    console.log("[" + new Date().toISOString() + "]", error);
};
var services = {
    createGRPCCLient: function (_a) {
        var _b = _a.config, host = _b.host, port = _b.port;
        return function (send) {
            try {
                var client = util_1.createClient(host + ":" + port);
                send({
                    type: 'CLIENT_CREATED',
                    payload: client,
                });
            }
            catch (error) {
                error_log(error);
            }
        };
    },
    initializedGRPCStream: function (_a) {
        var data = _a.data;
        return function (send) {
            try {
                var client_1 = data.client;
                var waitTime = parseInt(RECONNECT_WAIT_MS);
                var unix_time_now = new Date().getTime();
                var unix_time_wait = unix_time_now + waitTime;
                client_1 === null || client_1 === void 0 ? void 0 : client_1.waitForReady(unix_time_wait, function (error) {
                    if (!error) {
                        var stream = client_1 === null || client_1 === void 0 ? void 0 : client_1.startConnection();
                        send({
                            type: 'STREAM_CREATED',
                            payload: stream,
                        });
                    }
                    send({
                        type: 'ERROR',
                        error: error,
                    });
                });
            }
            catch (error) {
                error_log(error);
            }
        };
    },
    loadServices: function (_a) {
        var data = _a.data;
        return function (send) {
            try {
                var _a = data, client_2 = _a.client, stream_1 = _a.stream;
                stream_1 === null || stream_1 === void 0 ? void 0 : stream_1.on('data', send);
                stream_1 === null || stream_1 === void 0 ? void 0 : stream_1.on('error', function (error) {
                    if (error.code === 2) {
                        client_2 === null || client_2 === void 0 ? void 0 : client_2.close();
                        send({
                            type: 'CONNECTION_CLOSED',
                        });
                    }
                    else {
                        send({
                            type: 'ERROR',
                            error: error,
                        });
                    }
                });
                return function () { return stream_1 === null || stream_1 === void 0 ? void 0 : stream_1.removeListener('data', send); };
            }
            catch (error) {
                error_log(error);
            }
        };
    },
    onEventHandlerHeartBeat: function (c, e) { return function (send, onEvent) {
        try {
            var stream_2 = c.data.stream;
            var handler = function (event) {
                var interval = setInterval(function () {
                    stream_2 === null || stream_2 === void 0 ? void 0 : stream_2.write(__assign(__assign({}, event), { type: 'HEARTBEAT' }));
                    send({
                        type: 'INCREMENT_PING',
                    });
                }, Number(HEARTBEAT_MS));
                return function () {
                    clearInterval(interval);
                };
            };
            onEvent(handler);
        }
        catch (error) {
            error_log(error);
        }
    }; },
    unloadEnqueuedMessages: function (_a) {
        var data = _a.data;
        return function (send) {
            try {
                var buffer = data.buffer;
                var item = buffer.shift();
                while (item) {
                    send(item);
                    item = buffer.shift();
                }
            }
            catch (error) {
                error_log(error);
            }
        };
    },
};
exports.default = services;
