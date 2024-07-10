<template>
  <client-only>
    <div id="LoginBox" class="container">
      <form>
        <h2 class="ttl">Login to Your Account</h2>
        <div class="inputBox">
          <input
            id="uname"
            type="text"
            v-model="UserName"
            placeholder=" Username"
            aria-label="Username"
          />
          <a href="#" tabindex="-1" class="forgot">Forgot Username</a>
        </div>
        <div class="inputBox">
          <input
            id="pword"
            type="password"
            v-model="userPassword"
            placeholder=" Password"
            aria-label="Password"
          />
          <a href="#" tabindex="-1" class="forgot">Forgot Password</a>
        </div>
        <div class="loginButton" aria-label="sign in">
          <button id="LoginButton" v-on:click="SubmitForm">Sign In</button>
        </div>
      </form>

      <div id="NeedAccountBox">
        <h2 class="needAccount">Need an Account?</h2>
        <div class="signuptButton" aria-label="sign up">
          <button>Sign Up!</button>
        </div>
      </div>
    </div>
    <!-- <div class="waitgif" v-if="loading"><img src="/assets/styles/img/wait.gif" /></div> -->
  </client-only>
</template>
<script setup lang="ts">
import { ref } from "vue";
const loading = ref(true);
const UserName = ref("");
const userPassword = ref("");

const SubmitForm = () => {
  console.log(
    "Username: " + UserName.value + " Password: " + userPassword.value
  );
  //alert("Username: " + UserName.value + "\nPassword: " + userPassword.value);
};
</script>
<style lang="scss" scoped>
// .waitgif {
//   width: 100px;
//   margin: 0 auto;
// }

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
.signuptButton,
.loginButton {
  font-size: 20px;
  margin: 20px auto;
  text-align: center;
  border: 3px solid #000;
  background-color: #5bb6c1;
  border-radius: 20px;
  width: 245px;
  height: 50px;
  padding-top: 8px;
}
.signuptButton {
  background-color: #cccccc;
}
.loginButton:hover {
  background-color: #105d84;
  color: #ffffff;
}
.signuptButton:hover {
  background-color: #5bb6c1;
  color: #ffffff;
}
</style>
