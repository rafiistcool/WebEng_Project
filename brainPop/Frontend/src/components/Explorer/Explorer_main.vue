<template>
  <div class="desktop-3">
    <!-- Breadcrumb & Back -->
    <div class="breadcrumb-container">
      <button class="back-button" @click="goBack" :disabled="state.navigation.length === 0">
        ⭠ Back
      </button>
      <span class="breadcrumb">
        <span @click="goTo(null)" class="breadcrumb-link">Home</span>
        <template v-for="(folder, index) in state.navigation" :key="folder.id">
          / <span @click="goTo(index)" class="breadcrumb-link">{{ folder.name }}</span>
        </template>
      </span>
    </div>


    <!-- Folder Contents -->
    <div class="items-container">
      <div
          v-for="item in currentItems"
          :key="item.id"
          class="item-container"
          @dblclick="onItemClick(item)"
          @contextmenu.prevent="openContextMenu($event, item)"
      >
        <div class="icon-wrapper">
          <img :src="item.icon" class="item-icon" />
        </div>
        <div class="item-text">{{ item.name }}</div>

      </div>

      <div v-if="currentItems.length === 0" class="item-text" style="margin-top: 50px;">
      </div>

    </div>

    <!-- Add Button -->
    <img class="add" src="@/assets/icons/plus.svg" alt="Add" @click="openModal" />

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
          <button class="button confirm-button" @click="confirmSelection">Confirm</button>
          <button class="button cancel-button" @click="closeModal">Cancel</button>
        </div>


      </div>
    </div>

    <!-- Context Menu -->
    <div v-if="state.contextMenu.visible" :style="contextMenuStyles" class="context-menu">
      <button @click="renameItem">Rename</button>
      <button @click="deleteItem">Delete</button>
    </div>
  </div>
</template>

<script>
import { reactive, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCardStore } from "../../script/store"
export default {
  name: "Desktop",
  setup() {
    const state = reactive({
      isModalOpen: false,
      isSetSelected: false,
      setName: "",
      items: [],
      currentDirectory: null,
      navigation: [],
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        targetItem: null
      }
    });

    const openModal = () => {
      state.isModalOpen = true;
    };

    const closeModal = () => {
      state.isModalOpen = false;
      state.setName = "";
    };

    const confirmSelection = () => {
      if (!state.setName.trim()) {
        alert("Please enter a name!");
        return;
      }

      const newItem = {
        id: Date.now() + Math.random(),
        name: state.setName,
        icon: state.isSetSelected
            ? new URL('@/assets/icons/set.svg', import.meta.url).href
            : new URL('@/assets/icons/folder.svg', import.meta.url).href,
        children: state.isSetSelected ? null : []
      };

      const targetArray = state.currentDirectory?.children || state.items;
      targetArray.push(newItem);
      closeModal();
    };

    const onItemClick = (item) => {
      if (item.children) {
        state.currentDirectory = item;
        state.navigation.push(item);
      }
    };

    const goBack = () => {
      state.navigation.pop();
      state.currentDirectory = state.navigation[state.navigation.length - 1] || null;
    };

    const goTo = (index) => {
      if (index === null) {
        state.navigation = [];
        state.currentDirectory = null;
      } else {
        state.navigation = state.navigation.slice(0, index + 1);
        state.currentDirectory = state.navigation[index];
      }
    };

    const openContextMenu = (event, item) => {
      state.contextMenu.visible = true;
      state.contextMenu.x = event.pageX;
      state.contextMenu.y = event.pageY;
      state.contextMenu.targetItem = item;
    };

    const contextMenuStyles = computed(() => ({
      top: `${state.contextMenu.y}px`,
      left: `${state.contextMenu.x}px`
    }));

    const renameItem = () => {
      const newName = prompt("Enter new name:", state.contextMenu.targetItem.name);
      if (newName) {
        state.contextMenu.targetItem.name = newName;
      }
      closeContextMenu();
    };

    const deleteItem = () => {
      const items = state.currentDirectory?.children || state.items;
      const index = items.findIndex(i => i.id === state.contextMenu.targetItem.id);
      if (index !== -1) {
        items.splice(index, 1);
      }
      closeContextMenu();
    };

    const closeContextMenu = () => {
      state.contextMenu.visible = false;
      state.contextMenu.targetItem = null;
    };

    const currentItems = computed(() => {
      return state.currentDirectory?.children || state.items;
    });

    return {
      state,
      openModal,
      closeModal,
      confirmSelection,
      onItemClick,
      goBack,
      goTo,
      openContextMenu,
      renameItem,
      deleteItem,
      contextMenuStyles,
      currentItems
    };
  }
};
</script>

<style>
@import "@/assets/styles/masterStyle.css";
@import "@/assets/styles/explorer.css";

.breadcrumb-link {
  cursor: pointer;
  text-decoration: underline;
  margin: 0 5px;
}
</style>
