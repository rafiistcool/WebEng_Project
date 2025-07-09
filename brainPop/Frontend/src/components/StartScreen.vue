<script setup lang="ts">
import {onMounted} from "vue";

onMounted(() => {
  document.body.classList.remove('left-aligned');
});
</script>

<template>

    <div class=" container">
      <header class="logo-container">
        <img class="logo"
             src="../assets/icons/logo.png" alt=""/>
      </header>
      <main class="main-content">
        <h1 class="title">BrainPop</h1>
        <div class="button-group">
          <router-link to="/login" class="button login-button" custom v-slot="{ navigate }">
            <button @click="navigate">Anmelden</button>
          </router-link>
          <router-link to="/register" class="button register-button" custom v-slot="{ navigate }">
            <button @click="navigate">Registrieren</button>
          </router-link>
        </div>
      </main>
    </div>


</template>

<style scoped>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/startScreen.css";
</style>