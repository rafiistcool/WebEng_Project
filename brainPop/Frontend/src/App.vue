<script setup>
import { RouterView } from 'vue-router';
import NavBar from "@/components/NavBar.vue";
import onMounted from 'vue';
import {useAuthStore} from "@/script/auth";

onMounted(async () => {
  await useAuthStore().checkSession();
});

</script>

<template>
  <NavBar />

  <router-view />
</template>

<style scoped>
/*@import '../src/assets/styles/app_styles.css'; */
</style>