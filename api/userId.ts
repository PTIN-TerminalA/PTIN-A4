import { API_URL } from "./Api";

export async function getUserId(token: string): Promise<number> {
  const response = await fetch(`${API_URL}/api/get_user_id?token=${encodeURIComponent(token)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.user_id;
}
