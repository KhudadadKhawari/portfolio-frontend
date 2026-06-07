import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, getApiBaseUrl } from './api';

describe('api client', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the same-origin API default', () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');

    expect(getApiBaseUrl()).toBe('/api/v1');
  });

  it('uses the public API environment value', () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://portfolio.seferyak.com/api/v1/');

    expect(getApiBaseUrl()).toBe('https://portfolio.seferyak.com/api/v1');
  });

  it('sends login requests as json', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(Response.json({ access_token: 'token', token_type: 'bearer' }));

    const result = await api.login('admin', 'admin123');

    expect(result.access_token).toBe('token');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.objectContaining({ method: 'POST' }));
    fetchMock.mockRestore();
  });
});
