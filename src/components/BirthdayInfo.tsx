import { useEffect, useRef, useState } from "react";
import { useTypewriter } from "../hooks/useTypeWritter";

// const MP3_SRC   = "/audio/song.mp3"; // ganti ke URL online jika perlu
// const START_AT  = 176;               // 2 menit 57 detik
// const LOOP_END  = 0;                 // set > START_AT untuk loop segmen, contoh 205
// const LOOP_ONLY_REFRAIN = false;     // true: loop hanya di [START_AT, LOOP_END)
const MP3_SRC = "/audio/song.mp3";  // atau URL online
const START_AT = 177;               // 2:57 (dalam detik)
const END_AT   = 278;               // 4:38 (dalam detik)
const LOOP_ONLY_REFRAIN = true;     // true = loop hanya reff [START_AT, END_AT)

export default function BirthdayIntro() {
  const [open, setOpen] = useState(true);
  const [musicOn, setMusicOn] = useState(false); // state checkbox Musik lembut

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // init audio sekali
//   useEffect(() => {
//     const el = new Audio(MP3_SRC);
//     el.preload = "auto";
//     el.loop = !LOOP_ONLY_REFRAIN; // kalau loop refrain, kita loop manual
//     el.volume = 0.25;
//     // loop hanya segmen reff (opsional)
//     const onTimeUpdate = () => {
//       if (LOOP_ONLY_REFRAIN && LOOP_END > START_AT && el.currentTime >= LOOP_END) {
//         el.currentTime = START_AT; // balik ke awal reff
//         // el.play(); // biasanya tetap jalan tanpa perlu dipanggil lagi
//       }
//     };
//     el.addEventListener("timeupdate", onTimeUpdate);
//     audioRef.current = el;

//     return () => {
//       el.removeEventListener("timeupdate", onTimeUpdate);
//       el.pause();
//     };
//   }, []);
useEffect(() => {
    const el = new Audio(MP3_SRC);
    el.preload = "auto";
    el.loop = !LOOP_ONLY_REFRAIN; // kalau kita loop segmen manual, jangan pakai loop bawaan
    el.volume = 0.25;
  
    // iOS/Safari kadang baru mengizinkan seek setelah metadata siap:
    const onLoadedMeta = () => { try { el.currentTime = START_AT; } catch {} };
  
    // loop/stop di batas END_AT
    const onTimeUpdate = () => {
      if (el.currentTime >= END_AT) {
        if (LOOP_ONLY_REFRAIN) {
          el.currentTime = START_AT; // ulang dari awal reff
          // el.play(); // biasanya play lanjut otomatis
        } else {
          el.pause(); // kalau tidak loop, berhenti di 4:38
        }
      }
    };
  
    // jaga-jaga: kalau mulai play bukan dari reff, paksa seek ke START_AT
    const onPlay = () => {
      if (el.currentTime < START_AT || el.currentTime > END_AT) {
        try { el.currentTime = START_AT; } catch {}
      }
    };
  
    el.addEventListener("loadedmetadata", onLoadedMeta);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("play", onPlay);
  
    audioRef.current = el;
  
    return () => {
      el.removeEventListener("loadedmetadata", onLoadedMeta);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("play", onPlay);
      el.pause();
    };
  }, []);

  // reduced motion
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const message =
    "Selamat ulang tahun, sayang. Hari ini aku buka Museum Cinta kita. Pelan-pelan ya, satu halaman, satu senyum.";
  const typed = useTypewriter(message, open && !prefersReduced, 45);

  // nyalakan / matikan musik via checkbox (HARUS dari user gesture)
  const onToggleMusic = async (checked: boolean) => {
    setMusicOn(checked);
    const el = audioRef.current;
    if (!el) return;
    if (checked) {
      try {
        // pastikan mulai di reff
        if (el.readyState >= 1) el.currentTime = START_AT; // HAVE_METADATA
        await el.play(); // harus dipanggil dari event user (klik/cek)
      } catch (e) {
        // autoplay bisa diblok; tombol "Buka Museum" akan coba lagi
      }
    } else {
      el.pause();
    }
  };

  // saat menekan “Buka Museum” / “Tutup…”, kalau musik diaktifkan tapi belum jalan, coba play lagi
  const closeIntro = async () => {
    if (musicOn && audioRef.current) {
      try {
        if (audioRef.current.readyState >= 1) audioRef.current.currentTime = START_AT;
        await audioRef.current.play();
      } catch {}
    }
    onToggleMusic(true);
    setOpen(false);
  };
  // kunci scroll halaman saat modal terbuka (nyaman di mobile)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1.5px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
    >
      <div className="flex min-h-dvh items-center justify-center overflow-y-auto">
        <div
          className="
            w-[92vw] max-w-[420px] min-w-[320px] sm:max-w-[560px]
            mx-4 rounded-2xl bg-[#F9F9F4]
            p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)]
            pb-[calc(theme(spacing.4)+env(safe-area-inset-bottom))]
            relative
          "
        >
          <button
            className="absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 focus:outline-none"
            aria-label="Tutup"
            onClick={closeIntro}
          >
            ✕
          </button>

          <h1
            id="intro-title"
            className="font-[Playfair_Display] text-2xl sm:text-3xl leading-tight tracking-[0.2px] text-[#2B2B2B] mb-3 sm:mb-4"
          >
            Untukmu, di Hari Spesial
          </h1>

          <p className="text-[16px] sm:text-base leading-7 text-[#2B2B2B] [font-variant-ligatures:none]">
            {typed}
          </p>

          {/* Toggle musik lembut */}
          {/* <div className="mt-4 flex items-center gap-3">
            <input
              id="soft-music"
              type="checkbox"
              checked={musicOn}
              onChange={(e) => onToggleMusic(e.target.checked)}
              aria-label="Aktifkan musik lembut"
            />
            <label htmlFor="soft-music" className="text-sm text-[#2B2B2B]">
                Baca sambil dengar alunan hangat
            </label>
          </div> */}

          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="
                inline-flex items-center justify-center gap-2
                w-full rounded-xl px-4 py-3.5 font-medium text-white
                hover:shadow active:translate-y-[1px] transition
              "
              style={{ backgroundColor: "#A45D5D" }}
              onClick={closeIntro}
              aria-label="Buka Museum"
            >
              ✨ <span>Buka Museum</span>
            </button>

            <button
              className="
                inline-flex items-center justify-center gap-2
                w-full rounded-xl px-4 py-3.5 font-medium
                hover:shadow-sm transition
              "
              style={{ border: "1px solid #A3B18A", color: "#2B2B2B", background: "transparent" }}
              onClick={closeIntro}
              aria-label="Tutup dengan Senyum"
            >
              😊 <span>Tutup dengan Senyum</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
