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
  <div class="bg-grayBackground backdrop-blur rounded px-20 py-12 inline-block text-center">
    <h2 class="mb-4">Login</h2>
    <form>
      <div class="flex flex-col items-center mb-4 text-left">
        <label for="email" class="block w-full text-sm text-primary mb-1">E-Mail</label>
        <input type="text" id="email" v-model="email" required class="w-full p-2 border border-text rounded text-base focus:border-primary outline-none">
      </div>
      <div class="flex flex-col items-center mb-4 text-left">
        <label for="password" class="block w-full text-sm text-primary mb-1">Passwort</label>
        <input type="password" id="password" v-model="password" required class="w-full p-2 border border-text rounded text-base focus:border-primary outline-none">
      </div>
      <div class="flex flex-col justify-center gap-2">
        <button type="submit" class="button w-[70%] h-12" @click="login">Login</button>
        <router-link to="/register" class="w-[70%] h-12" custom v-slot="{ navigate }">
          <button class="button w-full h-full" @click="navigate">Registrieren</button>
        </router-link>
      </div>
    </form>
    <a href="#" class="block mt-2 text-sm text-primary hover:underline">Passwort vergessen?</a>
  </div>
</template>

<style scoped>
</style>