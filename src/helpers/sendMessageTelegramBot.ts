import axios from "axios";
import config from "../config";

export const sendMessageTelegramBot = async (message: any) => {
  const url = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: config.chat_id,
      text: message,
    });
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};
