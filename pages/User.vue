<template>
  <!-- User Page -->
  <div id="UserBox">
    <div class="grid grid-cols-12 gap-3">
      <div class="col-span-5">
        <div class="ttl">Your Account</div>
        <div class="name">{{ accountName }}</div>

        <div class="passwordBox grid row-auto">
          <div class="chgpwd">Change Password</div>
          <div class="pwdspacer">Old password</div>
          <div>
            <input
              id="OldPass"
              type="text"
              v-model="oldpass"
              aria-label="Enter old password here"
            />
          </div>
          <p>&nbsp;</p>
          <div>New password</div>
          <div>
            <input
              id="NewPass"
              type="text"
              v-model="newpass"
              aria-label="Enter new password here"
            />
          </div>
        </div>
        <div class="buttonArea">
          <button
            id="UpdateButton"
            v-on:click="UpdatePassword"
            aria-label="Update with new password"
          >
            Update
          </button>
        </div>
      </div>
      <div class="col-span-7">
        <div id="avatar" class="row">
          <div><img src="@/assets/styles/img/herbie.png" /></div>
        </div>
        <div id="passwordNotes" class="row">
          <p>
            <strong>Password format:</strong><br />
            At least 12 characters long but 14 or more is better.<br /><br />
            A combination of uppercase letters,<br />
            lowercase letters, numbers, an14 ord symbols.<br /><br />
            Not a word that can be found in a dictionary<br />
            or the name of a person, character,<br />
            product, or organization.<br /><br />
            Significantly different from your previous password
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const accountName = "Herbert Hoover";
const oldpass = ref("");
const newpass = ref("");
const passwordChanged = ref(false);

const UpdatePassword = (e: Event) => {
  if (oldpass.value.trim() !== "" && newpass.value.trim() !== "") {
    alert('Password has been changed');
    passwordChanged.value = true;
  } else {
    alert("Please enter valid credentials");
    passwordChanged.value = false;
  }
} 

</script>
<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#UserBox {
  margin: 30px auto 0 auto;
  width: 740px;
  height: 495px;
  border: 4px solid #105d84;
  background-color: #cccccc;
  #avatar {
    width: 150px;
    height: 150px;
    float: right;
    margin: 20px 20px 40px 0;

    border: 1px solid #105d84;
    text-align: right;
    vertical-align: top;
  }
  #passwordNotes p {
    text-align: left;
    margin-left: 20px;
  }
  .buttonArea {
    text-align: center;
    #UpdateButton {
      font-size: 20px;
      margin: 20px auto;
      text-align: center;
      border: 3px solid #000;
      background-color: #5bb6c1;
      border-radius: 20px;
      width: 245px;
      height: 50px;
      padding-top: 3px;
    }
  }
  .ttl {
    //margin: 30px 0 0 30px;
    font-size: 40px;
    margin-top: 20px;
    text-align: center;
  }
  .name {
    font-size: 30px;
    text-align: center;
    margin-top: 30px;
  }
  .chgpwd {
    font-size: 30px;
  }
  .passwordBox {
    margin: 120px 0 0 20px;
  }
  .pwdspacer {
    margin-top: 40px;
  }
}
</style>
