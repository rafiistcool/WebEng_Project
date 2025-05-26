<script setup lang="ts">
import {ref, watch, onMounted, onUnmounted, computed} from 'vue';
import {useCardStore} from '../script/store.js';
import {useRouter} from "vue-router";

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
  document.body.classList.add('left-aligned');
});

onUnmounted(() => {
  document.body.classList.remove('left-aligned');
});
const handleClickOutside = () => {
}

const editMode = ref(false);
const selectedCardIndex = ref<number | null>(null);

// Menü-Status
const activeMenuIndex = ref<number | null>(null);
const menuPosition = ref({top: 0, left: 0});

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

    // Update card in the store
    cardStore.cards[selectedCardIndex.value] = {
      id: existingCard.id,
      question: question.value,
      answer: answer.value,
      category: category.value,
      setId: existingCard.setId
    };

    // Save to localStorage
    updateCardInBackend(
        existingCard.id,
        question.value,
        answer.value,
        category.value
    );
  } else {
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

  question.value = card.question;
  answer.value = card.answer;
  category.value = card.category;

  selectedCardIndex.value = globalIndex;
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
  <div class="flex w-full">
    <div class="flex-1 mt-12 ml-2 flex flex-col gap-5">
      <div class="flex flex-col gap-5">
        <button class="button" @click="startLearningmode">Starten</button>
        <button class="button" @click="addCard">Hinzufügen</button>

        <div class="flex gap-2">
          <select
              v-model="selectedCategory"
              class="px-[45px] text-sm border-2 border-secondary rounded-lg bg-background-2 text-text cursor-pointer outline-none min-w-[200px] h-10 focus:border-primary focus:shadow-[0_0_5px_var(--primary-color)]"
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

      <div class="flex flex-wrap flex-row gap-5 justify-start ml-12 mt-12">
        <div v-for="(card, index) in filteredCards" :key="index" class="relative rounded-lg p-2 bg-secondary min-h-[140px] min-w-[170px]">
          <div class="absolute top-0 right-0">
            <button class="bg-none border-none text-xl cursor-pointer p-1" @click="toggleMenu($event, index)">&#8226;&#8226;&#8226;</button>
          </div>
          <h3>{{ card.question }}</h3>
          <p>{{ card.answer }}</p>
          <small>{{ card.category }}</small>
        </div>
      </div>
    </div>


    <!-- Menü Popup -->
    <div v-if="activeMenuIndex !== null" class="fixed bg-text border border-gray-300 shadow-md p-2 flex flex-col rounded z-50"
         :style="{ top: menuPosition.top + 'px', left: menuPosition.left + 'px' }">
      <button @click="editCard(activeMenuIndex)">Bearbeiten</button>
      <button @click="deleteCard(activeMenuIndex)">Löschen</button>
    </div>

    <!-- Popup zum Erstellen/Bearbeiten einer Karte -->
    <div v-if="showPopup" class="fixed inset-0 bg-blackBackground flex justify-center items-center">
      <div class="bg-gradient-to-br from-background-2 to-secondary p-5 rounded text-center w-[420px] h-[320px] z-10 flex justify-center">
        <h2 class="text-2xl mb-4">{{ editMode ? 'Karte bearbeiten' : 'Karte erstellen' }}</h2>
        <form @submit.prevent="saveCard" class="flex flex-col gap-5 justify-center items-center">
          <div class="flex flex-col gap-2">
            <label class="text-lg" for="question">Frage: </label>
            <input class="px-3 py-1 border rounded" type="text" id="question" v-model="question" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-lg" for="answer">Antwort: </label>
            <input class="px-3 py-1 border rounded" type="text" id="answer" v-model="answer" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-lg" for="category">Kategorie: </label>
            <input class="px-3 py-1 border rounded" type="text" id="category" v-model="category" />
          </div>
          <div class="flex justify-center gap-4 w-full mt-4">
            <button class="button px-4" @click="closePopup">Schließen</button>
            <button class="button px-4" type="submit">Speichern</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<style scoped>
</style>