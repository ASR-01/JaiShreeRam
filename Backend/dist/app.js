"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const corsOptions = {
    origin: ["http://192.168.1.7:4173", "http://172.29.112.1:4173", "http://localhost:4173"],
    credentials: true,
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", index_routes_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to the backend");
});
exports.default = app;
