import { useEffect, useState } from "react";
import { useTypewriter } from "../hooks/useTypeWritter";
import { useAudio } from "../audio/AudioProvider";
import { motion } from "framer-motion";

const START_AT = 177;
const END_AT   = 278;
const LOOP_ONLY_REFRAIN = true;
const HERO_IMG = "/img/aya-playfull.png";

export default function BirthdayIntro() {
  const [open, setOpen] = useState(true);
  const [musicOn, setMusicOn] = useState(false);
  const audio = useAudio();

  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const message = "Selamat ulang tahun, Aya sayang. Hari ini aku buka Museum Cinta kita. Pelan-pelan ya, satu halaman, satu senyum.";
  const typed = useTypewriter(message, open && !prefersReduced, 45);

  useEffect(() => {
    audio.setSegment({ start: START_AT, end: END_AT, loopSegment: LOOP_ONLY_REFRAIN });
  }, [audio]);

  const onToggleMusic = async (checked: boolean) => {
    setMusicOn(checked);
    if (checked) {
      await audio.playFrom(START_AT);
    } else {
      audio.pause();
    }
  };

  const closeIntro = async () => {
    if (musicOn) {
      await audio.playFrom(START_AT);
    } else {
      await onToggleMusic(true);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1.5px]" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="flex min-h-dvh items-center justify-center overflow-y-auto">
        <div className="w-[92vw] max-w-[420px] min-w-[320px] sm:max-w-[560px] mx-4 rounded-2xl bg-[#F9F9F4] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)] pb-[calc(theme(spacing.4)+env(safe-area-inset-bottom))] relative">
          <button className="absolute right-4 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 focus:outline-none" aria-label="Tutup" onClick={closeIntro}>✕</button>
          
          <div className="-mx-5 sm:-mx-6 -mt-5 overflow-hidden rounded-t-2xl relative">
          <motion.img
            src={HERO_IMG}
            alt="Aya tersenyum, candid"
            loading="eager"
            decoding="sync"
            initial={prefersReduced ? {} : { opacity: 0, scale: 1.06 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              w-full h-48 sm:h-64 object-cover
              object-[50%_45%]
              blur-[1px] saturate-[1.08] brightness-95
            "
          />
            <div
              aria-hidden
              className="absolute inset-0 bg-pink-200/20 mix-blend-multiply pointer-events-none"
            />

            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 sm:h-28
                        bg-gradient-to-b from-transparent via-white/70 to-[#F9F9F4]"
            />
            <h1
              id="intro-title"
              className="
                absolute left-5 right-5 bottom-3 sm:bottom-4
                font-serif text-xl sm:text-2xl text-white
                drop-shadow-md
                backdrop-blur-[1.5px] bg-black/10
                inline-block px-2 py-1 rounded
              "
            >
              Untukmu, di Hari Spesial
            </h1>
          </div>

          <p className="text-[16px] sm:text-base leading-relaxed text-[#2B2B2B] [font-variant-ligatures:none]">
            {typed}
          </p>

          <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3.5 font-medium text-white hover:shadow active:translate-y-[1px] transition"
              style={{ backgroundColor: "#A45D5D" }}
              onClick={closeIntro}
              aria-label="Buka Museum"
            >
              <span>Buka Museum</span>
            </button>

            <button
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3.5 font-medium hover:shadow-sm transition"
              style={{ border: "1px solid #A3B18A", color: "#2B2B2B", background: "transparent" }}
              onClick={closeIntro}
              aria-label="Tutup dengan Senyum"
            >
              <span>Tutup dengan Senyum</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
