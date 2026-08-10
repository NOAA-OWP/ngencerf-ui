import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue'; // **FIX: Correctly import 'ref' from 'vue'**
import { makeProtectedApiCall } from '@/composables/UserAuth';

// --- Mocks for Dependencies ---
vi.mock('@/stores/common/UserDataStore', () => ({
  useUserDataStore: () => ({
    getAccessToken: () => 'fake-access-token',
    getRefreshToken: () => 'fake-refresh-token',
    lastServerError: ref(null), // This now works
    logUserOut: vi.fn(),
  }),
}));

vi.mock('@/composables/UseBackendConfig', () => ({
  useBackendConfig: () => ({
    ngencerfBaseUrl: 'http://mock-api.com',
  }),
}));

vi.mock('@/stores/common/GeneralStore', () => ({
  generalStore: () => ({
    isLoading: ref(false), // This now works
  }),
}));

// Mock global fetch
let fetchSpy: any;

beforeEach(() => {
  // Mock fetch to return a successful response
  fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (url, options) => {
    return {
      ok: true,
      status: 200,
      json: async () => ({ data: 'mocked success' }),
      headers: { get: vi.fn(), set: vi.fn() }
    } as unknown as Response;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('makeProtectedApiCall', () => {
  const TEST_URL = 'http://mock-api.com/test';
  const objectBody = { id: 101, name: 'Test' };
  const stringifiedBody = JSON.stringify(objectBody);

  // This test validates the functional fix.
  it('should automatically stringify an un-stringified object body before calling fetch (Fix Validation)', async () => {
    // Call the function with an un-stringified object body
    await makeProtectedApiCall(TEST_URL, {
      method: 'POST',
      body: objectBody,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-access-token',
      },
    });

    // Check the arguments passed to the underlying fetch call
    const fetchOptions = fetchSpy.mock.calls[0][1];

    // Assert that the body is correctly stringified
    expect(fetchOptions.body).toBe(stringifiedBody);
    expect(typeof fetchOptions.body).toBe('string');
  });

  // This test validates the existing behavior for already-stringified bodies.
  it('should correctly handle an already stringified body (Pinia Store Behavior)', async () => {
    await makeProtectedApiCall(TEST_URL, {
      method: 'POST',
      body: stringifiedBody,
    });

    const fetchOptions = fetchSpy.mock.calls[0][1];
    
    // Assert that the string body is passed through without change
    expect(fetchOptions.body).toBe(stringifiedBody);
  });
  
  // This test ensures we don't accidentally stringify FormData objects used for file uploads.
  it('should not stringify a FormData object', async () => {
    const formData = new FormData();
    formData.append('key', 'value');

    await makeProtectedApiCall(TEST_URL, {
      method: 'POST',
      body: formData,
    });

    const fetchOptions = fetchSpy.mock.calls[0][1];
    
    // Assert that the FormData object itself is passed through
    expect(fetchOptions.body).toBe(formData);
  });
});
