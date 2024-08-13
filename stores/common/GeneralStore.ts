// @ts-check


import { defineStore } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

export const generalStore = defineStore(
  "generalStore",
  () => {
    const tabIndex = ref("1");

    function getTabIndex() {
      return parseInt(tabIndex.value);
    }
    function setTabIndex(tab: number) {
      tabIndex.value = tab.toString();
    }
    return { tabIndex, getTabIndex, setTabIndex };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);


/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(generalStore, import.meta.hot));
}
