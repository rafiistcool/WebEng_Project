<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const imageUrl = ref("https://placehold.co/600x400");

const toggleVisible = () => {
  visible.value = !visible.value;
}

const configureContentOfFlashcard = () => {

}
</script>

<template>
<body>
<div class="learning-mode-window">
  <h1 id="learnMode-h1">Learn-Mode</h1>
  <div class="flashcard-container" @click="toggleVisible">
    <div class="flashcard" :class="{ flipped: visible }">
      <div class="flashcardFront" v-if="visible">

        <p class="userContent">Hier sollte später Text stehen</p>
      </div>
      <div class="flashcardBack" v-else>
        <p class="userContent">Hier sollte der zweite Text stehen</p>
      </div>
    </div>
  </div>
  <div class="configure">
    <button class="baseButtonLayout" @click="configureContentOfFlashcard">Configure Content</button>
  </div>
</div>
</body>
</template>

<style>
@import "../assets/styles/learningMode.css";
</style>