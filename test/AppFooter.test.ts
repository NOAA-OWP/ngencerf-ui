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
    await wrapper.vm.$nextTick(); 
  });

  test("Test Server Version", async () => {
    await wrapper.vm.$nextTick();
    let inputWrapper = wrapper.find("#FooterData span");
    expect(inputWrapper.text()).toContain("Version");    
  });  
  
  test("Test Copyright", async () => {
    await wrapper.vm.$nextTick();
    const inputWrapper = wrapper.find('.copyright'); 
    expect(inputWrapper.exists()).toBe(true);
    expect(inputWrapper.text()).toContain("Copyright");    
  });

  describe('Index', () => {
    it('is a Vue instance',async () => {
      const wrapper = mount(AppFooter)
      await wrapper.vm.$forceUpdate();
      // console.log(wrapper.vm)
    })
  })

});
