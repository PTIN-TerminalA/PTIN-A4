import { API_URL } from "./Api";
import { ChatInfo } from "@/constants/mocks/mockTypes";


export async function sendMessageToBot(data: ChatInfo): Promise<string> {
  const response = await fetch(`${API_URL}/api/chat_agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: data.userId,
      user_message: data.userMessage,
      user_location_x: data.location_x,
      user_location_y: data.location_y,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("Fetch failed:", {
      status: response.status,
      statusText: response.statusText,
      body: text,
    });
    throw new Error(`API Error: ${response.status}`);
  }

  return text;
}
