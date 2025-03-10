<script setup lang="ts">
import {ref} from "vue";

const isSidebarOpen = ref(true);

const openSidebar = () => {
  isSidebarOpen.value = true;
}
const closeSidebar = () => {
  isSidebarOpen.value = false;
}
</script>

<template>
  <div class="sidebar-container">
    <div class="sidebar-hover-area" @mouseenter="openSidebar"></div>

    <div class="sidebar" :class="{ open: isSidebarOpen }" @mouseleave="closeSidebar">
      <div class="sidebar-content">
        <h2>Menu</h2>
        <ul>

          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/Card">Card</router-link></li>
          <li><router-link to="/startscreen">Startscreen</router-link></li>
          <li><router-link to="/login">login</router-link></li>
          <li><router-link to="/register">register</router-link></li>
          <li><router-link to="/explorer">Explorer</router-link></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/styles/sidebarStyles.css";
</style>