// @ts-check

import { defineStore } from "pinia";

export const generalStore = defineStore("GeneralStore", () => {
  const tabIndex = ref(1);

  function getTabIndex() {
    return tabIndex.value;
  }  
    function setTabIndex(tab: number) {
    tabIndex.value = tab;
  }

  return {
    getTabIndex,
    setTabIndex,
   };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(generalStore, import.meta.hot));
}

