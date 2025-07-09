<script setup lang="ts">
import {ref, watch, onMounted, onUnmounted, computed} from 'vue';
import {useCardStore, useSetStore} from '../script/store';
import {useRouter} from "vue-router";

const cardStore = useCardStore();
const setStore = useSetStore();
const router = useRouter();

const showPopup = ref(false);
const question = ref("");
const answer = ref("");
const category = ref("");

interface Card {
  id: number;
  question: string;
  answer: string;
  category: string;
  set_id: number;
}

// Load cards from backend
const loadCards = async () => {
  try {
    // Get the current set from the set store
    const currentSet = setStore.currentSet;
    if (!currentSet) {
      console.error("No set selected");
      return;
    }

    const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/cards?setId=${currentSet.id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cards = await response.json() as Card[];
    cardStore.cards = cards.map(card => ({
      id: card.id,
      question: card.question,
      answer: card.answer,
      category: card.category || '',
      setId: card.set_id
    }));

    // Ensure the cardStore's currentSetId is set correctly
    cardStore.setCurrentSet(currentSet.id);
  } catch (error) {
    console.error("Error loading cards from backend:", error);
  }
};

// Save a new card to backend
const saveCardToBackend = async (question: string, answer: string, category: string) => {
  try {
    // Get the current set from the set store
    const currentSet = setStore.currentSet;
    if (!currentSet) {
      console.error("No set selected");
      return null;
    }

    const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        setId: currentSet.id,
        question,
        answer,
        category
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newCard = await response.json();
    return newCard.id;
  } catch (error) {
    console.error("Error saving card to backend:", error);
    return null;
  }
};

// Update a card in backend
const updateCardInBackend = async (id: number, question: string, answer: string, category: string) => {
  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/cards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        answer,
        category
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating card in backend:", error);
    return false;
  }
};

// Delete a card from backend
const deleteCardFromBackend = async (id: number) => {
  try {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/cards/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Error deleting card from backend:", error);
    return false;
  }
};

// Load cards when component is mounted
onMounted(async () => {
  await loadCards();
  document.body.classList.add('left-aligned');
});

onUnmounted(() => {
  document.body.classList.remove('left-aligned');
  closeMenu(); // Cleanup listeners
});

const editMode = ref(false);
const selectedCardIndex = ref<number | null>(null);

// Menü-Status
const activeMenuIndex = ref<number | null>(null);
const menuPosition = ref({top: 0, left: 0});

const closeMenu = () => {
  activeMenuIndex.value = null;
  document.removeEventListener('click', closeMenu);
  document.removeEventListener('contextmenu', closeMenu);
};

const openContextMenu = (event: MouseEvent, index: number) => {
  if (activeMenuIndex.value !== null) {
    closeMenu();
  }

  activeMenuIndex.value = index;
  menuPosition.value = {
    top: event.clientY,
    left: event.clientX
  };

  setTimeout(() => {
    document.addEventListener('click', closeMenu);
    document.addEventListener('contextmenu', closeMenu);
  }, 0);
};

const addCard = () => {
  question.value = "";
  answer.value = "";
  category.value = "";
  editMode.value = false;
  showPopup.value = true;
};

const saveCard = async () => {
  if (editMode.value && selectedCardIndex.value !== null) {
    const existingCard = cardStore.cards[selectedCardIndex.value];

    // Update card in the backend
    const success = await updateCardInBackend(
        existingCard.id,
        question.value,
        answer.value,
        category.value
    );

    if (success) {
      // Update card in the store
      cardStore.cards[selectedCardIndex.value] = {
        id: existingCard.id,
        question: question.value,
        answer: answer.value,
        category: category.value,
        setId: existingCard.setId
      };
    } else {
      alert("Failed to update card. Please try again.");
    }
  } else {
    // Create new card in the backend
    const newCardId = await saveCardToBackend(
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
    } else {
      alert("Failed to create card. Please try again.");
    }
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

const editCard = (index: number) => {
  const filteredCards = cardStore.getCardsForCurrentSet();
  const card = filteredCards[index];

  // Find the actual index in the global cards array
  const globalIndex = cardStore.cards.findIndex(c => c.id === card.id);

  question.value = card.question;
  answer.value = card.answer;
  category.value = card.category;

  selectedCardIndex.value = globalIndex;
  editMode.value = true;
  showPopup.value = true;
  closeMenu();
};

const deleteCard = async (index: number) => {
  const filteredCards = cardStore.getCardsForCurrentSet();
  const card = filteredCards[index];

  // Find the actual index in the global cards array
  const globalIndex = cardStore.cards.findIndex(c => c.id === card.id);

  // Delete card from the backend
  const success = await deleteCardFromBackend(card.id);

  if (success) {
    // Delete card from the store
    cardStore.cards.splice(globalIndex, 1);
  } else {
    alert("Failed to delete card. Please try again.");
  }

  closeMenu();
};

const selectedCategory = ref<string>("");
// Update the uniqueCategories computed property
const uniqueCategories = computed(() => {
  const cards = cardStore.getCardsForCurrentSet();
  // Filter out empty categories and create a Set of unique non-empty categories
  const categories = new Set(
      cards
          .map(card => card.category)
          .filter(category => category && category.trim() !== '')
  );
  return Array.from(categories);
});

const filteredCards = computed(() => {
  const cards = cardStore.getCardsForCurrentSet();
  if (!selectedCategory.value) return cards;
  return cards.filter(card => card.category === selectedCategory.value);
});
</script>

<template>
  <div class=" card-creation">
    <div class="content-wrapper">
      <div class="content-buttons">
        <button class="button card-start-button" @click="startLearningmode">Starten</button>
        <button class="button card-creation-button" @click="addCard">Hinzufügen</button>

        <div class="category-filters">
          <select
              v-model="selectedCategory"
              class="category-dropdown"
          >
            <option value="">All Categories</option>
            <option
                v-for="category in uniqueCategories"
                :key="category"
                :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <div class="card-contents">
        <div v-for="(card, index) in filteredCards" :key="index" class="card-item"
             @contextmenu.prevent="openContextMenu($event, index)">
          <div class="card-header">
            <div class="card-header">
              <h3>{{ card.question }}</h3>
            </div>
            <p>{{ card.answer }}</p>
            <small>{{ card.category }}</small>
          </div>
        </div>
      </div>
    </div>


    <!-- Menü Popup -->
    <div v-if="activeMenuIndex !== null" class="menu-popup"
         :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }" @click.stop @contextmenu.stop>
      <button @click="editCard(activeMenuIndex)">Bearbeiten</button>
      <button @click="deleteCard(activeMenuIndex)">Löschen</button>
    </div>

    <!-- Popup zum Erstellen/Bearbeiten einer Karte -->
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

.category-dropdown {
  padding: 0 45px;
  font-size: 14px;
  border: 2px solid var(--secondary-color);
  border-radius: 10px;
  background-color: var(--background-color2);
  color: var(--text-color);
  cursor: pointer;
  outline: none;
  min-width: 200px;
  height: 40px;

}

.category-dropdown:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 5px var(--primary-color);
}

.category-dropdown option {
  background-color: var(--background-color2);
  color: var(--text-color);
  padding: 12px;
  font-size: 16px;
}
</style>