<template>
  <!-- AppHeader.vue -->
  <div id="Header" class="header  prevent-select">
    <div id="TopBar">&nbsp;</div>
    <div class="grid grid-cols-12 gap-1" style="height: 80px">
      <div id="PgmName" class="col-span-2 mt-4">
        <NuxtLink to="LandingPage">NgenCERF</NuxtLink>
      </div>
      <div id="Col2" class="col-span-8">

        <ul v-show="isUserLoggedIn() && location.name !== 'Login' && location.name !== 'LandingPage'" id="MainMenu">
          <li aria-label="Calibration" title="Calibration">
            <NuxtLink :class="location.name === 'Calibration' ? 'isActive' : ''" to="calibration" data-menu='1'
              @click="MenuChanged">Calibration</NuxtLink>
          </li>
          <li aria-label="Evaluation" title="Evaluation">
            <NuxtLink :class="location.name === 'Evaluation' ? 'isActive' : ''" to="evaluation" data-menu='2'
              @click="MenuChanged">Evaluation</NuxtLink>
          </li>
          <li aria-label="Forecast" title="Forecast">
            <NuxtLink :class="location.name === 'Forecast' ? 'isActive' : ''" to="forecast" data-menu='3'
              @click="MenuChanged">Forecast</NuxtLink>
          </li>
          <li aria-label="Verification" title="Verification">
            <NuxtLink :class="location.name === 'Verification' ? 'isActive' : ''" to="verification" data-menu='4'
              @click="MenuChanged">Verification</NuxtLink>
          </li>
        </ul>
      </div>

      <div id="Circles" class="col-span-2">
        <div id="UserGroup" class="grid grid-cols-2">
          <div class="col-span-1">
            <div v-if="isUserLoggedIn() && location.name !== 'Login'" id="UserCircle" class="float-right userInitials" @click="showUserMenu">
              {{ getUserInitials() }}
            </div>

          </div>
          <div id="userMenu">
            <ul>
              <li @click="gotoAccount">Account</li>
              <li @click="logoutUser">Logout</li>
            </ul>
          </div>
          <div class="col-span-1">
            <button v-if="isUserLoggedIn() && location.name !== 'Login'" class="float-left" id="HelpCircle" title="Help"
              aria-lable="help" @click="displayHelp">?</button>
          </div>
        </div>
      </div>

      <Transition name="slide-fade">
        <div v-if="showHelp" id="HelpWindow">
          <div class="text-right">
            <img title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
              class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="closeHelp" />
          </div>
          <div v-if="location.name === 'LandingPage'">
            <HelpLandingPageHelp />
          </div>

          <div v-if="location.name === 'PreviousRuns'">
            <HelpPreviousRunsHelp />
          </div>
          7
          <div v-if="location.name === 'Calibration'">
            <div v-if="getMenuIndex() === 1">
              <span v-if="getCalibrationTabIndex() === 1">
                <HelpHeadwaterBasinGageHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 2">
                <HelpFormulationHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 3">
                <HelpTuningControlsHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 4">
                <HelpOptimizationMetricsHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 5">
                <HelpRunStatusHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 6">
                <HelpResultsHelp />
              </span>
            </div>
          </div>

          <div v-else-if="getMenuIndex() === 2">

          </div>
          <div v-else-if="getMenuIndex() === 3">

          </div>
          <div v-else-if="getMenuIndex() === 4">

          </div>
          <div v-else-if="getMenuIndex() === 5">

          </div>
          <div v-else-if="getMenuIndex() === 6">

          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useUserDataStore } from "@/stores/common/UserDataStore";

import { generalStore } from "@/stores/common/GeneralStore";

import HelpLandingPageHelp from "../Help/LandingPageHelp.vue";
import HelpPreviousRunsHelp from "../Help/PreviousRunsHelp.vue";
import HelpHeadwaterBasinGageHelp from "../Help/HeadwaterBasinGageHelp.vue";
import HelpTuningControlsHelp from "../Help/TuningControlsHelp.vue";
import HelpFormulationHelp from "../Help/FormulationHelp.vue";
import HelpOptimizationMetricsHelp from "../Help/OptimizationMetricsHelp.vue"
import HelpRunStatusHelp from "../Help/RunStatusHelp.vue"
import HelpResultsHelp from "../Help/ResultsHelp.vue"

const { getMenuIndex, setMenuIndex, getCalibrationTabIndex, } = generalStore();

const { isUserLoggedIn, getUserName, setAccessToken, setRefreshToken, logUserOut } = useUserDataStore();

const location = useRoute();

const showHelp = ref(false);
let observer = null;

const isOnDiv = ref(false);
onMounted(() => {
  window.addEventListener('resize', function (event) {
    sizeHelpWindow();
    let headerHeight = document.getElementById('Header')?.clientHeight;
    let footerTop = document.getElementById('Footer')?.getBoundingClientRect().top;
    if (footerTop && headerHeight) {
      let h = (footerTop - headerHeight) + 54;
      let hpx = h + 'px'
      let ele = document.getElementById("HelpWindow");
      if (ele) { ele.style.height = parseInt(hpx) + 'px'; }
    };
  });
  document.getElementById("userMenu")?.addEventListener("mouseout", function () { hideUserMenu() });
});

onUnmounted(() => {
  window.removeEventListener('resize', function (event) {
    sizeHelpWindow();
  });
});

const sizeHelpWindow = () => {
  console.log("called")
  let headerHeight = document.getElementById('Header')?.clientHeight;
  let footerTop = document.getElementById('Footer')?.getBoundingClientRect().top;
  if (footerTop && headerHeight) {
    let h = (footerTop - headerHeight) + 54;
    let hpx = h + 'px'
    let ele = document.getElementById("HelpWindow");
    if (ele) { ele.style.height = parseInt(hpx) + 'px'; }
  };
};

const gotoAccount = async () => {
  await navigateTo('user');
}

const logoutUser = async () => {
  logUserOut();
  await navigateTo('login');
}

const showUserMenu = () => {
  console.log("Show Menu")
  const ele = document.getElementById('userMenu') as HTMLElement;
  ele.style.display = "block";
}

const hideUserMenu = () => {
  console.log(isOnDiv.value)
  if (isOnDiv.value) { return };
  setTimeout(() => {
    console.log("Hide Menu")
    const ele = document.getElementById('userMenu') as HTMLElement;
    ele.style.display = "none";
  }, 1500);
}

const closeHelp = () => {
  showHelp.value = false;
}
const displayHelp = () => {
  showHelp.value = true;
  setTimeout(function () { sizeHelpWindow() }, 0);
}

const getUserInitials = () => {
  const name = getUserName();
  return (fullname => fullname.map((n, i) => (i == 0 || i == fullname.length - 1) && n[0]).filter(n => n).join(""))
    (name.split(" "));
};

const MenuChanged = (e: MouseEvent) => {
  const ele = e.currentTarget as HTMLElement;
  const m = ele.getAttribute('data-menu');
  if (m) {
    setMenuIndex(parseInt(m, 10));
  }
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

#userMenu {
  display: none;
  background-color: white;
  border: 1px solid black;
  position: fixed;
  top: 7px;
  margin-left: 54px;
  padding: 5px 0;

  ul li {
    padding: 3px;
  }

  ul li:hover {
    background-color: #ccc;
  }

}

.fade {
  animation: fading 1s forwards; // "fading" is the keyframe animation you created
}

#Circles {
  margin-right: 10px;
  margin-top: 10px;
  clear: none;
  text-align: center;
}

#UserCircle,
#HelpCircle {
  display: inlingreye-block;
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

#HelpCircle {
  padding-top: 0;
}

#HelpCircle:hover {
  background-color: $ngwcp_primary2;
}

.help_close_button {
  margin: 20px auto;
  width: 100px;
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

  HelpWindow #HelpCircle {
    text-align: center;
    margin-top: 15px;
  }
}

#HelpWindow {
  z-index: 9999;
  border: 2px solid black;
  position: absolute;
  right: 2%;
  top: 84px;
  width: 80%;
  background-color: white;
  overflow-y: auto;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  //transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1)
  transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1)
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
