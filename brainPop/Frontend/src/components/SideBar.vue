<script setup lang="ts">

</script>

<template>
  <nav class="nav-bar">
    <router-link to="/startscreen">Startscreen</router-link>
    <router-link to="/login">Login</router-link>
    <router-link to="/register">Register</router-link>
    <router-link to="/explorer">Explorer</router-link>
    <router-link to="/cardcreation">Card Creation</router-link>
    <router-link to="/Card">Learning Mode</router-link>
  </nav>
</template>

<style>
@import "../assets/styles/masterStyle.css";

#app {
  padding-top: 60px;
}

.nav-bar {
  display: flex;
  gap: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--sidebarBackground);
  padding: 1rem;
  z-index: 50;
}

.nav-bar a {
  color: var(--primary-color);
  text-decoration: none;
}
</style>