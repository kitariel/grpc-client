"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = exports.decrypt = exports.encrypt = exports.deserializeFromJSON = exports.serializeToJSON = exports.log = void 0;
var path_1 = __importDefault(require("path"));
var crypto_1 = __importDefault(require("crypto"));
var proto_loader_1 = require("@grpc/proto-loader");
var grpc_js_1 = require("@grpc/grpc-js");
var log = function (module_name) { return function () {
    return "[" + new Date().toISOString() + "][" + module_name + "]:";
}; };
exports.log = log;
var serializeToJSON = function (literal) { return JSON.stringify(literal); };
exports.serializeToJSON = serializeToJSON;
var deserializeFromJSON = function (json_string) {
    return JSON.parse(json_string);
};
exports.deserializeFromJSON = deserializeFromJSON;
var encrypt = function (val, encryption_key, encryption_iv) {
    var cipher = crypto_1.default.createCipheriv('aes-256-cbc', encryption_key, encryption_iv);
    var encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
};
exports.encrypt = encrypt;
var decrypt = function (encrypted, encryption_key, encryption_iv) {
    var decipher = crypto_1.default.createDecipheriv('aes-256-cbc', encryption_key, encryption_iv);
    var decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
};
exports.decrypt = decrypt;
var createClient = function (endpoints) {
    if (endpoints === void 0) { endpoints = 'localhost:50051'; }
    var options = {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    };
    var proto_path = path_1.default.resolve(__dirname, 'machines/protos/Events.proto');
    var packageDefinition = proto_loader_1.loadSync(proto_path, options);
    var Proto = grpc_js_1.loadPackageDefinition(packageDefinition);
    var client = new Proto['Events'](endpoints, grpc_js_1.credentials.createInsecure(), {
        max_receive_message_length: 1 * 1024 * 1024 * 1024,
    });
    return client;
};
exports.createClient = createClient;
