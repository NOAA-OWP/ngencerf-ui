<template>
  <client-only>
    <div class="h-full min-h-screen ">
      <div class="grid grid-rows-12">
        <div class="row-span-1">
          <div>
            <AppHeader />
          </div>
        </div>
        <div class="grid row-span-10">
          <div class="grid grid-rows-12">
            <div class="row-span-12 flex items-center justify-center h-screen-inner">

              <div id="LoginBox" class="bg-white mx-auto px-12 py-12 rounded-[10px] max-w-screen-md"
                :class="!showCreateAccount ? 'loginBox' : 'createAccountBox'">

                <div v-if="showCreateAccount">
                  <div class="dialog-overlay" @click.self="closeAll">
                    <div class="dialog-content">
                      <h1>Create an Account</h1>
                      <form @submit.prevent="SubmitNewAccountForm">
                        <div class="form-group inputBox">
                          <label for="email" class="required-label">Email</label>
                          <InputText v-model="newEmail" id="email" type="email" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="first_name" class="required-label">First Name</label>
                          <InputText v-model="newFirstName" id="first_name" type="text" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="last_name" class="required-label">Last Name</label>
                          <InputText v-model="newLastName" id="last_name" type="text" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="password" class="required-label">Password</label>
                          <Password v-model="newPassword" id="password" type="password" name="password"
                            autocomplete="current-password" required toggleMask class="block">
                            <template #header>
                              <div class="font-semibold text-xm mb-4">Password</div>
                            </template>
                            <template #footer>
                              <Divider />
                              <ul class="pl-2 ml-2 my-0 leading-normal">
                                <li>Cannot be a commonly used password</li>
                                <li>Must be at least 8 characters long</li>
                                <li>Must contain at least one non-numeric character</li>
                              </ul>
                            </template>
                          </Password>
                        </div>
                        <div class="form-group inputBox">
                          <label for="confirmPassword" class="required-label">Confirm Password</label>
                          <Password v-model="confirmPassword" id="confirmPassword" type="password" :feedback="false"
                            required toggleMask class="block" />
                        </div>
                        <div :class="createAccountButtonClasses">
                          <Button type="submit" :disabled="disableCreateAccountBtn">Create Account</Button>
                        </div>
                        <div class="signupButton underline text-base inline pl-6">
                          <Button @click="closeAll" :class="cancelCreateAccountLinkClasses"
                            :disabled="disableCreateAccountBtn">Cancel</Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div v-else-if="showMFASetup" class="mx-auto px-8 text-left">
                  <div class="dialog-overlay" @click.self="closeAll">
                    <div class="dialog-content">
                      <form onsubmit="return false">
                        <h1>Complete MFA Setup</h1>

                        <p>Scan the QR Code with your authenticator app to continue. When your authenticator is set up, enter the 6-digit Code below.</p>

                        <img :src="QRCodeSource" alt="QR Code">

                        <p>Or manually enter the following code into your authenticator app:</p>

                        <p>{{ AuthenticatorKey }}</p>

                        <div class="mt-10">
                          <label for="MFACodeForSetup" style="font-weight: normal;" class="required-label">Code</label><br>
                          <input id="MFACodeForSetup" class="w-[350px]" type="text" v-model="MFACode" placeholder="######"
                            aria-label="MFACode" autocomplete="off" v-on:keypress="autoSubmit($event, 'mfa_setup')" />
                        </div>

                        <Button id="MFASetupButton" class="ngenButtonDiv btn-left mt-4" v-on:click="ConfirmMFASetup"
                          aria-label="Confirm Setup">Confirm Setup</Button>
                      </form>
                    </div>
                  </div>
                </div>

                <div v-else-if="showMFARecoveryCodes" class="mx-auto px-8 text-left">
                  <h1>MFA Setup Complete</h1>

                  <p>MFA has been set up for your account. Make a note of the following recovery codes
                    in case you ever lose access to your authenticator app.</p>
                  
                  <!-- TO DO: Show Recovery Codes Here -->

                  <p>You may now proceed to ngenCERF.</p>
                  
                  <!-- TO DO: Show Download and Copy Buttons Here -->
                  <Button id="GoToLandingButton" class="ngenButtonDiv btn-left mt-4" v-on:click="GoToLanding"
                    aria-label="Continue">Continue</Button>
                </div>

                <div v-else-if="showMFAVerify" class="mx-auto px-8 text-left">
                  <div class="dialog-overlay" @click.self="closeAll">
                    <div class="dialog-content">
                      <form onsubmit="return false">
                        <h1>Verify MFA Code</h1>

                        <p>Enter the MFA code shown in your authenticator app.</p>

                        <div class="mt-10">
                          <label for="MFACodeForVerification" style="font-weight: normal;" class="required-label">Code</label><br>
                          <input id="MFACodeForVerification" class="w-[350px]" type="text" v-model="MFACode" placeholder="######"
                            aria-label="MFACode" autocomplete="off" v-on:keypress="autoSubmit($event, 'mfa_verify')" />
                        </div>

                        <Button id="VerifyMFAButton" class="ngenButtonDiv btn-left mt-4" v-on:click="VerifyMFACode"
                          aria-label="Verify">Verify</Button>
                      </form>
                    </div>
                  </div>
                </div>

                <div v-else class="mx-auto px-8 text-left">
                  <form onsubmit="return false">

                    <h1>Login</h1>

                    <div class="mt-10">
                      <label for="uname" style="font-weight: normal;" class="required-label">Email</label><br>
                      <input id="uname" class="w-[350px]" type="text" v-model="userName" placeholder=" Email"
                        aria-label="Username" autocomplete="email" v-on:keypress="autoSubmit($event)" />
                      <!-- <Button tabindex="-1" class="c-blue underline text-xs" v-on:click="ForgotUsername">
                        Forgot Email
                      </Button> -->
                    </div>
                    <div class="mt-4">
                      <label for="pword" style="font-weight: normal;" class="required-label">Password</label><br>
                      <Password id="pword" type="password" autocomplete="current-password" v-model="userPassword"
                        placeholder=" Password" aria-label="Password" toggleMask :feedback="false"
                        class="block w-[350px]" v-on:keypress="autoSubmit($event)" />
                      <Button tabindex="-1" class="c-blue underline text-xs" v-on:click="ForgotPassword">
                        Forgot Password
                      </Button>
                    </div>

                    <Button id="LoginButton" class="ngenButtonDiv btn-left mt-4" v-on:click="SubmitLoginForm"
                      aria-label="sign in">Sign In</Button>

                    <div class="signupButton underline text-base mt-2" aria-label="sign up">
                      <Button @click="openCreateAccount" class="c-blue">Create an Account</Button>
                    </div>

                  </form>
                </div>

                <div class="required-hint mt-4">
                  <span class="required-asterisk">*</span> Required field
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row-span-1">
        <AppFooter />
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import QRCode from "qrcode";

import type { ToastMessageOptions } from "primevue/toast";
import { ToastTimeout } from "@/composables/NgencerfEnums";

import { useUserDataStore } from "@/stores/common/UserDataStore";
import { generalStore } from "@/stores/common/GeneralStore";

import AppFooter from "@/components/Common/AppFooter.vue";
import AppHeader from "@/components/Common/AppHeader.vue";

import { useBackendConfig } from "@/composables/UseBackendConfig";
import { addStyle } from "@primeuix/utils";

const { serverInfo, gitInfo, menuIndex, calibrationTabIndex, evaluationTabIndex, forecastTabIndex, hindcastTabIndex } = storeToRefs(generalStore());

const { popupActive } = storeToRefs(generalStore());

const { calibrationJobId } = storeToRefs(generalStore());

const { logUserIn, setUserName, hardResetUserDataStore, isUserLoggedIn, getAccessToken } = useUserDataStore();
const { resetGeneralStore, clearToastRecords, addToastRecord, getServerInfo, setServerInfo } = generalStore();

const { ngencerfBaseUrl } = useBackendConfig();

const toast = useToast();
const userDataStore = useUserDataStore();
const userName = ref<string>("");
const userPassword = ref<string>("");
const showCreateAccount = ref(false);
const showMFASetup = ref(false);
const showMFARecoveryCodes = ref(false);
const showMFAVerify = ref(false);

const newEmail = ref('');
const newFirstName = ref('');
const newLastName = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const MFAToken = ref<string>('');
const QRCodeSource = ref<string>('');
const AuthenticatorKey = ref<string>('');
const MFACode = ref<string>('');
const RecoveryCodes = ref<string[]>([]);

const disableCreateAccountBtn = ref<boolean>(false);
const createAccountButtonClasses = ref<string[]>(["ngenButtonDiv", "btn-left", "mt-4"]);
const cancelCreateAccountLinkClasses = ref<string[]>(['c-blue'])

onMounted(() => {
  popupActive.value = false;
  nextTick(async () => {
    sessionStorage.clear();
    localStorage.clear();
    clearToastRecords();
    calibrationJobId.value = 0;
    hardResetUserDataStore();
    resetGeneralStore();
    await getFooterInformation();
  });
});


// Get footer infongenCERF
const getFooterInformation = () => {
  makeProtectedApiCall<FormulationTabData>(`${ngencerfBaseUrl}/calibration/get_footer/`, {
    method: "POST",
    headers: {
      "Content-Type": 'application/json'
    },
    body: ""
  }).then((result) => {
    serverInfo.value = result._data;
    if (serverInfo.value) {
      setServerInfo(serverInfo.value);
    }
  })
}

// Get footer infongenCERF
const getGitInformation = () => {
  makeProtectedApiCall<FormulationTabData>(`${ngencerfBaseUrl}/calibration/get_git_info/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getAccessToken()}`,
      "Content-Type": 'application/json'
    },
    body: ""
  }).then((result) => {
    gitInfo.value = result._data.git_info;
  })
}

const closeAll = () => {
  showCreateAccount.value = false;
  showMFASetup.value = false;
  showMFARecoveryCodes.value = false;
  showMFAVerify.value = false;
};

const openCreateAccount = () => {
  closeAll();
  showCreateAccount.value = true;
};

const openMFASetup = async() => {
  await $fetch<any>(`${ngencerfBaseUrl}/auth/mfa/setup/`, {
    method: 'POST',
    body: {
      mfa_token: MFAToken.value
    }
  }).then(response => {
    if (response?.message) {
      const tMsg: ToastMessageOptions = { severity: 'info', detail: response.message, life: ToastTimeout.timeoutInfo };
      toast.add(tMsg); addToastRecord(tMsg);
    }
    closeAll();
    showMFASetup.value = true;
    // Convert otpauth_url into a QR Code for display
    QRCode.toDataURL(response?.otpauth_url, (err, url) => {
      if (err) console.error(err);
      console.log(url); // This URL can be set as the src of an <img> element
      QRCodeSource.value = url;
    });
    AuthenticatorKey.value = response?.authenticator_key;
    MFACode.value = '';
  }
  ).catch(error => {
    if (error) {
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: error?.message, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
    }
  });
};

const openMFAVerify = () => {
  closeAll();
  showMFAVerify.value = true;
};

const ForgotUsername = () => {
  //
};

const ForgotPassword = () => {
  const tMsg: ToastMessageOptions = { severity: 'info', summary: 'Info', detail: 'Please contact the ngenCERF administrator to reset your password.', life: ToastTimeout.timeoutInfo };
  toast.add(tMsg); addToastRecord(tMsg);
};

const autoSubmit = (e: KeyboardEvent, form_type: string='login') => {
  if (e.key === "Enter") {
    if (form_type === 'login' && (userName.value.trim() !== "" && userPassword.value.trim() !== "")) {
      SubmitLoginForm(e);
    }
    else if (form_type === 'mfa_setup' && (MFACode.value.trim().length === 6)) {
      ConfirmMFASetup(e);
    }
    else if (form_type === 'mfa_verify' && (MFACode.value.trim().length === 6)) {
      VerifyMFACode(e);
    }
  }
}

/** 
 * Submits the login form
 * @param e - event object
 */
const SubmitLoginForm = async (e: Event) => {
  e.preventDefault(); // prevents the page from reloading

  if (userName.value.trim() !== "" && userPassword.value.trim() !== "") {
    // try to create new access and refresh tokens

    await $fetch<any>(`${ngencerfBaseUrl}/auth/login/`, {
      method: 'POST',
      body: {
        email: userName.value.toLowerCase(),
        password: userPassword.value
      }
    }).then(response => {
      setUserName(userName.value.toLowerCase());
      // set MFA token if needed
      MFAToken.value = response?.mfa_token ?? '';
      if (response?.message) {
        const tMsg: ToastMessageOptions = { severity: 'info', detail: response.message, life: ToastTimeout.timeoutInfo };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      if (response?.mfa_setup_required) {
        openMFASetup();
      } else if (response.mfa_required) {
        openMFAVerify();
      } else {
        setTokenAndLogUserIn(response);
        GetExternalInfo();
        GoToLanding();
      }
    }
    ).catch(error => {
      if (error) {
        let err = error.data?.detail;
        if (!err) {
          err = "Cannot reach server. Error code: " + error.statusCode;
        }
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: err, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
        console.error("Error during user creation:", error.message, error.data.detail);
      }
    });
  } else if (userName.value.trim() === "" || userPassword.value.trim() === "") {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: "A Username and Password are required", life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

/** 
 * Submits the MFA Code during Setup
 * @param e - event object
 */
const ConfirmMFASetup = async (e: Event) => {
  e.preventDefault(); // prevents the page from reloading

  if (MFACode.value.trim().length === 6) {
    // validate the MFA Code

    await $fetch<any>(`${ngencerfBaseUrl}/auth/mfa/setup/confirm/`, {
      method: 'POST',
      body: {
        mfa_token: MFAToken.value,
        code: MFACode.value
      }
    }).then(response => {
      RecoveryCodes.value = response?.recovery_codes;
      showMFARecoveryCodes.value = true;
      SubmitLoginForm(e);
      if (response?.message) {
        const tMsg: ToastMessageOptions = { severity: 'info', detail: response.message, life: ToastTimeout.timeoutInfo };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    }
    ).catch(error => {
      if (error) {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: error.message, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    });
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: "MFA Code must be six digits long.", life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}

/** 
 * Submits the MFA Code during Verification
 * @param e - event object
 */
const VerifyMFACode = async (e: Event) => {
  e.preventDefault(); // prevents the page from reloading

  if (MFACode.value.trim().length === 6) {
    // validate the MFA Code

    await $fetch<any>(`${ngencerfBaseUrl}/auth/mfa/verify/`, {
      method: 'POST',
      body: {
        mfa_token: MFAToken.value,
        code: MFACode.value
      }
    }).then(response => {
      if (response?.message) {
        const tMsg: ToastMessageOptions = { severity: 'info', detail: response.message, life: ToastTimeout.timeoutInfo };
        toast.add(tMsg); addToastRecord(tMsg);
      }
      setTokenAndLogUserIn(response);
      GetExternalInfo();
      GoToLanding();
    }
    ).catch(error => {
      if (error) {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: error.message, life: ToastTimeout.timeoutError };
        toast.add(tMsg); addToastRecord(tMsg);
      }
    });
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: "MFA Code must be six digits long.", life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  }
}


const setTokenAndLogUserIn = async(response: any) => {
  // store tokens in UserDataStore
  userDataStore.setAccessToken(response?.access);
  userDataStore.setRefreshToken(response?.refresh);
  // store user name in UserDataStore
  userDataStore.setFirstName(response?.first_name);
  userDataStore.setLastName(response?.last_name);
  logUserIn();
}


const GetExternalInfo = async () => {
  await getGitInformation();
  serverInfo.value = getServerInfo();
}


const SubmitNewAccountForm = async () => {
  if (newPassword.value !== confirmPassword.value) {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: 'Passwords do not match.', life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
    return;
  }

  disableCreateAccountBtn.value = true;
  if (!createAccountButtonClasses.value.includes('disabledButton')) createAccountButtonClasses.value.push('disabledButton');
  if (!cancelCreateAccountLinkClasses.value.includes('disabledLink')) cancelCreateAccountLinkClasses.value.push('disabledLink');

  //try to create a new account for user
  const { data, error, } = await useFetch<any>(`${ngencerfBaseUrl}/auth/users/`, {
    method: 'POST',
    body: {
      email: newEmail.value.toLowerCase(),
      first_name: newFirstName.value,
      last_name: newLastName.value,
      password: newPassword.value,
      re_password: confirmPassword.value
    }
  });

  if (error.value) {
    disableCreateAccountBtn.value = false;
    createAccountButtonClasses.value.splice(createAccountButtonClasses.value.indexOf('disabledButton'), 1);
    cancelCreateAccountLinkClasses.value.splice(cancelCreateAccountLinkClasses.value.indexOf('disabledLink'), 1);
    if (error.value?.data.email) {
      let detail = error.value?.data.email[0];
      if (detail.indexOf('already exists')) {
        // customize error message since the one we get back from Djoser isn't ideal
        detail = 'A user with this Email address has already registered.'
      }
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: detail, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
      return;
    } else if (error.value?.data.first_name) {
      let detail = error.value?.data.first_name[0];
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: detail, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
      return;
    } else if (error.value?.data.last_name) {
      let detail = error.value?.data.last_name[0];
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: detail, life: ToastTimeout.timeoutError };
      toast.add(tMsg); addToastRecord(tMsg);
      return;
    } else if (error.value?.data.password) {
      error.value?.data.password.forEach((e: any) => {
        const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: e, life: ToastTimeout.timeoutError }
        toast.add(tMsg); addToastRecord(tMsg);
      });
      return;
    }
  }

  if (data.value.email && data.value.id) {
    disableCreateAccountBtn.value = false;
    createAccountButtonClasses.value.splice(createAccountButtonClasses.value.indexOf('disabledButton'), 1);
    cancelCreateAccountLinkClasses.value.splice(cancelCreateAccountLinkClasses.value.indexOf('disabledLink'), 1);
    const tMsg: ToastMessageOptions = { severity: 'success', summary: 'Success', detail: 'Account created successfully. Please log in.', life: ToastTimeout.timeoutSuccess };
    toast.add(tMsg); addToastRecord(tMsg);
    closeAll();
  };
};

/**
 * Navigates to the landing page.
 */
const GoToLanding = () => {
  navigateTo("LandingPage");
};

onUnmounted(() => {
  closeAll();
})

</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

.needAccount {
  font-size: 18px;
  font-weight: 600;
  margin-top: 50px;
}

.signupButton {
  border: 0px;
  margin: 20px auto 0 0;
}

.ngenButtonDiv.disabledButton {
  background-color: darkgray;
}

.disabledLink {
  color: darkgray;
}

.c-blue:hover {
  background-color: transparent;
  font-weight: bold;
  border: none;
}
</style>
