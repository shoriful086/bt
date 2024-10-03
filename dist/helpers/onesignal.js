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
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios");
const sendOneSignalNotification = (title_1, message_1, ...args_1) => __awaiter(void 0, [title_1, message_1, ...args_1], void 0, function* (title, message, userIds = []) {
    const data = {
        app_id: "77649604-fb17-4609-bee1-e0f36285611f", // Replace with your OneSignal App ID
        headings: { en: title },
        contents: { en: message },
        include_player_ids: userIds, // User IDs for OneSignal
    };
    const headers = {
        "Content-Type": "application/json",
        // Authorization: `Basic YOUR_ONESIGNAL_API_KEY`, // Replace with your OneSignal API Key
    };
    try {
        const response = yield axios.post("https://onesignal.com/api/v1/notifications", data, { headers });
        console.log("Notification sent:", response.data);
    }
    catch (error) {
        console.error("Error sending notification:", error);
    }
});
exports.default = sendOneSignalNotification;
