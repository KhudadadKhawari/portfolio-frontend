import type { BlogPost, Certification, Project } from '@/types/content';

const fallbackApiBase = 'http://localhost:8000/api/v1';

export function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || fallbackApiBase;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
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
      throw new Error(`Upload failed: ${response.status}`);
    }
    return response.json();
  },
};
