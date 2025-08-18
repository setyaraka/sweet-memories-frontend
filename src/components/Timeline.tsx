import { Email } from "../lib/types";
import { fmt } from "../lib/dates";

type Props = {
  items: Email[];
  activeId?: string;
  onSelect: (id: string) => void;
  query: string;
  onQuery: (v: string) => void;
  cat: string;
  onCat: (v: string) => void;
};

export default function Timeline({ items, activeId, onSelect, query, onQuery, cat, onCat }: Props) {
  return (
    <aside className="hidden sm:block rounded-2xl border border-transparent bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(180deg,#fff,#f2e9e1)_border-box]">
      <div className="flex items-center justify-between border-b border-dashed border-[#eadfd6] px-4 pt-4 pb-2">
        <div className="text-lg font-semibold">Timeline</div>
      </div>
      <div className="flex items-center gap-2 px-3 pt-3">
        <input
          className="flex-1 h-10 rounded-xl border border-[#e8ddd4] bg-white px-3 text-sm outline-none placeholder:text-[#b4a79d] focus:ring-0 focus:border-[#e8ddd4]"
          placeholder="Cari kata di judul/isi…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        <div className="relative">
          <select
            className="h-10 appearance-none rounded-xl border border-[#e8ddd4] bg-white pl-3 pr-4 text-sm outline-none focus:ring-0 focus:border-[#e8ddd4]"
            value={cat}
            onChange={(e) => onCat(e.target.value)}
          >
            <option value="">Semua</option>
            <option>Pagi</option>
            <option>Dukungan</option>
            <option>Spesial</option>
            <option>Random</option>
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">▾</span>
        </div>
      </div>
      <ul className="max-h-[70vh] list-none overflow-auto p-0">
        {items.map((e) => {
          const text = e?.content.replace(/\\n/g, "\n");
          return (
            <li key={e.id} className="border-b border-[#f1e7df]">
              <button
                className={`w-full text-left px-4 py-3 hover:bg-[#fff3ee] ${
                  e.id === activeId ? "bg-[#fff6f2]" : ""
                }`}
                onClick={() => onSelect(e.id)}
                aria-current={e.id === activeId ? "true" : undefined}
              >
                <small className="block text-[#6B6157]">{fmt(e.created_at)} · {e.category}</small>
                <div className="truncate font-semibold">{e.title}</div>
                <div className="truncate text-[#413a33]/90">{text.split("\n")[0]}</div>
              </button>
            </li>
          )
        }) }
        {!items.length && (
          <li className="px-4 py-6 text-sm text-[#6B6157]">Tidak ada surat. Coba ubah pencarian/kategori.</li>
        )}
      </ul>
    </aside>
  );
}