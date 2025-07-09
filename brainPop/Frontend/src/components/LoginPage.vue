<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../script/auth';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  document.body.classList.remove('left-aligned');
});

const login = async (event: Event) => {
  event.preventDefault();

  if (!username.value || !password.value) {
    errorMessage.value = 'Bitte geben Sie Benutzername und Passwort ein.';
    return;
  }

  try {
    const result = await authStore.login(username.value, password.value);

    if (result.success) {
      router.push('/explorer');
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    console.error('Login error:', error);
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login" class="login-register-buttons">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="input-group">
        <label for="username">E-Mail</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="input-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="login-register-buttons">
        <button type="submit" class="button login-button">Login</button>
        <router-link to="/register" class="button register-button" custom v-slot="{ navigate }">
          <button @click="navigate">Registrieren</button>
        </router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/login.css";
</style>
