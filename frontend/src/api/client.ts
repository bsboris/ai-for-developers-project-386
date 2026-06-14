const BASE_URL = "/api";

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiRequestError(
      res.status,
      body.code ?? "UNKNOWN",
      body.message ?? res.statusText,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export function apiRequestWithAuth<T>(
  path: string,
  username: string,
  password: string,
  options?: RequestInit,
): Promise<T> {
  const encoded = btoa(`${username}:${password}`);
  return apiRequest<T>(path, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Basic ${encoded}`,
    },
  });
}
