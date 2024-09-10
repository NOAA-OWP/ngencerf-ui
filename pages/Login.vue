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
            <div class="row-span-12">

              <div id="LoginBox" class="container" :class="!showDialog ? 'loginBox' : 'createAccountBox'">

                <div v-if="!showDialog">
                  <h2 class="ttl">Login to Your Account</h2>
                  <div class="inputBox">
                    <input id="uname" type="text" v-model="userName" placeholder=" Username" aria-label="Username" />
                    <button tabindex="-1" class="forgot" v-on:click="ForgotUsername">
                      Forgot Username
                    </button>
                  </div>
                  <div class="inputBox">
                    <input id="pword" type="password" v-model="userPassword" placeholder=" Password"
                      aria-label="Password" />
                    <button tabindex="-1" class="forgot" v-on:click="ForgotPassword">
                      Forgot Password
                    </button>
                  </div>
                  <div class="loginButton ngenButtonDiv" v-on:click="SubmitLoginForm" aria-label="sign in">
                    <button id="LoginButton">Sign In</button>
                  </div>
                  <div>
                    <!-- <p class="needAccount">Need an Account?</p> -->
                    <div class="signupButton ngenButtonDiv" aria-label="sign up">
                      <button @click="openDialog">Create an Account</button>
                    </div>
                  </div>
                </div>

                <div v-if="showDialog">
                  <div class="dialog-overlay" @click.self="closeDialog">
                    <div class="dialog-content">
                      <h2 class="ttl">Create an Account</h2>
                      <form @submit.prevent="submitForm">
                        <div class="form-group inputBox">
                          <label for="username">Username</label>
                          <input v-model="_username" id="username" type="text" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="email">Email</label>
                          <input v-model="userEmail" id="email" type="email" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="password">Password</label>
                          <input v-model="password" id="password" type="password" required />
                        </div>
                        <div class="form-group inputBox">
                          <label for="confirmPassword">Confirm Password</label>
                          <input v-model="confirmPassword" id="confirmPassword" type="password" required />
                        </div>
                        <div class="createAccountButton ngenButtonDiv">
                          <button type="submit">Create Account</button>
                        </div>
                        <div class="cancelCreateAccountButton ngenButtonDiv">
                          <button type="button" @click="closeDialog">Cancel</button>
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

import { ref } from "vue";
import { useBackendConfig } from "~/composables/UseBackendConfig";
import { useToast } from "primevue/usetoast";
import { useUserDataStore } from "@/stores/common/UserDataStore";
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";

const { logUserIn, logUserOut } = useUserDataStore();
const { ngencerfBaseUrl } = useBackendConfig();

const loading = ref<boolean>(true);
const toast = useToast();
const userDataStore = useUserDataStore();
const userName = ref<string>("");
const userPassword = ref<string>("");
const showDialog = ref(false);

const _username = ref('');
const userEmail = ref('');
const password = ref('');
const confirmPassword = ref('');

onMounted(() => {
  localStorage.clear();
});

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  console.log("closeDialog called from Login.vue");
  showDialog.value = false;
};

const ForgotUsername = () => {
  //
};
const ForgotPassword = () => {
  //
};

const SignUp = () => {
  //
};

/** 
 * Submits the login form
 * @param e - event object
 */
const SubmitLoginForm = async (e: Event) => {
  e.preventDefault(); // prevents the page from reloading

  if (userName.value.trim() !== "" && userPassword.value.trim() !== "") {
    // try to create new access and refresh tokens
    try {
      const data = await $fetch<any>(`${ngencerfBaseUrl}/auth/jwt/create/`, {
        method: 'POST',
        body: {
          username: userName.value,
          password: userPassword.value
        }
      });
      const { access, refresh } = data;
      // console.log('Access Token:', access);
      // console.log('Refresh Token:', refresh);

      if (access && refresh) {
        // store tokens in UserDataStore
        userDataStore.setAccessToken(access);
        userDataStore.setRefreshToken(refresh);
        logUserIn();
        await GoToLanding();
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  } else {
    console.error("Username and password are required.");
  }
};

const submitForm = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match.");
    return;
  }

  // let responseData: FetchResponse<any> | null = null;
  // try to create a new account for user
  const {data, error} = await useFetch<any>(`${ngencerfBaseUrl}/auth/users/`, {
    method: 'POST',
    body: { 
      username: _username.value,
      email: userEmail.value,
      password: password.value,
      re_password: confirmPassword.value
    }
  });

  if (error.value) {
    console.error(error.value);
    return;
  }

  const { email, username, id } = data.value;

  if (email && username && id) {
    alert("Account created successfully. Please log in.");
    closeDialog()
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

.loginBox, .createAccountBox {
  position: relative;
  margin: 60px auto 0 auto;
  border-radius: 50px;
  width: 420px;
  height: 450px;
  border: 2px solid #105d84;  
}

.loginBox {
  height: 390px;
}

.createAccountBox {
  height: 550px;
}

input::-webkit-input-placeholder {
  opacity: 0.8;
}

.ttl {
  text-align: center;
  position: static;
  margin-top: 20px;
  font-size: 26px;
  font-weight: 600;
}

.needAccount {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-top: 20px;
}

.inputBox {
  margin: 0 auto;
  margin-top: 20px;
  width: 80%;

  input {
    height: 40px !important;
  }
}

.forgot {
  text-decoration: underline;
  color: #0c1db4;
}

.signupButton,
.loginButton,
.createAccountButton,
.cancelCreateAccountButton {
  font-size: 20px;
  margin: 20px auto;
  text-align: center;
  border: 3px solid #000;
  border-radius: 20px;
  width: 245px;
  height: 50px;
  padding-top: 10px;

}
</style>
