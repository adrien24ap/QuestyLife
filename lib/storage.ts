"use client";

import { useEffect, useRef, useState } from "react";

export const STORAGE_SYNC_EVENT = "questylife-storage-sync";

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function notifyStorageSync(key: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(STORAGE_SYNC_EVENT, { detail: { key } }));
}

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const lastSerialized = useRef<string | null>(null);

  useEffect(() => {
    const storedValue = readStorage(key, fallback);
    lastSerialized.current = JSON.stringify(storedValue);
    setValue(storedValue);
    setReady(true);
  }, [key]);

  useEffect(() => {
    function refresh(event: Event) {
      const customEvent = event as CustomEvent<{ key?: string }>;
      if (!customEvent.detail?.key || customEvent.detail.key === key) {
        const storedValue = readStorage(key, fallback);
        const nextSerialized = JSON.stringify(storedValue);
        if (lastSerialized.current !== nextSerialized) {
          lastSerialized.current = nextSerialized;
          setValue(storedValue);
        }
      }
    }

    window.addEventListener(STORAGE_SYNC_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(STORAGE_SYNC_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [fallback, key]);

  useEffect(() => {
    if (ready) {
      const nextSerialized = JSON.stringify(value);
      if (lastSerialized.current === nextSerialized) return;
      lastSerialized.current = nextSerialized;
      writeStorage(key, value);
      notifyStorageSync(key);
    }
  }, [key, ready, value]);

  return [value, setValue] as const;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
