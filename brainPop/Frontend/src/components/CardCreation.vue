<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCardStore } from '../script/store.js';
import { useRouter } from "vue-router";

const cardStore = useCardStore();
const router = useRouter();

const showPopup = ref(false);
const question = ref("");
const answer = ref("");
const category = ref("");


const editMode = ref(false);
const selectedCardIndex = ref<number | null>(null);

// Menü-Status
const activeMenuIndex = ref<number | null>(null);
const menuPosition = ref({ top: 0, left: 0 });

const addCard = () => {
  question.value = "";
  answer.value = "";
  category.value = "";
  editMode.value = false;
  showPopup.value = true;
};

const saveCard = () => {
  if (editMode.value && selectedCardIndex.value !== null) {
    const existingCard = cardStore.cards[selectedCardIndex.value];

    cardStore.cards[selectedCardIndex.value] = {
      id: existingCard.id,
      question: question.value,
      answer: answer.value,
      category: category.value,
    };
  } else {

    cardStore.addCard(question.value, answer.value, category.value);
  }

  closePopup();
};



const closePopup = () => {
  showPopup.value = false;
  selectedCardIndex.value = null;
  editMode.value = false;
};

const startLearningmode = () => {
  router.push("/card");
};

const toggleMenu = (event: MouseEvent, index: number) => {
  if (activeMenuIndex.value === index) {
    activeMenuIndex.value = null;
  } else {
    activeMenuIndex.value = index;
    menuPosition.value = {
      top: event.clientY + 5,
      left: event.clientX - 60
    };
  }
};

const editCard = (index: number) => {
  const card = cardStore.cards[index];

  question.value = card.question;
  answer.value = card.answer;
  category.value = card.category;

  selectedCardIndex.value = index;
  editMode.value = true;
  showPopup.value = true;
  activeMenuIndex.value = null;
};

const deleteCard = (index: number) => {
  cardStore.cards.splice(index, 1);
  activeMenuIndex.value = null;
};
</script>

<template>
  <div class="card-creation">
    <h1 class="title">Card Creation</h1>
    <button class="button card-start-button" @click="startLearningmode">Starten</button>
    <button class="button card-creation-button" @click="addCard">Hinzufügen</button>

      <div class="card-contents">
        <div v-for="(card, index) in cardStore.cards" :key="index" class="card-item">
          <div class="card-header">
            <h3>{{ card.question }}</h3>
            <button class="menu-button" @click="toggleMenu($event, index)">&#8226;&#8226;&#8226;</button>
          </div>
          <p>{{ card.answer }}</p>
          <small>{{ card.category }}</small>
        </div>
      </div>

    <!-- Menü Popup -->
    <div v-if="activeMenuIndex !== null" class="menu-popup" :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }">
      <button @click="editCard(activeMenuIndex)">Bearbeiten</button>
      <button @click="deleteCard(activeMenuIndex)">Löschen</button>
    </div>

    <!-- Popup zum Erstellen/Bearbeiten einer Karte -->
    <div v-if="showPopup" class="card-creation-popup">
      <div class="popup-content">
        <h2 class="popup-title">{{ editMode ? 'Karte bearbeiten' : 'Karte erstellen' }}</h2>
        <form @submit.prevent="saveCard">
          <div class="form-group">
            <label for="question">Frage: </label>
            <input type="text" id="question" v-model="question" />
          </div>
          <div class="form-group">
            <label for="answer">Antwort: </label>
            <input type="text" id="answer" v-model="answer" />
          </div>
          <div class="form-group">
            <label for="category">Kategorie: </label>
            <input type="text" id="category" v-model="category" />
          </div>
          <div class="popup-buttons">
            <button class="button close-button" @click="closePopup">Schließen</button>
            <button class="button save-button" type="submit">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import "../assets/styles/masterStyle.css";
@import "../assets/styles/cardCreation.css";


</style>
