<template>
  <div v-if="visible" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-content">
      <h2>Create an Account</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="username">Username</label>
          <input v-model="_username" id="username" type="text" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="userEmail" id="email" type="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="password" id="password" type="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input v-model="confirmPassword" id="confirmPassword" type="password" required />
        </div>
        <button type="submit">Create Account</button>
        <button type="button" @click="closeDialog">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBackendConfig } from "~/composables/UseBackendConfig";

const { ngencerfBaseUrl } = useBackendConfig();

const props = defineProps({
  visible: Boolean,
  onClose: Function
});


const _username = ref('');
const userEmail = ref('');
const password = ref('');
const confirmPassword = ref('');

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

const closeDialog = () => {
  props.onClose?.();
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
  margin-bottom: 15px;
}

button {
  margin-right: 10px;
}
</style>
