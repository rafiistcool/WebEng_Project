<template>
  <div class="desktop-3">
    <!-- Box -->
    <div
        class="box_set_container"
        @mousedown="startPress($event, 'box', $event.target)"
        @mouseup="cancelPress"
        @touchstart="startPress($event, 'box', $event.target)"
        @touchend="cancelPress"
    >
      <img class="box" src="../assets/icons/box.png" alt="" />
      <div class="box_text">Set 1</div>
    </div>

    <!-- Flashcards -->
    <div
        class="flashcards_Box_flashcards_container"
        @mousedown="startPress($event, 'flashcards', $event.target)"
        @mouseup="cancelPress"
        @touchstart="startPress($event, 'flashcards', $event.target)"
        @touchend="cancelPress"
    >
      <div class="flashcards_text">Cards 1</div>
      <img class="flashcards_Box" src="../assets/icons/karteikarten-zum-lernen.png" alt="" />
    </div>
  </div>

  <div class="brainpop_Title">Brainpop</div>
  <img class="add" src="../assets/icons/plus.png" alt="" @click="openModal" />
  <img class="brain-process" src="../assets/icons/brain-process.png" alt="" />

  <!-- Add Set Modal -->
  <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <h2>Select what to add</h2>

      <!-- Toggle Switch -->
      <input type="checkbox" id="toggle" class="toggleCheckbox" v-model="isSetSelected" />
      <label for="toggle" class="toggleContainer">
        <div>Folder</div>
        <div>Set</div>
      </label>

      <!-- Input Field for Set Name -->
      <div v-if="isSetSelected" class="input-container">
        <label for="setName">Set Name:</label>
        <input type="text" id="setName" v-model="setName" placeholder="Enter set name" />
      </div>

      <button @click="confirmSelection">Confirm</button>
      <button @click="closeModal">Cancel</button>
    </div>
  </div>

  <!-- Context Menu -->
  <div v-if="isContextMenuOpen" ref="contextMenu" class="context-menu">
    <button @click="renameFile">Rename</button>
    <button @click="copyFile">Copy</button>
    <button @click="deleteFile">Delete</button>
  </div>
</template>

<script>
export default {
  name: "Desktop3",
  data() {
    return {
      isModalOpen: false,
      isContextMenuOpen: false,
      isSetSelected: false,
      setName: "",
      pressTimer: null,
      selectedItem: null,
      targetElement: null,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.setName = "";
    },
    confirmSelection() {
      if (this.isSetSelected && this.setName.trim() === "") {
        alert("Please enter a set name!");
        return;
      }
      alert(`${this.isSetSelected ? `Flashcard Set "${this.setName}"` : "Box"} added!`);
      this.closeModal();
    },
    startPress(event, item, target) {
      this.selectedItem = item;
      this.targetElement = target;

      this.pressTimer = setTimeout(() => {
        this.showContextMenu();
      }, 700);
    },
    cancelPress() {
      clearTimeout(this.pressTimer);
    },
    showContextMenu() {
      if (!this.targetElement) return;

      this.isContextMenuOpen = true;
      this.$nextTick(() => {
        const menu = this.$refs.contextMenu;
        const rect = this.targetElement.getBoundingClientRect();

        menu.style.top = `${rect.bottom + window.scrollY}px`;
        menu.style.left = `${rect.left + window.scrollX}px`;

        setTimeout(() => {
          document.addEventListener("click", this.handleClickOutside);
        }, 1000);
      });
    },
    handleClickOutside(event) {
      if (this.$refs.contextMenu && !this.$refs.contextMenu.contains(event.target)) {
        this.isContextMenuOpen = false;
        document.removeEventListener("click", this.handleClickOutside);
      }
    },
    renameFile() {
      const newName = prompt("Enter new name:");
      if (newName) {
        alert(`Renamed ${this.selectedItem} to ${newName}`);
      }
      this.isContextMenuOpen = false;
    },
    copyFile() {
      alert(`Copied ${this.selectedItem}`);
      this.isContextMenuOpen = false;
    },
    deleteFile() {
      const confirmDelete = confirm(`Are you sure you want to delete ${this.selectedItem}?`);
      if (confirmDelete) {
        alert(`${this.selectedItem} deleted!`);
      }
      this.isContextMenuOpen = false;
    },
  },
};
</script>

<style scoped>
@import "../assets/styles/style_Desktop3.css";


</style>
