import { VueWrapper, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test, vi } from "vitest"; 
import { createTestingPinia } from "@pinia/testing";
import AppHeader from "@/components/Common/AppHeader.vue";

// MOCK: This ensures UseBackendConfig.ts doesn't crash on the internal Nuxt '#app' import.
vi.mock("@/composables/UseBackendConfig", () => ({
  useBackendConfig: () => ({
    ngencerfBaseUrl: 'http://mocked-backend:8000',
  }),
}));

// Mock the PrimeVue Swal object
vi.mock('sweetalert2', () => ({ default: { fire: vi.fn(), confirm: vi.fn() } }));


describe("Test Header component", () => {
  let wrapper: VueWrapper;
  beforeEach(async () => {
    wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          NuxtLink: true, 
          Button: true,   
          // We must stub the PrimeVue components used in the ContextMenu template
          ContextMenu: true,
          Transition: true,
        },
        // We use global.mocks for useRoute(), but a deeper mock for the router context is safer.
        mocks: {
          // This mock is needed because the component template accesses 'location' (the result of useRoute())
          location: { name: 'LandingPage' } 
        },
        provide: {
          // Explicitly provide the Vue Router/Nuxt context
          'useRoute': () => ({ name: 'LandingPage' }),
        },
      },
    });
    // Ensure the component fully renders after mounting
    await wrapper.vm.$nextTick();
  });
  
  test("Verify Program Name", () => {
    // Check for PgmName in the HTML after successful mounting
    expect(wrapper.html()).toContain("ngenCERF");
  });
});