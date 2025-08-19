import { useEffect, useMemo, useRef, useState } from "react";

export function useTypewriter(text: string, enabled = true, speed = 45) {
    // Pecah teks jadi array code point (aman untuk emoji)
    const glyphs = useMemo(() => Array.from(text), [text]);
  
    const [out, setOut] = useState("");
    const idxRef = useRef(0);
    const timerRef = useRef<number | null>(null);
  
    useEffect(() => {
      // reset saat teks berubah atau enable berubah
      setOut("");
      idxRef.current = 0;
  
      if (!enabled) {
        setOut(text);
        return;
      }
  
      const tick = () => {
        const i = idxRef.current;
        if (i >= glyphs.length) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = null;
          return;
        }
        // tambahkan tepat 1 glyph, tidak pernah memanggil text[i] di luar range
        setOut(prev => prev + glyphs[i]);
        idxRef.current = i + 1;
      };
  
      timerRef.current = window.setInterval(tick, speed);
  
      return () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
      };
    }, [glyphs, enabled, speed, text]);
  
    return out;
}