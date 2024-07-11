// @ts-check

import { defineStore } from "pinia";

export const useUserDataStore = defineStore("UserDataStore", () => {
  const isLoggedIn = ref(false);

  function isUserLoggedIn() {
    return isLoggedIn.value;
  }

  function logUserIn(info: boolean) {
    console.log("User is logged In");
    isLoggedIn.value = info;
  }
  function logUserOut(info: boolean) {
    console.log("User is logged out");
    return (isLoggedIn.value === info);
  }

  return {
    isUserLoggedIn,
    logUserOut,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot));
}

