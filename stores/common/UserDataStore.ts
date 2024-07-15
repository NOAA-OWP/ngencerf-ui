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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot));
}

