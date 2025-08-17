import React, { useEffect, useMemo, useState } from "react";
import type { Email } from "./lib/types"; // for Email["category"] typing
import { PASS_PHRASE } from "./lib/constants";
import { fmt, greet } from "./lib/dates";
import Timeline from "./components/Timeline";
import Reader from "./components/Reader";
import ComposerModal from "./components/ComposerModal";
import Modal from "./components/Modal";
import { useRemoteEmails } from "./hooks/useRemoteEmails";

export default function App() {
  const [unlocked, setUnlocked] = useState<boolean>(!PASS_PHRASE);

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [showList, setShowList] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);
  const [showRandom, setShowRandom] = useState(false);
  const [activePos, setActivePos] = useState<number>(0);

  // 👉 Ambil data dari API (bukan localStorage)
  const { data: emails, create } = useRemoteEmails({ query, cat });

  const ordered = useMemo(() => emails, [emails]);

  // Pastikan activeId valid saat filter berubah
  useEffect(() => {
    if (!ordered.length) {
      setActiveId(undefined);
    } else if (!activeId || !ordered.some((e) => e.id === activeId)) {
      setActiveId(ordered[0].id);
    }
  }, [ordered, activeId]);

  const activeIndex = ordered.findIndex((e) => e.id === activeId);
  const active: Email | undefined = activeIndex >= 0 ? ordered[activeIndex] : undefined;

  // ✅ Versi remote: data dikirim dari ComposerModal
  const addEmail = async (data: { title: string; content: string; category: Email["category"]; author?: string }) => {
    const created = await create({ ...data, author: data.author ?? "Aku" });
    setActiveId(created.id);   // opsional: langsung fokus ke surat baru
    setOpenCompose(false);
  };

  const onPrev = () => {
    if (activeIndex <= 0) return;
    setActiveId(ordered[activeIndex - 1].id);
  };
  const onNext = () => {
    if (activeIndex < 0 || activeIndex >= ordered.length - 1) return;
    setActiveId(ordered[activeIndex + 1].id);
  };

  const randomNote = () => {
    if (!ordered.length) return;
    const idx = Math.floor(Math.random() * ordered.length);
    setActiveId(ordered[idx].id);
    setShowRandom(true);
  };

  console.log(ordered, '>>> ORDERED')
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,#fde7da,transparent_40%)] bg-[#F7F3EE] text-[#2A2A2A]">
      {(() => {
        const SoftGate = require("./components/SoftGate").default;
        return <SoftGate unlocked={unlocked} setUnlocked={setUnlocked} />;
      })()}

      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-4 hidden sm:flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold tracking-wide">Museum Cinta Digital</div>
            <div className="text-sm text-[#6B6157]">{greet()}</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eddad0] bg-white px-3 py-1 text-xs text-[#7b6c60]">
            <span>{emails.length}</span> <span>surat tersimpan</span>
          </div>
        </header>

        <header className="mb-3 sm:hidden flex items-center justify-between">
          <button aria-label="Buka daftar surat" onClick={() => setShowList(true)} className="h-10 rounded-xl border border-[#ecd9cf] bg-white px-3 text-sm">☰ Daftar</button>
          <div className="text-base font-semibold">Museum Cinta</div>
          <button aria-label="Tulis surat baru" onClick={() => setOpenCompose(true)} className="h-10 rounded-xl border border-[#ecd9cf] bg-white px-3 text-sm">+ Surat</button>
        </header>

        <div className="grid gap-6 sm:grid-cols-[360px_1fr]">
          <Timeline
            items={ordered}
            activeId={activeId}
            onSelect={setActiveId}
            query={query}
            onQuery={setQuery}
            cat={cat}
            onCat={setCat}
          />

          <Reader
            email={active}
            onPrev={onPrev}
            onNext={onNext}
            atStart={activeIndex <= 0}
            atEnd={activeIndex < 0 || activeIndex >= ordered.length - 1}
          />
        </div>
      </div>

      {/* {showList && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowList(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-[360px] bg-white shadow-2xl p-3 overflow-y-auto">
            
          </div>
        </div>
      )} */}
      {showList && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowList(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-[360px] bg-white shadow-2xl p-3 overflow-y-auto">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-lg font-semibold">Timeline</div>
              <button
                aria-label="Tutup daftar"
                className="text-sm rounded-lg border border-[#ecd9cf] px-2 py-1"
                onClick={() => setShowList(false)}
              >
                Tutup
              </button>
            </div>

            <div className="mb-3 flex items-center gap-2">
              <input
                className="flex-1 h-10 rounded-xl border border-[#e8ddd4] bg-white px-3 text-sm outline-none placeholder:text-[#b4a79d] focus:ring-0 focus:border-[#e8ddd4]"
                placeholder="Cari judul/isi…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="relative">
                <select
                  className="h-10 appearance-none rounded-xl border border-[#e8ddd4] bg-white pl-3 pr-4 text-sm outline-none focus:ring-0 focus:border-[#e8ddd4]"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                >
                  <option value="">Semua</option>
                  <option>Pagi</option>
                  <option>Dukungan</option>
                  <option>Spesial</option>
                  <option>Random</option>
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">
                  ▾
                </span>
              </div>
            </div>

            <ul>
              
              {ordered.map((row, pos) => (
                <li
                  key={row.id}
                  className={`cursor-pointer border-b border-[#f1e7df] px-2 py-3 ${
                    pos === activePos ? "bg-[#fff6f2]" : "hover:bg-[#fff3ee]"
                  }`}
                  onClick={() => {
                    setActivePos(pos);
                    setShowList(false);
                  }}
                >
                  <small className="block text-[#6B6157]">
                    {fmt(row.created_at)} · {row.category}
                  </small>
                  <div className="truncate font-semibold">{row.title}</div>
                  <div className="truncate text-[#413a33]/90">
                    {row.content.split("\n")[0]}
                  </div>
                </li>
              ))}
              {!ordered.length && (
                <li className="px-2 py-6 text-sm text-[#6B6157]">
                  Tidak ada surat. Coba ubah pencarian/kategori.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto flex justify-center sm:justify-end p-3 sm:p-0 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="flex gap-2 sm:flex-col">
          <button aria-label="Kejutkan aku" className="h-11 rounded-xl border border-[#ecd9cf] bg-gradient-to-b from-[#fbe2da] to-[#f5d3c7] px-4 shadow-md" onClick={randomNote}>🎲 Surprise Me</button>
          <button aria-label="Tulis surat baru" className="hidden sm:inline-block h-11 rounded-xl border border-[#ecd9cf] bg-white px-4 shadow-md hover:bg-[#fff6f2]" onClick={() => setOpenCompose(true)}>+ Surat</button>
        </div>
      </div>

      <ComposerModal open={openCompose} onClose={() => setOpenCompose(false)} onSubmit={addEmail} />

      <Modal open={showRandom} onClose={() => setShowRandom(false)}>
        {active ? (
          <div>
            <div className="text-sm text-[#6B6157]">{new Date(active.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</div>
            <h2 className="mt-1 text-xl font-semibold [text-wrap:balance]">{active.title}</h2>
            <div className="mt-2 whitespace-pre-wrap leading-7 text-[clamp(16px,3.8vw,18px)] whitespace-pre-wrap">{active.content}</div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="h-11 rounded-xl border border-[#ecd9cf] bg-white px-4 hover:bg-[#fff6f2]" onClick={() => setShowRandom(false)}>
                Tutup
              </button>
            </div>
          </div>
        ) : (
          <div>Tidak ada surat</div>
        )}
      </Modal>
    </div>
  );
}