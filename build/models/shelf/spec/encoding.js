"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_1 = require("compassql/build/src/query/encoding");
var wildcard_1 = require("compassql/build/src/wildcard");
var util_1 = require("vega-lite/build/src/util");
var function_1 = require("./function");
__export(require("./function"));
;
;
function isWildcardChannelId(shelfId) {
    return wildcard_1.isWildcard(shelfId.channel);
}
exports.isWildcardChannelId = isWildcardChannelId;
function fromEncodingQueries(encodings) {
    return encodings.reduce(function (encodingMixins, encQ) {
        if (wildcard_1.isWildcard(encQ.channel)) {
            encodingMixins.anyEncodings.push(__assign({ channel: encQ.channel }, fromEncodingQuery(encQ)));
        }
        else {
            encodingMixins.encoding[encQ.channel] = fromEncodingQuery(encQ);
        }
        return encodingMixins;
    }, { encoding: {}, anyEncodings: [] });
}
exports.fromEncodingQueries = fromEncodingQueries;
function fromEncodingQuery(encQ) {
    if (encoding_1.isFieldQuery(encQ)) {
        return fromFieldQuery(encQ);
    }
    else if (encoding_1.isAutoCountQuery(encQ)) {
        throw Error('AutoCount Query not yet supported');
    }
    else {
        throw Error('Value Query not yet supported');
    }
}
exports.fromEncodingQuery = fromEncodingQuery;
function toEncodingQuery(fieldDef, channel) {
    return toFieldQuery(fieldDef, channel);
}
exports.toEncodingQuery = toEncodingQuery;
function toFieldQuery(fieldDef, channel) {
    var fn = fieldDef.fn, fieldDefWithoutFn = __rest(fieldDef, ["fn"]);
    return __assign({ channel: channel }, function_1.toFieldQueryFunctionMixins(fn), fieldDefWithoutFn);
}
exports.toFieldQuery = toFieldQuery;
function fromFieldQuery(fieldQ) {
    var aggregate = fieldQ.aggregate, bin = fieldQ.bin, hasFn = fieldQ.hasFn, timeUnit = fieldQ.timeUnit, field = fieldQ.field, type = fieldQ.type, scale = fieldQ.scale, axis = fieldQ.axis, legend = fieldQ.legend, sort = fieldQ.sort, description = fieldQ.description;
    if (wildcard_1.isWildcard(type)) {
        throw Error('Voyager does not support wildcard type');
    }
    var fn = function_1.fromFieldQueryFunctionMixins({ aggregate: aggregate, bin: bin, timeUnit: timeUnit, hasFn: hasFn });
    return __assign({}, (fn ? { fn: fn } : {}), { field: field,
        type: type }, (sort ? { sort: sort } : {}), (scale ? { scale: fromFieldQueryNestedProp(fieldQ, 'scale') } : {}), (axis ? { axis: fromFieldQueryNestedProp(fieldQ, 'axis') } : {}), (legend ? { legend: fromFieldQueryNestedProp(fieldQ, 'legend') } : {}), (description ? { description: description } : {}));
}
exports.fromFieldQuery = fromFieldQuery;
function fromFieldQueryNestedProp(fieldQ, prop) {
    var propQ = fieldQ[prop];
    if (!propQ) {
        return undefined;
    }
    else if (wildcard_1.isWildcard(propQ)) {
        throw Error("Voyager does not support wildcard " + prop);
    }
    else if (util_1.isBoolean(propQ)) {
        throw Error("Voyager does not support boolean " + prop);
    }
    else {
        Object.keys(propQ).forEach(function (nestedProp) {
            if (wildcard_1.isWildcard(propQ[nestedProp])) {
                throw Error("Voyager does not support wildcard " + prop + " " + nestedProp);
            }
        });
    }
    // We already catch all the unsupported types above so here we can just cast
    return propQ;
}
exports.fromFieldQueryNestedProp = fromFieldQueryNestedProp;
//# sourceMappingURL=encoding.js.map