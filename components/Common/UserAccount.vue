<template>
  <!-- User Page -->

  <div id="UserBox" class="bg-white mx-auto px-16 pt-10 pb-16 rounded-[10px] max-w-screen-md">

    <div class="grid grid-cols-2 gap-3">
      <div class="col-span-2">
        <div class="ttl">Your Account</div>
        <div class="name">
          {{ fullName }}
          <div class="pt-1" style="font-size:0.7em;">{{ userName }}</div>
        </div>
      </div>
      <div class="col-span-1">
        <a href="#" @click="showForm = 'changePassword'" class="mt-6 mb-6" :class="changePasswordClasses">Change
          Password</a>
      </div>
      <div class="col-span-1">
        <a href="#" @click="showForm = 'updateName'" class="mt-6 mb-6" :class="updateNameClasses">Update Name</a>
      </div>
      <div class="col-span-2">
        <div class="mt-2 mb-2 hr"></div>
      </div>
      <div class="col-span-1">
        <form @submit.prevent="changePassword" @cancel="closeAccountBox" v-if="showForm === 'changePassword'">
          <div class="passwordBox grid row-auto">

            <label for="OldPass">Old password</label>
            <div class="mb-3">
              <Password id="OldPass" type="password" name="password" autocomplete="current-password" v-model="oldpass"
                aria-label="Enter old password here" toggleMask :feedback="false" />
            </div>

            <label for="NewPass">New password</label>
            <div class="mb-3">
              <Password id="NewPass" type="password" name="password" autocomplete="new-password" v-model="newpass"
                aarigia-label="Enter new password here" toggleMask :feedback="true" />
            </div>

            <label for="ReNewPass">Confirm New password</label>
            <div class="mb-3">
              <Password id="ReNewPass" type="password" name="password" autocomplete="new-password"
                v-model="confirmNewpass" aria-label="Password" toggleMask :feedback="false" />

            </div>
          </div>

          <div class="buttonArea mt-4">
            <Button class="ngenButtonDiv mr-6" id="UpdateButton" type="submit" aria-label="Update with new password">
              Update
            </button>
            <Button class="c-blue font-normal underline" id="closeBtn" name="cancel" value="Cancel" type="button"
              v-on:click="closeAccountBox" aria-label="Close Account Box">
              Close
            </button>
          </div>

        </form>
      </div>
      <div class="col-span-1">
        <div id="passwordNotes" v-if="showForm === 'changePassword'">
          <strong>Password format:</strong><br>
          <ul>
            <li>Cannot be a commonly used password</li>
            <li>Must be at least 8 characters long</li>
            <li>Must contain at least one non-numeric character</li>
          </ul>
        </div>

        <form @submit.prevent="updateName" @cancel="closeAccountBox" v-if="showForm === 'updateName'">
          <div class="passwordBox grid row-auto">
            <label for="FirstName">First Name</label>
            <div class="mb-3">
              <InputText id="FirstName" type="text" name="first_name" v-model="newFirstName"
                aria-label="Enter first name here" />
            </div>

            <label for="LastName">Last Name</label>
            <div class="mb-3">
              <InputText id="LastName" type="text" name="last_name" v-model="newLastName"
                aria-label="Enter last name here" />
            </div>
          </div>

          <div class="buttonArea mt-4">
            <Button class="ngenButtonDiv mr-6" id="UpdateNameButton" type="submit" aria-label="Update with new name">
              Update
            </button>
            <Button class="c-blue font-normal underline" id="closeNameBtn" name="cancel" value="Cancel" type="button"
              v-on:click="closeAccountBox" aria-label="Close Account Box">
              Close
            </button>
          </div>

        </form>
      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import { useToast } from "primevue/usetoast";

import type { ToastMessageOptions } from "primevue/toast";


import { useUserDataStore } from '@/stores/common/UserDataStore';

import { useBackendConfig } from "@/composables/UseBackendConfig";

const {
  getAccessToken,
  getUserName,
  getUserFullName,
  getUserFirstName,
  getUserLastName,
  setFirstName,
  setLastName
} = useUserDataStore();
const toast = useToast();
const { ngencerfBaseUrl } = useBackendConfig();

const showForm = ref("changePassword");
const changePasswordClasses = ref("chgpwd sel");
const updateNameClasses = ref("updtnm");

const fullName = ref<string>("");
const userName = ref<string>("")

onMounted( () => {
  fullName.value = getUserFullName();
  userName.value = getUserName();
});

watch(showForm, async () => {
  if (showForm.value === 'updateName') {
    changePasswordClasses.value = "chgpwd";
    updateNameClasses.value = "updtnm sel";
  } else {
    changePasswordClasses.value = "chgpwd sel";
    updateNameClasses.value = "updtnm";
  }
});

const oldpass = ref("");
const newpass = ref("");
const confirmNewpass = ref("");

const passwordChanged = ref(false);

const passwordChangeData = {
  "new_password": "string",
  "re_new_password": "string",
  "current_password": "string"
};

const newFirstName = ref(getUserFirstName());
const newLastName = ref(getUserLastName());

const updateNameData = {
  "first_name": "string",
  "last_name": "string"
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
      }
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: e, life: 3000 };
toast.add(tMsg);
      console.error("Error during user creation:", error.value?.message, error.value?.data);
      return;
    }
    console.log("changePassword", data);
    // Clear out the inputs and report success
    oldpass.value = "";
    newpass.value = "";
    confirmNewpass.value = "";
    const tMsg: ToastMessageOptions = { severity: 'success', summary: 'Password Change Successful', detail: "You have successfully changed your password", life: 3000 };
toast.add(tMsg);
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Password Change Error', detail: "Password was not changed", life: 3000 };
toast.add(tMsg);
  }
}

/** 
* Submits the name change
* @param e - event object
*/
const updateName = async () => {
  updateNameData.first_name = newFirstName.value.trim();
  updateNameData.last_name = newLastName.value.trim();

  if (updateNameData.first_name !== "" && updateNameData.last_name !== "") {
    const { data, error } = await useFetch<any>(`${ngencerfBaseUrl}/auth/users/me/`, {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer ${getAccessToken()}`,
        "Content-Type": 'application/json'
      },
      body: updateNameData
    });
    // error.value.statuscode
    if (error.value) {
      let e = error.value?.data?.detail;
      if (!e) {
        e = "Cannot reach server. Error code: " + error.value.statusCode;
      }
      const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: e, life: 3000 };
toast.add(tMsg);
      console.error("Error during user update:", error.value?.message, error.value?.data);
      return;
    }
    console.log("UpdateNameData", data);
    // Clear out the inputs and report success
    setFirstName(updateNameData.first_name);
    setLastName(updateNameData.last_name);
    const tMsg: ToastMessageOptions = { severity: 'success', summary: 'Name Change Successful', detail: "You have successfully changed your name", life: 3000 };
toast.add(tMsg);
  } else {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Name Change Error', detail: "Name was not changed", life: 3000 };
toast.add(tMsg);
  }
}

const closeAccountBox = () => {
  useAccountEvent("accountEvent", "");
}

</script>
<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

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
    text-align: right;
    vertical-align: top;
  }

  #passwordNotes {
    text-align: left;
    padding-left: 20px;

    ul {
      list-style: disc;
      margin-top: 10px;
    }

    li {
      margin-top: 5px;
      margin-left: 18px;
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

  .chgpwd,
  .updtnm {
    font-size: 25px;
    text-align: center;
    color: #0077ff;
    font-weight: normal;
    text-decoration: underline;
  }

  .chgpwd.sel,
  .updtnm.sel {
    color: #000000;
    font-weight: bold;
    text-decoration: none;
  }

}
</style>
