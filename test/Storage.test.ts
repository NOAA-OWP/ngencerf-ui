import { describe, expect, it, vi, afterAll } from 'vitest';
import { getStorageKey } from "@/utils/Storage";

describe('getStorageKey', () => {

  const originalWindowLocation = window.location;
  
  // Test the Parallel Works specific path
  it('should prefix the key with the fourth path segment', () => {
    // Mock the window location
    Object.defineProperty(window, 'location', {
      value: { pathname: '/sessions/ngen-pw-user/my-unique-session-id/some/path' },
      writable: true
    });
    
    expect(getStorageKey('calibration-store')).toBe('my-unique-session-id-calibration-store');
  });

  // Test the fallback for root paths (where JSDOM tests run)
  it('should use "global" prefix for root or short paths', () => {
    // Path: /
    Object.defineProperty(window, 'location', {
      value: { pathname: '/' },
      writable: true
    });
    expect(getStorageKey('general-store')).toBe('global-general-store');

    // Path: /sessions
    Object.defineProperty(window, 'location', {
      value: { pathname: '/sessions' },
      writable: true
    });
    expect(getStorageKey('general-store')).toBe('global-general-store');
  });
  
  // Test SSR scenario (assuming no window)
  it('should return the storeId directly in a non-browser (SSR) environment', () => {
    // Temporarily hide window object
    const windowSpy = vi.spyOn(global, 'window', 'get');
    windowSpy.mockReturnValue(undefined as any);
    
    expect(getStorageKey('user-data')).toBe('user-data');
    
    // Restore original window
    windowSpy.mockRestore();
  });
  
  // Restore original window.location after all tests in this describe block
  afterAll(() => {
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
      writable: true,
    });
  });
});