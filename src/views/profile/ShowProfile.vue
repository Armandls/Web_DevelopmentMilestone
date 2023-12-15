<script setup>
import {computed, inject, ref} from 'vue';
import NavigationBar from "../../ components/NavigationBar.vue";

const games = ref([
  { player1: 'Oriolshhh', player2: 'Carlos', winner: 'Oriolshhh', score: '3-1' },
  { player1: 'Armand', player2: 'Oriolshhh', winner: 'Armand', score: '2-0' },
  { player1: 'Armand', player2: 'Oriolshhh', winner: 'Armand', score: '2-0' },
  { player1: 'Armand', player2: 'Oriolshhh', winner: 'Armand', score: '2-0' },
  { player1: 'Armand', player2: 'Oriolshhh', winner: 'Armand', score: '2-0' },
  { player1: 'Armand', player2: 'Oriolshhh', winner: 'Armand', score: '2-0' },
  { player1: 'Armand', player2: 'Oriolshhh', winner: 'Armand', score: '2-0' },
  { player1: 'Armand', player2: 'Oriolshhh', winner: 'Armand', score: '2-0' },
]);

const playerData = inject('playerData'); //Agafem les dades del jugador desde App.vue

//Computed per a que quan canviïn les dades del jugador, es canviïn automàticament les dades que es mostren
const playerName = computed(() => playerData.value ? playerData.value.player_ID : 'Nom Desconegut');
const playerLevel = computed(() => playerData.value ? playerData.value.level : 'N/A');
const playerXP = computed(() => playerData.value ? playerData.value.xp : 'N/A');
const playerCoins = computed(() => playerData.value ? playerData.value.coins : 'N/A');
const playerAvatar = computed(() => playerData.value ? playerData.value.img : '/src/assets/avatars/avatar1.png');
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <div class="pt-8 bg-transparent">
      <div class="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden flex items-center p-3 sm:p-3 md:p-4 lg:p-4 xl:p-4">
        <!-- Foto de perfil -->
        <img class="h-16 sm:h-20 md:h-24 lg:h-24 xl:h-24 w-16 sm:w-20 md:w-24 lg:w-24 xl:w-24" :src="playerAvatar" alt="Foto de perfil">

        <!-- Nom jugador -->
        <div class="ml-4 flex-grow">
          <div class="p-1 sm:p-1.5 md:p-2 lg:p-2 xl:p-2 border border-blue-400 rounded w-full bg-blue-400">
            <div class="font-bold text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl text-gray-800">{{ playerName }}</div>
          </div>

          <!-- Nivell i xp -->
          <div class="p-1 sm:p-1.5 md:p-2 lg:p-2 xl:p-2 border border-yellow-200 rounded mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-2 bg-yellow-200">
            <div class="font-bold text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl text-gray-800">LVL: {{ playerLevel }} - XP: {{ playerXP }}</div>
          </div>
        </div>

        <!-- Monedes -->
        <div class="ml-4 sm:ml-5 md:ml-6 lg:ml-6 xl:ml-6 p-3 sm:p-3.5 md:p-4 lg:p-4 xl:p-4 border border-green-400 rounded text-right bg-green-400">
          <span class="text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl text-gray-800 font-bold">Coins: {{ playerCoins }}</span>
        </div>
      </div>
    </div>

    <!-- Game History -->
    <div class="mt-8 mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-3xl px-4">
      <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white">GAME HISTORY</h2>
    </div>

    <!-- Llista de partides jugades -->
    <div class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-10 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5">
      <div v-for="(game, index) in games" :key="game.id" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">

        <!-- Index -->
        <div class="text-2xl sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mr-4 ml-4">
          {{ index + 1 }}
        </div>

        <!-- Noms -->
        <div class="flex-grow text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
          <span :class="{'font-bold': game.winner === game.player1}">{{ game.player1 }}</span>
          <span> vs </span>
          <span :class="{'font-bold': game.winner === game.player2}">{{ game.player2 }}</span>
        </div>

        <!-- Resultat -->
        <div class="p-2 bg-yellow-300 rounded mr-2 text-md sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mt-2 mb-2">
          {{ game.score }}
        </div>

      </div>
    </div>

    <!-- Navigation bar -->
    <NavigationBar/>
  </div>
</template>

<style scoped>
</style>


