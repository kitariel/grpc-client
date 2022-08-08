"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = __importDefault(require("./actions"));
var activities_1 = __importDefault(require("./activities"));
var delays_1 = __importDefault(require("./delays"));
var guards_1 = __importDefault(require("./guards"));
var services_1 = __importDefault(require("./services"));
var options = {
    actions: actions_1.default,
    activities: activities_1.default,
    delays: delays_1.default,
    guards: guards_1.default,
    services: services_1.default,
};
exports.default = options;
