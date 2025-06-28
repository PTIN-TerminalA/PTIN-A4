import { API_URL } from "./Api";

export async function sendMessageToBot(messageText: string): Promise<string> {
  const response = await fetch(`${API_URL}/ask_agent/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: messageText }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const reply = await response.text();
  return reply;
}
