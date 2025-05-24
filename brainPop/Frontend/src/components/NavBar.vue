<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from "@/script/auth.ts"

const authenticator = useAuthStore();

const password = ref("password");
const email = ref("email");
//For Mobile
const isNavOpen = ref(false);

</script>

<template>
  <nav class="nav-bar" :class="{ 'nav-open': isNavOpen }">
    <!-- Left Side: Branding / Startscreen -->
    <div class="nav-brand">
      <!-- Could place a logo image or text here -->
      <router-link to="/startscreen" class="nav-logo">
        <!-- Placeholder icon for "home" -->
        <i class="fa fa-home"></i>
        <span>Startscreen</span>
      </router-link>
    </div>

    <!-- Hamburger Button (for mobile) -->
    <button class="nav-toggle" @click="isNavOpen = !isNavOpen">

      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <!-- Right Side: Links -->
    <div class="nav-links">
      <!-- If user is NOT logged in, show these -->
      <router-link
          v-if="!authenticator.isUserLoggedIn"
          to="/login"
          class="nav-link"
      >
        <i class="fa fa-sign-in"></i> Login
      </router-link>

      <router-link
          v-if="!authenticator.isUserLoggedIn"
          to="/register"
          class="nav-link"
      >
        <i class="fa fa-user-plus"></i> Register
      </router-link>


      <router-link
          v-if="authenticator.isUserLoggedIn"
          to="/logout"
          class="nav-link"
          @click.native.prevent="authenticator.logout"
      >
      <i class="fa fa-sign-out"></i> Logout
      </router-link>

      <!-- Demo button: Switch login status manually -->
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
