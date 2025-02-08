<script setup lang="ts">
import { ref } from 'vue';

const flipped = ref(false);
const imageUrl = ref("https://placehold.co/600x400");

const isFlipped = () => {
  flipped.value = !flipped.value;
}

const configureContentOfFlashcard = () => {

}

const notKnown = () => {
  console.log('Not Known');
}

const known = () => {
  console.log('Known');
}
</script>

<template>
  <div class="learning-mode-window">
    <h1 id="learnMode-h1">Learn-Mode</h1>
    <div class="learning-mode-window-content">

      <!-- Linke Pfeil-Schaltfläche -->
      <div class="arrow-container">
        <div class="arrow arrow-left" @click="notKnown">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </div>
      </div>


      <div class="flashcard-container">
        <div class="flashcard" @click="isFlipped">
            <div class="flashcardFront" v-if="flipped">
              <p class="userContent" >Hier sollte später Text stehen</p>
            </div>
            <div class="flashcardBack" v-else>
              <p class="userContent">Hier steht der zweite Text</p>
            </div>
        </div>
      </div>

      <!-- Rechte Pfeil-Schaltfläche -->
      <div class="arrow-container">
        <div class="arrow arrow-right" @click="known">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="content-below-flashcard">
      <div class="flashcard-counter">
        <p class="counter">Hier sollte das stehen: (2)/(35)</p>
      </div>
      <!-- Konfigurations-Button -->
      <div class="edit-button-container">
        <button class="baseButtonLayout" @click="configureContentOfFlashcard">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/styles/learningMode.css";
</style>