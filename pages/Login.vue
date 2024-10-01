<template>
  <client-only>
    <div class="h-full min-h-screen ">
      <div class="grid grid-rows-12">
        <div class="row-span-1">
          <div>
            <AppHeader />
          </div>
        </div>
        <div class="h-full grid row-span-10">
          <div class="grid grid-rows-12">
            <div class="row-span-12 flex items-center justify-center h-screen-inner">

              <div id="LoginBox" class="bg-white mx-auto px-8 py-8 rounded-[10px] max-w-screen-md" :class="!showDialog ? 'loginBox' : 'createAccountBox'">

                <div v-if="!showDialog" class="mx-auto px-8 text-left">
                  <form onsubmit="return false">
                    <h1>Login in</h1>
                    <div class="inputBox">
                      <input id="uname" type="text" v-model="userName" placeholder=" Username" aria-label="Username"
                        autocomplete="username" v-on:keypress="autoSubmit"/>
                      <button tabindex="-1" class="c-blue underline text-xs" v-on:click="ForgotUsername">
                        Forgot Username
                      </button>
                    </div>
                    <div class="inputBox">
                      <Password id="pword" type="password" autocomplete="current-password" v-model="userPassword"
                        placeholder=" Password" aria-label="Password" toggleMask :feedback="false" class="block" v-on:keypress="autoSubmit"/>
                      <button tabindex="-1" class="c-blue underline text-xs" v-on:click="ForgotPassword">
                        Forgot Password
                      </button>
                    </div>
                    <div class="ngenButtonDiv bg-blue1 btn-left mt-4" v-on:click="SubmitLoginForm" aria-label="sign in">
                      <button id="LoginButton">Sign In</button>
                    </div>
                    <div>
                      <div class="signupButton underline text-base" aria-label="sign up">
                        <button @click="openDialog" class="c-blue">Create an Account</button>
                      </div>
                    </div>

                  </form>
                </div>

                <div v-if="showDialog">
                  <div class="dialog-overlay" @click.self="closeDialog">
                    <div class="dialog-content">
                      <h1>Create an Account</h1>
                      <form @submit.prevent="submitForm">
                        <div class="form-group inputBox">
                          <label for="username">Username</label>
                          <InputText v-model="newUsername" id="username" type="text" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="email">Email</label>
                          <InputText v-model="newEmail" id="email" type="email" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="password">Password</label>
                          <Password v-model="newPassword" id="password" type="password" name="password" autocomplete="current-password" required toggleMask class="block">
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
                          <label for="confirmPassword">Confirm Password</label>
                          <Password v-model="confirmPassword" id="confirmPassword" type="password" :feedback="false"
                            required toggleMask class="block" />
                        </div>
                        <div class="ngenButtonDiv bg-blue1 btn-left mt-4">
                          <button type="submit">Create Account</button>
                        </div>
                        <div class="signupButton underline text-base inline pl-6">
                          <button type="button" @click="closeDialog" class="c-blue">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
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
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useToast } from "primevue/usetoast";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

const { logUserIn, setUserName } = useUserDataStore();
const { ngencerfBaseUrl } = useBackendConfig();

const toast = useToast();
const userDataStore = useUserDataStore();
const userName = ref<string>("");
const userPassword = ref<string>("");
const showDialog = ref(false);

const newUsername = ref('');
const newEmail = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

onMounted(() => {
  localStorage.clear();
});

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
};

const ForgotUsername = () => {
  //
};
const ForgotPassword = () => {
  //
};

const autoSubmit = (e: KeyboardEvent) => {
  const u = document.getElementById("uname");
  const p = document.getElementById('pword');
  if (e.key === "Enter" && (userName.value.trim() !== "" && userPassword.value.trim() !== "")) {
    SubmitLoginForm(e);
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

    const { data, error } = await useFetch<any>(`${ngencerfBaseUrl}/auth/jwt/create/`, {
      method: 'POST',
      body: {
        username: userName.value,
        password: userPassword.value
      }
    });
    // error.value.statuscode
    if (error.value) {
      let err = error.value?.data?.detail;
      if (!err) {
        err = "Cannot reach server. Error code: " + error.value.statusCode;
        console.log("StatusCode: ", e);
      }
      toast.add({ severity: 'error', summary: 'Error', detail: err, life: 3000 });
      console.error("Error during user creation:", error.value?.message, error.value?.data);
      return;
    }

    setUserName(userName.value);
    // store tokens in UserDataStore
    userDataStore.setAccessToken(data.value.access);
    userDataStore.setRefreshToken(data.value.refresh);
    logUserIn();
    await GoToLanding();
  } else if (userName.value.trim() === "" || userPassword.value.trim() === "") {
    toast.add({ severity: 'error', summary: 'Error', detail: "A Username and Password are required", life: 3000 });
  }
}

const submitForm = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Passwords do not match.', life: 3000 });
    return;
  }

  // try to create a new account for user
  const { data, error } = await useFetch<any>(`${ngencerfBaseUrl}/auth/users/`, {
    method: 'POST',
    body: {
      username: newUsername.value,
      email: newEmail.value,
      password: newPassword.value,
      re_password: confirmPassword.value
    }
  });

  if (error.value) {
    if (error.value?.data.username) {
      let detail = error.value?.data.username[0];
      toast.add({ severity: 'error', summary: 'Error', detail: detail, life: 3000 });
      return;
    } else if (error.value?.data.password) {
      error.value?.data.password.forEach((e: any) => toast.add({ severity: 'error', summary: 'Error', detail: e, life: 3000 }));
      return;
    }
  }

  if (data.value.email && data.value.username && data.value.id) {
    toast.add({ severity: 'success', summary: 'Success', detail: 'Account created successfully. Please log in.', life: 3000 });
    closeDialog();
  };
};

/**
 * Navigates to the landing page.
 */
const GoToLanding = async () => {
  await navigateTo({ path: "/LandingPage" });
};

</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
.needAccount {
  font-size: 18px;
  font-weight: 600;
  margin-top: 50px;
}

.signupButton {
  border: 0px;
  margin: 20px auto 0 0;
}
</style>
