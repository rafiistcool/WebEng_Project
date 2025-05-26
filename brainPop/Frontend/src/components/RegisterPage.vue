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
  <div class="bg-grayBackground backdrop-blur rounded px-20 py-12 inline-block text-center">
    <h2 class="mb-4">Registrieren</h2>
    <form @submit.prevent="register">
      <div class="flex flex-col items-center mb-4 text-left">
        <label for="email" class="block w-full text-sm text-primary mb-1">E-Mail</label>
        <input type="text" id="email" v-model="email" required class="w-full p-2 border border-text rounded text-base focus:border-primary outline-none">
      </div>
      <div class="flex flex-col items-center mb-4 text-left">
        <label for="password" class="block w-full text-sm text-primary mb-1">Passwort</label>
        <input type="password" id="password" v-model="password" required class="w-full p-2 border border-text rounded text-base focus:border-primary outline-none">
      </div>
      <div class="flex flex-col items-center mb-4 text-left">
        <label for="passwordConfirm" class="block w-full text-sm text-primary mb-1">Passwort wiederholen</label>
        <input type="password" id="passwordConfirm" v-model="passwordConfirm" required class="w-full p-2 border border-text rounded text-base focus:border-primary outline-none">
      </div>
      <button type="submit" class="button w-full h-12">Registrieren</button>
    </form>
  </div>

</template>

<style scoped>
</style>