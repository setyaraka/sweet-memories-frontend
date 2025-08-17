import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { Email, Category } from "../lib/types"

export function useRemoteEmails(filters: { query?: string; cat?: string }) {
  const [data, setData] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams();
      if (filters.query) q.set("query", filters.query);
      if (filters.cat) q.set("cat", filters.cat);
      const items = await api<Email[]>(`/emails${q.toString() ? `?${q.toString()}` : ""}`);
      console.log(items, '>>> ITEMS')
      setData(items);
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [filters.query, filters.cat]);

  useEffect(() => { load(); }, [load]);

  const create = useCallback(async (input: { title: string; content: string; category: Category; author?: string }) => {
    const created = await api<Email>("/emails", "POST", input);
    setData((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<Omit<Email, "id">>) => {
    const updated = await api<Email>(`/emails/${id}`, "PUT", patch);
    setData((prev) => prev.map((x) => (x.id === id ? updated : x)));
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    await api(`/emails/${id}`, "DELETE");
    setData((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const ordered = useMemo(() =>
    [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  [data]);

  return { data: ordered, loading, error, reload: load, create, update, remove };
}