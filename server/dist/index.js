"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const secret_1 = require("./secret");
const globalError_middleware_1 = __importDefault(require("./middlewares/globalError.middleware"));
app_1.default.listen(secret_1.PORT, () => {
    console.log(`Server Is Listing on Port ${secret_1.PORT}`);
});
app_1.default.use(globalError_middleware_1.default);
