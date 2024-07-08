<template>
  <div id="LoginBox">
    <h2 class="ttl">Login to Your Account</h2>
    <!-- <div class="ttl">Login to Your Account</div>
    <div class="userName inputBox">
      <div><input type="text" placeholder=" Username" /></div>
      <div class="forgot"><a href="#">Forgot Username</a></div>
    </div>
    <div class="userPassword inputBox">
      <div><input type="password" placeholder=" Password" /></div>
      <div class="forgot"><a href="#">Forgot Password</a></div>
    </div>
    <div class="loginButton nextgenButton"><button>Sign In</button></div> -->
    <div id="NeedAccountBox">
      <!-- <div class="needAccount">Need an Account?</div>
        <div class="signuptButton nextgenButton"><button>Sign Up!</button></div> -->
    </div>
  </div>
</template>
<style lang="scss" scoped>
#LoginBox {
  margin: 40px auto 0 auto;
  border-radius: 50px;
}
#LoginBox,
#NeedAccountBox {
  width: 35vw;
  height: 40vw;
  border: 4px solid #105d84;

  background-color: #c5d4c8;
  #NeedAccountBox {
    object-fit: cover;
    overflow: hidden;
    //position: relative;
    height: 15.5%;
    margin-top: 78%;
    background-color: #5bb6c1;
    margin-left: -3px;
    border-radius: 0 0 50px 50px;
  }
}
.ttl {
    text-align: center;;
   position: static;
   margin-top: 28px;
//   margin-left: 8%;
  font-size: 36px;
  font-weight: 600;
  //   margin-top: 40px;
}
.needAccount {
  text-align: center;
  font-size: 36px;
  font-weight: 600;
  margin-top: 20px;
}
.inputBox {
  margin: 0 auto;
  margin-top: 40px;
  width: 80%;
  input {
    height: 40px !important;
  }
}
.forgot {
  padding-top: 5px;
  text-decoration: underline;
  color: #0c1db4;
}
.signuptButton,
.loginButton {
  font-size: 30px;
  padding-top: 8px;
  margin: 20px auto;
  text-align: center;
  border: 3px solid #000;
  background-color: #5bb6c1;
  border-radius: 20px;
  width: 20vw;
  height: 4vw;
}
</style>
