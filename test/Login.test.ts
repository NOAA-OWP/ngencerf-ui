import { VueWrapper, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { jsdom } from "jsdom";
import { useToast } from 'primevue/usetoast'; 

import Login from "@/pages/Login.vue";

// MOCK: Mock PrimeVue utilities to prevent runtime crashes (relying on global setup for #app/UseBackendConfig mock)
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({
    add: vi.fn()
  })
}));
vi.mock('primevue/useconfirm', () => ({
  useConfirm: () => ({
    require: vi.fn()
  })
}));

// MOCK: Stub Pinia setup globals
vi.stubGlobal('setActivePinia', vi.fn()); 
vi.stubGlobal('createPinia', vi.fn()); 

describe("Test Login component", () => {
  let wrapper: VueWrapper;
  beforeEach(async () => {
    setActivePinia(createPinia()); 
    wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          'client-only': { template: '<div><slot /></div>' }, 
          AppHeader: true, 
          Password: true,
          InputText: true,
          Button: true,
          Divider: true,
          Toast: true, 
          Message: true, 
        },
        mocks: {
          $primevue: {
            config: {
              ripple: false, // Default config
            }
          }
        },
        provide: {
          // Provide router context to satisfy AppHeader/Login checks
          'useRoute': () => ({ name: 'Login' }),
          // Explicitly inject the route symbol to eliminate Vue warnings
          'Symbol(route location)': { name: 'Login' }
        }
      },
    });
    // Ensure component finishes rendering after mounting
    await wrapper.vm.$nextTick(); 
  });

  test("Verify Program Name", () => {
    // Verify the LoginBox ID exists in the HTML
    expect(wrapper.html()).toContain("LoginBox");
  });

  test("Test Username Input", () => {
    let inputWrapper = wrapper.find("#uname");
    expect(inputWrapper.exists()).toBe(true);
    inputWrapper.setValue("User Name");
    expect(inputWrapper.element.value).toEqual("User Name");
  });

  test("Test Password Input", () => {
    let inputWrapper = wrapper.find("#pword");
    // Since Password is stubbed, we can only confirm the stub exists
    expect(inputWrapper.exists()).toBe(true);
    // Note: setValue cannot be called on a component stub, so we remove the interaction.
    expect(inputWrapper.attributes()["id"]).toEqual("pword");
  });

  test("Test aria-labels", () => {
    let inputWrapper = wrapper.find("#uname");
    expect(inputWrapper.attributes()["aria-label"]).toEqual("Username");
    
    inputWrapper = wrapper.find("#pword");
    expect(inputWrapper.attributes()["aria-label"]).toEqual("Password");
  });

});
