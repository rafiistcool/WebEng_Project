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
  <nav class="nav-bar" :class="{ 'nav-open': isNavOpen }">

    <div class="nav-brand">

      <router-link to="/startscreen" class="nav-logo">

        <i class="fa fa-home"></i>
        <img src="../assets/icons/Temp-Logo-Sebastian.png" alt="Startseite" id="home-icon">
      </router-link>
    </div>


    <button class="nav-toggle" @click="isNavOpen = !isNavOpen">

      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>


    <div class="nav-links">

      <router-link
          v-if="!authenticator.isUserLoggedIn"
          to="/login"
          class="nav-link"
      >
        <i class="fa fa-sign-in"></i>
        <span class="icon-font">Login</span>
        <img src="../assets/icons/login-icon.svg" alt="Login" class="icon">
      </router-link>

      <router-link
          v-if="!authenticator.isUserLoggedIn"
          to="/register"
          class="nav-link"
      >
        <i class="fa fa-user-plus"></i>
        <span class="icon-font">Register</span>
        <img src="../assets/icons/register-icon.svg" alt="Register" class="icon">

      </router-link>


      <router-link
          v-if="authenticator.isUserLoggedIn"
          to="/logout"
          class="nav-link"
          @click.native.prevent="authenticator.logout"
      >
      <i class="fa fa-sign-out"></i> Logout
      </router-link>


      <button class="demo-toggle-button" @click="authenticator.login(email, password)">
        Login (Demo)
      </button>
    </div>
  </nav>
</template>

<style scoped>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/navbar.css";
</style>
