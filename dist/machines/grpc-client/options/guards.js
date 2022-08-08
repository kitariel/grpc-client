"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error_log = function (error) {
    console.log("[" + new Date().toISOString() + "]", error);
};
var _a = process.env.RECONN_ATTEMPT, RECONN_ATTEMPT = _a === void 0 ? "10" : _a;
var guards = {
    isAttemptMax: function (_a) {
        var data = _a.data;
        try {
            var attempts = data.attempts;
            return attempts === parseInt(RECONN_ATTEMPT) ? false : true;
        }
        catch (error) {
            error_log(error);
            return false;
        }
    },
    isEncrypted: function (_a) {
        var encryption = _a.config.encryption;
        return (encryption ? true : false);
    },
    isEncryptedAndTransparent: function (_a) {
        var _b = _a.config, encryption = _b.encryption, transparent = _b.transparent;
        return encryption && transparent ? true : false;
    },
    isEncryptedButNotTransparent: function (_a) {
        var _b = _a.config, encryption = _b.encryption, transparent = _b.transparent;
        return encryption && !transparent ? true : false;
    },
    isTransparent: function (_a) {
        var transparent = _a.config.transparent;
        return (transparent ? true : false);
    },
    connectionExists: function (_a) {
        var data = _a.data;
        var stream = data.stream;
        return stream ? true : false;
    },
    hasReachedMaxPings: function (_a) {
        var data = _a.data;
        var ping_counter = data.ping_counter;
        return ping_counter >= 5;
    },
};
exports.default = guards;
