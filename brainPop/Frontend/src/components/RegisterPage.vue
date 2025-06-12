<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../script/auth';

const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const errorMessage = ref('');
const router = useRouter();
const authStore = useAuthStore();

const register = async (event: Event) => {
  event.preventDefault();

  if (!username.value || !password.value || !passwordConfirm.value) {
    errorMessage.value = 'Bitte alle Felder ausfüllen!';
    return;
  }

  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'Die Passwörter stimmen nicht überein!';
    return;
  }

  try {
    const result = await authStore.register(username.value, password.value, passwordConfirm.value);

    if (result.success) {
      alert(result.message);
      router.push('/login');
    } else {
      errorMessage.value = result.message;
    }
  } catch (error) {
    errorMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
    console.error('Registration error:', error);
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Registrieren</h2>
    <form @submit.prevent="register">
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div class="input-group">
        <label for="username">Benutzername</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="input-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="input-group">
        <label for="passwordConfirm">Passwort wiederholen</label>
        <input type="password" id="passwordConfirm" v-model="passwordConfirm" required>
      </div>
      <button type="submit" class="button">Registrieren</button>
    </form>
  </div>
</template>

<style scoped>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/register.css";
</style>
