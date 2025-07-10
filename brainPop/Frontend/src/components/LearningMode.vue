<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
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
const cardQueue = ref<Cards[]>([]);
const currentCard = ref<Cards | null>(null);
const completedCards = ref<Set<number>>(new Set());
const cardsProcessed = ref(0);

onMounted(async () => {
  cards.value = await getCards();
  if (cards.value.length > 0) {
    generateCardQueue();
    currentIndex.value = 0;
    cardsProcessed.value = 0;
    completedCards.value.clear();
    showNextCard();
  }
});

const generateCardQueue = () => {
  if (cards.value.length === 0) return;

  // Nur Karten einschließen, die noch nicht gemeistert sind
  const uncompletedCards = cards.value.filter(card => !completedCards.value.has(card.id));

  if (uncompletedCards.length === 0) {
    console.log("All cards completed!");
    cardQueue.value = [];
    return;
  }

  // Nach Gewicht sortieren
  const sortedCards = [...uncompletedCards].sort((a, b) => {
    const weightA = a.weight || 10;
    const weightB = b.weight || 10;
    return weightA - weightB;
  });

  const queue: Cards[] = [];

  sortedCards.forEach(card => {
    const weight = card.weight || 10;

    let frequency = 1;
    if (weight <= 3) {
      frequency = 4;
    } else if (weight <= 6) {
      frequency = 3;
    } else if (weight <= 9) {
      frequency = 2;
    } else {
      frequency = 1;
    }

    // Karten mit höherem Gewicht seltener zeigen
    if (weight > 15) {
      frequency = Math.max(1, Math.floor(frequency / 2));
    }

    for (let i = 0; i < frequency; i++) {
      queue.push(card);
    }
  });

  cardQueue.value = shuffleArray(queue);
  console.log(`Generated queue with ${cardQueue.value.length} cards from ${uncompletedCards.length} uncompleted cards`);
};


const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};


const flip = () => {
  flipped.value = !flipped.value;
}

const notKnown = async () => {
  let weight = getWeightOfCard(currenCardId.value);
  weight = Math.max(1, weight - 2);

  const success = await updateWeightOfCard(currenCardId.value, weight);
  if (success) {
    trackProgress(currenCardId.value, 'notKnown');
    showNextCard();
  }
};

const hard = async () => {
  let weight = getWeightOfCard(currenCardId.value);
  weight = Math.max(1, weight - 1);

  const success = await updateWeightOfCard(currenCardId.value, weight);
  if (success) {
    trackProgress(currenCardId.value, 'hard');
    showNextCard();
  }
};

const almostKnown = async () => {
  let weight = getWeightOfCard(currenCardId.value);
  weight = weight + 2;

  const success = await updateWeightOfCard(currenCardId.value, weight);
  if (success) {
    trackProgress(currenCardId.value, 'almostKnown');
    showNextCard();
  }
};

const known = async () => {
  let weight = getWeightOfCard(currenCardId.value);
  weight = weight + 3;

  const success = await updateWeightOfCard(currenCardId.value, weight);
  if (success) {
    trackProgress(currenCardId.value, 'known');
    showNextCard();
  }
};


const updateWeightOfCard = async (cardID: number, newWeight: number) => {
  try {
    const card = cards.value.find(c => c.id === cardID);
    if (!card) {
      console.error("Card not found");
      return false;
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/cards/${cardID}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        question: card.question,
        answer: card.answer,
        category: card.category,
        weight: newWeight
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`HTTP error! status: ${response.status}`, errorData);
      return false;
    }

    // Lokale Karte aktualisieren
    card.weight = newWeight;
    console.log(`Card ${cardID} weight updated to ${newWeight}`);

    return true;

  } catch (error) {
    console.error("Error updating card in backend:", error);
    return false;
  }
}


const trackProgress = (cardId: number, difficulty: 'notKnown' | 'hard' | 'almostKnown' | 'known') => {
  const card = cards.value.find(c => c.id === cardId);
  if (!card) return;

  // Karte als bearbeitet markieren
  cardsProcessed.value++;

  // Aktuelles Gewicht nach der Aktualisierung abrufen
  const currentWeight = getWeightOfCard(cardId);

  // Karte als gemeistert markieren basierend auf Gewicht UND Schwierigkeit
  if (difficulty === 'known' && currentWeight >= 15) {
    completedCards.value.add(cardId);
    console.log(`Card ${cardId} marked as COMPLETED (weight: ${currentWeight})`);
  } else if (difficulty === 'almostKnown' && currentWeight >= 18) {
    completedCards.value.add(cardId);
    console.log(`Card ${cardId} marked as COMPLETED (weight: ${currentWeight})`);
  }

  console.log(`Card ${cardId} marked as ${difficulty}. Processed: ${cardsProcessed.value}, Completed: ${completedCards.value.size}/${cards.value.length}`);
};


const progressPercentage = computed(() => {
  if (cards.value.length === 0) return 0;
  return Math.round((completedCards.value.size / cards.value.length) * 100);
});


const getSessionStats = computed(() => {
  const totalCards = cards.value.length;
  const completed = completedCards.value.size;
  const remaining = totalCards - completed;

  return {
    total: totalCards,
    completed,
    remaining,
    progress: progressPercentage.value
  };
});



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
  // Wenn Queue leer ist, neue generieren
  if (cardQueue.value.length === 0) {
    generateCardQueue();
  }

  // Nächste Karte aus der Queue nehmen
  if (cardQueue.value.length > 0) {
    currentCard.value = cardQueue.value.shift()!;
    currenCardId.value = currentCard.value.id;

    // Karteninhalt aktualisieren
    userContentFront.value = currentCard.value.question;
    userContentBack.value = currentCard.value.answer;

    // Karte zurücksetzen (nicht geflippt)
    flipped.value = false;

    // Index aktualisieren
    const totalCards = cards.value.length;
    const processedCards = completedCards.value.size;
    currentIndex.value = Math.min(processedCards, totalCards - 1);

    console.log(`Showing card: ${currentCard.value.question} (Weight: ${currentCard.value.weight || 10})`);
  } else {
    // Alle Karten abgearbeitet
    endLearningSession();
  }
};

const endLearningSession = () => {
  console.log('Learning session completed!');
  console.log(`Final stats: ${completedCards.value.size}/${cards.value.length} cards mastered`);

  alert(`Lernsession beendet!\n${completedCards.value.size} von ${cards.value.length} Karten gemeistert.`);

  router.push("/cardcreation");
};


</script>

<template>
  <div class="learning-mode-window">

    <div class="content-above-flashcard">
      <div class="end-button"></div>

      <div class="end-button-container">
        <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="end-button"
             @click="endLearningSession">
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
        <p class="counter">{{ getSessionStats.completed }}/{{ getSessionStats.total }} ({{ progressPercentage }}%)</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
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
