import { useMemo, useState } from "react";
import type { Email } from "./lib/types";
import { PASS_PHRASE } from "./lib/constants";
import { fmt, greet } from "./lib/dates";
import Timeline from "./components/Timeline";
import Reader from "./components/Reader";
import ComposerModal from "./components/ComposerModal";
import { useRemoteEmails } from "./hooks/useRemoteEmails";
import BirthdayIntro from "./components/BirthdayInfo";
import { AudioProvider } from "./audio/AudioProvider";
import FloatingActions from "./components/FloatingActions";
import RandomModal from "./components/RandomModal";
import { FINAL_ID } from "./lib/constants"; // ⬅️ tambahkan ini

export default function App() {
  const [unlocked, setUnlocked] = useState<boolean>(!PASS_PHRASE);

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("");
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [showList, setShowList] = useState(false);
  const [openCompose, setOpenCompose] = useState(false);
  const [showRandom, setShowRandom] = useState(false);
  const [activePos, setActivePos] = useState<number>(0);

  const { data: emails, create } = useRemoteEmails({ query, cat });
  const ordered = useMemo(() => emails, [emails]);

  const activeIndex = ordered.findIndex((e) => e.id === activeId);
  const active: Email | undefined = activeIndex >= 0 ? ordered[activeIndex] : undefined;
  const isFinal = activeId === FINAL_ID;
  const text = active?.content.replace(/\\n/g, "\n");

  const addEmail = async (data: { title: string; content: string; category: Email["category"]; author?: string }) => {
    const escapedContent = data.content.replace(/\n/g, "\\n");
    const created = await create({
      ...data,
      content: escapedContent,
      author: data.author ?? "Aku",
    });
    setActiveId(created.id);
    setOpenCompose(false);
  };

  // Navigasi
  const onPrev = () => {
    if (isFinal) {
      // dari Halaman Terakhir balik ke surat terakhir (jika ada)
      if (ordered.length) setActiveId(ordered[ordered.length - 1].id);
      return;
    }
    if (activeIndex <= 0) return;
    setActiveId(ordered[activeIndex - 1].id);
  };

  const onNext = () => {
    if (isFinal) return; // di final tidak ada "berikutnya"
    if (activeIndex < 0) return;
    if (activeIndex >= ordered.length - 1) {
      // dari surat terakhir menuju Halaman Terakhir
      setActiveId(FINAL_ID);
      return;
    }
    setActiveId(ordered[activeIndex + 1].id);
  };

  // Surprise: pilih dari surat biasa saja (bukan final)
  const randomNote = () => {
    if (!ordered.length) return;
    const idx = Math.floor(Math.random() * ordered.length);
    setActiveId(ordered[idx].id);
    setShowRandom(true);
  };

  // status ujung untuk tombol di Reader
  const atStart = !isFinal && activeIndex <= 0;
  const atEnd = isFinal ? true : (activeIndex < 0 || activeIndex >= ordered.length - 1);
  const showFinal = query.trim() === "" && cat.trim() === "";

  return (
    <AudioProvider initialSrc="/audio/song.mp3" initialVolume={0.25}>
      <BirthdayIntro />
      <ComposerModal open={openCompose} onClose={() => setOpenCompose(false)} onSubmit={addEmail} />
      <RandomModal active={active} text={text || ""} showRandom={showRandom} setShowRandom={setShowRandom} />

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
            <button
              aria-label="Buka daftar surat"
              onClick={() => setShowList(true)}
              className="h-10 rounded-xl border border-[#ecd9cf] bg-white px-3 text-sm"
            >
              ☰ Daftar
            </button>
            <div className="text-base font-semibold">Museum Cinta</div>
            <button
              aria-label="Tulis surat baru"
              onClick={() => setOpenCompose(true)}
              className="h-10 rounded-xl border border-[#ecd9cf] bg-white px-3 text-sm"
            >
              + Surat
            </button>
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
              activeId={activeId}
              email={active}
              onPrev={onPrev}
              onNext={onNext}
              atStart={atStart}
              atEnd={atEnd}
            />
          </div>
        </div>

        {showList && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowList(false)} aria-hidden="true" />
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
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs">▾</span>
                </div>
              </div>

              <ul>
                {ordered.map((row, pos) => {
                  const text = row?.content.replace(/\\n/g, "\n");
                  return (
                    <li
                      key={row.id}
                      className={`cursor-pointer border-b border-[#f1e7df] px-2 py-3 ${
                        row.id === activeId ? "bg-[#fff6f2]" : "hover:bg-[#fff3ee]"
                      }`}
                      onClick={() => {
                        setActivePos(pos);
                        setShowList(false);
                        setActiveId(row.id);
                      }}
                    >
                      <small className="block text-[#6B6157]">
                        {fmt(row.created_at)} · {row.category}
                      </small>
                      <div className="truncate font-semibold">{row.title}</div>
                      <div className="truncate text-[#413a33]/90">
                        {text.split("\n")[0]}
                      </div>
                    </li>
                  );
                })}

                {showFinal && (
                  <li
                    key={FINAL_ID}
                    className={`cursor-pointer border-b border-[#f1e7df] px-2 py-3 ${
                      activeId === FINAL_ID ? "bg-[#fff6f2]" : "hover:bg-[#fff3ee]"
                    }`}
                    onClick={() => {
                      setShowList(false);
                      setActiveId(FINAL_ID);
                    }}
                  >
                    <small className="block text-[#a1746a] italic">
                      Awal, bukan akhir · Penutup
                    </small>
                    <div className="truncate font-semibold">Halaman Terakhir</div>
                    <div className="truncate text-[#413a33]/90">
                      Semua kata ini akhirnya bermuara ke kita…
                    </div>
                  </li>
                )}

                {!ordered.length && (
                  <li className="px-2 py-6 text-sm text-[#6B6157]">
                    Belum ada surat di sini, Sayang. Coba pilih kategori lain atau tekan Surprise Me untuk dapat kejutan manis dariku.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <FloatingActions onSurprise={randomNote} onCompose={() => setOpenCompose(true)} />
      </div>
    </AudioProvider>
  );
}
