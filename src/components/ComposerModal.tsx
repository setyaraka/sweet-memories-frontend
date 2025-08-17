import { useState } from "react";
import Modal from "./Modal";
import { CATEGORIES, Category } from "../lib/types";
import { btn } from "../lib/ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { 
    title: string; 
    content: string; 
    category: Category 
  }) => void;
};

export default function ComposerModal({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Category>("Pagi");

  const save = () => {
    if (!title.trim() || !content.trim()) {
      alert("Judul dan isi tidak boleh kosong");
      return;
    }
    onSubmit({ title: title.trim(), content: content.trim(), category });
    setTitle("");
    setContent("");
    setCategory("Pagi");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="compose-title">
      <h3 id="compose-title" className="text-lg font-semibold">Tulis Surat Baru</h3>
      <div className="mt-3 grid gap-3">
        <input
          className="w-full rounded-xl border border-[#e8ddd4] px-3 py-2 outline-none"
          placeholder="Judul / Kalimat pembuka"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="w-full rounded-xl border border-[#e8ddd4] px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea
          rows={8}
          className="w-full rounded-xl border border-[#e8ddd4] px-3 py-2 outline-none"
          placeholder="Tulis isi surat di sini…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className={`${btn.base} ${btn.ghost}`} onClick={onClose}>Batal</button>
        <button className={`${btn.base} ${btn.primary}`} onClick={save}>Simpan</button>
      </div>
    </Modal>
  );
}