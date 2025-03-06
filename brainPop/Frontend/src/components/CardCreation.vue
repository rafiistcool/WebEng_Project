<script setup lang="ts">

import {ref} from "vue";

class Card {
  id: number;
  question: string;
  answer: string;
  category: string;

  constructor(id: number, question: string, answer: string, category: string) {
    this.id = id;
    this.question = question;
    this.answer = answer;
    this.category = category;
  }
}

const cards: Card[] = [];
const showPopup = ref(false);

const question = ref("");
const answer = ref("");
const category = ref("");

const startLearningmode = () => {

}

const addCard = () => {
  showPopup.value = true;
}
const saveCard = () => {
  cards.push(new Card(0, question.value, answer.value, category.value));
  console.log(cards);
}
const edit = () => {

}
const closePopup = () => {
  showPopup.value = false;
}
</script>

<template>
<div class="card-creation">
  <h1>Card Creation</h1>
  <div class="content-wrapper">
    <div class="card-creation-buttons">
      <button class="card-creation-button" @click="startLearningmode">Starten</button>
      <button class="card-creation-button" @click="addCard">Hinzufügen</button>
      <button class="card-creation-button" @click="edit">Bearbeiten</button>
    </div>
    <div class="card-contents">
      <p>Test Inhalt</p>
    </div>
  </div>

  <div v-if="showPopup" class="card-creation-popup">
    <div class="popup-content">
      <h2>Karte erstellen</h2>
      <form @submit.prevent="saveCard">
        <div class="form-group" >
          <label for="question">Frage:</label>
          <input type="text" id="question" v-model="question"/>
        </div>
        <div class="form-group">
          <label for="answer">Antwort:</label>
          <input type="text" id="answer" v-model="answer"/>
        </div>
        <div class="form-group">
          <label for="category">Kategorie:</label>
          <input type="text" id="category" v-model="category"/>
        </div>
        <button type="submit">Speichern</button>
      </form>
      <button class="close-button" @click="closePopup">Schließen</button>
    </div>
  </div>

</div>
</template>

<style scoped>
@import "../assets/styles/cardCreation.css";
</style>