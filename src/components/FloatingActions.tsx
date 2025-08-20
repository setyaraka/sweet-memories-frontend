import { Dices, MessageCirclePlus } from "lucide-react";
import MusicButton from "./MusicButton";

export default function FloatingActions({ onSurprise, onCompose }: {
  onSurprise: () => void;
  onCompose: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:left-auto flex justify-center sm:justify-end p-3 sm:p-0 pb-[calc(env(safe-area-inset-bottom)+12px)]">
      <div className="flex gap-2 sm:flex-col">
        <MusicButton />
        <button
          className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-md bg-white/80 ring-1 ring-black/5 hover:ring-rose-300 hover:bg-white transition"
          onClick={onSurprise}
          aria-label="Beri aku kejutan manis"
        >
          <Dices className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition" aria-hidden />
          <span className="font-medium">Surprise Me</span>
        </button>
        <button
          aria-label="Tulis surat baru"
          className="hidden group sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-md bg-white/80 ring-1 ring-black/5 hover:ring-rose-300 hover:bg-white transition"
          onClick={onCompose}
        >
          <MessageCirclePlus className="h-5 w-5 group-hover:rotate-12 group-hover:scale-110 transition" aria-hidden />
          <span className="font-medium">Surat</span>
        </button>
      </div>
    </div>
  );
}
