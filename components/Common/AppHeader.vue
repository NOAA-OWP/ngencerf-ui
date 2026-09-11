<template>
    <!-- AppHeader.vue -->
    <div id="Header" class="header  prevent-select">
        <div id="TopBar">&nbsp;</div>
        <div class="grid grid-cols-12 gap-1" style="height: 80px">
            <div v-if="isUserLoggedIn()" id="PgmName" class="col-span-2 mt-6">
                <NuxtLink id="MainMenuLandingPage" to="LandingPage">
                  ngenCERF
                </NuxtLink>
            </div>
            <div v-else id="PgmName" class="col-span-2 mt-6">
                <div>ngenCERF</div>
            </div>
            <div id="Col2" class="col-span-8">

                <ul v-show="userLoggedIn && location.name !== 'Login'" id="MainMenu">
                    <li aria-label="Calibration" title="Calibration">
                      <NuxtLink id="MainMenuCalibration" :class="location.name === 'Calibration' ? 'isActive' : ''"
                        to="calibration">
                        Calibration
                      </NuxtLink>
                    </li>
                    <li aria-label="Evaluation" title="Evaluation">
                      <NuxtLink id="MainMenuEvaluation" :class="location.name === 'Evaluation' ? 'isActive' : ''"
                        to="evaluation">
                        Evaluation
                      </NuxtLink>
                    </li>
                    <li aria-label="Forecast" title="Forecast">
                      <NuxtLink id="MainMenuForecast" :class="location.name === 'Forecast' ? 'isActive' : ''"
                        to="forecast">
                        Forecast
                      </NuxtLink>
                    </li>
                    <li aria-label="Hindcast" title="Hindcast">
                      <NuxtLink id="MainMenuHindcast" :class="location.name === 'Hindcast' ? 'isActive' : ''"
                        to="hindcast">
                        Hindcast
                      </NuxtLink>
                    </li>
                </ul>
            </div>

            <div id="Circles" class="col-span-2">
                <div id="UserGroup" class="grid grid-cols-2">
                    <div class="col-span-1">
                        <Button v-if="userLoggedIn && location.name !== 'Login'"
                            class="pt-0" id="HelpCircle" title="Help" aria-label="Help"
                            @click="displayHelp">?</Button>
                    </div>

                    <div class="col-span-1">
                        <div v-show="!uMenu && userLoggedIn && location.name !== 'Login'" id="UserCircle"
                            class="float-right userInitials" @contextmenu="onImageRightClick" @click="onImageRightClick"
                            aria-label="User Menu" title="User Menu">
                            {{ userInitials }}<i class="pi pi-angle-down"></i>
                            <ContextMenu ref="userContextMenu" :model="userItems" :autoZIndex="true" />
                        </div>
                    </div>

                </div>
            </div>

            <Transition name="slide-fade">

                <div v-show="showHelp" id="HelpWindow" ref="helpWindow">
                    <div id="HelpContent">
                        <div class="text-right sticky top-0">
                            <img alt="Close" title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png"
                                width="40" class="absolute cursor-pointer right-0 mt-1 mr-1" @click="closeHelp" />
                        </div>

                        <div v-if="location.name === 'LandingPage'" class="py-10 px-6">
                            <LazyHelpLandingPageHelp />
                        </div>
                        <div v-else-if="location.name === 'DownloadCli'" class="py-10 px-6">
                            <LazyHelpDownloadCliPageHelp />
                        </div>

                        <div v-if="location.name === 'Calibration'" class="py-10 px-1">
                            <div v-if="getMenuIndex() === 1">
                                <span v-if="getCalibrationTabIndex() === 1">
                                    <LazyCalibrationHelpPreviousRunsHelp />
                                </span>
                                <span v-else-if="getCalibrationTabIndex() === 2">
                                    <LazyCalibrationHelpHeadwaterBasinGageHelp />
                                </span>
                                <span v-else-if="getCalibrationTabIndex() === 3">
                                    <LazyCalibrationHelpFormulationHelp />
                                </span>
                                <span v-else-if="getCalibrationTabIndex() === 4">
                                    <LazyCalibrationHelpTuningControlsHelp />
                                </span>
                                <span v-else-if="getCalibrationTabIndex() === 5">
                                    <LazyCalibrationHelpOptimizationMetricsHelp />
                                </span>
                                <span v-else-if="getCalibrationTabIndex() === 6">
                                    <LazyCalibrationHelpRunStatusHelp />
                                </span>
                            </div>
                        </div>

                        <div v-else-if="location.name === 'Evaluation'" class="py-10 px-1">
                            <div v-if="getMenuIndex() === 2">
                                <span v-if="getEvaluationTabIndex() === 1">
                                    <LazyEvaluationCalibrationRunsHelp />
                                </span>
                                <span v-else-if="getEvaluationTabIndex() === 2">
                                    <LazyEvaluationEvaluatesHelp />
                                </span>
                                <span v-else-if="getEvaluationTabIndex() === 3">
                                    <LazyEvaluationComparePermutationsHelp />
                                </span>
                                <span v-else-if="getEvaluationTabIndex() === 4">
                                    <LazyEvaluationCalibrationSelectAltInterationssHelp />
                                </span>
                                <span v-else-if="getEvaluationTabIndex() === 5">
                                    <LazyEvaluationRunStatusHelp />
                                </span>
                            </div>
                        </div>

                        <div v-else-if="location.name === 'Forecast'" class="py-10 px-1">
                            <div v-if="getMenuIndex() === 3">
                                <span v-if="getForecastTabIndex() === 1">
                                    <LazyForecastCalibrationRunsHelp />
                                </span>
                                <span v-else-if="getForecastTabIndex() === 2">
                                    <LazyForecastForecastRunsHelp />
                                </span>
                                <span v-else-if="getForecastTabIndex() === 3">
                                    <LazyForecastSetupForecastHelp />
                                </span>
                                <span v-else-if="getForecastTabIndex() === 4">
                                    <LazyForecastRunStatusHelp />
                                </span>
                                <span v-else-if="getForecastTabIndex() === 5">
                                    <LazyForecastResultsHelp />
                                </span>
                            </div>
                        </div>

                        <div v-else-if="location.name === 'Hindcast'" class="py-10 px-1">
                            <div v-if="getMenuIndex() === 4">
                                <span v-if="getHindcastTabIndex() === 1">
                                    <LazyHindcastCalibrationRunsHelp />
                                </span>
                                <span v-else-if="getHindcastTabIndex() === 2">
                                    <LazyHindcastHindcastRunsHelp />
                                </span>
                                <span v-else-if="getHindcastTabIndex() === 3">
                                    <LazyHindcastSetupHindcastHelp />
                                </span>
                                <span v-else-if="getHindcastTabIndex() === 4">
                                    <LazyHindcastRunStatusHelp />
                                </span>
                                <span v-else-if="getHindcastTabIndex() === 5">
                                    <LazyHindcastResultsHelp />
                                </span>
                                <span v-else-if="getHindcastTabIndex() === 6">
                                    <LazyHindcastVerificationRunsHelp />
                                </span>
                                <span v-else-if="getHindcastTabIndex() === 7">
                                    <LazyHindcastVerificationRunStatusHelp />
                                </span>
                                <span v-else-if="getHindcastTabIndex() === 8">
                                    <LazyHindcastVerificationResultsHelp />
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </Transition>

        </div>
    </div>
    <div id="UserAccountOverlay" class="hidden" ref="accountOverlay">
        <LazyUserAccount />
    </div>
    <div id="AboutBoxOverlay" class="hidden" ref="aboutOverlay">
        <LazyAboutBox />
    </div>
    <div id="ErrorLogOverlay" class="hidden" ref="errorOverlay">
        <LazyErrorLog />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import ContextMenu from 'primevue/contextmenu';
import Swal from 'sweetalert2';

import { useUserDataStore } from "@/stores/common/UserDataStore"
import { generalStore } from "@/stores/common/GeneralStore";

import { useLogout, useLogoutListen } from "@/composables/UseEventBus";
import { getErrorTextFromStatus } from "@/utils/CommonHelpers";

import { useDialog } from "primevue/usedialog";
import MoveNextPrevDialog from "../Common/MoveNextPrevDialog.vue";

const dialog = useDialog();
const navDialogOpened = ref<boolean>(false);

const LazyAboutBox = defineAsyncComponent(() => import("@/components/Common/AboutBox.vue"))
const LazyErrorLog = defineAsyncComponent(() => import("@/components/Common/ErrorLog.vue"))
const LazyUserAccount = defineAsyncComponent(() => import("@/components/Common/UserAccount.vue"))

// Lazy Load for Help Files
const LazyHelpLandingPageHelp = defineAsyncComponent(() => import("@/components/Help/LandingPageHelp.vue"))
const LazyHelpDownloadCliPageHelp = defineAsyncComponent(() => import("@/components/Help/DownloadCliPageHelp.vue"))

// Calibration Workflow Help Files
const LazyCalibrationHelpPreviousRunsHelp = defineAsyncComponent(() => import("@/components/Help/Calibration/PreviousRunsHelp.vue"))
const LazyCalibrationHelpHeadwaterBasinGageHelp = defineAsyncComponent(() => import("@/components/Help/Calibration/HeadwaterBasinGageHelp.vue"))
const LazyCalibrationHelpTuningControlsHelp = defineAsyncComponent(() => import("@/components/Help/Calibration/TuningControlsHelp.vue"))
const LazyCalibrationHelpFormulationHelp = defineAsyncComponent(() => import("../Help/Calibration/FormulationHelp.vue"))
const LazyCalibrationHelpOptimizationMetricsHelp = defineAsyncComponent(() => import("@/components/Help/Calibration/OptimizationMetricsHelp.vue"))
const LazyCalibrationHelpRunStatusHelp = defineAsyncComponent(() => import("@/components/Help/Calibration/RunStatusHelp.vue"))

// Evaluation Workflow Help Files
const LazyEvaluationCalibrationRunsHelp = defineAsyncComponent(() => import("@/components/Help/Evaluation/CalibrationRunsHelp.vue"))
const LazyEvaluationEvaluatesHelp = defineAsyncComponent(() => import("@/components/Help/Evaluation/EvaluateHelp.vue"))
const LazyEvaluationComparePermutationsHelp = defineAsyncComponent(() => import("@/components/Help/Evaluation/ComparePermutationsHelp.vue"))
const LazyEvaluationCalibrationSelectAltInterationssHelp = defineAsyncComponent(() => import("@/components/Help/Evaluation/SelectAltIterationHelp.vue"))
const LazyEvaluationRunStatusHelp = defineAsyncComponent(() => import("@/components/Help/Evaluation/RunStatusHelp.vue"))

// Forecast Workflow Help Files
const LazyForecastCalibrationRunsHelp = defineAsyncComponent(() => import("@/components/Help/Forecast/CalibrationRunsHelp.vue"));
const LazyForecastForecastRunsHelp = defineAsyncComponent(() => import("@/components/Help/Forecast/ForecastRunsHelp.vue"));
const LazyForecastSetupForecastHelp = defineAsyncComponent(() => import("@/components/Help/Forecast/SetupForecastHelp.vue"));
const LazyForecastRunStatusHelp = defineAsyncComponent(() => import("@/components/Help/Forecast/RunStatusHelp.vue"));
const LazyForecastResultsHelp = defineAsyncComponent(() => import("@/components/Help/Forecast/ResultsHelp.vue"));

// Hindcast Workflow Help Files
const LazyHindcastCalibrationRunsHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/CalibrationRunsHelp.vue"));
const LazyHindcastHindcastRunsHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/HindcastRunsHelp.vue"));
const LazyHindcastSetupHindcastHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/SetupHindcastHelp.vue"));
const LazyHindcastRunStatusHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/RunStatusHelp.vue"));
const LazyHindcastResultsHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/ResultsHelp.vue"));
const LazyHindcastVerificationRunsHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/VerificationRunsHelp.vue"));
const LazyHindcastVerificationRunStatusHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/VerificationRunStatusHelp.vue"));
const LazyHindcastVerificationResultsHelp = defineAsyncComponent(() => import("@/components/Help/Hindcast/VerificationResultsHelp.vue"));

const props = defineProps({
  callTabValidator: {
    type: Function,
    required: false,
  },
  callTabRestore: {
    type: Function,
    required: false,
  }
});

const { popupActive } = storeToRefs(generalStore());

const emit = defineEmits(["logoutEvent"]);

const accountOverlay = ref();
const aboutOverlay = ref();
const errorOverlay = ref();

const { getMenuIndex, setMenuIndex, getCalibrationTabIndex, getEvaluationTabIndex, getForecastTabIndex, getHindcastTabIndex, validateCurrentTab } = generalStore();

const { isUserLoggedIn, getUserInitials, setIsTokenExpired, getIsTokenExpired } = useUserDataStore();

const { userInitials, lastServerError } = storeToRefs(useUserDataStore());

const location = useRoute();
const router = useRouter();
const pendingRoute = ref<any>(null);
const allowNavigation = ref<boolean>(false);

const userLoggedIn = ref<boolean>();

import pdfUrl from '@/assets/styles/pdfs/NGWPC_NgenCERF_Users_Guide.pdf';

const userItems = ref([
    { label: 'Account', icon: 'pi pi-fw-times', command: () => gotoAccount() },
    { label: 'About', icon: 'pi pi-fw-times', command: () => aboutBox() },
    { label: 'Notifications', icon: 'pi pi-fw-times', command: () => errorLog() },
    { label: 'Users Guide', icon: 'pi pi-fw-times', command: () => window.open(pdfUrl, '_blank') },
    { label: 'Download CLI', icon: 'pi pi-fw-times', command: () => navigateTo("DownloadCli") },
    { label: 'Logout', icon: 'pi pi-fw-times', command: () => logoutUser() }
])

const userContextMenu = ref();
const uMenu = ref(false);
const showHelp = ref(false);
let observer = null;
const isOnDiv = ref(false);

const helpWindow = ref<HTMLDivElement | null>(null);

const onImageRightClick = (event: any) => {
    if (!popupActive.value) {
        userContextMenu.value.show(event)
    }
}

onMounted(() => {
    userInitials.value = getUserInitials();
    userLoggedIn.value = isUserLoggedIn();

    window.addEventListener('resize', function (event) {
        sizeHelpWindow();
        sizeLogWindow();
        sizeAboutWindow();
    });
    document.getElementById("userMenu")?.addEventListener("mouseout", function () { hideUserMenu() });

    setTimeout(() => {
        if (helpWindow.value) {
            const el = helpWindow.value
            if (!el.style.width) {
                el.style.width = '600px' // Initial width
            }
        }
    }, 0)

});

onUnmounted(() => {
    window.removeEventListener('resize', function (event) {
        //
    });
});

// Handle submitTimeDate changes
watch(userLoggedIn, () => {
    const uli = isUserLoggedIn();
    userLoggedIn.value = uli;
});

const sizeHelpWindow = () => {
    let headerHeight = document.getElementById('Header')?.clientHeight;
    let footerTop = document.getElementById('Footer')?.getBoundingClientRect().top;
    if (footerTop && headerHeight) {
        let h = (footerTop - headerHeight) - 20;
        let ele = document.getElementById("HelpWindow");
        if (ele) { ele.style.height = h + 'px'; }
    };
};

const sizeLogWindow = () => {
    let headerHeight = document.getElementById('Header')?.clientHeight;
    let footerTop = document.getElementById('Footer')?.getBoundingClientRect().top;
    if (footerTop && headerHeight) {
        let h = (footerTop - headerHeight) - 20;
        let ele = document.getElementById("ErrorLog");
        if (ele) { ele.style.height = h + 'px'; }
    };
};


const sizeAboutWindow = () => {
    let headerHeight = document.getElementById('Header')?.clientHeight;
    let footerTop = document.getElementById('Footer')?.getBoundingClientRect().top;
    if (footerTop && headerHeight) {
        let h = (footerTop - headerHeight) - 20;
        let ele = document.getElementById("AboutBox");
        if (ele) { ele.style.height = h + 'px'; }
    };
};

/**
 * 
 */
const gotoAccount = async () => {
    if (!popupActive.value) {
        accountOverlay.value.style.display = "block";
        popupActive.value = true;
    }
}

const aboutBox = async () => {
    if (!popupActive.value) {
        aboutOverlay.value.style.display = "block";
        popupActive.value = true;
    }
}

const errorLog = async () => {
    errorOverlay.value.style.display = "block";
    setTimeout(function () { sizeLogWindow() }, 0);
}


useAccountEventListen('accountEvent', () => {
    const ele = document.getElementById('UserAccountOverlay') as HTMLElement;
    ele.style.display = "none";
    popupActive.value = false;
})

useAccountEventListen('aboutBoxEvent', () => {
    const ele = document.getElementById('AboutBoxOverlay') as HTMLElement;
    ele.style.display = "none";
    popupActive.value = false;
})

useAccountEventListen('errorLogEvent', () => {
    const ele = document.getElementById('ErrorLogOverlay') as HTMLElement;
    ele.style.display = "none";
    popupActive.value = false;
})

useLogoutListen('logoutEvent', (evStr: string) => {
    if (evStr === "token" && !getIsTokenExpired()) {
        popupActive.value = false;
        setIsTokenExpired();
        let err = (lastServerError?.value) ? getErrorTextFromStatus(lastServerError?.value?.status) + ' ' : '';
        useLogout("logoutEvent", "logout");
        navigateTo('login');
        setTimeout(() => {
            Swal.fire({
                width: 500,
                html: err + "Please log in again.",
                title: 'Your session has expired.',
                icon: 'info',
                confirmButtonText: 'Close'
            })
        }, 250);
    }
})

const logoutUser = async () => {
    if (!popupActive.value) {
        if (confirm("Are you sure you want to logout?")) {
            useLogout("logoutEvent", "logout");
            await navigateTo('login');
        }
    }
}

const hideUserMenu = () => {
    if (isOnDiv.value) { return };
    setTimeout(() => {
        uMenu.value = false;
    }, 1000);
}

const closeHelp = () => {
    showHelp.value = false;
    popupActive.value = false;
}
const displayHelp = () => {
    if (!popupActive.value) {
        popupActive.value = true;
        showHelp.value = true;
        setTimeout(function () { sizeHelpWindow() }, 0);
    }
}

onBeforeRouteLeave(async(to, from) => {
  // IMPORTANT:
  // allow the second navigation attempt through
  if (allowNavigation.value) {
    allowNavigation.value = false
    setMenuIndexByRoute(to.path.split('/')[1]);
    return true
  }

  const errors = await validateCurrentTab()

  if (!errors.error) {
    setMenuIndexByRoute(to.path.split('/')[1]);
    return true
  }

  pendingRoute.value = to

  showTabNavDialog(errors.text)

  return false
})

const setMenuIndexByRoute = (path: string) => {
  switch(path) {
    case 'calibration':
      setMenuIndex(1);
      break;
    case 'evaluation':
      setMenuIndex(2);
      break;
    case 'forecast':
      setMenuIndex(3);
      break;
    case 'hindcast':
      setMenuIndex(4);
      break;
    default:
      setMenuIndex(0);
      break;
  }
}

const showTabNavDialog = (body: string[]) => {
  if (navDialogOpened.value) return

  navDialogOpened.value = true

  dialog.open(MoveNextPrevDialog, {
    props: {
      header: 'Unsaved changes!',
      modal: true,
      style: {
        width: 'auto'
      }
    },

    data: {
      body,
      direction: true
    },

    onClose: async (opt) => {

      navDialogOpened.value = false

      if (opt?.data?.moveToNextResponse && pendingRoute.value) {

        if (props.callTabRestore) {
          props.callTabRestore()
        }

        // bypass next guard execution
        allowNavigation.value = true

        const route = pendingRoute.value
        pendingRoute.value = null

        await router.push(route.fullPath)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#TopBar {
    position: fixed;
    top: 0;
    height: 6px;
    background-color: global.$ngwcp_primary1;
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
            background-color: global.$ngwcp_neutral_gray_md;
            border-radius: 5px;
            padding: 15px 28px;
        }

        a:hover {
            background-color: #aaa;
            text-decoration: none;
        }

        .isActive {
            color: #fff;
            background-color: global.$ngwcp_primary1;
        }

        .isActive:hover {
            color: #fff;
            background-color: global.$ngwcp_primary1;
        }
    }
}

#Circles {
    margin-right: 0px;
    margin-left: auto;
    clear: none;
    text-align: center;
}

#HelpCircle {
    display: inline-block;
    height: 50px;
    width: 50px;
    margin-top: 20px;
    background-color: global.$ngwcp_primary2;
    color: white;
    border-radius: 50%;
    font-size: 38px;
    border: 1px solid #000;
    margin-left: 37px;
}

#UserCircle {
    display: inline-block;
    height: 70px;
    width: 70px;
    margin-top: 10px;
    background-color: global.$ngwcp_neutral_gray_md;
    border-radius: 50%;
    font-size: 30px;
    padding-top: 20px;
    margin-right: 40px;
}

#UserCircle:hover {
    background-color: global.$ngwcp_primary2;
}

#HelpCircle:hover {
    background-color: global.$ngwcp_primary2;
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
    z-index: 999;
    border: 5px solid #ccc;
    border-radius: 8px;
    position: absolute;
    right: 2%;
    top: 84px;
    width: auto;
    background-color: white;
    resize: both;
    overflow: auto;
    direction: rtl;
    min-width: 400px;
    min-height: 200px;
}

#HelpContent {
    direction: ltr;
}

#ErrorLogOverlay {
    z-index: 9999;
    position: absolute;
    right: 2%;
    background-color: white;
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
