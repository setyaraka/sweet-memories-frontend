import { PlayCircle, PauseCircle } from "lucide-react";
import { useAudio } from "../audio/AudioProvider";

export default function MusicButton() {
  const { playing, toggle } = useAudio();

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={toggle}
        aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
        title={playing ? "Pause" : "Play"}
        className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-md bg-white/80 ring-1 ring-black/5 hover:ring-rose-300 hover:bg-white transition"
      >
        {playing ? (
          <PauseCircle className="h-5 w-5 group-hover:scale-110 transition" aria-hidden />
        ) : (
          <PlayCircle className="h-5 w-5 group-hover:scale-110 transition" aria-hidden />
        )}
        <span className="hidden sm:inline font-medium">
          {playing ? "Pause Musik" : "Putar Musik"}
        </span>
      </button>
    </div>
  );
}
