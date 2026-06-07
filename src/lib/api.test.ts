import { describe, expect, it, vi } from 'vitest';
import { api, getApiBaseUrl } from './api';

describe('api client', () => {
  it('uses the local backend default', () => {
    expect(getApiBaseUrl()).toContain('/api/v1');
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
