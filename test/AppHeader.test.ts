import { VueWrapper, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test } from "vitest";
import AppHeader from "~~/components/AppHeader.vue";
//import { NuxtLink } from "@vue/test-utils";

describe("Test Header component", () => {
  let wrapper: VueWrapper = null;
  beforeEach(async () => {
    wrapper = mount(AppHeader);
  });
  test("Verify Program Name", () => {
    expect(wrapper.html()).toContain("PgmName");
  });
});
