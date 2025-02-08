<template>
  <div class="desktop-3">
    <div class="box_set_container">
      <img class="box" src="../assets/icons/box.png" alt="" />
      <div class="set">Set 1</div>
    </div>
    <div class="flashcards_Box_flashcards_container">
      <div class="flashcards">Flashcards 1</div>
      <img class="flashcards_Box" src="../assets/icons/karteikarten-zum-lernen.png" alt="" />
    </div>
  </div>
  <div class="brainpop_Title">Brainpop</div>
  <img class="add" src="../assets/icons/plus.png" alt="" @click="openModal" />
  <img class="brain-process" src="../assets/icons/brain-process.png" alt="" />

  <div v-if="isModalOpen" class="modal-overlay">
    <div class="modal">
      <h2>Select what to add</h2>
      <button @click="addBox">Add Box</button>
      <button @click="addFlashcardSet">Add Flashcard Set</button>
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
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    addBox() {
      this.closeModal();
    },
    addFlashcardSet() {

      this.closeModal();
    }
  }
};
</script>

<style scoped>
@import "../assets/styles/style_Desktop3.css";

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #2C7873;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
.modal h2{
  font-family: "Bayon-Regular", sans-serif;
  color: white;

}

.modal button {
  margin: 10px;
  padding: 10px 20px;
  cursor: pointer;
  background: #6fB98F;
  color: white;
  border: none;
  border-radius: 10px;
}
</style>
