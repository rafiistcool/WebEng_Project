<script setup lang="ts">

</script>

<template>

    <div class="w-full text-center">
      <header class="mb-8">
        <img class="max-w-[20%] mx-auto" src="../assets/icons/logo.png" alt="" />
      </header>
      <main class="inline-block text-center bg-grayBackground backdrop-blur rounded p-[5%]">
        <h1 class="text-[6vw] mb-[10%]">BrainPop</h1>
        <div class="flex justify-center gap-[10%] mt-[5%] flex-col sm:flex-row sm:gap-[5%]">
          <router-link to="/login" class="w-[20%] h-12" custom v-slot="{ navigate }">
            <button class="button w-full h-full" @click="navigate">Anmelden</button>
          </router-link>
          <router-link to="/Explorer" class="w-[20%] h-12" custom v-slot="{ navigate }">
            <button class="button w-full h-full" @click="navigate">Gast</button>
          </router-link>
        </div>
      </main>
    </div>


</template>

<style scoped>
</style>