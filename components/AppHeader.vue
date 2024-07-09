<template>
  <!-- AppHeader.vue -->
  <div id="Header" class="header">
    <div id="TopBar">&nbsp;</div>
    <div id="PgmName"><a href="ngenhome">NEXTGEN</a></div>
    <div v-show="location.name != 'Login' && location.name != 'NgenHome'">
      <TopMenu />
    </div>
    <div id="UserLink">
      <div id="UserLinkCircle">
        <div id="UserCircle">
          <a href="user">HH</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const location = useRoute();
const userMenuShowing = ref(false);

const ToggleUserMenu = () => {
  setTimeout(function () {
    userMenuShowing.value = !userMenuShowing.value;
  }, 1000);
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#UserLink {
  position: fixed;
  right: 50px;
  top: 10px;
  width: 150px;
  height: auto;
  text-align: center;
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

#TopBar {
  position: fixed;
  top: 0;
  height: 6px;
  background-color: $ngwcp_primary1;
  width: 100%;
}
#Header {
  height: 80px;
  border-bottom: 2px solid $ngwcp_primary1;
}
#Logo {
  position: fixed;
  top: 6;
  left: 10px;
  margin-top: 20px;

  img {
    width: 200px;
  }
}
#TopMenu {
  position: fixed;
  font: 20px "ObjektivMk2_Rg", sans-serif;
  right: 250px;
  top: 15px;
  ul {
    list-style: none;
  }
  li {
    display: inline-block;
    margin-right: 20px;
  }
}
#PgmName {
  font: 40px "NeueFrutigerWorld-Bold", sans-serif;
  font-weight: bold;
  position: fixed;
  left: 20px;
}
</style>
