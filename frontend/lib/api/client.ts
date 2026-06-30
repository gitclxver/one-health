import type { ApiResponse } from "@/lib/types/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: unknown[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Base URL for browser requests (empty = same-origin proxy). */
export function getClientApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "";
}

/** Base URL for server-side requests. */
export function getServerApiBase(): string {
  return (
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://127.0.0.1:3001"
  );
}

function resolveUrl(path: string, serverSide: boolean): string {
  const base = serverSide ? getServerApiBase() : getClientApiBase();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

let refreshAttempted = false;

async function parseErrorResponse(res: Response): Promise<ApiError> {
  try {
    const body = (await res.json()) as ApiResponse<null> & { errors?: unknown[] };
    const message =
      body.message ??
      (res.status >= 500
        ? "Unable to load content right now. Please try again later."
        : res.statusText);
    return new ApiError(res.status, message, body.errors);
  } catch {
    return new ApiError(
      res.status,
      res.status >= 500
        ? "Unable to load content right now. Please try again later."
        : "Something went wrong. Please try again.",
    );
  }
}

export async function api<T>(
  path: string,
  options: RequestInit & { serverSide?: boolean; skipRefresh?: boolean } = {},
): Promise<T> {
  const { serverSide = false, skipRefresh = false, ...fetchOptions } = options;
  const url = resolveUrl(path, serverSide);

  const headers: HeadersInit = {
    ...(fetchOptions.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...fetchOptions.headers,
  };

  const res = await fetch(url, {
    ...fetchOptions,
    credentials: serverSide ? undefined : "include",
    headers,
  }).catch(() => {
    throw new ApiError(0, "Unable to connect. Please check your connection and try again.");
  });

  if (
    res.status === 401 &&
    !skipRefresh &&
    !path.includes("/auth/refresh") &&
    !serverSide
  ) {
    if (!refreshAttempted) {
      refreshAttempted = true;
      try {
        await fetch(resolveUrl("/api/v1/auth/refresh", false), {
          method: "POST",
          credentials: "include",
        });
        refreshAttempted = false;
        return api<T>(path, { ...options, skipRefresh: true });
      } catch {
        refreshAttempted = false;
      }
    }
    throw await parseErrorResponse(res);
  }

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function apiData<T>(
  path: string,
  options?: RequestInit & { serverSide?: boolean },
): Promise<T> {
  const response = await api<ApiResponse<T>>(path, options);
  return response.data as T;
}
