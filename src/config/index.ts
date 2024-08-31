import dotenv from "dotenv";
import path from "path";
import { jwtHelpers } from "../helpers/jwtHelpers";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  jwt_secret: process.env.jWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  bot_token: process.env.BOT_TOKEN,
  chat_id: process.env.CHAT_ID,
};
