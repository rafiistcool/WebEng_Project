<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <body class="main-body">
    <div class="main-background">
      <div class="header-main-background">
        <h1>BRAINPOP</h1>
      </div>
      <div class="sidebar-page-wrapper">
        <div class="sidebar-background">
          <div class="sidebar-content">
            <div class="router-links">
              <div class="home-link">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="black">
                  <polygon points="20,50 50,15 80,50" stroke="black" stroke-width="4" fill="none"/>
                  <rect x="25" y="50" width="50" height="40" stroke="black" stroke-width="4" fill="none" rx="5" ry="5"/>
                  <rect x="50" y="70" width="10" height="20" stroke="black" stroke-width="4" fill="none" rx="2" ry="2"/>
                  <rect x="32" y="58" width="10" height="10" stroke="black" stroke-width="4" fill="none" rx="2" ry="2"/>
                </svg>
              </div>
              <router-link to="/">Home</router-link>
              <router-link to="/card">Card</router-link>
            </div>
          </div>
        </div>
        <div class="page-content">
          <router-view />
        </div>
      </div>
    </div>

  </body>
</template>

<style scoped>
@import '../src/assets/styles/app_styles.css';
</style>