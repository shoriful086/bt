"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageTelegramBot = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const sendMessageTelegramBot = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `https://api.telegram.org/bot${config_1.default.bot_token}/sendMessage`;
    try {
        yield axios_1.default.post(url, {
            chat_id: config_1.default.chat_id,
            text: message,
        });
    }
    catch (error) {
        console.error("Failed to send message:", error);
    }
});
exports.sendMessageTelegramBot = sendMessageTelegramBot;
