<script setup lang="ts">
import { ref } from 'vue';
import { useCardStore } from '../script/store.js';
import { useRouter } from "vue-router";

const cardStore = useCardStore();
const router = useRouter();

const showPopup = ref(false);
const question = ref("");
const answer = ref("");
const category = ref("");

const addCard = () => {
  showPopup.value = true;
}

const saveCard = () => {
  cardStore.addCard(question.value, answer.value, category.value);
}

const closePopup = () => {
  showPopup.value = false;
}

const startLearningmode = () => {
  router.push("/card");
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