import { Email } from "../lib/types";
import { fmt } from "../lib/dates";
import { btn } from "../lib/ui";
import { JSX } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, HeartHandshake, MessageCircleHeart, PartyPopper, Sunrise } from "lucide-react";
import { FINAL_ID } from "../lib/constants";

type Props = {
  email?: Email;
  activeId?: string;
  onPrev: () => void;
  onNext: () => void;
  atStart: boolean;
  atEnd: boolean;
};

const categoryMeta: Record<string, { tint: string; ring: string; gradient: string; icon: string; label: string }> = {
  pagi:    { tint: "text-[#A45D5D]", ring: "ring-[#A45D5D]/25", gradient: "from-[#FFF8F1] to-[#FFF3ED]", icon: "🌅", label: "Pagi" },
  dukungan:{ tint: "text-[#A3B18A]", ring: "ring-[#A3B18A]/25", gradient: "from-[#FAFFF7] to-[#F7FFF9]", icon: "💪", label: "Dukungan" },
  spesial: { tint: "text-[#A45D5D]", ring: "ring-[#A45D5D]/25", gradient: "from-[#FFF1F5] to-[#FFF7FA]", icon: "🎉", label: "Spesial" },
  random:  { tint: "text-[#6B6157]", ring: "ring-[#6B6157]/20", gradient: "from-[#FFFDF8] to-[#FFF8F1]", icon: "💌", label: "Random" },
};

const categoryIcon: Record<string, JSX.Element> = {
  Pagi:     <Sunrise className="h-4 w-4" aria-hidden />,
  Dukungan: <HeartHandshake className="h-4 w-4" aria-hidden />,
  Spesial:  <PartyPopper className="h-4 w-4" aria-hidden />,
  Random:   <MessageCircleHeart className="h-4 w-4" aria-hidden />,
};

export default function Reader({ email, activeId, onPrev, onNext, atStart, atEnd }: Props) {
  const isFinal = activeId === FINAL_ID;

  const text = email?.content.replace(/\\n/g, "\n") ?? "";
  const catKey = (email as Email)?.category?.toLowerCase?.() ?? "random";
  const meta = categoryMeta[catKey] ?? categoryMeta.random;

  const finalShell = [
    "rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
    "bg-gradient-to-br from-[#FFF1F5] to-[#FFF7FA] ring-1 ring-rose-200/50"
  ].join(" ");

  const normalShell = [
    "rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]",
    "bg-gradient-to-br", meta.gradient, "ring-1", meta.ring
  ].join(" ");

  return (
    <main className="p-1 order-1 sm:order-none">
      <AnimatePresence mode="wait">
        <motion.article
          key={isFinal ? FINAL_ID : (email?.id ?? "welcome")}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={isFinal ? finalShell : normalShell}
        >
          {isFinal ? (
            <div>
              <div className="flex items-center gap-2 text-sm text-[#a1746a] italic">
                <span>Awal, bukan akhir · Penutup</span>
              </div>

              <h1 className="mb-3 font-serif text-[clamp(22px,5.5vw,26px)] font-semibold text-[#A45D5D] [text-wrap:balance]">
                Halaman Terakhir
              </h1>

              <div className="space-y-4">
                <img
                  src="/img/kami.jpeg"
                  alt="Kita berdua"
                  className="w-full rounded-2xl shadow-lg object-cover max-h-80 object-[50%_30%]"
                />
                <p className="text-center text-lg italic text-[#A45D5D] leading-relaxed">
                  “Semua kata ini akhirnya bermuara ke kita. Terima kasih sudah jadi rumahku.”
                </p>
                <div className="text-center text-sm text-[#6B6157]">Raka ❤️</div>
              </div>

              <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#A45D5D]/30 to-transparent" />
              <div className="mt-2 flex justify-start">
                <button
                  className={`${btn.base} ${btn.ghost} flex items-center gap-2`}
                  onClick={onPrev}
                  aria-label="Buka surat sebelumnya"
                  title="Sebelumnya"
                >
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                  <span className="hidden sm:inline">Sebelumnya</span>
                  <span className="sm:hidden">Sebelum</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {!email ? (
                <div>
                  <div className="text-sm text-[#6B6157]">—</div>
                  <h1 className="mb-2 font-serif text-[clamp(22px,5.5vw,26px)] font-semibold tracking-tight text-[#A45D5D] [text-wrap:balance]">
                    Selamat datang, Aya Sayang ❤️
                  </h1>
                  <p className="text-[clamp(16px,3.8vw,18px)] leading-7 sm:leading-8 text-[#3E3A36]">
                    Pilih satu surat di sebelah kiri untuk membacanya. Atau, kalau mau, tekan Surprise Me untuk kejutan kata manis dariku.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 text-sm text-[#6B6157]">
                    <span>{fmt(email.created_at)}</span>
                    <span aria-hidden>•</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/70 ring-1 ${meta.ring}`}>
                      <span>{categoryIcon[email.category]}</span>
                      <span className="sr-only">Kategori: </span>
                      <span className="capitalize">{meta.label}</span>
                    </span>
                  </div>

                  <h1 className={`mb-2 font-serif text-[clamp(22px,5.5vw,26px)] font-semibold [text-wrap:balance] ${meta.tint}`}>
                    {email.title}
                  </h1>

                  <div className="text-[clamp(16px,3.8vw,18px)] leading-7 sm:leading-8 text-[#3E3A36] whitespace-pre-wrap">
                    {text}
                  </div>

                  <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#A45D5D]/30 to-transparent" />

                  <div className={`mt-2 flex gap-2 ${!atStart ? "justify-between" : "justify-end"}`}>
                    {!atStart && (
                      <button
                        className={`${btn.base} ${btn.ghost} flex items-center gap-2`}
                        onClick={onPrev}
                        disabled={atStart}
                        aria-label="Buka surat sebelumnya"
                        title="Sebelumnya"
                      >
                        <ArrowLeft className="h-5 w-5" aria-hidden />
                        <span className="hidden sm:inline">Sebelumnya</span>
                        <span className="sm:hidden">Sebelum</span>
                      </button>
                    )}
                      <button
                        className={`${btn.base} ${btn.ghost} flex items-center gap-2`}
                        onClick={onNext}
                        aria-label="Buka surat berikutnya"
                        title="Berikutnya"
                      >
                        <span className="hidden lg:inline">Surat Berikutnya</span>
                        <span className="lg:hidden">Lanjut</span>
                        <ArrowRight className="h-5 w-5" aria-hidden />
                      </button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.article>
      </AnimatePresence>
    </main>
  );
}
