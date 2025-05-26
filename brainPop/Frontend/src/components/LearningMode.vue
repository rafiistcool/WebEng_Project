<script setup lang="ts">
import { ref, computed } from 'vue';
import {useCardStore} from "@/script/store.js";
import router from "@/router.js";

const flipped = ref(false);

const userContentFront = ref("Vorderseite");
const userContentBack = ref("Rückseite");
const cardStore = useCardStore();
const currentIndex = ref(0);

// Get only cards from the current set
const filteredCards = computed(() => cardStore.getCardsForCurrentSet());

const flip = () => {
  flipped.value = !flipped.value;
}

const updateContentOfFlashcard = () => {
  if(filteredCards.value.length > 0) {
    // Make sure currentIndex is within bounds
    if (currentIndex.value >= filteredCards.value.length) {
      currentIndex.value = 0;
    }
    const currentCard = filteredCards.value[currentIndex.value];
    userContentFront.value = currentCard.question;
    userContentBack.value = currentCard.answer;
  } else {
    // No cards in the current set
    userContentFront.value = "No cards in this set";
    userContentBack.value = "Add cards to this set in the card creation page";
  }
}

const notKnown = () => {
  // Only navigate if there are cards
  if (filteredCards.value.length > 0) {
    if (currentIndex.value <= 0) {
      currentIndex.value = filteredCards.value.length - 1;
    } else {
      currentIndex.value = (currentIndex.value - 1) % filteredCards.value.length;
    }
    flipped.value = false;
    updateContentOfFlashcard();
    console.log('Not Known');
  }
}
const known = () => {
  // Only navigate if there are cards
  if (filteredCards.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % filteredCards.value.length;
    flipped.value = false;
    updateContentOfFlashcard();
    console.log('Known');
  }
}

const endLearningMode = () => {
  router.push("/cardcreation");
}
updateContentOfFlashcard();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4">

    <div class="flex w-full">
      <div class="flex-1"></div>

      <div class="flex justify-end items-center w-full p-4 flex-1">
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer" @click="endLearningMode">
          <circle cx="30" cy="30" r="28" fill="#004445" stroke="#004445" stroke-width="4"/>
          <line x1="18" y1="18" x2="42" y2="42" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
          <line x1="18" y1="42" x2="42" y2="18" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
    </div>


    <div class="flex flex-row justify-center gap-6 items-center">
      <div class="flex items-center justify-center">
        <div class="bg-background-2 w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-md" @click="notKnown">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M15 20l-8-8 8-8" stroke-width="3"/>
          </svg>
        </div>
      </div>
      <div class="flex justify-center items-center [perspective:1000px]">
        <div class="w-[50vw] h-[40vh] bg-background-2 rounded-2xl shadow-xl flex justify-center items-stretch p-2 relative transition-transform duration-500 [transform-style:preserve-3d]" @click="flip" :class="{ 'rotate-y-180': flipped }">
            <div class="absolute inset-0 flex items-center justify-center bg-secondary [backface-visibility:hidden]">
              <p class="text-background-1 text-3xl font-bold">{{ userContentFront }}</p>
            </div>
            <div class="absolute inset-0 flex items-center justify-center bg-secondary [backface-visibility:hidden] rotate-y-180">
              <p class="text-background-1 text-3xl font-bold">{{ userContentBack }}</p>
            </div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <div class="bg-background-2 w-[70px] h-[70px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 hover:shadow-md" @click="known">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M9 20l8-8-8-8" stroke-width="3"/>
          </svg>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center">
      <div class="flashcard-counter">
        <p class="text-primary text-lg"> ({{ currentIndex+1 }})/({{ filteredCards.length }})</p>
      </div>
      <div class="edit-button-container">
        <button class="bg-secondary border-background-1 rounded-lg text-lg px-8 py-1 shadow-md hover:shadow-lg transform hover:scale-110" @click="updateContentOfFlashcard">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>


