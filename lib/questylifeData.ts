"use client";

import { notifyStorageSync, readStorage, writeStorage } from "./storage";

export const QUESTYLIFE_STORAGE_KEYS = [
  "questylife.missions",
  "questylife.water",
  "questylife.weights",
  "questylife.recaps",
  "questylife.sport",
  "questylife.sleep"
] as const;

export type QuestyLifeStorageKey = (typeof QUESTYLIFE_STORAGE_KEYS)[number];
export type QuestyLifeCloudPayload = Partial<Record<QuestyLifeStorageKey, unknown>>;

export function collectQuestyLifeData(): QuestyLifeCloudPayload {
  return QUESTYLIFE_STORAGE_KEYS.reduce<QuestyLifeCloudPayload>((payload, key) => {
    payload[key] = readStorage<unknown>(key, []);
    return payload;
  }, {});
}

export function applyQuestyLifeData(payload: QuestyLifeCloudPayload) {
  QUESTYLIFE_STORAGE_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(payload, key)) {
      writeStorage(key, payload[key]);
      notifyStorageSync(key);
    }
  });
}
