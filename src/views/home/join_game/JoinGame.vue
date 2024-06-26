<script setup>
import {inject, onMounted, ref, watch} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import NavigationBar from "../../../ components/NavigationBar.vue";
import router from "../../../router/index.js";

const authToken = inject('authToken'); //Agafem el token del jugador desde App.vue

function getMonthNumber(month) {
  const months = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };
  return months[month];
}

function formatDate(dateStr) {
  const parts = dateStr.split(' ');
  const year = parts[3];
  const month = getMonthNumber(parts[1]);
  const day = parts[2].length === 1 ? `0${parts[2]}` : parts[2]; // Afegir zero si el dia és d'un sol dígit
  return `${year}-${month}-${day}`;
}

const items = ref([]);
function loadGames(query = {}) {
  fetch('https://balandrau.salle.url.edu/i3/arenas', {
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
        let filteredGames = games;
        if (query.startDate) {
          filteredGames = filteredGames.filter(game => {
            if (game.creation_date) {
              const formattedGameDate = formatDate(game.creation_date);
              return formattedGameDate === query.startDate;
            }
            return false;
          });
        }

        if (query.available === 'true') {
          filteredGames = filteredGames.filter(game => !game.finished);
        }

        if (query.finishedGames === 'true') {
          filteredGames = filteredGames.filter(game => game.finished);
        }

        filteredGames.sort((a, b) => {
          const datetimeA = new Date(a.creation_date);
          const datetimeB = new Date(b.creation_date);
          return datetimeB - datetimeA;
        });

        let gamesForDisplay = filteredGames.map(game => {
          const playerInside = game.players_games && game.players_games.length > 0
              ? game.players_games[0].player_ID
              : "N/A";

          const player2Inside = game.players_games && game.players_games.length > 1
              ? game.players_games[1].player_ID
              : "N/A";

          return {
            gameId: game.game_ID,
            size: game.size,
            creationDate: game.creation_date,
            finished: game.finished,
            hpMax: game.HP_max,
            started: game.start,
            playerInside,
            player2Inside,
          };
        });

        gamesForDisplay = gamesForDisplay.filter(game => {
          return !(game.playerInside === "N/A" && game.player2Inside === "N/A");
        });

        items.value = gamesForDisplay;
      })
      .catch(error => {
        console.error('Error fetching games:', error.message);
      });
}
const route = useRoute(); //Retornem la ruta actual

function applyFiltersFromRoute() {
  const query = route.query; //Agafem els paràmetres de la URL
  if (Object.keys(query).length > 0) {
    //Apliquem els filtres
    loadGames(query);
  } else {
    //Carreguem tots els jocs
    loadGames();
  }
}

function clearFilters() {
  router.push({ name: 'joingame' }); //per netejar els filtres simplements treiem els parametres de la ruta
}

onMounted(applyFiltersFromRoute);

//Obserem constantmernt la ruta per si hi ha canvis, route es una font de dades reactiva
//Cada vegada que hi hagi canvis a la ruta, aplicarem els filtres
watch(route, applyFiltersFromRoute);

function goToStats(gameId) {
  router.push({
    name: 'gameinfo',
    query: {
      gameID: gameId
    }
  });
}

const showErrorModal = ref(false);
const errorMessage = ref('');
function goToPlayGame(gameId, hp, size) {
  if (attacks.value.length < 1) {
    showErrorModal.value = true;
    errorMessage.value = 'You need at least one attack to join a game';
    return;
  }

  fetch(`https://balandrau.salle.url.edu/i3/arenas/${gameId}/play`, {
    method: 'POST',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          router.push({ name: 'playgame', query: { name: gameId, hpMax: hp, rowsAndColumns: size } });
          return;
        }
        return response.json().then(json => {
          throw new Error(`Error: ${response.status} - ${json.message}`);
        });
      })
      .catch(error => {
        console.error('Error joining game: ', error.message);
        showErrorModal.value = true;
        errorMessage.value = 'The game is currently being played!';
      });
}

const attacks = ref([]);
const token = inject('authToken');
//Get the attacks from the API
function loadPlayerAttacks() {
  fetch('https://balandrau.salle.url.edu/i3/players/attacks', {
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          console.error("Response error:", response);
          throw response;
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Primero filtramos los ataques que no estén en venta (attack.on_sale = false)
          const filteredAttacks = data.filter(attack => !attack.on_sale && attack.equipped);

          // Luego mapeamos los ataques ordenados para estructurarlos por orden
          attacks.value = filteredAttacks.map(attack => ({
            attackName: attack.attack_ID,
          }));
        } else {
          console.error("Expected an array, but got:", data);
        }
      })
      .catch(error => {
        console.error("Error fetching game data:", error);
      });
}

onMounted(loadPlayerAttacks);

</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Available games i boto de filtrar -->
    <div class="flex justify-center md:justify-start items-start pt-10 md:pt-24 w-full">
      <div class="ml-5 md:ml-32 lg:ml-[150px] xl:ml-[300px] 2xl:ml-[450px]">
        <div class="flex flex-col md:flex-row items-center">
          <div class="text-white text-4xl md:text-[50px] font-bold font-['Sigmar One'] uppercase">AVAILABLE GAMES</div>
          <RouterLink to="/joingamefilter" class="bg-fuchsia-500 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded mt-4 md:mt-0 md:ml-10">
            FILTER
          </RouterLink>
          <button @click="clearFilters" class="bg-red-400 hover:bg-red-600 text-white font-bold ml-4 py-2 px-4 rounded mt-2 md:mt-0">
            CLEAR FILTERS
          </button>
        </div>
      </div>
    </div>

    <div v-if="showErrorModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <p>{{ errorMessage }}</p>
        <!-- Envolver el botón en un div y aplicar flexbox para centrarlo -->
        <div class="flex justify-center mt-6">
          <button @click="showErrorModal = false" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Container pels joinable games -->
    <div v-if="items.length > 0" class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5 mb-24">
      <div v-for="item in items" :key="item.gameId" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <div class="flex items-center">
          <!-- Imatge del joc -->
          <img v-if="item.finished" class="rounded w-[48px] h-[48px] mr-4 ml-4 border-2 border-black" src="/src/assets/game/gameStats.png" alt="Game Finished">
          <img v-else class="rounded w-[48px] h-[48px] mr-4 ml-4 border-2 border-black" :src="'/src/assets/game/joinGame.png'" alt="Join Game">

          <div class="flex items-center">
            <!-- Nom del player -->
            <div v-if="item.finished" class="text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] mr-2 bg-blue-300 rounded p-1.5">
              {{ item.playerInside }} VS {{ item.player2Inside }}
            </div>
            <div v-else class="text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] mr-2 bg-blue-300 rounded p-1.5">
              {{ item.playerInside }}
            </div>


            <!-- Game size -->
            <div v-if="!item.finished" class="text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] mr-2 bg-purple-300 rounded p-1.5">
              Game Size: {{ item.size }}
            </div>

            <!-- Max HP -->
            <div v-if="!item.finished" class="text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-pink-300 rounded p-1.5">
              Max HP: {{ item.hpMax }}
            </div>
          </div>
        </div>

        <!-- Botó per unir-se al joc o veure estadístiques -->
        <button v-if="!item.finished" @click="goToPlayGame(item.gameId, item.hpMax, item.size)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-3 sm:mt-3 sm:mb-3 sm:ml-3">
          JOIN GAME
        </button>
        <button v-else @click="goToStats(item.gameId)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-3 sm:mt-3 sm:mb-3 sm:ml-3">
          GAME STATS
        </button>
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

