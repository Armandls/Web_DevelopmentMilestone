<template>
  <main class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-6 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5 mb-10">
    <!-- Bucle per a cada jugador en la llista filtrada -->
    <RouterLink v-for="(item, index) in items" :key="item.id" :to="`/profileranking`" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
      <div class="flex items-center">
        <span class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</span>
        <img class="w-[58px] h-[58px]" :src="item.imageSrc" />
        <span class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.username }} - Level: {{ item.level }}</span>
        <aside class="flex flex-col items-center justify-center bg-transparent p-3 ml-2 rounded-2xl mb-2.5">
          <p class="text-black font-bold text-xl rounded">{{ item.xp }} EXP</p>
        </aside>
      </div>
    </RouterLink>
  </main>
</template>

<script setup>
import { defineProps } from 'vue';

// Definició de les props que aquest component espera rebre
const props = defineProps({
  items: Array // Aquesta seria la llista de jugadors ja filtrada
});
</script>