const store = new Map<string, { data: unknown; expires: number }>();

export function getCached<T>(key: string): T | null {
  const hit = store.get(key);
  if (!hit || hit.expires < Date.now()) {
    if (hit) store.delete(key);
    return null;
  }
  return hit.data as T;
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expires: Date.now() + ttlMs });
}

export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}
