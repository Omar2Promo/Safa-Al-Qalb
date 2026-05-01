// useEmotionLog.ts
// Manages the persistent emotion log stored in localStorage.
// Design: Islamic Geometric Minimalism — data as a journal of the heart's journey.

import { useState, useCallback } from "react";

export type EmotionLevel = "mild" | "irritation" | "resentment";

export interface EmotionEntry {
  id: string;
  timestamp: string; // ISO string
  level: EmotionLevel;
  description: string;
  guidance: string;
  personLabel?: string; // optional label like "a colleague", "a family member"
}

const STORAGE_KEY = "safa_al_qalb_log";

function loadEntries(): EmotionEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EmotionEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: EmotionEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function useEmotionLog() {
  const [entries, setEntries] = useState<EmotionEntry[]>(loadEntries);

  const addEntry = useCallback((entry: Omit<EmotionEntry, "id" | "timestamp">) => {
    const newEntry: EmotionEntry = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    setEntries((prev) => {
      const updated = [newEntry, ...prev];
      saveEntries(updated);
      return updated;
    });
    return newEntry;
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    saveEntries([]);
  }, []);

  return { entries, addEntry, deleteEntry, clearAll };
}
