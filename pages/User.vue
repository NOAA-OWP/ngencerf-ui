<template>
  <!-- User Page -->

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

              <div id="UserBox" class="bg-white mx-auto px-8 py-8 rounded-[10px] max-w-screen-md">
                <div class="grid grid-cols-12 gap-3">
                  <div class="col-span-5">
                    <div class="ttl">Your Account</div>
                    <div class="name">{{ accountName }}</div>
        <form @submit.prevent="changePassword">
          <div class="passwordBox grid row-auto">
            <div class="chgpwd">Change Password</div>
            <div class="pwdspacer">Old password</div>
            <div>
            <Password id="OldPass" type="password" name="password" :inputProps="{ autocomplete: true }" autocomplete="current-password" v-model="oldpass"
              aria-label="Enter old password here" toggleMask :feedback="false" />

            </div>
              <p>&nbsp;</p>
              <div>New password</div>
              <div>
            <Password id="NewPass" type="password" name="password" :inputProps="{ autocomplete: true }" autocomplete="new-password" v-model="newpass"
              aaria-label="Enter new password here" toggleMask :feedback="true" />

                        </div>
              <p>&nbsp;</p>
              <div>Confirm New password</div>
              <div>
            <Password id="ReNewPass" type="password" name="password" :inputProps="{ autocomplete: true }" autocomplete="new-password" v-model="confirmNewpass"
              aria-label="Password" toggleMask :feedback="false" />

                      </div>
                    </div>
                    <div class="buttonArea">

            <button id="UpdateButton" v-on:click="changePassword" aria-label="Update with new password">
              Update
            </button>
          </div>
        </form>
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
            </div>
          </div>
        </div>
      </div>
      <!--<div class="row-span-1">
        <AppFooter />
      </div>-->
    </div>
</template>

<script setup lang="ts">
import { useUserDataStore } from '~/stores/common/UserDataStore';
import { useToast } from "primevue/usetoast";
import { useBackendConfig } from "~/composables/UseBackendConfig";

const { getAccessToken, getUserInitials } = useUserDataStore()
const toast = useToast();
const { ngencerfBaseUrl } = useBackendConfig();

const accountName = getUserInitials();
const oldpass = ref("");
const newpass = ref("");
const confirmNewpass = ref("");

const passwordChanged = ref(false);

const passwordChangeData = {
  "new_password": "string",
  "re_new_password": "string",
  "current_password": "string"
};


/** 
* Submits the password change
* @param e - event object
*/
const changePassword = async () => {
  passwordChangeData.current_password = oldpass.value.trim();
  passwordChangeData.new_password = newpass.value.trim();
  passwordChangeData.re_new_password = confirmNewpass.value.trim();

  if (passwordChangeData.current_password !== "" && passwordChangeData.new_password !== "" && passwordChangeData.re_new_password !== ""
    && (passwordChangeData.new_password === passwordChangeData.re_new_password)) {
    const { data, error } = await useFetch<any>(`${ngencerfBaseUrl}/auth/users/set_password/`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: passwordChangeData
    });
    // error.value.statuscode
    if (error.value) {
      let e = error.value?.data?.detail;
      if (!e) {
        e = "Cannot reach server. Error code: " + error.value.statusCode;
        console.log("StatusCode: ", e);
      }
      toast.add({ severity: 'error', summary: 'Error', detail: e, life: 3000 });
      console.error("Error during user creation:", error.value?.message, error.value?.data);
      return;
    }
    // Clear out the inputs and report success
    oldpass.value = "";
    newpass.value = "";
    confirmNewpass.value = "";
    toast.add({ severity: 'success', summary: 'Password Change Successful', detail: "You have successfully changed your password", life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: 'Password Change Error', detail: "Password was not changed", life: 3000 });
  }
}

</script>
<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#UserBox {
  /*margin: 30px auto 0 auto;
  width: 740px;
  height: 495px;
  border: 4px solid #105d84;
  background-color: $ngwcp_groupsbkg;*/
  #avatar {
    width: 150px;
    height: 150px;
    float: right;
    margin: 20px 20px 40px 0;

    /*border: 1px solid #105d84;*/
    text-align: right;
    vertical-align: top;
  }
  #passwordNotes p {
    text-align: left;
    margin-left: 20px;
  }
  .buttonArea {
    text-align: center;
    /*#UpdateButton {
      font-size: 20px;
      margin: 20px auto;
      text-align: center;
      border: 3px solid #000;
      background-color: $ngwcp_primary2;
      border-radius: 20px;
      width: 245px;
      height: 50px;
      padding-top: 3px;
    }*/
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
