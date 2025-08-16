import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

export type Email = {
  id: string;
  title: string;
  content: string;
  category: "Pagi" | "Dukungan" | "Spesial" | "Random" | string;
  created_at: string; // ISO string
  author: string;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const PASS_PHRASE = ""; // isi kalau mau soft lock

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

type SoftGateProps = {
  unlocked: boolean;
  setUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
};

const greet = () => {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi, Sayang ❤️";
  if (h < 16) return "Selamat siang, Sayang ❤️";
  if (h < 19) return "Selamat sore, Sayang ❤️";
  return "Selamat malam, Sayang ❤️";
};

const sampleEmails: Email[] = [
  {
    id: crypto.randomUUID(),
    title: "Hai sayang, kalau kamu baca ini mungkin kamu baru bangun…",
    content:
      "Sebelum mulai hari, aku cuma mau bilang: kamu nggak sendirian. Aku selalu di sini, meski dari jauh.\n\nTarik napas pelan, minum air putih, dan inget: kamu udah hebat sampai di titik ini. Kalau capek, peluk kata-kata ini dulu.",
    category: "Pagi",
    created_at: "2024-04-22T06:20:00+07:00",
    author: "Aku",
  },
  {
    id: crypto.randomUUID(),
    title: "Kalau hari ini rasanya berat, pelan-pelan aja ya",
    content:
      "Nggak harus kuat terus kok. Kalau pengen nangis, nggak apa-apa. Aku jagain dari sini.\n\nMalem ini aku bacain cerita favoritmu lagi ya. Biar hati kita istirahat bareng.",
    category: "Dukungan",
    created_at: "2024-05-07T21:05:00+07:00",
    author: "Aku",
  },
  {
    id: crypto.randomUUID(),
    title: "Terima kasih sudah jadi rumah untukku",
    content:
      "Ada banyak hal yang bikin aku jatuh cinta ulang tiap hari: caramu sabar, caramu nanya kabar kecil, caramu inget hal-hal sepele.\n\nSemoga semua kebaikanmu pelan-pelan balik lagi jadi tenang di hatimu.",
    category: "Spesial",
    created_at: "2024-06-14T19:40:00+07:00",
    author: "Aku",
  },
  {
    id: crypto.randomUUID(),
    title: "Random: aku kangen detil-detil kecil",
    content:
      "Kayak nunggu notif kamu muncul, atau ngeliat kamu ketawa gara-gara hal receh. Nanti ketemu, aku mau traktir roti kesukaanmu. Deal?",
    category: "Random",
    created_at: "2024-07-05T10:10:00+07:00",
    author: "Aku",
  },
];

function useLocalEmails(
  key = "mc_emails"
): [Email[], React.Dispatch<React.SetStateAction<Email[]>>] {
  const [emails, setEmails] = useState<Email[]>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Email[];
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch {}
    return sampleEmails;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(emails));
    } catch {}
  }, [emails, key]);

  return [emails, setEmails];
}

function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full sm:max-w-xl sm:w-full rounded-t-2xl sm:rounded-2xl bg-[#FFF8F1] shadow-xl p-4 sm:p-6
                   max-h-[85dvh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function SoftGate({ unlocked, setUnlocked }: SoftGateProps) {
  const [val, setVal] = useState("");
  useEffect(() => {
    if (!PASS_PHRASE) return;
    const ok = localStorage.getItem("mc_pass") === "ok";
    if (ok) setUnlocked(true);
  }, [setUnlocked]);

  if (!PASS_PHRASE || unlocked) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FBEDE5] to-[#F7F3EE] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[#f0e2d8] bg-white p-6 shadow-lg">
        <h3 className="text-xl font-semibold">Masuk ke Museum Cinta 💌</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Masukkan kata rahasia yang kalian sepakati.
        </p>
        <input
          className="mt-4 w-full rounded-xl border border-[#e8ddd4] px-3 py-2 outline-none"
          placeholder="kata rahasia"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <div className="mt-4 flex gap-2">
          <button
            className="rounded-xl border border-[#ecd9cf] bg-white px-4 py-2 hover:bg-[#fff6f2]"
            onClick={() => {
              if (val && val === PASS_PHRASE) {
                localStorage.setItem("mc_pass", "ok");
                setUnlocked(true);
              } else alert("Kata rahasia salah");
            }}
          >
            Buka
          </button>
          <button
            className="rounded-xl border border-[#ecd9cf] bg-white px-4 py-2 hover:bg-[#fff6f2]"
            onClick={() => {
              localStorage.removeItem("mc_pass");
              setVal("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [unlocked, setUnlocked] = useState<boolean>(!PASS_PHRASE);
  const [emails, setEmails] = useLocalEmails();

  const [query, setQuery] = useState<string>("");
  const [cat, setCat] = useState<string>("");
  const [activePos, setActivePos] = useState<number>(0);
  const [showList, setShowList] = useState<boolean>(false);

  const ordered = useMemo(() => {
    const sorted = [...emails].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    return sorted
      .map((e, i) => ({ e, i }))
      .filter((x) => !cat || x.e.category === cat)
      .filter(
        (x) =>
          !query ||
          x.e.title.toLowerCase().includes(query.toLowerCase()) ||
          x.e.content.toLowerCase().includes(query.toLowerCase())
      );
  }, [emails, cat, query]);

  useEffect(() => {
    if (activePos > ordered.length - 1) setActivePos(0);
  }, [ordered.length, activePos]);

  const active = ordered[activePos]?.e as Email | undefined;

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [compose, setCompose] = useState<{
    title: string;
    content: string;
    category: Email["category"];
  }>({
    title: "",
    content: "",
    category: "Pagi",
  });

  const addEmail = () => {
    if (!compose.title.trim() || !compose.content.trim()) {
      alert("Judul dan isi tidak boleh kosong");
      return;
    }
    setEmails((prev: Email[]) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: compose.title.trim(),
        content: compose.content.trim(),
        category: compose.category,
        created_at: new Date().toISOString(),
        author: "Aku",
      },
    ]);
    setOpenModal(false);
    setCompose({ title: "", content: "", category: "Pagi" });
  };

  const randomNote = () => {
    if (!ordered.length) return;
    const idx = Math.floor(Math.random() * ordered.length);
    setActivePos(idx);
    setShowRandom(true);
  };

  const [showRandom, setShowRandom] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_20%_-10%,#fde7da,transparent_40%)] bg-[#F7F3EE] text-[#2A2A2A]">
      <SoftGate unlocked={unlocked} setUnlocked={setUnlocked} />

      <div className="mx-auto max-w-6xl p-6">

        {/* Header desktop */}
        <header className="mb-4 hidden sm:flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-semibold tracking-wide">
              Museum Cinta Digital
            </div>
            <div className="text-sm text-[#6B6157]">{greet()}</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#eddad0] bg-white px-3 py-1 text-xs text-[#7b6c60]">
            <span>{emails.length}</span> <span>surat tersimpan</span>
          </div>
        </header>

        {/* Header mobile */}
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
            onClick={() => setOpenModal(true)}
            className="h-10 rounded-xl border border-[#ecd9cf] bg-white px-3 text-sm"
          >
            + Surat
          </button>
        </header>

        {/* App Grid */}
        <div className="grid gap-6 sm:grid-cols-[360px_1fr]">
          {/* Left: Timeline (hidden on mobile) */}
          <aside className="hidden sm:block rounded-2xl border border-transparent bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(180deg,#fff,#f2e9e1)_border-box]">
            <div className="flex items-center justify-between border-b border-dashed border-[#eadfd6] px-4 pt-4 pb-2">
              <div className="text-lg font-semibold">Timeline</div>
              <button
                onClick={() => setOpenModal(true)}
                className="h-10 rounded-xl border border-[#ecd9cf] bg-white px-3 py-2 text-sm hover:bg-[#fff6f2]"
              >
                + Surat Baru
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 pt-3">
              <input
                className="flex-1 h-10 rounded-xl border border-[#e8ddd4] bg-white px-3 text-sm outline-none placeholder:text-[#b4a79d] focus:ring-0 focus:border-[#e8ddd4]"
                placeholder="Cari kata di judul/isi…"
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
            <ul className="max-h-[70vh] list-none overflow-auto p-0">
              {ordered.map((row, pos) => (
                <li
                  key={row.e.id}
                  className={`cursor-pointer border-b border-[#f1e7df] px-4 py-3 hover:bg-[#fff3ee] ${
                    pos === activePos ? "bg-[#fff6f2]" : ""
                  }`}
                  onClick={() => setActivePos(pos)}
                >
                  <small className="block text-[#6B6157]">
                    {fmt(row.e.created_at)} · {row.e.category}
                  </small>
                  <div className="truncate font-semibold">{row.e.title}</div>
                  <div className="truncate text-[#413a33]/90">
                    {row.e.content.split("\n")[0]}
                  </div>
                </li>
              ))}
              {!ordered.length && (
                <li className="px-4 py-6 text-sm text-[#6B6157]">
                  Tidak ada surat. Coba ubah pencarian/kategori.
                </li>
              )}
            </ul>
          </aside>

          {/* Right: Reader */}
          <main className="p-1 order-1 sm:order-none">
            <article className="rounded-2xl bg-[#FFF8F1] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
              {!active ? (
                <div>
                  <div className="text-sm text-[#6B6157]">—</div>
                  <h1 className="mb-2 text-[clamp(20px,5.5vw,24px)] font-semibold [text-wrap:balance]">
                    Selamat datang, Sayang ❤️
                  </h1>
                  <div className="whitespace-pre-wrap text-[clamp(16px,3.8vw,18px)] leading-7 sm:leading-8">
                    Pilih salah satu surat di sisi kiri untuk membacanya. Atau
                    tekan tombol “Surprise Me” untuk kejutan manis.
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-[#6B6157]">
                    {fmt(active.created_at)}
                  </div>
                  <h1 className="mb-2 text-[clamp(20px,5.5vw,24px)] font-semibold [text-wrap:balance]">
                    {active.title}
                  </h1>
                  <div className="whitespace-pre-wrap text-[clamp(16px,3.8vw,18px)] leading-7 sm:leading-8">
                    {active.content}
                  </div>
                  <div className="mt-4 flex justify-between gap-2">
                    <button
                      aria-label="Surat sebelumnya"
                      className="h-11 rounded-xl border border-[#ecd9cf] bg-white px-3 py-2 hover:bg-[#fff6f2]"
                      onClick={() => setActivePos((p) => Math.max(0, p - 1))}
                    >
                      ← Sebelumnya
                    </button>
                    <button
                      aria-label="Surat berikutnya"
                      className="h-11 rounded-xl border border-[#ecd9cf] bg-white px-3 py-2 hover:bg-[#fff6f2]"
                      onClick={() =>
                        setActivePos((p) => Math.min(ordered.length - 1, p + 1))
                      }
                    >
                      Berikutnya →
                    </button>
                  </div>
                </div>
              )}
            </article>
          </main>
        </div>
      </div>

      {/* Slide-over Timeline (mobile) */}
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
                  key={row.e.id}
                  className={`cursor-pointer border-b border-[#f1e7df] px-2 py-3 ${
                    pos === activePos ? "bg-[#fff6f2]" : "hover:bg-[#fff3ee]"
                  }`}
                  onClick={() => {
                    setActivePos(pos);
                    setShowList(false);
                  }}
                >
                  <small className="block text-[#6B6157]">
                    {fmt(row.e.created_at)} · {row.e.category}
                  </small>
                  <div className="truncate font-semibold">{row.e.title}</div>
                  <div className="truncate text-[#413a33]/90">
                    {row.e.content.split("\n")[0]}
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

      {/* Bottom Action Bar (mobile) / FAB (desktop) */}
      <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto flex justify-center sm:justify-end p-3 sm:p-0 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="flex gap-2 sm:flex-col">
          <button
            aria-label="Kejutkan aku"
            className="h-11 rounded-xl border border-[#ecd9cf] bg-gradient-to-b from-[#fbe2da] to-[#f5d3c7] px-4 shadow-md"
            onClick={randomNote}
          >
            🎲 Surprise Me
          </button>
          <button
            aria-label="Tulis surat baru"
            className="hidden sm:inline-block h-11 rounded-xl border border-[#ecd9cf] bg-white px-4 shadow-md hover:bg-[#fff6f2]"
            onClick={() => setOpenModal(true)}
          >
            + Surat
          </button>
        </div>
      </div>

      {/* Composer */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <h3 className="text-lg font-semibold">Tulis Surat Baru</h3>
        <div className="mt-3 grid gap-3">
          <input
            className="w-full rounded-xl border border-[#e8ddd4] px-3 py-2 outline-none"
            placeholder="Judul / Kalimat pembuka"
            value={compose.title}
            onChange={(e) =>
              setCompose((s) => ({ ...s, title: e.target.value }))
            }
          />
          <select
            className="w-full rounded-xl border border-[#e8ddd4] px-3 py-2"
            value={compose.category}
            onChange={(e) =>
              setCompose((s) => ({ ...s, category: e.target.value }))
            }
          >
            <option>Pagi</option>
            <option>Dukungan</option>
            <option>Spesial</option>
            <option>Random</option>
          </select>
          <textarea
            rows={8}
            className="w-full rounded-xl border border-[#e8ddd4] px-3 py-2 outline-none"
            placeholder="Tulis isi surat di sini…"
            value={compose.content}
            onChange={(e) =>
              setCompose((s) => ({ ...s, content: e.target.value }))
            }
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="h-11 rounded-xl border border-[#ecd9cf] bg-white px-4 hover:bg-[#fff6f2]"
            onClick={() => setOpenModal(false)}
          >
            Batal
          </button>
          <button
            className="h-11 rounded-xl border border-[#ffd2c5] bg-gradient-to-b from-[#ffeae4] to-[#ffe2db] px-4"
            onClick={addEmail}
          >
            Simpan
          </button>
        </div>
      </Modal>

      <Modal open={showRandom} onClose={() => setShowRandom(false)}>
        {active ? (
          <div>
            <div className="text-sm text-[#6B6157]">{fmt(active.created_at)}</div>
            <h2 className="mt-1 text-xl font-semibold [text-wrap:balance]">
              {active.title}
            </h2>
            <div className="mt-2 whitespace-pre-wrap leading-7 text-[clamp(16px,3.8vw,18px)]">
              {active.content}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="h-11 rounded-xl border border-[#ecd9cf] bg-white px-4 hover:bg-[#fff6f2]"
                onClick={() => setShowRandom(false)}
              >
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
