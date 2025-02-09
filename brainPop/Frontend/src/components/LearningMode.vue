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

    <div class="end-button-container">
      <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="end-button">
        <circle cx="30" cy="30" r="28" fill="#004445" stroke="#004445" stroke-width="4"/>
        <line x1="18" y1="18" x2="42" y2="42" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
        <line x1="18" y1="42" x2="42" y2="18" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="learn-mode-heading">
      <h1 id="learnMode-h1">Learn-Mode</h1>
    </div>
    <div class="learning-mode-window-content">
      <div class="arrow-container">
        <div class="arrow arrow-left" @click="notKnown">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M15 20l-8-8 8-8" stroke-width="3"/>
          </svg>
        </div>
      </div>
      <div class="flashcard-container">
        <div class="flashcard" @click="isFlipped"  :class="{flipped: flipped}">
            <div class="flashcardFront">
              <p class="userContent" >Hier sollte später Text stehen</p>
            </div>
            <div class="flashcardBack">
              <p class="userContent">Hier steht der zweite Text</p>
            </div>
        </div>
      </div>
      <div class="arrow-container">
        <div class="arrow arrow-right" @click="known">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M9 20l8-8-8-8" stroke-width="3"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="content-below-flashcard">
      <div class="flashcard-counter">
        <p class="counter">Hier sollte das stehen: (2)/(35)</p>
      </div>
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