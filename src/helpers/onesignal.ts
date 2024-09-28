const axios = require("axios");

const sendOneSignalNotification = async (
  title: string,
  message: string,
  userIds = []
) => {
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
    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      data,
      { headers }
    );
    console.log("Notification sent:", response.data);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

export default sendOneSignalNotification;
