// @ts-check

import { defineStore } from "pinia";

export const useUserDataStore = defineStore("UserDataStore", () => {
  const isLoggedIn = ref(false);

  function isUserLoggedIn() {
    return isLoggedIn.value;
  }
  function logUserIn() {
    console.log("User is logged In");
    isLoggedIn.value = true;
  }
  function logUserOut() {
    console.log("User is logged out");
    isLoggedIn.value = false;
  }
  function getUserName() {
    return "Herbert Hover";
  }
  return {
    isUserLoggedIn,
    logUserIn,
    logUserOut,
    getUserName,
  };
});

/* Pinia supports Hot Module replacement so you can edit your stores
   and interact with them directly in your app without reloading the page,
   allowing you to keep the existing state, add, or even remove state,
   actions, and getters.
*/
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot));
}

