<template>
  <!-- AppHeader.vue -->
  <div id="Header" class="header">
    <div id="TopBar">&nbsp;</div>
    <div class="grid grid-cols-12 gap-1" style="height: 80px">
      <div id="PgmName" class="col-span-2">
        <NuxtLink to="LandingPage">NEXTGEN</NuxtLink>
      </div>
      <div id="Col2" class="col-span-8">
        <ul v-show="isUserLoggedIn() && location.name !== 'Login' && location.name !=='LandingPage'" id="MainMenu">
          <li>
            <a to="/">Calibration</a>
          </li>
          <li>
            <a class="disabled" href="/">Evaluation</a>
          </li>
          <li>
            <a class="disabled" href="/">Validation</a>
          </li>
          <li>
            <a class="disabled" href="/">Forecast</a>
          </li>
          <li>
            <a class="disabled" href="/">Verification</a>
          </li>
        </ul>
      </div>

      <div id="Circles" class="col-span-2">
        <NuxtLink v-show="isUserLoggedIn() && location.name !== 'Login'" to="user" id="UserCircle" class="userInitials">
          {{ getUserInitials() }}
        </NuxtLink>
        <NuxtLink to="#" class="qmark" id="HelpCircle"> ? </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUserDataStore } from "@/stores/common/UserDataStore";

const { isUserLoggedIn, getUserName } = useUserDataStore();

const location = useRoute();
const userMenuShowing = ref(false);

console.log("Page: ", location.name);
const getUserInitials = () => {
  const name = getUserName();
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
  let initials = [...name.matchAll(rgx)] || [];
  initials = (
    (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
  ).toUpperCase();
  return initials;
};
const ToggleUserMenu = () => {
  setTimeout(function () {
    userMenuShowing.value = !userMenuShowing.value;
  }, 1000);
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

.bordered {
  border: 1px solid #000;
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
  margin-bottom: 4px;
}
#Logo {
  img {
    width: 200px;
  }
}

#PgmName {
  display: inline-block;
  font: 40px "NeueFrutigerWorld-Bold", sans-serif;
  font-weight: bold;
  margin-left: 20px;
}
#TopMenu {
  display: inline;
  font-size: 20px;
  font: 20px Arial, sans-serif;
}
#MainMenu {
  float: right;
  margin-top: 20px;
  ul {
    list-style: none;
    margin-top: 0px;
  }

  li {
    display: inline-block;
    margin-right: 20px;
    font-size: 22px;
    margin-top: 30px;
    a {
      text-decoration: none;
      color: #000;
    }
    a:hover {
      color: $ngwcp_primary1;
      text-decoration: none;
    }
  }
}

#Circles {
  margin-right: 10px;
  margin-top: 10px;
  clear: none;
  text-align: center;
}

#UserCircle,
#HelpCircle {
  display: inline-block;
  height: 60px;
  width: 60px;
  background-color: #bbb;
  border-radius: 50%;
  font-size: 30px;
  padding-top: 16px;
  border: 1px solid #000;
}
#UserCircle {
  margin-right: 10px;
}
#HelpCircle {
  background-color: $ngwcp_primary2;
}

.userInitials {
  text-align: center;
}
.qmark {
  font-size: 35px;
}

#HelpLink {
  z-index: 9;
  text-align: center;
  height: 60px;
  width: 60px;
  display: inline-block;
  #HelpCircle {
    text-align: center;
    margin-top: 15px;
  }
}
</style>
