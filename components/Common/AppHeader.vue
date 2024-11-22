<template>
  <!-- AppHeader.vue -->
  <div id="Header" class="header  prevent-select">
    <div id="TopBar">&nbsp;</div>
    <div class="grid grid-cols-12 gap-1" style="height: 80px">
      <div id="PgmName" class="col-span-2 mt-6">
        <NuxtLink to="LandingPage">NgenCERF</NuxtLink>
      </div>
      <div id="Col2" class="col-span-8">

        <ul v-show="isUserLoggedIn() && location.name !== 'Login'" id="MainMenu">
          <li aria-label="Calibration" title="Calibration">
            <NuxtLink :class="location.name === 'Calibration' ? 'isActive' : ''" to="calibration" data-menu='1'
              @click="MenuChanged">Calibration</NuxtLink>
          </li>
          <li aria-label="Evaluation" title="Evaluation">
            <NuxtLink :class="location.name === 'Evaluation' ? 'isActive' : ''" to="evaluation" data-menu='2'
              @click="MenuChanged">Evaluation</NuxtLink>
          </li>
          <li aria-label="Forecast" title="Forecast">
            <NuxtLink :class="location.name === 'Forecast' ? 'isActive' : ''" to="forecast" data-menu='3' @click=""
              class="disabled">Forecast</NuxtLink>
          </li>
          <li aria-label="Verification" title="Verification">
            <NuxtLink :class="location.name === 'Verification' ? 'isActive' : ''" to="verification" data-menu='4'
              @click="" class="disabled">Verification</NuxtLink>
          </li>
        </ul>

      </div>

      <div id="Circles" class="col-span-2">
        <div id="UserGroup" class="grid grid-cols-2">

          <div class="col-span-1">
            <div v-show="!uMenu && isUserLoggedIn() && location.name !== 'Login'" id="UserCircle"
              class="float-right userInitials" @contextmenu="onImageRightClick" @click="onImageRightClick">
              {{ getUserInitials() }}<i class="pi pi-angle-down"></i>
              <ContextMenu ref="userContextMenu" :model="userItems" :autoZIndex="true" />
            </div>

          </div>
          <div class="col-span-1">
            <button v-if="isUserLoggedIn() && location.name !== 'Login'" class="float-left" style="padding-top:0px"
              id="HelpCircle" title="Help" aria-label="help" @click="displayHelp">?</button>
          </div>

        </div>
      </div>

      <Transition name="slide-fade">
        <div v-if="showHelp" id="HelpWindow">
          <div class="text-right sticky top-0">
            <img alt="Close" title="Close" aria-label="Close" src="~/assets/styles/img/xclose.png" width="40"
              class="absolute cursor-pointer right-0 boxed mt-1 mr-1" @click="closeHelp" />
          </div>
          <div v-if="location.name === 'LandingPage'" class="py-10 px-6">
            <HelpLandingPageHelp />
          </div>

          <div v-if="location.name === 'Calibration'" class="py-10 px-1">
            <div v-if="getMenuIndex() === 1">
              <span v-if="getCalibrationTabIndex() === 1">
                <HelpPreviousRunsHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 2">
                <HelpHeadwaterBasinGageHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 3">
                <HelpFormulationHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 4">
                <HelpTuningControlsHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 5">
                <HelpOptimizationMetricsHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 6">
                <HelpRunStatusHelp />
              </span>
              <span v-else-if="getCalibrationTabIndex() === 7">
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
  <div id="UserAccountOverlay" class="hidden" ref="accountOverlay">
    <UserAccount />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useUserDataStore } from "@/stores/common/UserDataStore"
import { generalStore } from "@/stores/common/GeneralStore";
import ContextMenu from 'primevue/contextmenu';

import { useLogout, useLogoutListen } from "~/composables/UseEventBus";

import UserAccount from "~/components/Common/UserAccount.vue";

const HelpLandingPageHelp = defineAsyncComponent(() => import("../Help/LandingPageHelp.vue"))
const HelpPreviousRunsHelp = defineAsyncComponent(() => import("../Help/PreviousRunsHelp.vue"))
const HelpHeadwaterBasinGageHelp = defineAsyncComponent(() => import("../Help/HeadwaterBasinGageHelp.vue"))
const HelpTuningControlsHelp = defineAsyncComponent(() => import("../Help/TuningControlsHelp.vue"))
const HelpFormulationHelp = defineAsyncComponent(() => import("../Help/FormulationHelp.vue"))
const HelpOptimizationMetricsHelp = defineAsyncComponent(() => import("../Help/OptimizationMetricsHelp.vue"))
const HelpRunStatusHelp = defineAsyncComponent(() => import("../Help/RunStatusHelp.vue"))
const HelpResultsHelp = defineAsyncComponent(() => import("../Help/ResultsHelp.vue"))

const emit = defineEmits(["logoutEvent"]);

const accountOverlay = ref();

const { getMenuIndex, setMenuIndex, getCalibrationTabIndex, } = generalStore();

const { isUserLoggedIn, getUserInitials, setIsTokenExpired, getIsTokenExpired } = useUserDataStore();

const location = useRoute();

const userItems = ref([
  { label: 'Account', icon: 'pi pi-fw-times', command: () => gotoAccount() },
  { label: 'Logout', icon: 'pi pi-fw-times', command: () => logoutUser() }
])

const userContextMenu = ref();

const uMenu = ref(false);

const showHelp = ref(false);
let observer = null;

const isOnDiv = ref(false);

const onImageRightClick = (event: any) => {
  console.log("Activating user manu")
  userContextMenu.value.show(event)
}

onMounted(() => {
  console.log('MOUNTED: AppHeader');
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
  let headerHeight = document.getElementById('Header')?.clientHeight;
  let footerTop = document.getElementById('Footer')?.getBoundingClientRect().top;
  if (footerTop && headerHeight) {
    let h = (footerTop - headerHeight) + 54;
    let hpx = h + 'px'
    let ele = document.getElementById("HelpWindow");
    if (ele) { ele.style.height = parseInt(hpx) + 'px'; }
  };
};

/**
 * 
 */
const gotoAccount = async () => {
  accountOverlay.value.style.display = "block";
}

useAccountEventListen('accountEvent', () => {
  const ele = document.getElementById('UserAccountOverlay') as HTMLElement;
  ele.style.display = "none";
})

useLogoutListen('logoutEvent', (evStr: string) => {
  if (evStr === "token" && !getIsTokenExpired()) {
    setIsTokenExpired();
    alert("Your session has expired. Please log in again.");
    useLogout("logoutEvent", "logout");
    navigateTo('login');
  }
})

const logoutUser = async () => {
  if (confirm("Are you sure you want to logout?")) {
    console.log("Logging out...");
    useLogout("logoutEvent", "logout");
    await navigateTo('login');
  }
}

const showUserMenu = () => {
  uMenu.value = true;
}

const hideUserMenu = () => {
  if (isOnDiv.value) { return };
  setTimeout(() => {
    uMenu.value = false;
  }, 1000);
}

const closeHelp = () => {
  showHelp.value = false;
}
const displayHelp = () => {
  showHelp.value = true;
  setTimeout(function () { sizeHelpWindow() }, 0);
}

const MenuChanged = (e: MouseEvent) => {
  const currentMenu = getMenuIndex();
  const ele = e.currentTarget as HTMLElement;
  const m = ele.getAttribute('data-menu');
  const tabs = document.getElementsByClassName("tabs");
  const tab = <HTMLElement>tabs[0];
  if (m && e) {
    if (currentMenu && currentMenu.toString() === m) {
      tab.click();
    } else {
      setMenuIndex(parseInt(m, 10));
    }
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
  font-family: Arial, sans-serif;
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
    margin: 20px 7px 0;
    font-size: 22px;

    a {
      text-decoration: none;
      color: #000;
      font-weight: bold;
      background-color: $ngwcp_neutral_gray_md;
      border-radius: 5px;
      padding: 15px 28px;
    }

    a:hover {
      background-color: $gray-20;
      text-decoration: none;
    }

    .isActive {
      color: #fff;
      background-color: $ngwcp_primary1;
    }

    .isActive:hover {
      color: #fff;
      background-color: $ngwcp_primary1;
    }
  }
}

#Circles {
  margin-right: 0px;
  margin-left: auto;
  clear: none;
  text-align: center;
}

#UserCircle {
  display: inline-block;
  height: 70px;
  width: 70px;
  margin-top: 10px;
  background-color: $ngwcp_neutral_gray_md;
  border-radius: 50%;
  font-size: 30px;
  padding-top: 20px;
  margin-right: 10px;
}

#HelpCircle {
  display: inline-block;
  height: 50px;
  width: 50px;
  margin-top: 20px;
  background-color: $ngwcp_primary2;
  color: white;
  border-radius: 50%;
  font-size: 38px;
  padding-top: 12px;
  border: 1px solid #000;
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

#HelpWindow {
  z-index: 9999;
  border: 1px solid black;
  position: absolute;
  right: 2%;
  top: 84px;
  width: 50%;
  background-color: white;
  overflow: auto;
}

.disabled,
.disabled:hover {
  background-color: $ngwcp_neutral_gray_md !important;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 1s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
