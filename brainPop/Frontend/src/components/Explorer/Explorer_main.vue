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

    <!-- Folder Contents (gehört innerhalb von .desktop-3!) -->
    <div class="items-container">
      <div
          v-for="item in currentItems"
          :key="item.id"
          class="item-container"
          draggable="true"
          @dragstart="onDragStart(item)"
          @dragover.prevent="onDragOver($event, item)"
          @drop="onDrop(item)"
          @dblclick="onItemClick(item)"
          @contextmenu.prevent="openContextMenu($event, item)"
      >
        <div class="icon-wrapper">
          <img :src="item.icon" class="item-icon" alt=""/>
        </div>
        <div class="item-text">{{ item.name }}</div>
      </div>

      <div v-if="currentItems.length === 0" class="item-text" style="margin-top: 50px;">
        No items
      </div>
    </div>
  </div>
  <!-- Add Button -->
  <img class="add" src="@/assets/icons/plus.svg" alt="Add" @click="openModal"/>

  <!-- Modal -->
  <div v-if="state.isModalOpen" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <h2>Select what to add</h2>
      <input type="checkbox" id="toggle" class="toggleCheckbox" v-model="state.isSetSelected"/>
      <label for="toggle" class="toggleContainer">
        <div>Folder</div>
        <div>Set</div>
      </label>
      <div class="input-container">
        <label class="name" for="setName">Name:</label>
        <input type="text" id="setName" v-model="state.setName" placeholder="Enter name"/>
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

</template>

<script>
import {reactive, ref, computed, onMounted, onUnmounted} from "vue";
import {useRouter} from "vue-router";
import {useCardStore} from "../../script/store";
import {useAuthStore} from "../../script/auth";

export default {
  name: "Desktop",
  setup() {
    const router = useRouter();
    const cardStore = useCardStore();
    const authStore = useAuthStore();

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

    const draggedItem = ref(null);

    const loadFolderHierarchy = async () => {
      try {
        if (!authStore.user?.id) {
          console.error("User not logged in");
          return;
        }

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/folders/hierarchy?userId=${authStore.user.id}`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Convert backend format to frontend format
        state.items = data.map(folder => convertFolderToFrontendFormat(folder));

        // Also load root-level sets (sets not in any folder)
        const setsResponse = await fetch(import.meta.env.VITE_BACKEND_URL + `/sets?userId=${authStore.user.id}`, {
          credentials: 'include'
        });
        if (setsResponse.ok) {
          const sets = await setsResponse.json();
          // Filter out sets that are already in folders
          const folderSetIds = new Set();
          data.forEach(folder => {
            folder.sets.forEach(set => folderSetIds.add(set.id));
          });

          const rootSets = sets.filter(set => !folderSetIds.has(set.id));

          // Add root sets to items
          rootSets.forEach(set => {
            state.items.push({
              id: set.id,
              name: set.name,
              icon: new URL('@/assets/icons/set.svg', import.meta.url).href,
              children: null
            });
          });
        }
      } catch (error) {
        console.error("Error loading data from backend:", error);
      }
    };

    // Convert backend folder format to frontend format
    const convertFolderToFrontendFormat = (folder) => {
      const result = {
        id: folder.id,
        name: folder.name,
        icon: new URL('@/assets/icons/folder.svg', import.meta.url).href,
        children: folder.children.map(child => convertFolderToFrontendFormat(child))
      };

      // Add sets to the folder
      if (folder.sets && folder.sets.length > 0) {
        folder.sets.forEach(set => {
          result.children.push({
            id: set.id,
            name: set.name,
            icon: new URL('@/assets/icons/set.svg', import.meta.url).href,
            children: null
          });
        });
      }

      return result;
    };

    // Create a new folder
    const createFolder = async (name, parentId = null) => {
      try {
        if (!authStore.user?.id) {
          console.error("User not logged in");
          return null;
        }

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/folders',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                userId: authStore.user.id,
                name,
                parentId
              }),
            });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating folder:", error);
        return null;
      }
    };

    // Create a new set
    const createSet = async (name) => {
      try {
        if (!authStore.user?.id) {
          console.error("User not logged in");
          return null;
        }

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + '/sets',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                userId: authStore.user.id,
                name
              }),
            });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating set:", error);
        return null;
      }
    };

    // Add a set to a folder
    const addSetToFolder = async (folderId, setId) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/folders/${folderId}/sets/${setId}`,

            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
      } catch (error) {
        console.error("Error adding set to folder:", error);
        return false;
      }
    };

    // Update folder name
    const updateFolder = async (id, name, parentId = null) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/folders/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({name, parentId}),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error updating folder:", error);
        return null;
      }
    };

    // Update set name
    const updateSet = async (id, name) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sets/${id}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({name}),
            });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error updating set:", error);
        return null;
      }
    };

    // Delete folder
    const deleteFolder = async (id) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/folders/${id}`,

            {
              method: 'DELETE',
              credentials: 'include',
            });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
      } catch (error) {
        console.error("Error deleting folder:", error);
        return false;
      }
    };

    // Delete set
    const deleteSet = async (id) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sets/${id}`,

            {
              method: 'DELETE',
              credentials: 'include',
            });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return true;
      } catch (error) {
        console.error("Error deleting set:", error);
        return false;
      }
    };

    const currentItems = computed(() => {
      return state.currentDirectory?.children || state.items;
    });
    const openModal = () => {
      state.isModalOpen = true;
    };

    const closeModal = () => {
      state.isModalOpen = false;
      state.setName = "";
    };

    const confirmSelection = async () => {
      if (!state.setName.trim()) {
        alert("Please enter a name!");
        return;
      }

      let newItem;

      if (state.isSetSelected) {
        // Create a new set
        const newSet = await createSet(state.setName);
        if (!newSet) {
          alert("Failed to create set. Please try again.");
          return;
        }

        newItem = {
          id: newSet.id,
          name: newSet.name,
          icon: new URL('@/assets/icons/set.svg', import.meta.url).href,
          children: null
        };

        // If we're in a folder, add the set to the folder
        if (state.currentDirectory) {
          const success = await addSetToFolder(state.currentDirectory.id, newSet.id);
          if (!success) {
            alert("Failed to add set to folder. Please try again.");
            return;
          }
        }
      } else {
        // Create a new folder
        const parentId = state.currentDirectory?.id || null;
        const newFolder = await createFolder(state.setName, parentId);
        if (!newFolder) {
          alert("Failed to create folder. Please try again.");
          return;
        }

        newItem = {
          id: newFolder.id,
          name: newFolder.name,
          icon: new URL('@/assets/icons/folder.svg', import.meta.url).href,
          children: []
        };
      }

      const targetArray = state.currentDirectory?.children || state.items;
      targetArray.push(newItem);
      closeModal();
    };

    const onItemClick = (item) => {
      if (item.children) {
        // It's a folder, navigate into it
        state.currentDirectory = item;
        state.navigation.push(item);
      } else {
        // It's a set, navigate to CardCreation
        cardStore.setCurrentSet(item.id);
        router.push('/cardcreation');
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

    const renameItem = async () => {
      const newName = prompt("Enter new name:", state.contextMenu.targetItem.name);
      if (!newName) {
        closeContextMenu();
        return;
      }

      const item = state.contextMenu.targetItem;
      let success = false;

      // Check if it's a folder or a set
      if (item.children !== null) {
        // It's a folder
        const updatedFolder = await updateFolder(item.id, newName);
        if (updatedFolder) {
          item.name = updatedFolder.name;
          success = true;
        }
      } else {
        // It's a set
        const updatedSet = await updateSet(item.id, newName);
        if (updatedSet) {
          item.name = updatedSet.name;
          success = true;
        }
      }

      if (!success) {
        alert("Failed to rename item. Please try again.");
      }

      closeContextMenu();
    };

    const deleteItem = async () => {
      const item = state.contextMenu.targetItem;
      let success = false;

      // Check if it's a folder or a set
      if (item.children !== null) {
        // It's a folder
        success = await deleteFolder(item.id);
      } else {
        // It's a set
        success = await deleteSet(item.id);
      }

      if (success) {
        const items = state.currentDirectory?.children || state.items;
        const index = items.findIndex(i => i.id === item.id);
        if (index !== -1) {
          items.splice(index, 1);
        }
      } else {
        alert("Failed to delete item. Please try again.");
      }

      closeContextMenu();
    };

    const closeContextMenu = () => {
      state.contextMenu.visible = false;
      state.contextMenu.targetItem = null;
    };

    // DRAG AND DROP

    const onDragStart = (item) => {
      draggedItem.value = item;
    };

    const onDragOver = (event, targetItem) => {
      // Allow drop only on folders
      if (targetItem.children) {
        event.preventDefault();
      }
    };

    const onDrop = async (targetItem) => {
      if (!targetItem.children || !draggedItem.value || draggedItem.value.id === targetItem.id) return;

      // If the dragged item is a set and the target is a folder
      if (draggedItem.value.children === null && targetItem.children !== null) {
        // Add the set to the folder in the backend
        const success = await addSetToFolder(targetItem.id, draggedItem.value.id);
        if (success) {
          // Update the UI
          const fromArray = state.currentDirectory?.children || state.items;
          const index = fromArray.findIndex(i => i.id === draggedItem.value.id);
          if (index !== -1) {
            const [moved] = fromArray.splice(index, 1);
            targetItem.children.push(moved);
          }
        } else {
          alert("Failed to move set to folder. Please try again.");
        }
      } else if (draggedItem.value.children !== null && targetItem.children !== null) {
        // If the dragged item is a folder and the target is a folder
        // Update the folder's parent in the backend
        const updatedFolder = await updateFolder(draggedItem.value.id, draggedItem.value.name, targetItem.id);
        if (updatedFolder) {
          // Update the UI
          const fromArray = state.currentDirectory?.children || state.items;
          const index = fromArray.findIndex(i => i.id === draggedItem.value.id);
          if (index !== -1) {
            const [moved] = fromArray.splice(index, 1);
            targetItem.children.push(moved);
          }
        } else {
          alert("Failed to move folder. Please try again.");
        }
      }

      draggedItem.value = null;
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.context-menu')) {
        closeContextMenu();
      }
    };

    onMounted(() => {
      loadFolderHierarchy();
      document.body.classList.add('left-aligned');
      document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
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
      currentItems,
      onDragStart,
      onDragOver,
      onDrop,
      loadFolderHierarchy,
      createFolder,
      createSet,
      updateFolder,
      updateSet,
      deleteFolder,
      deleteSet,
      addSetToFolder
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
