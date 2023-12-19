<template>
  <main class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-6 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-10 mb-20">
    <!-- Bucle per a cada jugador en la llista filtrada -->
    <div v-for="(item, index) in items" :key="item.id" @click="handlePlayerClick(item)" :class="containerClass(index)" class="flex items-center justify-between w-full h-[88px] my-2 rounded-[10px] border-4 border-black cursor-pointer">
      <div class="flex items-center">
        <!-- Espai reservat per al número amb amplada fixa -->
        <span class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-8 ml-3 w-[30px] text-right">{{ index + 1 }}</span>
        <!-- Foto amb borde negre -->
        <img class="w-[58px] h-[58px] border-4 border-black mr-4 mt-1.5 mb-1.5" :src="item.imageSrc" />

        <!-- Recuadres per a nom, nivell i experiència -->
        <div class="flex">
          <!-- Nom del jugador en un recuadre -->
          <div class="rounded p-2 mr-2"> <!--Per afegir el recuadre bg-yellow-100 (per exemple) -->
            <span class="text-black text-2xl font-bold">{{ item.username }}</span>
          </div>

          <!-- Nivell en un recuadre -->
          <div class=" rounded p-2 mr-2">
            <span class="text-black text-2xl font-bold">{{ item.level }} LVL</span>
          </div>

          <!-- Experiència en un recuadre -->
          <div class=" rounded p-2">
            <span class="text-black text-2xl font-bold">{{ item.xp }} XP</span>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import {defineProps} from 'vue';
import router from "../router/index.js";

const props = defineProps({
  items: Array,//LLista ja filtrada
  isSearching: Boolean //Indica si s'està filtrant o no
});

const containerClass = (index) => {
  if (props.isSearching) {
    return 'bg-yellow-100';
  }


  if (index === 0) return 'bg-gold-metallic';
  if (index === 1) return 'bg-silver-metallic';
  if (index === 2) return 'bg-bronze-metallic';
  return 'bg-yellow-100'; // Estil per defecte quan no hi ha cerca
};


const emits = defineEmits(['playerClick']);

const handlePlayerClick = (item) => {
  // Emetre un event amb la informació del jugador
  emits('playerClick', item);
};
</script>