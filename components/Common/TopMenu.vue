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
  #UserLink {
    #UserLinkCircle {
      z-index: 9;
      text-align: center;
      height: 60px;
      width: 60px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      font-size: 22px;
      #UserCircle {
        text-align: center;
        margin-top: 18px;
      }
      .tglusermenu {
        cursor: pointer;
      }
    }
    #UserMenu {
      background-color: #ffffff;
      border-radius: 20px;
      height: 2em;
      padding-top: 5px;
    }
  }

  #HelpLink {
    z-index: 9;
    text-align: center;
    height: 60px;
    width: 60px;
    display: inline-block;
    #HelpCircle {
      text-align: center;
      margin-top: 18px;
    }
  }
}
</style>
