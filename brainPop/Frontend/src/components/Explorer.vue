<template>
  <div class="desktop-3">
    <div v-for="(item, index) in state.items" :key="index" :style="item.positionStyle" class="item-container">
      <img :src="item.icon" class="item-icon" alt="" />
      <div class="item-text">{{ item.name }}</div>
    </div>

    <div class="brainpop_Title">Brainpop</div>
    <img class="add" src="../assets/icons/plus.svg" alt="" @click="openModal" />
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
      <div class="modal-buttons">
        <button class="confirm-button" @click="confirmSelection">Confirm</button>
        <button class="cancel-button" @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  name: "Desktop3",
  setup() {
    const state = reactive({
      isModalOpen: false,
      isSetSelected: false,
      setName: "",
      items: [] // Ensures `items` is properly initialized
    });

    const openModal = () => {
      state.isModalOpen = true;
    };

    const closeModal = () => {
      state.isModalOpen = false;
      state.setName = "";
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
        positionStyle: {
          position: "absolute",
          left: `${(10 + state.items.length * 15)-30}%`,
          top: "35%"
        }
      };

      console.log("Before unshift: ", state.items);
      state.items.unshift(newItem);
      console.log("After unshift: ", state.items);

      state.setName = "";
      state.isModalOpen = false;
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
@import "@/assets/styles/masterStyle.css";
</style>

