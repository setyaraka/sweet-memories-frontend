const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:4000";

function getApiKey() {
  return localStorage.getItem("mc_api_key") || process.env.REACT_APP_API_KEY || "";
}

type Method = "GET" | "POST" | "PUT" | "DELETE";

export async function api<T>(path: string, method: Method = "GET", body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": getApiKey(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}