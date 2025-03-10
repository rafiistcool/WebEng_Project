<template>
  <div class="desktop">
    <div class="items-container">
      <FolderItem
          v-for="(item, index) in state.items"
          :key="index"
          :item="item"
          @addItem="openModal"
      />
    </div>

    <div class="brainpop_Title">Brainpop</div>
    <img class="add" src="../assets/icons/plus.svg" alt="" @click="openModal(null)" />
    <img class="Brainpop-Logo" src="../assets/icons/Temp-Logo-Sebastian.png" alt="" />
  </div>

  <!-- Modal -->
  <div v-if="state.isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <h2>Select what to add</h2>
      <input type="checkbox" id="toggle" class="toggleCheckbox" v-model="state.isSetSelected" />
      <label for="toggle" class="toggleContainer">
        <div>Folder</div>
        <div>Set</div>
      </label>
      <div class="input-container">
        <label class="name" for="setName">Name:</label>
        <input type="text" id="setName" v-model="state.setName" placeholder="Enter name" />
      </div>
      <div v-if="state.parentFolder">
        <p>Adding to: {{ state.parentFolder.name }}</p>
      </div>
      <div class="modal-buttons">
        <button class="confirm-button" @click="confirmSelection">Confirm</button>
        <button class="cancel-button" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import FolderItem from "./FolderItem.vue"; // Import recursive component

export default {
  name: "Desktop",
  components: { FolderItem },
  setup() {
    const state = reactive({
      isModalOpen: false,
      isSetSelected: false,
      setName: "",
      parentFolder: null, // Stores selected folder to add into
      items: [] // Main storage for folders/sets
    });

    const openModal = (folder) => {
      state.parentFolder = folder;
      state.isModalOpen = true;
    };

    const closeModal = () => {
      state.isModalOpen = false;
      state.setName = "";
      state.parentFolder = null;
    };

    const confirmSelection = () => {
      if (state.setName.trim() === "") {
        alert("Please enter a name!");
        return;
      }

      let newItem = {
        name: state.setName,
        icon: state.isSetSelected
            ? new URL('@/assets/icons/set.svg', import.meta.url).href
            : new URL('@/assets/icons/folder.svg', import.meta.url).href,
        children: state.isSetSelected ? null : [] // Only folders can have children
      };

      if (state.parentFolder) {
        state.parentFolder.children.push(newItem);
      } else {
        state.items.push(newItem);
      }

      closeModal();
    };

    return {
      state,
      openModal,
      closeModal,
      confirmSelection
    };
  }
};
</script>
<style>
@import "@/assets/styles/style_Desktop3.css";
</style>

