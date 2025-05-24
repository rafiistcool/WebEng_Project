<!--

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
@import "../assets/styles/sidebar.css";
</style>
-->

<script setup lang="ts">
import { ref } from 'vue';

/**
 * In a real app, you'd probably get login state from:
 *  - Vuex/Pinia store
 *  - a composable
 *  - or a global auth service
 *
 * For demo, we store it locally:
 */
const isLoggedIn = ref(false);

/**
 * Controls mobile nav toggle (hamburger)
 */
const isNavOpen = ref(false);

/**
 * Example toggle function:
 * (You might replace this with your actual login/out calls)
 */
function toggleLogin() {
  isLoggedIn.value = !isLoggedIn.value;
  // Optionally close the nav on toggle
  isNavOpen.value = false;
}
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
      <!-- Basic "hamburger" icon -->
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <!-- Right Side: Links -->
    <div class="nav-links">
      <!-- If user is NOT logged in, show these -->
      <router-link
          v-if="!isLoggedIn"
          to="/login"
          class="nav-link"
      >
        <i class="fa fa-sign-in"></i> Login
      </router-link>

      <router-link
          v-if="!isLoggedIn"
          to="/register"
          class="nav-link"
      >
        <i class="fa fa-user-plus"></i> Register
      </router-link>

      <!-- If user IS logged in, show these -->
      <router-link
          v-if="isLoggedIn"
          to="/logout"
          class="nav-link"
          @click.native.prevent="toggleLogin"
      >
      <i class="fa fa-sign-out"></i> Logout
      </router-link>

      <!-- Demo button: Switch login status manually -->
      <button class="demo-toggle-button" @click="toggleLogin">
        Toggle Login (Demo)
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* Use your existing imports or keep them outside the <style> in main entry
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/sidebar.css";
*/

/* We override or extend the .nav-bar & .nav-bar a rules from sidebar.css. */

/* Root container of the navbar */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--sidebarBackground);
  padding: 0.5rem 1rem;
  z-index: 50;

  /* For smoother transitions on mobile open/close */
  transition: max-height 0.3s ease-in-out;
  /* By default, show horizontal layout */
  max-height: 60px;
  overflow: hidden; /* hides links on small screens if nav closed */
}

.nav-brand {
  display: flex;
  align-items: center;
}

/* Example logo styles */
.nav-logo {
  display: flex;
  align-items: center;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 1.2rem;
}
.nav-logo i {
  margin-right: 0.5rem;
}

/* The right side links container */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Each link */
.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-size: 1rem;
  display: flex;
  align-items: center;
}
.nav-link i {
  margin-right: 0.3rem;
  font-size: 1.2rem;
}

/* On hover, lighten or shift color */
.nav-link:hover {
  color: var(--primary-color);
}

/* Example button for toggling login (demo only) */
.demo-toggle-button {
  background: var(--primary-color);
  color: var(--text-color);
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}
.demo-toggle-button:hover {
  background: var(--secondary-color);
}

/* Hamburger Button (hidden on bigger screens) */
.nav-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: auto; /* push it to the right if needed */
}
.nav-toggle .bar {
  width: 25px;
  height: 3px;
  background-color: var(--text-color);
  margin: 4px 0;
  transition: 0.4s;
}

/*
   When .nav-open is applied, we can expand the nav
   to show links on mobile.
*/
.nav-bar.nav-open {
  max-height: 300px; /* enough to show all links stacked */
}

/* Responsive Rules */
@media (max-width: 768px) {
  /* Show hamburger, hide normal horizontal layout. */
  .nav-toggle {
    display: flex;
  }

  /* We'll stack nav-links vertically. */
  .nav-links {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 1rem 0;
  }

  .nav-link {
    padding: 0.5rem 0;
  }
}
</style>
