import { VueWrapper, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import AppHeader from "~/components/Common/AppHeader.vue";

describe("Test Header component", () => {
  let wrapper: VueWrapper;
  beforeEach(async () => {
    wrapper = mount(AppHeader, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
  });
  test("Verify Program Name", () => {
    expect(wrapper.html()).toContain("PgmName");
  });
});
