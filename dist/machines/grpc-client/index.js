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
exports.Interpret = exports.spawn = void 0;
var xstate_1 = require("xstate");
var config_1 = __importDefault(require("./config"));
var options_1 = __importDefault(require("./options"));
var spawn = function (context) {
    return xstate_1.Machine(__assign(__assign({}, config_1.default), { context: context }), options_1.default);
};
exports.spawn = spawn;
var Interpret = function (context) {
    var machine = exports.spawn(context);
    var service = xstate_1.interpret(machine);
    return service;
};
exports.Interpret = Interpret;
