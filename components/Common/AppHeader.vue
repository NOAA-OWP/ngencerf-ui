<template>
  <!-- AppHeader.vue -->
  <div id="Header" class="header  prevent-select">
    <div id="TopBar">&nbsp;</div>
    <div class="grid grid-cols-12 gap-1" style="height: 80px">
      <div id="PgmName" class="col-span-2">
        <NuxtLink to="LandingPage">NgenCERF</NuxtLink>
      </div>
      <div id="Col2" class="col-span-8">

        <ul v-show="isUserLoggedIn() && location.name !== 'Login' && location.name !=='LandingPage'" id="MainMenu">
          <li aria-label="Calibration" title="Calibration">
            <NuxtLink :class="location.name === 'Calibration' ? 'isActive' : ''" to="calibration" data-menu='1' @click="MenuChanged">Calibration</NuxtLink>
          </li>
          <li aria-label="Evaluation" title="Evaluation">
            <NuxtLink :class="location.name === 'Evaluation' ? 'isActive' : ''" to="evaluation" data-menu='2' @click="MenuChanged">Evaluation</NuxtLink>
          </li>
          <li aria-label="Forecast" title="Forecast">
            <NuxtLink :class="location.name === 'Forecast' ? 'isActive' : ''" to="forecast" data-menu='3' @click="MenuChanged">Forecast</NuxtLink>
          </li>
          <li aria-label="Verification" title="Verification">
            <NuxtLink :class="location.name === 'Verification' ? 'isActive' : ''" to="verification" data-menu='4' @click="MenuChanged">Verification</NuxtLink>
          </li>
        </ul>
        
      </div>

      <div id="Circles" class="col-span-2">
        <NuxtLink v-show="isUserLoggedIn() && location.name !== 'Login'" to="user" id="UserCircle" PreviousRunsclass="userInitials">
         {{ getUserInitials() }}
        </NuxtLink>
        <NuxtLink to="#" class="qmark" id="HelpCircle" v-show="isUserLoggedIn()"> ? </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

const { setMenuIndex } = generalStore();
const { isUserLoggedIn, getUserName } = useUserDataStore();
const location = useRoute();
const userMenuShowing = ref(false);

const getUserInitials = () => {
  const name = getUserName();
  return (fullname=>fullname.map((n, i)=>(i==0||i==fullname.length-1)&&n[0]).filter(n=>n).join(""))
  (name.split(" "));
};

const MenuChanged = (e) => {
  const m = e.currentTarget.getAttribute('data-menu');
  setMenuIndex(m);
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

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
  margin-right: 100px;
  margin-top: 20px;
  ul {
    list-style: none;
    margin-top: 0px;
  }

  li {
    display: inline-block;
    margin-right: 20px;
    font-size: 22px;
    margin-top: 15px;
    a {
      text-decoration: none;
      color: #000;
    }
    a:hover {
      color: $ngwcp_primary1;
      text-decoration: none;
    }
    .isActive {
      font-weight: bold;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
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
  background-color: #eee;
  border-radius: 50%;
  font-size: 30px;
  padding-top: 16px;
  border: 1px solid #000;
}
#UserCircle {
  margin-right: 10px;
}
#UserCircle:hover {
  background-color: $ngwcp_primary2;
}
#HelpCircle:hover {
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
