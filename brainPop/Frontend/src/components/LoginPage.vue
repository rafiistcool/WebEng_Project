<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const login = () => {
  const storedEmail = localStorage.getItem('userEmail');
  console.log(storedEmail);

  const storedPassword = localStorage.getItem('userPassword');
  console.log(storedPassword);
  if (email.value === storedEmail && password.value === storedPassword) {
    alert('Login erfolgreich!');
    router.push('/explorer');
  } else {
    alert('Falsche E-Mail oder falsches Passwort!');
  }
};
</script>

<template>
  <body>
  <div class="login-container">
    <h2>Login</h2>
    <form>
      <div class="input-group">
        <label for="email">E-Mail</label>
        <input type="text" id="email" v-model="email" required>
      </div>
      <div class="input-group">
        <label for="password">Passwort</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" class="login-button" @click="login">Login</button>
      <router-link to="/register" class="register-button" custom v-slot="{ navigate }">
        <button @click="navigate">Registrieren</button>
      </router-link>
    </form>
    <a href="#" style="color: #6fB98F" class="forgot-password">Passwort vergessen?</a>
  </div>
  </body>
</template>

<style scoped>
@import "../assets/styles/login.css";
</style>