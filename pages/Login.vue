<template>
  <client-only>
    <div id="LoginBox" class="container">
      <h2 class="ttl">Login to Your Account</h2>
      <div class="inputBox">
        <input
          id="uname"
          type="text"
          v-model="userName"
          placeholder=" Username"
          aria-label="Username"
        />
        <button tabindex="-1" class="forgot" v-on:click="forgotUsername">
          Forgot Username
        </button>
      </div>
      <div class="inputBox">
        <input
          id="pword"
          type="password"
          v-model="userPassword"
          placeholder=" Password"
          aria-label="Password"
        />
        <button tabindex="-1" class="forgot" v-on:click="forgotPassword">
          Forgot Password
        </button>
      </div>
      <div class="loginButton" v-on:click="SubmitForm" aria-label="sign in">
        <button id="LoginButton">Sign In</button>
      </div>

      <div id="NeedAccountBox">
        <h2 class="needAccount">Need an Account?</h2>
        <div class="signupButton" aria-label="sign up">
          <button>Sign Up!</button>
        </div>
      </div>
    </div>
  </client-only>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useUserDataStore } from "@/stores/common/UserDataStore";

const { logUserIn, logUserOut } = useUserDataStore();

const loading = ref(true);
const userName = ref("");
const userPassword = ref("");

const forgotUsername = () => {
  alert("Not yet implemented");
};
const forgotPassword = () => {
  alert("Not yet implemented");
};
const SubmitForm = (e: Event) => {
  if (userName.value.trim() !== "" && userPassword.value.trim() !== "") {
    logUserIn();
    GoToLanding();
  } else {
    alert("Please enter valid credentials");
  }
};

const GoToLanding = async () => {
  await navigateTo({ path: "/LandingPage" });
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/styles.scss";
#LoginBox {
  position: relative;
  margin: 40px auto 0 auto;
  border-radius: 50px;
  min-width: 420px;
  max-width: 420px;
  max-height: 450px;
  min-height: 450px;
  background-color: #c5d4c8;
  width: 35vw;
  height: 36vw;
  border: 4px solid #105d84;
  max-height: 437px;
}

#NeedAccountBox {
  position: absolute;
  bottom: 0;
  background-color: #5bb6c1;
  border-radius: 0 0 50px 50px;
  width: 100%;
  border-top: 4px solid #105d84;
}

input::-webkit-input-placeholder {
  opacity: 0.5; /*Change the opacity between 0 and 1*/
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
  font-size: 26px;
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
.loginButton {
  font-size: 20px;
  margin: 20px auto;
  text-align: center;
  border: 3px solid #000;
  background-color: #5bb6c1;
  border-radius: 20px;
  width: 245px;
  height: 50px;
  padding-top: 10px;
}
.signupButton {
  background-color: $ngwcp_groupsbkg;
}
.loginButton:hover {
  background-color: #105d84;
  color: #ffffff;
}
.signupButton:hover {
  background-color: #5bb6c1;
  color: #ffffff;
}
</style>
