<script setup lang="ts">

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

const startLearningmode = () => {

}

const addCard = () => {

}
const edit = () => {

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

  <div class="card-creation-popup" >

  </div>
</div>
</template>

<style scoped>
@import "../assets/styles/cardCreation.css";
</style>