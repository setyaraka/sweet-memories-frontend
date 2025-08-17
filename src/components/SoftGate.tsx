import React, { useEffect, useRef, useState } from "react";
import { PASS_PHRASE, STORAGE_KEYS } from "../lib/constants";

type Props = {
  unlocked: boolean;
  setUnlocked: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SoftGate({ unlocked, setUnlocked }: Props) {
  const [val, setVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!PASS_PHRASE) return;
    const ok = localStorage.getItem(STORAGE_KEYS.pass) === "ok";
    if (ok) setUnlocked(true);
  }, [setUnlocked]);

  useEffect(() => {
    if (PASS_PHRASE && !unlocked) inputRef.current?.focus();
  }, [unlocked]);

  if (!PASS_PHRASE || unlocked) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#FBEDE5] to-[#F7F3EE] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[#f0e2d8] bg-white p-6 shadow-lg">
        <h3 className="text-xl font-semibold">Masuk ke Museum Cinta 💌</h3>
        <p className="mt-1 text-sm text-neutral-600">Masukkan kata rahasia yang kalian sepakati.</p>
        <input
          ref={inputRef}
          className="mt-4 w-full rounded-xl border border-[#e8ddd4] px-3 py-2 outline-none"
          placeholder="kata rahasia"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (val && val === PASS_PHRASE) {
                localStorage.setItem(STORAGE_KEYS.pass, "ok");
                localStorage.setItem("mc_api_key", val); // <- enable API calls
                setUnlocked(true);
              } else alert("Kata rahasia salah");
            }
          }}
        />
        <div className="mt-4 flex gap-2">
          <button
            className="rounded-xl border border-[#ecd9cf] bg-white px-4 py-2 hover:bg-[#fff6f2]"
            onClick={() => {
              if (val && val === PASS_PHRASE) {
                localStorage.setItem(STORAGE_KEYS.pass, "ok");
                localStorage.setItem("mc_api_key", val); // <- enable API calls
                setUnlocked(true);
              } else alert("Kata rahasia salah");
            }}
          >
            Buka
          </button>
          <button
            className="rounded-xl border border-[#ecd9cf] bg-white px-4 py-2 hover:bg-[#fff6f2]"
            onClick={() => {
              localStorage.removeItem(STORAGE_KEYS.pass);
              setVal("");
              inputRef.current?.focus();
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}