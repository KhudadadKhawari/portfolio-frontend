import type { BlogPost, Certification, Project } from '@/types/content';

const sameOriginApiBase = '/api/v1';

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

function cleanApiBaseUrl(value: string | undefined) {
  return value?.trim().replace(/\/$/, '');
}

function isAbsoluteApiBaseUrl(value: string | undefined) {
  return /^https?:\/\//i.test(value || '');
}

export function getApiBaseUrl() {
  const publicApiBase = cleanApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (globalThis.window === undefined) {
    const internalApiBase = cleanApiBaseUrl(process.env.INTERNAL_API_BASE_URL);
    if (internalApiBase) {
      return internalApiBase;
    }
    if (isAbsoluteApiBaseUrl(publicApiBase)) {
      return publicApiBase;
    }

    throw new Error(
      'Server-side API requests require INTERNAL_API_BASE_URL or an absolute NEXT_PUBLIC_API_BASE_URL',
    );
  }

  return publicApiBase || sameOriginApiBase;
}

async function getErrorMessage(response: Response, fallback: string) {
  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.includes('application/json')) {
    const body = (await response.json().catch(() => null)) as { detail?: unknown; message?: unknown } | null;
    const message = body?.detail || body?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  const text = await response.text().catch(() => '');
  return text.trim() || fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response, `API request failed: ${response.status}`), response.status);
  }
  return response.json() as Promise<T>;
}

export const api = {
  projects: () => request<Project[]>('/projects'),
  project: (slug: string) => request<Project>(`/projects/${slug}`),
  posts: () => request<BlogPost[]>('/blog'),
  post: (slug: string) => request<BlogPost>(`/blog/${slug}`),
  certifications: () => request<Certification[]>('/certifications'),
  login: (username: string, password: string) =>
    request<{ access_token: string; token_type: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  createProject: (token: string, payload: Partial<Project>) =>
    request<Project>('/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  createPost: (token: string, payload: Partial<BlogPost>) =>
    request<BlogPost>('/blog', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  createCertification: (token: string, payload: Partial<Certification>) =>
    request<Certification>('/certifications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    }),
  upload: async (token: string, formData: FormData) => {
    const response = await fetch(`${getApiBaseUrl()}/uploads`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) {
      throw new ApiError(await getErrorMessage(response, `Upload failed: ${response.status}`), response.status);
    }
    return response.json();
  },
};
