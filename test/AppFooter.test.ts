import { VueWrapper, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test } from "vitest";
import { createTestingPinia } from "@pinia/testing";
import AppFooter from "@/components/Common/AppFooter.vue";

describe("Test Footer component", () => {
  expect(AppFooter).toBeTruthy();

  let wrapper: VueWrapper;
  beforeEach(async () => {
    wrapper = mount(AppFooter, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
  });

  test("Test Server Version", () => {
    let inputWrapper = wrapper.find("#FooterData span");
    expect(inputWrapper.text()).toContain("Version");    
  });  
  
  test("Test Copyright", () => {
    let inputWrapper = wrapper.find("#Copyright");
    expect(inputWrapper.text()).toContain("Copyright");    
  });

  // test("Test Footer", () => {
  //   //let inputWrapper = wrapper.find("#Footer");
  //   console.log("Footer", wrapper.vm.$data);
  // });

  describe('Index', () => {
    it('is a Vue instance',async () => {
      const wrapper = mount(AppFooter)
      await wrapper.vm.$forceUpdate();
      console.log(wrapper.vm)
    })
  })

});
