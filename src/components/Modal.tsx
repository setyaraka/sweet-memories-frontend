import React, { useEffect, useRef } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string; // id of heading inside modal
};

export default function Modal({ open, onClose, children, labelledBy }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // focus container when open
    requestAnimationFrame(() => ref.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby={labelledBy}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className="w-full sm:max-w-xl sm:w-full rounded-t-2xl sm:rounded-2xl bg-[#FFF8F1] shadow-xl p-4 sm:p-6 max-h-[85dvh] overflow-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}