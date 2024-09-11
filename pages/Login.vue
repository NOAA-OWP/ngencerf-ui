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

              <div id="LoginBox" class="container">
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
                  <p class="needAccount">Need an Account?</p>
                  <div class="signupButton ngenButtonDiv" v-on:click="SignUp" aria-label="sign up">
                    <button>Request an Account</button>
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
import { useUserDataStore } from "@/stores/common/UserDataStore";
import AppFooter from "~/components/Common/AppFooter.vue";
import AppHeader from "~/components/Common/AppHeader.vue";

const { logUserIn, logUserOut } = useUserDataStore();

const userDataStore = useUserDataStore();
const loading = ref<boolean>(true);
const userName = ref<string>("");
const userPassword = ref<string>("");

onMounted( () => {
  localStorage.clear();
})

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
  const { ngencerfBaseUrl } = useBackendConfig();

  if (userName.value.trim() !== "" && userPassword.value.trim() !== "") {
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

/**
 * Navigates to the landing page.
 */
const GoToLanding = async () => {
  await navigateTo({ path: "/LandingPage" });
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";

#LoginBox {
  position: relative;
  margin: 60px auto 0 auto;
  border-radius: 50px;
  width: 420px;
  height: 450px;
  border: 2px solid #105d84;

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
  margin-top: 50px;
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
.loginButton {
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
