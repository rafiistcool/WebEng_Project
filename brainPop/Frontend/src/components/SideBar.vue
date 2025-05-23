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
          <li><router-link to="/startscreen">Startscreen</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/register">Register</router-link></li>
          <li><router-link to="/explorer">Explorer</router-link></li>
          <li><router-link to="/cardcreation">Card Creation</router-link></li>
          <li><router-link to="/Card">Learning Mode</router-link></li>
    
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/sidebarStyles.css";
</style>