<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <h1>Hello Vue!</h1>
  <router-link to="/">Home</router-link>
  <router-link to="/card">Card</router-link>
  <router-link to="/startscreen">startscreen</router-link>
  <router-link to="/login">Login</router-link>
  <router-link to="/register">Register</router-link>
  <router-view />
</template>