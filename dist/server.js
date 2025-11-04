"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const config_1 = require("./src/config/config");
const startServer = () => {
    return app_1.default.listen(config_1.config.port, () => {
        console.log(`🚀🚀🚀 Server is running at PORT ${config_1.config.port}`);
    });
};
startServer();
