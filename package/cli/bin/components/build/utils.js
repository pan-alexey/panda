"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPackage = void 0;
const isPackage = (name) => {
    if (!name)
        return false;
    try {
        const resolvePackage = require.resolve(name);
        return !!resolvePackage;
    }
    catch (error) {
        return false;
    }
};
exports.isPackage = isPackage;
