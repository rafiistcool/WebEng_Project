<script setup lang="ts">

import { ref, computed, nextTick, onMounted } from 'vue';
import { useCardStore } from '../script/store.ts';
import { useRouter } from "vue-router";

const cardStore = useCardStore();
const router = useRouter();

const showPopup = ref(false);
const question = ref("");
const answer = ref("");
const category = ref("");

// Load cards from localStorage
const loadCards = () => {
  try {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      cardStore.cards = JSON.parse(savedCards);
    }
  } catch (error) {
    console.error("Error loading cards from localStorage:", error);
  }
};

// Save all cards to localStorage
const saveCardsToLocalStorage = () => {
  try {
    localStorage.setItem('cards', JSON.stringify(cardStore.cards));
  } catch (error) {
    console.error("Error saving cards to localStorage:", error);
  }
};

// Save a new card to localStorage
const saveCardToBackend = (question: string, answer: string, category: string) => {
  try {
    // Generate a new ID for the card
    const newId = Date.now();

    // Return the new ID so it can be used by the caller
    return newId;
  } catch (error) {
    console.error("Error saving card to localStorage:", error);
    return null;
  }
};

// Update a card in localStorage
const updateCardInBackend = (id: number, question: string, answer: string, category: string) => {
  try {
    // The actual update happens in the saveCard function
    // We just need to save all cards to localStorage after the update
    saveCardsToLocalStorage();
    return true;
  } catch (error) {
    console.error("Error updating card in localStorage:", error);
    return false;
  }
};

// Delete a card from localStorage
const deleteCardFromBackend = (id: number) => {
  try {
    // The actual deletion happens in the deleteCard function
    // We just need to save all cards to localStorage after the deletion
    saveCardsToLocalStorage();
    return true;
  } catch (error) {
    console.error("Error deleting card from localStorage:", error);
    return false;
  }
};

// Load cards when component is mounted
onMounted(() => {
  loadCards();
});


const editMode = ref(false);
const selectedCardIndex = ref<number | null>(null);

// Menü-Status
const activeMenuIndex = ref<number | null>(null);
const menuPosition = ref({top: 0, left: 0});

const selectedCategoryFilter = ref<string | null>(null);

//Filter
const filteredCards = computed(() => {
  if (!selectedCategoryFilter.value) return cardStore.cards;
  return cardStore.cards.filter(card => card.category === selectedCategoryFilter.value);
});

const uniqueCategories = computed(() => {
  const categories = cardStore.cards
      .map(card => card.category.trim())
      .filter(c => c !== "");
  return [...new Set(categories)];
});

const clearFilter = () => {
  selectedCategoryFilter.value = null;
};


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
      setId: existingCard.setId
      category: category.value.trim(),
    };

    // Save to localStorage
    updateCardInBackend(
      existingCard.id,
      question.value,
      answer.value,
      category.value
    );
  } else {
    cardStore.addCard(question.value, answer.value, category.value.trim());
    // Generate new ID
    const newCardId = saveCardToBackend(
      question.value,
      answer.value,
      category.value
    );

    if (newCardId) {
      // Add card to the store with the new ID
      cardStore.addCard(question.value, answer.value, category.value);
      // Update the ID of the last added card
      const lastIndex = cardStore.cards.length - 1;
      if (lastIndex >= 0) {
        cardStore.cards[lastIndex].id = newCardId;
      }

      // Save to localStorage
      saveCardsToLocalStorage();
    }
  }

  nextTick(() => {
    console.log("Aktualisierte Kategorien:", uniqueCategories.value);
  });

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
  const filteredCards = cardStore.getCardsForCurrentSet();
  const card = filteredCards[index];

  // Find the actual index in the global cards array
  const globalIndex = cardStore.cards.findIndex(c => c.id === card.id);

  const card = cardStore.cards[index];
  question.value = card.question;
  answer.value = card.answer;
  category.value = card.category;

  selectedCardIndex.value = globalIndex;
  selectedCardIndex.value = index;
  editMode.value = true;
  showPopup.value = true;
  activeMenuIndex.value = null;
};

const deleteCard = (index: number) => {
  const filteredCards = cardStore.getCardsForCurrentSet();
  const card = filteredCards[index];

  // Find the actual index in the global cards array
  const globalIndex = cardStore.cards.findIndex(c => c.id === card.id);

  // Delete card from the store
  cardStore.cards.splice(globalIndex, 1);

  // Save changes to localStorage
  deleteCardFromBackend(card.id);

  activeMenuIndex.value = null;
};
</script>

<template>
  <div class=" card-creation">

    <button class="button card-start-button" @click="startLearningmode">Starten</button>
    <button class="button card-creation-button" @click="addCard">Hinzufügen</button>


    <!-- FILTERBUTTONS UNTER "HINZUFÜGEN" -->
    <div class="category-filters">
      <button
          v-for="category in uniqueCategories"
          :key="category"
          @click="selectedCategoryFilter = category"
          :class="{ active: selectedCategoryFilter === category }"
          class="button filter-button"
      >
        {{ category }}
      </button>
      <button
          v-if="selectedCategoryFilter"
          @click="clearFilter"
          class="button filter-button clear"
      >
        Alle anzeigen
      </button>
    </div>

    <!-- KARTENLISTE DARUNTER -->
    <div class="card-contents">
      <div v-for="(card, index) in cardStore.getCardsForCurrentSet()" :key="index" class="card-item">
      <div v-for="(card, index) in filteredCards" :key="card.id" class="card-item">

        <div class="card-header">
          <h3>{{ card.question }}</h3>
          <button class="menu-button" @click="toggleMenu($event, index)">&#8226;&#8226;&#8226;</button>
        </div>
        <p>{{ card.answer }}</p>
        <small>{{ card.category }}</small>
      </div>
    </div>

    <!-- Menü Popup -->
    <div
        v-if="activeMenuIndex !== null"
        class="menu-popup"
        :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }"
    >

      <button @click="editCard(activeMenuIndex)">Bearbeiten</button>
      <button @click="deleteCard(activeMenuIndex)">Löschen</button>
    </div>

    <!-- Popup zum Erstellen/Bearbeiten -->
    <div v-if="showPopup" class="card-creation-popup">
      <div class="popup-content">
        <h2 class="popup-title">{{ editMode ? 'Karte bearbeiten' : 'Karte erstellen' }}</h2>
        <form @submit.prevent="saveCard">
          <div class="form-wrapper">
            <div class="form-group">
              <label class="popup-label" for="question">Frage: </label>
              <input class="popup-text-input" type="text" id="question" v-model="question"/>
            </div>
            <div class="form-group">
              <label class="popup-label" for="answer">Antwort: </label>
              <input class="popup-text-input" type="text" id="answer" v-model="answer"/>
            </div>
            <div class="form-group">
              <label class="popup-label" for="category">Kategorie: </label>
              <input class="popup-text-input" type="text" id="category" v-model="category"/>
            </div>
            <div class="popup-buttons">
              <button class="button close-button" @click="closePopup">Schließen</button>
              <button class="button save-button" type="submit">Speichern</button>
            </div>
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
