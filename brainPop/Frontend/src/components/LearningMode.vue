<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);
const imageUrl = ref("https://placehold.co/600x400");

const toggleVisible = () => {
  visible.value = !visible.value;
}

const configureContentOfFlashcard = () => {

}
</script>

<<template>
  <div class="learning-mode-window">
    <h1 id="learnMode-h1">Learn-Mode</h1>
    <div class="learning-mode-window-content">

      <!-- Left Arrow -->
      <div class="arrow-container">
        <div class="arrow arrow-left">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </div>
      </div>

      <!-- Flashcard -->
      <div class="flashcard-container" @click="toggleVisible">
        <div class="flashcard">
          <div class="flashcardFront" v-if="visible">
            <p class="userContent">Hier sollte später Text stehen</p>
          </div>
          <div class="flashcardBack" v-else>
            <p class="userContent">Hier sollte der zweite Text stehen</p>
          </div>
        </div>
      </div>

      <!-- Right Arrow -->
      <div class="arrow-container">
        <div class="arrow arrow-right">
          <svg viewBox="0 0 24 24" class="arrow-svg">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

    </div>
    <div class="configure">
      <button class="baseButtonLayout" @click="configureContentOfFlashcard">
        Configure Content
      </button>
    </div>
  </div>
</template>

<style>
@import "../assets/styles/learningMode.css";
</style>