<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from "@/script/auth.ts"

const authenticator = useAuthStore();

//DEMO DATA
const password = ref("password");
const email = ref("email");
//For Mobile
const isNavOpen = ref(false);

</script>

<template>
  <nav :class="['flex items-center justify-between fixed top-0 left-0 right-0 bg-sidebarBackground p-2 z-50 transition-all overflow-hidden', isNavOpen ? 'max-h-[300px]' : 'max-h-[60px]']">

    <div class="flex items-center">

      <router-link to="/startscreen" class="flex items-center text-primary text-lg no-underline">

        <i class="fa fa-home mr-2"></i>
        <img src="../assets/icons/Temp-Logo-Sebastian.png" alt="Startseite" class="h-[70px]">
      </router-link>
    </div>


    <button class="flex flex-col md:hidden ml-auto" @click="isNavOpen = !isNavOpen">

      <span class="w-[25px] h-[3px] bg-text my-1"></span>
      <span class="w-[25px] h-[3px] bg-text my-1"></span>
      <span class="w-[25px] h-[3px] bg-text my-1"></span>
    </button>


    <div :class="['flex items-center gap-4', isNavOpen ? 'flex' : 'hidden', 'md:flex md:flex-row md:gap-4 flex-col w-full md:w-auto p-4 md:p-0']">

      <router-link
          v-if="!authenticator.isUserLoggedIn"
          to="/login"
          class="flex items-center text-text hover:text-primary no-underline"
      >
        <i class="fa fa-sign-in mr-1 text-xl"></i>
        <span class="text-base">Login</span>
        <img src="../assets/icons/login-icon-thicker.svg" alt="Login" class="h-[50px]">
      </router-link>

      <router-link
          v-if="!authenticator.isUserLoggedIn"
          to="/register"
          class="flex items-center text-text hover:text-primary no-underline"
      >
        <i class="fa fa-user-plus mr-1 text-xl"></i>
        <span class="text-base">Register</span>
        <img src="../assets/icons/register-icon.svg" alt="Register" class="h-[50px]">

      </router-link>


      <router-link
          v-if="authenticator.isUserLoggedIn"
          to="/logout"
          class="flex items-center text-text hover:text-primary no-underline"
          @click.native.prevent="authenticator.logout"
      >
      <i class="fa fa-sign-out mr-1 text-xl"></i>
        <span class="text-base">Logout</span>
        <img src="../assets/icons/logout-icon.svg" alt="Logout" class="h-[50px]">
      </router-link>


      <button class="bg-primary text-text px-2 py-1 rounded text-sm hover:bg-secondary" @click="authenticator.login(email, password)">
        Login (Demo)
      </button>
    </div>
  </nav>
</template>

<style scoped>
</style>
