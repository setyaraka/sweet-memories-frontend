import { useEffect, useState } from "react";

// CRA-friendly dev check
const isDev = process.env.NODE_ENV !== "production";

export function useLocalStorage<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial();
    } catch (e) {
      if (isDev) console.warn("useLocalStorage parse failed", e);
      return initial();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      if (isDev) console.warn("useLocalStorage set failed", e);
    }
  }, [key, value]);

  return [value, setValue] as const;
}