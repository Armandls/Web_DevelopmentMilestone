<script setup>
import {RouterLink, useRoute} from 'vue-router';
import {inject, onMounted, ref} from "vue";
import router from "../../router/index.js";

const token = inject('authToken'); //Agafem el token del jugador desde App.vue

const username = ref('');
const imageSrc = ref('');
const lvl = ref('');
const xp = ref('');

const route = useRoute();

username.value = route.query.username;
imageSrc.value = route.query.imageSrc;
lvl.value = route.query.lvl;
xp.value = route.query.xp;

console.log(username.value);
console.log(imageSrc.value);
console.log(lvl.value);
console.log(xp.value);

const items = ref([]);

function loadGames() {
  fetch(`https://balandrau.salle.url.edu/i3/players/${username.value}/games/finished`, {
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          console.log(response)
          return response.json();
        } else {
          console.error("Response error:", response);
          throw response;
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          items.value = data.map(game => ({
            gameID: game.game_ID,
            size: game.size,
            creationDate: game.creation_date,
            HPMax: game.HP_max,
            playerGame1: game.players_games.length > 0 ? {
              gameID: game.players_games[0].game_ID,
              playerID: game.players_games[0].player_ID,
              winner: game.players_games[0].winner,
              xpWin: game.players_games[0].xp_win,
              coinsWin: game.players_games[0].coins_win
            } : null,
            playerGame2: game.players_games.length > 1 ? {
              gameID: game.players_games[1].game_ID,
              playerID: game.players_games[1].player_ID,
              winner: game.players_games[1].winner,
              xpWin: game.players_games[1].xp_win,
              coinsWin: game.players_games[1].coins_win
            } : null
          }));
        } else {
          console.error("Expected an array, but got:", data);
        }
      })
      .catch(error => {
        console.error("Error fetching game data:", error);
      });
}

let winrate = ref(0);
function loadPlayerStatistics() {
  fetch(`https://balandrau.salle.url.edu/i3/players/${username.value}/statistics`, {
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          console.log(response)
          return response.json();
        } else {
          console.error("Response error:", response);
          throw response;
        }
      })
      .then(statistics => {
        const stats = statistics;
        winrate.value = stats.games_played > 0 ? (stats.games_won / stats.games_played) * 100 : 'N/A';
        winrate.value = stats.games_played > 0 ? winrate.value + '%' : winrate.value;
      })
      .catch(error => {
        console.error("Error fetching player statistics:", error);
      });
}

onMounted(loadGames);
onMounted(loadPlayerStatistics);

function goToStats(gameId) {
  router.push({
    name: 'gameinfo',
    query: {
      gameID: gameId
    }
  });
}
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <div class="bg-transparent">
      <div class="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-4xl xl:max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden flex items-center p-3 sm:p-3 md:p-4 lg:p-4 xl:p-4 mt-10">
        <!-- Foto de perfil -->
        <img class="h-16 sm:h-20 md:h-24 lg:h-24 xl:h-24 w-16 sm:w-20 md:w-24 lg:w-24 xl:w-24" :src="imageSrc" alt="Foto de perfil">

        <!-- Nom jugador -->
        <div class="ml-4 flex-grow">
          <div class="p-1 sm:p-1.5 md:p-2 lg:p-2 xl:p-2 border border-blue-400 rounded w-full bg-blue-400">
            <div class="font-bold text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl text-gray-800">{{ username }}</div>
          </div>

          <!-- Nivell i xp -->
          <div class="p-1 sm:p-1.5 md:p-2 lg:p-2 xl:p-2 border border-yellow-200 rounded mt-1 sm:mt-1.5 md:mt-2 lg:mt-2 xl:mt-2 bg-yellow-200">
            <div class="font-bold text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl text-gray-800">LVL: {{ lvl }} - XP:{{ xp }}</div>
          </div>
        </div>

        <!-- WR -->
        <div class="ml-4 sm:ml-5 md:ml-6 lg:ml-6 xl:ml-6 p-3 sm:p-3.5 md:p-4 lg:p-4 xl:p-4 border border-green-400 rounded text-right bg-green-500">
          <span class="text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl text-gray-800 font-bold">WR: {{ winrate }}</span>
        </div>
      </div>
    </div>

    <!-- Game History -->
    <div class="mt-8 mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl xl:max-w-3xl px-4">
      <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white">GAME HISTORY</h2>
    </div>

    <!-- Llista de partides jugades -->
    <div v-if="items.length > 0" class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5 mb-24">
      <div v-for="item in items" :key="item.gameId" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <div class="flex items-center">
          <!-- Imatge del joc -->
          <img class="rounded w-[48px] h-[48px] mr-4 ml-4 border-2 border-black" src="/src/assets/game/gameStats.png" alt="Game Finished">

          <div class="flex items-center">
            <!-- Nom del player -->
            <div class="text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] mr-2 bg-blue-300 rounded p-1.5">
              {{ item.playerGame1.playerID }} VS {{ item.playerGame2.playerID }}
            </div>
          </div>
        </div>

        <button @click="goToStats(item.gameID)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3 sm:mt-3 sm:mb-3 sm:ml-3">
          <font-awesome-icon icon="chart-bar" class="mr-2" /> GAME STATS
        </button>
      </div>
    </div>

    <div v-else class="text-center text-3xl font-bold text-white mt-10 mb-96">
      NO GAMES AVAILABLE
    </div>

    <!-- Boto de tornar enrere -->
    <div class="fixed top-0 left-0 pt-4">
      <router-link to="/ranking" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <img src="/src/assets/game_filter/return_icon.png" class="w-6 h-6 mr-2 font-extrabold" alt=""/>
        <span class="hidden sm:inline">RETURN</span>
      </router-link>
    </div>



  </div>
</template>

<style scoped>
</style>

