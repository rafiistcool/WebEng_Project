<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useCardStore, useSetStore} from "@/script/store.js";
import router from "@/router.js";

const flipped = ref(false);

const userContentFront = ref("Vorderseite");
const userContentBack = ref("Rückseite");
const cardStore = useCardStore();
const setStore = useSetStore();
const currentIndex = ref(0);
const currenCardId = ref(0);

interface Cards {
  id: number;
  set_id: number;
  question: string;
  answer: string;
  category?: string;
  weight?: number;
}

const cards = ref<Cards[]>([]);

onMounted(async () => {
  cards.value = await getCards();
})

const flip = () => {
  flipped.value = !flipped.value;
}

const notKnown = () => {
  let weight = getWeightOfCard(currenCardId.value);
  weight = Math.max(0, weight - 2);
  updateWeightOfCard(currenCardId.value ,weight);
  showNextCard();
}
const hard = () => {
  let weight = getWeightOfCard(currenCardId.value);
  weight = Math.max(0, weight - 1);
  updateWeightOfCard(currenCardId.value ,weight);
  showNextCard();
}
const almostKnown = () => {
  showNextCard();
}
const known = () => {
  let weight = getWeightOfCard(currenCardId.value);
  weight = weight + 1;
  updateWeightOfCard(currenCardId.value,weight);

}

const updateWeightOfCard =async (cardID: number, newWeight: number) => {
  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/cards/${cardID}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        weight: newWeight
      })
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
  }catch (error){
    console.error("Error updating card in backend:", error);
  }
}
const getWeightOfCard =(cardID: number) : number => {
  const card = cards.value.find(card => card.id === cardID);
  return card?.weight || 10;
}

const getCards =async () : Promise<Cards[]> => {
  try {
    if (!cardStore.currentSetId) {
      console.error("No set selected");
      return [];
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sets/${setStore.currentSet?.id}/cards`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Cards[];

  }catch (error){
    console.error("Error loading cards from backend:", error);
    return [];
  }
}

const showNextCard = () => {

}

const endLearningMode = () => {
  router.push("/cardcreation");
}
getCards();
</script>

<template>
  <div class="learning-mode-window">

    <div class="content-above-flashcard">
      <div class="end-button"></div>

      <div class="end-button-container">
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="end-button"
             @click="endLearningMode">
          <circle cx="30" cy="30" r="28" fill="#004445" stroke="#004445" stroke-width="4"/>
          <line x1="18" y1="18" x2="42" y2="42" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
          <line x1="18" y1="42" x2="42" y2="18" stroke="#2C7873" stroke-width="4" stroke-linecap="round"/>
        </svg>
      </div>
    </div>


    <div class="learning-mode-window-content">
      <div class="arrow-container">
      </div>
      <div class="flashcard-container">
        <div class="flashcard" @click="flip" :class="{flipped: flipped}">
          <div class="flashcardFront">
            <p class="userContent">{{ userContentFront }}</p>
          </div>
          <div class="flashcardBack">
            <p class="userContent">{{ userContentBack }}</p>
          </div>
        </div>
      </div>
      <div class="arrow-container">
      </div>
    </div>
    <div class="content-below-flashcard">
      <div class="flashcard-counter">
        <p class="counter"> ({{ currentIndex + 1 }})/({{ cards.length }})</p>
      </div>
      <div class="button-container">
        <button class="baseButtonLayout" @click="notKnown" style="background-color: red">
          Nicht gewusst
        </button>
        <button class="baseButtonLayout" @click="hard" style="background-color: orange">
          Wiederholen/Schwer
        </button>
        <button class="baseButtonLayout" @click="almostKnown" style="background-color: cornflowerblue">
          Unsicher/Fast gewusst
        </button>
        <button class="baseButtonLayout" @click="known" style="background-color: lawngreen">
          Gewusst
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/learningMode.css";
</style>
