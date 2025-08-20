export const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }
);
  
export const greet = () => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi, Aya Sayang ❤️";
    if (h < 16) return "Selamat siang, Aya Sayang ❤️";
    if (h < 19) return "Selamat sore, Aya Sayang ❤️";
    return "Selamat malam, Aya Sayang ❤️";
};