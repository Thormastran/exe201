import { getToken } from './auth-storage';
import { getCached, invalidateCache, setCached } from './api-cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
  /** Cache GET trong N ms (chỉ method GET) */
  cacheTtlMs?: number;
  /** Bỏ qua cache cho request này */
  skipCache?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = false, headers, cacheTtlMs, skipCache, ...rest } = options;
  const method = (rest.method ?? 'GET').toUpperCase();
  const cacheKey = `${method}:${path}`;

  if (method === 'GET' && cacheTtlMs && !skipCache) {
    const hit = getCached<T>(cacheKey);
    if (hit !== null) return hit;
  }

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = getToken();
    if (token) {
      (requestHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
    });
  } catch {
    throw new ApiError(
      'Không kết nối được máy chủ API. Hãy mở terminal chạy Backend: cd BE → npm run start:dev (port 3001).',
      0,
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      Array.isArray(data.message)
        ? data.message.join(', ')
        : data.message ?? 'Có lỗi xảy ra';
    throw new ApiError(message, response.status);
  }

  if (method === 'GET' && cacheTtlMs) {
    setCached(cacheKey, data, cacheTtlMs);
  }

  if (method !== 'GET') {
    invalidateCache();
  }

  return data as T;
}

export { invalidateCache };
