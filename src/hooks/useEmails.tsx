import { useLocalStorage } from "../hooks/useLocalStorage";
import { Email } from "../lib/types";
import { STORAGE_KEYS } from "../lib/constants";
import { sampleEmails } from "../data/sampleEmails";

export function useEmails() {
  return useLocalStorage<Email[]>(STORAGE_KEYS.emails, () => sampleEmails);
}