import { Email } from "../lib/types";
import { fmt } from "../lib/dates";
import { btn } from "../lib/ui";

type Props = {
  email?: Email;
  onPrev: () => void;
  onNext: () => void;
  atStart: boolean;
  atEnd: boolean;
};

export default function Reader({ email, onPrev, onNext, atStart, atEnd }: Props) {
  const text = email?.content.replace(/\\n/g, "\n");
  return (
    <main className="p-1 order-1 sm:order-none">
      <article className="rounded-2xl bg-[#FFF8F1] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        {!email ? (
          <div>
            <div className="text-sm text-[#6B6157]">—</div>
            <h1 className="mb-2 text-[clamp(20px,5.5vw,24px)] font-semibold [text-wrap:balance]">Selamat datang, Sayang ❤️</h1>
            <div className="whitespace-pre-wrap text-[clamp(16px,3.8vw,18px)] leading-7 sm:leading-8">
              Pilih salah satu surat di sisi kiri untuk membacanya. Atau tekan tombol “Surprise Me” untuk kejutan manis.
            </div>
          </div>
        ) : (
          <div>
            <div className="text-sm text-[#6B6157]">{fmt(email.created_at)}</div>
            <h1 className="mb-2 text-[clamp(20px,5.5vw,24px)] font-semibold [text-wrap:balance]">{email.title}</h1>
            <div className="whitespace-pre-wrap text-[clamp(16px,3.8vw,18px)] leading-7 sm:leading-8">{text}</div>
            <div className="mt-4 flex justify-between gap-2">
              <button className={`${btn.base} ${btn.ghost}`} onClick={onPrev} disabled={atStart} aria-label="Surat sebelumnya">
                Sebelumnya
              </button>
              <button className={`${btn.base} ${btn.ghost}`} onClick={onNext} disabled={atEnd} aria-label="Surat berikutnya">
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </article>
    </main>
  );
}