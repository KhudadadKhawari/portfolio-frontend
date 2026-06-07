import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, getApiBaseUrl } from './api';

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('uses the same-origin API default', () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');

    expect(getApiBaseUrl()).toBe('/api/v1');
  });

  it('uses the public API environment value', () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://portfolio.seferyak.com/api/v1/');

    expect(getApiBaseUrl()).toBe('https://portfolio.seferyak.com/api/v1');
  });

  it('uses the internal API base for server-side requests', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://portfolio.seferyak.com/api/v1');
    vi.stubEnv('INTERNAL_API_BASE_URL', 'http://backend:8000/api/v1/');

    expect(getApiBaseUrl()).toBe('http://backend:8000/api/v1');
  });

  it('uses an absolute public API base for server-side requests when internal is missing', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://portfolio.seferyak.com/api/v1/');
    vi.stubEnv('INTERNAL_API_BASE_URL', '');

    expect(getApiBaseUrl()).toBe('https://portfolio.seferyak.com/api/v1');
  });

  it('rejects relative server-side API bases', () => {
    vi.stubGlobal('window', undefined);
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '/api/v1');
    vi.stubEnv('INTERNAL_API_BASE_URL', '');

    expect(() => getApiBaseUrl()).toThrow('Server-side API requests require');
  });

  it('sends login requests as json', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({ access_token: 'token', token_type: 'bearer' }));

    const result = await api.login('admin', 'admin123');

    expect(result.access_token).toBe('token');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('throws backend error details', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      Response.json({ detail: 'Invalid credentials' }, { status: 401 }),
    );

    await expect(api.login('admin', 'wrong')).rejects.toMatchObject({
      message: 'Invalid credentials',
      status: 401,
    });
  });
});
