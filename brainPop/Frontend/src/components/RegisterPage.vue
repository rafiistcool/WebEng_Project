<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const router = useRouter();

const register = () => {
  if (email.value && (password.value === passwordConfirm.value)) {
    if (password.value === passwordConfirm.value) {
      localStorage.setItem('userEmail', email.value);
      localStorage.setItem('userPassword', password.value);
      alert('Registrierung erfolgreich!');
      router.push('/login');
    }else{
      alert('Bitte geben Sie zweimal das selbe Passwort ein!')
    }
  } else {
    alert('Bitte alle Felder ausfüllen!');
  }
};
</script>

<template>
  <div class="login-container">
    <h2>Registrieren</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <label for="email">E-Mail</label>
        <input type="text" id="email" v-model="email" required>
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