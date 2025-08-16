import type { Email } from "../lib/types";

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const sampleEmails: Email[] = [
  {
    id: uid(),
    title: "Hai sayang, kalau kamu baca ini mungkin kamu baru bangun…",
    content:
      "Sebelum mulai hari, aku cuma mau bilang: kamu nggak sendirian. Aku selalu di sini, meski dari jauh.\n\nTarik napas pelan, minum air putih, dan inget: kamu udah hebat sampai di titik ini. Kalau capek, peluk kata-kata ini dulu.",
    category: "Pagi",
    created_at: "2024-04-22T06:20:00+07:00",
    author: "Aku",
  },
  {
    id: uid(),
    title: "Kalau hari ini rasanya berat, pelan-pelan aja ya",
    content:
      "Nggak harus kuat terus kok. Kalau pengen nangis, nggak apa-apa. Aku jagain dari sini.\n\nMalem ini aku bacain cerita favoritmu lagi ya. Biar hati kita istirahat bareng.",
    category: "Dukungan",
    created_at: "2024-05-07T21:05:00+07:00",
    author: "Aku",
  },
  {
    id: uid(),
    title: "Terima kasih sudah jadi rumah untukku",
    content:
      "Ada banyak hal yang bikin aku jatuh cinta ulang tiap hari: caramu sabar, caramu nanya kabar kecil, caramu inget hal-hal sepele.\n\nSemoga semua kebaikanmu pelan-pelan balik lagi jadi tenang di hatimu.",
    category: "Spesial",
    created_at: "2024-06-14T19:40:00+07:00",
    author: "Aku",
  },
  {
    id: uid(),
    title: "Random: aku kangen detil-detil kecil",
    content:
      "Kayak nunggu notif kamu muncul, atau ngeliat kamu ketawa gara-gara hal receh. Nanti ketemu, aku mau traktir roti kesukaanmu. Deal?",
    category: "Random",
    created_at: "2024-07-05T10:10:00+07:00",
    author: "Aku",
  },
];