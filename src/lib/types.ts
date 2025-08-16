export const CATEGORIES = ["Pagi", "Dukungan", "Spesial", "Random"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Email = {
  id: string;
  title: string;
  content: string;
  category: Category;
  created_at: string; // ISO
  author: string;
};