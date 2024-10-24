<template>
  <!-- User Page -->

        <div id="UserBox" class="bg-white mx-auto px-16 pt-10 pb-16 rounded-[10px] max-w-screen-md">

          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <div class="ttl">Your Account</div>
              <div class="name">
                {{ getUserFullName() }}
                <div class="pt-1" style="font-size:0.7em;">{{ getUserName() }}</div>
              </div>
              <div class="mt-2 mb-2 hr"></div>
              <div class="chgpwd mt-6 mb-6">Change Password</div>
            </div>
            <div class="col-span-1">
              <form @submit.prevent="changePassword" @cancel="closeAccountBox">
                <div class="passwordBox grid row-auto">

                  <label for="OldPass">Old password</label>
                  <div class="mb-3">
                    <Password id="OldPass" type="password" name="password" :inputProps="{ autocomplete: true }"
                      autocomplete="current-password" v-model="oldpass" aria-label="Enter old password here" toggleMask
                      :feedback="false" />
                  </div>
                  
                  <label for="NewPass">New password</label>
                  <div class="mb-3">
                    <Password id="NewPass" type="password" name="password" :inputProps="{ autocomplete: true }"
                      autocomplete="new-password" v-model="newpass" aaria-label="Enter new password here" toggleMask
                      :feedback="true" />
                  </div>
                  
                  <label for="ReNewPass">Confirm New password</label>
                  <div class="mb-3">
                    <Password id="ReNewPass" type="password" name="password" :inputProps="{ autocomplete: true }"
                      autocomplete="new-password" v-model="confirmNewpass" aria-label="Password" toggleMask
                      :feedback="false" />

                  </div>
                </div>

                <div class="buttonArea mt-4">
                  <button class="ngenButtonDiv mr-6" id="UpdateButton" type="submit"
                    aria-label="Update with new password">
                    Update
                  </button>
                   <button class="c-blue font-normal underline" id="closeBtn" name="cancel" value="Cancel" type="button" v-on:click="closeAccountBox"
                    aria-label="Close Account Box">
                    Close
                  </button>
                </div>

              </form>
            </div>
            <div class="col-span-1">
              <div id="passwordNotes">                
                <strong>Password format:</strong><br>
                <ul>
                  <li>Cannot be a commonly used password</li>
                  <li>Must be at least 8 characters long</li>
                  <li>Must contain at least one non-numeric character</li>
                </ul>
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

const { getAccessToken, getUserInitials, getUserName, getUserFullName } = useUserDataStore()
const toast = useToast();
const { ngencerfBaseUrl } = useBackendConfig();

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
  left: Calc(50vw - 365px);
  top: Calc(50vh - 300px);
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

  #passwordNotes {
    text-align: left;
    padding-left: 20px;
    ul {
      list-style: disc;
      margin-top:10px;
    }
    li {
      margin-top:5px;
      margin-left:18px;
    }
  }

  .buttonArea {
    text-align: left;
  }

  .ttl {
    font-size: 35px;
    margin-top: 15px;
    text-align: center;
  }

  .name {
    font-size: 20px;
    text-align: center;
    margin-top: 25px;
  }

  .chgpwd {
    font-size: 25px; 
    text-align: center;
  }

}
</style>
