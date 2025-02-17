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
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
}

.sidebar-hover-area {
  width: 30px;
  height: 100vh;
  background: transparent;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 30;
}

.sidebar {
  width: 250px;
  height: 100vh;
  background: #333;
  color: white;
  position: absolute;
  left: -250px;
  transition: left 0.3s ease;
  z-index: 20;
  padding: 20px;
}

.sidebar.open {
  left: 0;
}

.sidebar-content h2 {
  margin: 0 0 20px;
}

.sidebar-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-content li {
  margin-bottom: 10px;
}

.sidebar-content a {
  color: white;
  text-decoration: none;
}

.sidebar-content a:hover {
  text-decoration: underline;
}
</style>