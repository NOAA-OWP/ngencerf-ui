<!-- TopMenu.vue -->
<template>

</template>

<script lang="ts" setup>
import { useUserDataStore } from "@/stores/common/UserDataStore";

const { isUserLoggedIn } = useUserDataStore();
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#TopMenu {
    display: inline-block;
  font-size: 20px;
  font: 20px Arial, sans-serif;

  ul {
    list-style: none;
    margin-top: 20px;
  }

  li {
    display: inline-block;
    margin-right: 20px;
    a {
      text-decoration: none;
      color: #000;
    }
    a:hover {
      text-decoration: underline;
      color: $ngwcp_primary1;
    }
    a:active {
      background-color: $ngwcp_neutral1;
    }
  }
}
</style>
