import { VueWrapper, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test } from "vitest";

import { jsdom } from "jsdom";
import User from "@/pages/User.vue";

describe("Test Header component", () => {
  //const jsdomAlert = window.alert; // remember the jsdom alert
  window.alert = () => {}; // provide an empty implementation for window.alert
  let wrapper: VueWrapper;

  beforeEach(async () => {
    wrapper = mount(User);
  });``

  test("Verify Program Name", () => {
    expect(wrapper.html()).toContain("passwordBox");
  });

  test("Test Old Password Input", () => {
    let inputWrapper = wrapper.find("#OldPass");
    inputWrapper.setValue("oldpassword");
    expect(inputWrapper.element.value).toEqual("oldpassword");
  });

  test("Test Password Input", () => {
    let inputWrapper = wrapper.find("#NewPass");
    inputWrapper.setValue("newpassword");
    expect(inputWrapper.element.value).toEqual("newpassword");
  });

  test("Click on Sign In and check reactative constants.", async () => {
    let inputWrapper = wrapper.find("#OldPass");
    inputWrapper.setValue("oldpassword");

    inputWrapper = wrapper.find("#NewPass");
    inputWrapper.setValue("newpassword");

    const btn = wrapper.find("#UpdateButton");
    await btn.trigger("click");

    let ud = wrapper.vm.newpass;
    expect(wrapper.vm.newpass).toEqual("newpassword");

    ud = wrapper.vm.oldpass;
    expect(wrapper.vm.oldpass).toEqual("oldpassword");
  });

  test("Test aria-labels", () => {
    let inputWrapper = wrapper.find("#OldPass");
    expect(inputWrapper.attributes()["aria-label"]).toEqual(
      "Enter old password here"
    );
    inputWrapper = wrapper.find("#NewPass");
    expect(inputWrapper.attributes()["aria-label"]).toEqual(
      "Enter new password here"
    );
  });

  test("Test successful Update Password Event", async () => {
    let inputWrapper = wrapper.find("#OldPass");
    inputWrapper.setValue("OldPassword");
    inputWrapper = wrapper.find("#NewPass");
    inputWrapper.setValue("NewPassword");

    const btn = wrapper.find("#UpdateButton");
    await btn.trigger("click");
    let ud = wrapper.vm.passwordChanged;
    expect(wrapper.vm.passwordChanged).toBe(true);
  });

  test("Test unsuccessful Update Password Event", async () => {
    let inputWrapper = wrapper.find("#OldPass");
    inputWrapper.setValue("");
    inputWrapper = wrapper.find("#NewPass");
    inputWrapper.setValue("");

    const btn = wrapper.find("#UpdateButton");
    await btn.trigger("click");
    let ud = wrapper.vm.passwordChanged;
    expect(wrapper.vm.passwordChanged).toBe(false);
  });
});
