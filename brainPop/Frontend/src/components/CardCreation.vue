<script setup lang="ts">
import cardHandler from "@/script/cardHandler.js";

</script>

<template>
<div class="card-creation">
  <h1>Card Creation</h1>
  <div class="content-wrapper">
    <div class="card-creation-buttons">
      <button class="card-creation-button" @click="cardHandler.startLearningmode">Starten</button>
      <button class="card-creation-button" @click="cardHandler.addCard">Hinzufügen</button>
      <button class="card-creation-button" @click="cardHandler.edit">Bearbeiten</button>
    </div>
    <div class="card-contents">
      <p>Test Inhalt</p>
    </div>
  </div>

  <div v-if="cardHandler.showPopup" class="card-creation-popup">
    <div class="popup-content">
      <h2>Karte erstellen</h2>
      <form @submit.prevent="cardHandler.saveCard">
        <div class="form-group" >
          <label for="question">Frage:</label>
          <input type="text" id="question" v-model="cardHandler.question"/>
        </div>
        <div class="form-group">
          <label for="answer">Antwort:</label>
          <input type="text" id="answer" v-model="cardHandler.answer"/>
        </div>
        <div class="form-group">
          <label for="category">Kategorie:</label>
          <input type="text" id="category" v-model="cardHandler.category"/>
        </div>
        <button type="submit">Speichern</button>
      </form>
      <button class="close-button" @click="cardHandler.closePopup">Schließen</button>
    </div>
  </div>

</div>
</template>

<style scoped>
@import "../assets/styles/cardCreation.css";
</style>