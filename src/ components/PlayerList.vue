<template>
  <main class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-6 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-10 mb-20">
    <!-- Bucle per a cada jugador en la llista filtrada -->
    <div v-for="(item, index) in items" :key="item.id" @click="handlePlayerClick(item)" :class="containerClass(index)" class="flex items-center justify-between w-full h-[88px] my-2 rounded-[10px] border-4 border-black cursor-pointer">
      <div class="flex items-center">
        <!-- Espai reservat per al número amb amplada fixa -->
        <span class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-8 ml-3 w-[30px] text-right">{{ index + 1 }}</span>
        <!-- Foto amb borde negre -->
        <img class="w-[58px] h-[58px] border-4 border-black" :src="item.imageSrc" />
        <span class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] ml-5">{{ item.username }} - Level: {{ item.level }}</span>
        <aside class="flex flex-col items-center justify-center bg-transparent p-3 ml-2 rounded-2xl mb-2.5">
          <p class="text-black font-bold text-xl rounded">{{ item.xp }} EXP</p>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup>
import { defineProps } from 'vue';
import router from "../router/index.js";

const containerClass = (index) => {
  if (index === 0) return 'bg-gold-metallic';    // Or metàl·lic per al primer jugador
  if (index === 1) return 'bg-silver-metallic';  // Plata metàl·lica per al segon jugador
  if (index === 2) return 'bg-bronze-metallic';  // Bronze per al tercer jugador
  return 'bg-yellow-100'; // Retornar classe buida o una classe per defecte per a la resta
};

// Definició de les props que aquest component espera rebre
const props = defineProps({
  items: Array // Aquesta seria la llista de jugadors ja filtrada
});

const handlePlayerClick = (item) => {
  localStorage.setItem('currentPlayer', JSON.stringify({
    username: item.username,
    imageSrc: item.imageSrc,
    lvl: item.level,
    xp: item.xp
  }));
  router.push('/profileranking');
};
</script>