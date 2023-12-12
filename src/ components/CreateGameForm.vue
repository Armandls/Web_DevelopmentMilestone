<script setup>
import { ref } from 'vue';
import router from "../router/index.js";

const rowsAndColumns = ref(2); //Valor por defecto
const hp = ref(15); //Valor por defecto
const rowsErrorMessage = ref(''); //Variable para el mensaje de error de Filas y Columnas
const hpErrorMessage = ref(''); //Variable para el mensaje de error de HP

const createGame = () => {
  if (rowsAndColumns.value >= 2 && rowsAndColumns.value <= 10 && hp.value >= 15) {
    rowsErrorMessage.value = '';
    hpErrorMessage.value = '';
    router.push({ path: '/playgame', query: { rows: rowsAndColumns.value, hp: hp.value } });
  } else {
    if (rowsAndColumns.value < 2 || rowsAndColumns.value > 10) {
      rowsErrorMessage.value = 'The number of rows and columns must be between 2 and 10';
      if (hp.value < 15) {
        hpErrorMessage.value = 'The HP must be at least 15';
      } else {
        hpErrorMessage.value = '';
      }
    } else {
      rowsErrorMessage.value = '';
      hpErrorMessage.value = 'The HP must be at least 15';
    }
  }
};

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-cover bg-no-repeat bg-center" style="background-image: url('/src/assets/welcome_page/background.png')">

    <!-- Return Home -->
    <div class="fixed top-0 left-0 pt-4">
      <router-link to="/home" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <font-awesome-icon icon="home" class="mr-2"/>
        <span class="hidden sm:inline">Home</span>
      </router-link>
    </div>

    <!-- Container para los campos -->
    <div class="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
      <div class="flex items-center justify-center p-8">
        <div class="w-full max-w-7xl bg-black bg-opacity-60 shadow-xl rounded" style="background-image: url('/src/assets/welcome_page/neon.png'); background-size: cover; background-position: center;">

          <div class="p-8">
            <h2 class="mb-6 text-3xl font-bold text-center text-white uppercase">Create a Game</h2>

            <div class="space-y-4">
              <!-- Numero Rows i Columns -->
              <div>
                <label for="rows" class="block text-sm font-bold text-white uppercase">Number of Rows & Columns (2 - 10)</label>
                <input type="number" id="rows" v-model.number="rowsAndColumns" min="2" max="10" class="w-full p-2 mt-1 bg-cyan-300 text-black rounded">
                <p v-if="rowsErrorMessage" class="text-red-500">{{ rowsErrorMessage }}</p>
              </div>

              <!-- Player HP -->
              <div>
                <label for="hp" class="block text-sm font-bold text-white uppercase">Player HP</label>
                <input type="number" id="hp" v-model.number="hp" min="15" class="w-full p-2 mt-1 bg-cyan-300 text-black rounded">
                <p v-if="hpErrorMessage" class="text-red-500">{{ hpErrorMessage }}</p>
              </div>

              <!-- Create Game -->
              <button @click="createGame" class="block px-4 py-2 mt-4 text-lg font-bold text-center text-black bg-yellow-400 rounded hover:bg-yellow-500 uppercase">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>