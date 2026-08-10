import { vi } from 'vitest';

/**
 * Universal Mocking Setup for Nuxt 3 in Vitest
 * This file is executed via setupFiles in vitest.config.ts and handles critical dependency mocking.
 */

// MOCK 1: Directly mock the UseBackendConfig module.
// This is the highest priority fix to stop the "Failed to resolve import #app" crash,
// as the compiler hits this file early in the dependency tree.
vi.mock('../composables/UseBackendConfig', () => ({
  useBackendConfig: vi.fn(() => ({
    ngencerfBaseUrl: 'http://mocked-backend:8000',
  })),
}));

// MOCK 2: Stub global composables that components call (e.g., in <script setup>)
vi.stubGlobal('useRuntimeConfig', vi.fn(() => ({
  public: {
    ngencerfBaseUrl: 'http://mocked-backend:8000',
  },
})));
vi.stubGlobal('useRoute', vi.fn(() => ({ name: 'mock-route' }))); 
vi.stubGlobal('navigateTo', vi.fn(() => {}));