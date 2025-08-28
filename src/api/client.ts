const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";
const ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY!;

function getAuthHeader() {
  return `Bearer ${ANON_KEY}`;
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

export async function api<T>(path: string, method: Method = "GET", body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
      // "x-api-key": getApiKey(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}