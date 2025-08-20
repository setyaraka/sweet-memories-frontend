import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Segment = { start?: number; end?: number; loopSegment?: boolean };

type AudioCtx = {
  ready: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  // actions
  setSrc: (src: string) => void;
  setVolume: (v: number) => void;
  toggle: () => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  seek: (t: number) => void;
  setSegment: (seg: Segment) => void;
  playFrom: (t: number) => Promise<void>;
};

const AudioContextGlobal = createContext<AudioCtx | null>(null);

let _audio: HTMLAudioElement | null = null;

export const AudioProvider: React.FC<{ children: React.ReactNode; initialSrc?: string; initialVolume?: number }> = ({
  children,
  initialSrc = "/audio/song.mp3",
  initialVolume = 0.25,
}) => {
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVol] = useState<number>(() => {
    if (typeof window === "undefined") return initialVolume;
    const saved = localStorage.getItem("audio:volume");
    return saved ? Number(saved) : initialVolume;
  });

  const segmentRef = useRef<Segment>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!_audio) {
      _audio = new Audio();
      _audio.preload = "auto";
      _audio.crossOrigin = "anonymous";
    }

    const el = _audio;
    el.src = initialSrc;
    el.volume = volume;
    el.loop = !segmentRef.current.loopSegment;

    const onLoadedMeta = () => {
      setDuration(el.duration || 0);
      setReady(true);
    };
    const onTime = () => {
      setCurrentTime(el.currentTime);
      const { start, end, loopSegment } = segmentRef.current;
      if (loopSegment && typeof start === "number" && typeof end === "number" && end > start) {
        if (el.currentTime >= end) el.currentTime = start;
      }
    };
    const onPlay = () => {
      setPlaying(true);
      const { start, end, loopSegment } = segmentRef.current;
      if (loopSegment && typeof start === "number" && typeof end === "number") {
        if (el.currentTime < start || el.currentTime > end) el.currentTime = start;
      }
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    el.addEventListener("loadedmetadata", onLoadedMeta);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);

    return () => {
      el.removeEventListener("loadedmetadata", onLoadedMeta);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
    };
  }, [initialSrc, volume]);

  const setSrc = useCallback((src: string) => {
    if (!_audio) return;
    if (_audio.src !== src) {
      _audio.src = src;
      _audio.load();
      setReady(false);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    const vv = Math.min(1, Math.max(0, v));
    setVol(vv);
    if (_audio) _audio.volume = vv;
    if (typeof window !== "undefined") localStorage.setItem("audio:volume", String(vv));
  }, []);

  const play = useCallback(async () => {
    if (!_audio) return;
    try {
      await _audio.play();
      setPlaying(true);
    } catch {
      // autoplay policy: butuh user gesture
    }
  }, []);

  const pause = useCallback(() => {
    _audio?.pause();
  }, []);

  const toggle = useCallback(async () => {
    if (!_audio) return;
    if (_audio.paused) await play();
    else pause();
  }, [play, pause]);

  const seek = useCallback((t: number) => {
    if (!_audio) return;
    try { _audio.currentTime = Math.max(0, Math.min(t, _audio.duration || t)); } catch {}
  }, []);

  const setSegment = useCallback((seg: Segment) => {
    segmentRef.current = seg;
    if (_audio) _audio.loop = !seg.loopSegment;
  }, []);

  const playFrom = useCallback(async (t: number) => {
    seek(t);
    await play();
  }, [play, seek]);

  const value = useMemo<AudioCtx>(() => ({
    ready, playing, currentTime, duration, volume,
    setSrc, setVolume, toggle, play, pause, seek, setSegment, playFrom,
  }), [ready, playing, currentTime, duration, volume, setSrc, setVolume, toggle, play, pause, seek, setSegment, playFrom]);

  return <AudioContextGlobal.Provider value={value}>{children}</AudioContextGlobal.Provider>;
};

export function useAudio() {
  const ctx = useContext(AudioContextGlobal);
  if (!ctx) throw new Error("useAudio must be used within <AudioProvider />");
  return ctx;
}
