"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalErrorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        msg: message,
    });
};
exports.default = GlobalErrorMiddleware;
