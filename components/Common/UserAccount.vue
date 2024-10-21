<template>
  <!-- User Page -->

        <div id="UserBox" class="bg-white mx-auto px-16 pt-10 pb-16 rounded-[10px] max-w-screen-md">

          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <div class="ttl">Your Account</div>
              <div class="name">{{ accountName }}</div>
              <div class="chgpwd mt-12 mb-6">Change Password</div>
            </div>
            <div class="col-span-1">
              <form @submit.prevent="changePassword" @cancel="closeAccountBox">
                <div class="passwordBox grid row-auto">
                  <div class="pwdspacer">Old password</div>
                  <div>
                    <Password id="OldPass" type="password" name="password" :inputProps="{ autocomplete: true }"
                      autocomplete="current-password" v-model="oldpass" aria-label="Enter old password here" toggleMask
                      :feedback="false" />

                  </div>
                  <p>&nbsp;</p>
                  <div>New password</div>
                  <div>
                    <Password id="NewPass" type="password" name="password" :inputProps="{ autocomplete: true }"
                      autocomplete="new-password" v-model="newpass" aaria-label="Enter new password here" toggleMask
                      :feedback="true" />

                  </div>
                  <p>&nbsp;</p>
                  <div>Confirm New password</div>
                  <div>
                    <Password id="ReNewPass" type="password" name="password" :inputProps="{ autocomplete: true }"
                      autocomplete="new-password" v-model="confirmNewpass" aria-label="Password" toggleMask
                      :feedback="false" />

                  </div>
                </div>
                <div class="buttonArea mt-8">
                  <button class="ngenButtonDiv" id="UpdateButton" type="submit"
                    aria-label="Update with new password">
                    Update
                  </button>
                   <button class="ngenButtonDiv ml-2" id="closeBtn" name="cancel" value="Cancel" type="button" v-on:click="closeAccountBox"
                    aria-label="Close Account Box">
                    Close
                  </button>
                </div>
              </form>
            </div>
            <div class="col-span-1">
              <div id="passwordNotes" class="row">
                <p>
                  <strong>Password format:</strong><br />
                  <ul>
                    <li>Cannot be a commonly used password</li>
                    <li>Must be at least 8 characters long</li>
                    <li>Must contain at least one non-numeric character</li>
                  </ul>
                </p>
              </div>
            </div>

          </div>

        </div>

</template>

<script setup lang="ts">
import Password from 'primevue/password';
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

const emit = defineEmits(["closeAccountBox"]);

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

const closeAccountBox = () => {
  useAccountEvent("accountEvent", "");
}

</script>
<style lang="scss" scoped>
@import "/assets/styles/styles.scss";

#UserBox {
  position: absolute;
  left: 30%;
  margin-top: 100px;
  border: 5px solid #ccc;
  z-index: 9999;
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

}
</style>
