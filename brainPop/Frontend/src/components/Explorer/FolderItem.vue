<template>
  <div class="item-container">
    <div @click="toggleExpand" class="folder-item">
      <img :src="item.icon" class="item-icon" alt="" />
      <div class="item-text">{{ item.name }}</div>
      <img v-if="!item.children" class="add-icon" src="@/assets/icons/plus.svg" @click.stop="$emit('addItem', item)" />
    </div>
    <div v-if="isExpanded" class="nested-items">
      <FolderItem
          v-for="(child, index) in item.children"
          :key="index"
          :item="child"
          @addItem="$emit('addItem', child)"
      />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "FolderItem",
  props: ["item"],
  emits: ["addItem"],
  setup() {
    const isExpanded = ref(false);

    const toggleExpand = () => {
      if (Array.isArray(item.children)) {
        isExpanded.value = !isExpanded.value;
      }
    };

    return {
      isExpanded,
      toggleExpand
    };
  }
};
</script>

<style>
.nested-items {
  padding-left: 20px;
}
.folder-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.add-icon {
  margin-left: auto;
  cursor: pointer;
  width: 16px;
}
</style>
