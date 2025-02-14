<template>
  <div class="desktop-3">
    <div class="box_set_container">
      <img class="box" src="../assets/icons/box.png" alt="" />
      <div class="box_text">Set 1</div>
    </div>
    <div class="flashcards_Box_flashcards_container">
      <div class="flashcards_text">Flashcards 1</div>
      <img class="flashcards_Box" src="../assets/icons/karteikarten-zum-lernen.png" alt="" />
    </div>
  </div>
  <div class="brainpop_Title">Brainpop</div>
  <img class="add" src="../assets/icons/plus.png" alt="" @click="openModal" />
  <img class="brain-process" src="../assets/icons/brain-process.png" alt="" />

  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal">
      <h2>Select what to add</h2>

      <!-- Toggle Switch -->
      <input type="checkbox" id="toggle" class="toggleCheckbox" v-model="isSetSelected" />
      <label for="toggle" class='toggleContainer'>
        <div>Folder</div>
        <div>Set</div>
      </label>

      <!-- Text Field for Set Name -->
      <div v-if="isSetSelected" class="input-container">
        <label for="setName">Set Name:</label>
        <input type="text" id="setName" v-model="setName" placeholder="Enter set name" />
      </div>

      <button @click="confirmSelection">Confirm</button>
      <button @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Desktop3",
  data() {
    return {
      isModalOpen: false,
      isSetSelected: false, // false = 'box', true = 'flashcard set'
      setName: "" // Stores the entered set name
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.setName = ""; // Reset input field on close
    },
    confirmSelection() {
      if (this.isSetSelected && this.setName.trim() === "") {
        alert("Please enter a set name!"); // Prevent empty set names
        return;
      }

      alert(`${this.isSetSelected ? `Flashcard Set "${this.setName}"` : 'Box'} added!`);
      this.closeModal();
    },
  },
};
</script>

<style scoped>
@import "../assets/styles/style_Desktop3.css";

.input-container {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-container label {
  color: white;
  font-family: "Bayon-Regular", sans-serif;
  margin-bottom: 5px;
}

.input-container input {
  width: 80%;
  padding: 8px;
  border-radius: 5px;
  border: none;
  text-align: center;
}
</style>
