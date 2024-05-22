"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reset = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ResetSchema = new mongoose_1.default.Schema({
    email: String,
    token: { type: String, unique: true },
});
exports.Reset = mongoose_1.default.model("Reset", ResetSchema);
