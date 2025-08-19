import { useEffect, useState } from "react";
import { useTypewriter } from "../hooks/useTypeWritter";

export default function BirthdayIntro() {
    const [open, setOpen] = useState(true);
  
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
              onClick={() => setOpen(false)}
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
      
            <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                className="
                  inline-flex items-center justify-center gap-2
                  w-full rounded-xl px-4 py-3.5 font-medium text-white
                  hover:shadow active:translate-y-[1px] transition
                "
                style={{ backgroundColor: "#A45D5D" }}
                onClick={() => { setOpen(false); }}
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
                onClick={() => setOpen(false)}
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
  