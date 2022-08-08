"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var xstate_1 = require("xstate");
var _a = process.env.GRPC_PORT, GRPC_PORT = _a === void 0 ? "50051" : _a;
var implementation = {
    services: {
        userInput: function (_a) {
            var client_test_id = _a.client_test_id;
            return function (send) {
                process.stdin.on("data", function (data) {
                    send({ type: "SEND", payload: data.toString().replace("\n", "") });
                });
            };
        },
    },
    actions: {
        spawnTemplate: xstate_1.assign({
            clients: function () {
                var instance = index_1.spawn({
                    config: {
                        host: "10.110.3.40",
                        port: 50051,
                        transparent: true,
                        verbose: true,
                    },
                    data: {
                        attempts: 0,
                        buffer: [],
                        ping_counter: 0,
                    },
                });
                return xstate_1.spawn(instance);
            },
        }),
        assignClientId: xstate_1.assign({
            client_envelope: function (_, _a) {
                var envelope = _a.envelope;
                return envelope;
            },
        }),
        assignClientIdByEVENT: xstate_1.assign({
            client_envelope: function (_, _a) {
                var payload = _a.payload;
                return payload.envelope;
            },
        }),
        sendTest: xstate_1.send(function (_a, e) {
            var client_envelope = _a.client_envelope;
            return {
                type: "SEND",
                envelope: client_envelope,
                payload: {
                    type: "TYPES",
                    payload: {
                        message: "hey",
                    },
                },
            };
        }, { to: function (_a) {
                var clients = _a.clients;
                return clients;
            } }),
    },
};
var config = xstate_1.Machine({
    initial: "start",
    context: {
        clients: {},
        client_envelope: {},
    },
    entry: ["spawnTemplate"],
    states: {
        start: {
            on: {
                CONNECTION: {
                    actions: [
                        "assignClientId",
                        function (_, e) { return console.log("@@@@@CLIENT", e); },
                    ],
                    target: "userEntry",
                },
            },
        },
        userEntry: {
            invoke: {
                src: "userInput",
            },
            on: {
                SEND: {
                    actions: [function () { return console.log("SENDING....."); }, "sendTest"],
                },
                "*": {
                    actions: [function (_, e) { return console.log("@@@@@MESSAGE FROM SERVER", e); }],
                },
            },
        },
    },
}, implementation);
var service = xstate_1.interpret(config).start();
