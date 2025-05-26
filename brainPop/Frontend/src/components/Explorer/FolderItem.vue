
<template>
  <div class="flex flex-col">
    <div @click="toggleExpand" class="flex items-center cursor-pointer">
      <img :src="item.icon" class="w-full h-full" alt="" />
      <div class="ml-2">{{ item.name }}</div>
    </div>
    <div v-if="isExpanded" class="pl-5">
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

<style scoped>
</style>
