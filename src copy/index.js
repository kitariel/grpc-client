"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpret = exports.spawn = void 0;
var grpc_client_1 = require("./machines/grpc-client");
Object.defineProperty(exports, "spawn", { enumerable: true, get: function () { return grpc_client_1.spawn; } });
Object.defineProperty(exports, "Interpret", { enumerable: true, get: function () { return grpc_client_1.Interpret; } });
