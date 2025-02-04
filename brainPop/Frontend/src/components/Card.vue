<script setup lang="ts">
import { ref } from 'vue/dist/vue.mjs';

const visible = ref(false);
const imageUrl = ref("https://via.placeholder.com/150");

const toggleVisible = () => {
  visible.value = !visible.value;
}
</script>

<template>
<body>
<div>
  <h1>Learn-Mode</h1>

  <div class="flashcard">
    <div class="contents" v-if="visible">
      <button @click="toggleVisible"></button>
      <img :src="imageUrl" alt="Pic not found" />
    </div>
  </div>
</div>
</body>
</template>

<style>
@import "../assets/styles/style.css";
</style>