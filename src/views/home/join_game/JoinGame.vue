<script setup>
import {inject, onMounted, ref} from 'vue';
import { RouterLink } from 'vue-router';
import NavigationBar from "../../../ components/NavigationBar.vue";

//TODO: Fer una altre pantalla de veure informació detallada de cada game i si no esta acabat poder entrar-hi

const authToken = inject('authToken'); //Agafem el token del jugador desde App.vue

const items = ref([]);
function loadGames() {
  fetch('https://balandrau.salle.url.edu/i3/games', {
    method: 'GET',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(games => {
        items.value = games.map(game => ({
          gameId: game.game_ID,
          size: game.size,
          creationDate: game.creation_date, // Aquest camp pot requerir un format específic
          finished: game.finished,
          hpMax: game.HP_max,
          started: game.start,
          playerInside: game.players_games[0].player_ID,
        }));
      })
      .catch(error => {
        console.error('Error fetching games:', error.message);
      });
}

onMounted(loadGames); //carreguem els games al iniciar la pagina
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Available games i boto de filtrar -->
    <div class="flex justify-center md:justify-start items-start pt-10 md:pt-24 w-full">
      <div class="ml-5 md:ml-64 lg:ml-[200px] xl:ml-[350px] 2xl:ml-[500px]"> <!-- Augment significatiu del marge esquerre per a pantalles grans -->
        <div class="flex flex-col md:flex-row items-center">
          <div class="text-white text-4xl md:text-[50px] font-bold font-['Sigmar One'] uppercase">AVAILABLE GAMES</div>
          <RouterLink to="/joingamefilter" class="bg-fuchsia-500 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded mt-4 md:mt-0 md:ml-10">
            <font-awesome-icon icon="filter" class="mr-2" /> FILTER
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Container pels joinable games -->
    <div v-if="items.length > 0" class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5">
      <div v-for="(item, index) in items" :key="item.id" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <div class="flex items-center">
          <div class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</div>
          <img class="w-[58px] h-[58px]" :src="item.imageSrc" />
          <div class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.username }} - WinRate: {{ item.winRate }}%</div>
        </div>
        <!-- Implementar aquesta logica en un futur
        <RouterLink :to="'/startgame/${item.id}'" class="bg-green-500 text-sm md:text-lg lg:text-xl xl:text-2xl hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-3">
          <font-awesome-icon icon="play" class="mr-2" /> JOIN GAME
        </RouterLink>
        -->
        <RouterLink to="/playgame" class="bg-green-500 text-sm md:text-lg lg:text-xl xl:text-2xl hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-3">
          <font-awesome-icon icon="play" class="mr-2" /> JOIN GAME
        </RouterLink>
      </div>
    </div>

    <div v-else class="text-center text-3xl font-bold text-white mt-10">
      NO GAMES AVAILABLE
    </div>

    <!-- Menu lateral -->
    <NavigationBar/>
  </div>
</template>

<style scoped>
</style>

