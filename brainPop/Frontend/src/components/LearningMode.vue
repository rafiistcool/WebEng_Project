<script setup lang="ts">
import { ref } from 'vue';
import {useCardStore} from "@/script/store.js";
import router from "@/router.js";

const flipped = ref(false);

const userContentFront = ref("Vorderseite");
const userContentBack = ref("Rückseite");
const cardStore = useCardStore();
const currentIndex = ref(0);

const flip = () => {
  flipped.value = !flipped.value;
}

const updateContentOfFlashcard = () => {
  if(cardStore.cards.length > 0) {
    const currentCard = cardStore.cards[currentIndex.value];
    userContentFront.value = currentCard.question;
    userContentBack.value = currentCard.answer;
  }
}

const notKnown = () => {
  if (currentIndex.value <= 0) {
    currentIndex.value = cardStore.cards.length - 1;
  }else {
    currentIndex.value = (currentIndex.value - 1) % cardStore.cards.length;
  }
  flipped.value = false;
  updateContentOfFlashcard();
  console.log('Not Known');
}
const known = () => {
  currentIndex.value = (currentIndex.value + 1) % cardStore.cards.length;
  flipped.value = false;
  updateContentOfFlashcard();
  console.log('Known');
}

const endLearningMode = () => {
  router.push("/cardcreation");
}
updateContentOfFlashcard();
</script>

<template>
  <div class="learning-mode-window">

    <div class="content-above-flashcard">
      <div class="end-button"></div>

      <div class="end-button-container" >
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="end-button" @click="endLearningMode">
          <circle cx="30" cy="30" r="28" fill="#004445" stroke="#004445" stroke-width="4"/>
          <line x1="18" y1="18" x2="42" y2="42" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
          <line x1="18" y1="42" x2="42" y2="18" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
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
        <div class="flashcard" @click="flip" :class="{flipped: flipped}">
            <div class="flashcardFront">
              <p class="userContent" >{{ userContentFront }}</p>
            </div>
            <div class="flashcardBack">
              <p class="userContent">{{ userContentBack }}</p>
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
        <p class="counter"> ({{ currentIndex+1 }})/({{ cardStore.cards.length }})</p>
      </div>
      <div class="edit-button-container">
        <button class="baseButtonLayout" @click="updateContentOfFlashcard">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/learningMode.css";
</style>