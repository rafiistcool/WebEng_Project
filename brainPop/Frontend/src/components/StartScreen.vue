<script setup lang="ts">

</script>

<template>
  <body>
  <div class="container">
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
        <router-link to="/desktop" class="button guest-button" custom v-slot="{ navigate }">
          <button @click="navigate">Gast</button>
        </router-link>
      </div>
    </main>
  </div>
  </body>
</template>

<style scoped>
@import "../assets/styles/startScreen.css";
</style>