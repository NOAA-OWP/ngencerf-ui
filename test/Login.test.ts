import { VueWrapper, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import { jsdom } from "jsdom";
import Login from "@/pages/Login.vue";

describe("Test Header component", () => {
  let wrapper: VueWrapper;
  beforeEach(async () => {
    setActivePinia(createPinia());

    wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
  });

  test("Verify Program Name", () => {
    expect(wrapper.html()).toContain("LoginBox");
  });

  test("Test Username Input", () => {
    let inputWrapper = wrapper.find("#uname");
    inputWrapper.setValue("User Name");
    expect(inputWrapper.element.value).toEqual("User Name");
  });

  test("Test Password Input", () => {
    let inputWrapper = wrapper.find("#pword");
    inputWrapper.setValue("Password");
    expect(inputWrapper.element.value).toEqual("Password");
  });

  test("Click on Sign In and check reactative constants.", async () => {
    let inputWrapper = wrapper.find("#uname");
    inputWrapper.setValue("User Name");
    inputWrapper = wrapper.find("#pword");
    inputWrapper.setValue("Password");
    const btn = wrapper.find("#LoginButton");
    await btn.trigger("click");
    let ud = wrapper.vm.userName;
    expect(wrapper.vm.userName).toEqual("User Name");
  });

  test("Test aria-labels", () => {
    let inputWrapper = wrapper.find("#uname");
    expect(inputWrapper.attributes()["aria-label"]).toEqual("Username");
    inputWrapper = wrapper.find("#pword");
    expect(inputWrapper.attributes()["aria-label"]).toEqual("Password");
  });
});
