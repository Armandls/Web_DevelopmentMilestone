<script setup>
import {inject, onMounted, ref} from "vue";
import {RouterLink, useRoute, useRouter} from "vue-router";

const token = inject('authToken'); //Agafem el token del jugador desde App.vue
const game = ref(null);

const route = useRoute();
const gameId = route.query.gameID;
console.log(gameId);

const router = useRouter();
const goBack = () => {
  router.back();
};

const avatars = [
  'src/assets/avatars/avatar1.png',
  'src/assets/avatars/avatar2.png',
  'src/assets/avatars/avatar3.png',
  'src/assets/avatars/avatar4.png',
  'src/assets/avatars/avatar5.png',
  'src/assets/avatars/avatar6.png',
  'src/assets/avatars/avatar7.png',
  'src/assets/avatars/avatar8.png',
  'src/assets/avatars/avatar9.png',
  'src/assets/avatars/avatar10.png',
];

function getPlayerIndex(playerID) {
  return Array.from(playerID).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getRandomAvatar(playerID) {
  if (!playerID) {
    return avatars[1];
  }
  let index = getPlayerIndex(playerID);
  return avatars[index % avatars.length];
}

function mapGameInfo(gameData) {
  if (!gameData) {
    console.error("No game data provided");
    return;
  }

  // Update game.value directly within this function
  game.value = {
    id: gameData.game_ID,
    size: gameData.size,
    creationDate: new Date(gameData.creation_date).toLocaleString(), // convert to readable date
    isFinished: gameData.finished,
    maxHP: gameData.HP_max,
    hasStarted: gameData.start,
    players: gameData.players_games.map(player => ({
      gameId: player.game_ID,
      playerId: player.player_ID,
      isWinner: player.winner,
      xpWon: player.xp_win,
      coinsWon: player.coins_win
    }))
  };
}

const winner = ref("N/A");
const loser = ref("N/A");

function seeWinner() {
  // Inicializa objetos vacíos para winner y loser
  winner.value = { playerId: "N/A", imageSrc: null, xpWon: 0, coinsWon: 0 };
  loser.value = { playerId: "N/A", imageSrc: null, xpWon: 0, coinsWon: 0 };

  if (!game.value || !game.value.players || game.value.players.length === 0) {
    // Si no hay datos de juego o jugadores, ambos se mantienen como "N/A"
    console.error("No game data or players available");
    return;
  }

  if (game.value.players.length === 1) {
    // Caso de un solo jugador en el juego
    const player = game.value.players[0];
    if (player.isWinner) {
      winner.value = player;
    } else {
      loser.value = player;
    }
    return;
  }

  // Caso de dos jugadores en el juego
  const [firstPlayer, secondPlayer] = game.value.players;
  winner.value = firstPlayer.isWinner ? firstPlayer : secondPlayer;
  loser.value = firstPlayer.isWinner ? secondPlayer : firstPlayer;
}

function loadGameInfo() {
  if (gameId) {
    fetch(`https://balandrau.salle.url.edu/i3/arenas/${gameId}`, {
      headers: {
        'Bearer': `${token.value}`,
        'Content-Type': 'application/json'
      }
    })
        .then(response => {
          console.log(response);
          if (response.status === 200) {
            return response.json();
          } else {
            console.error("Response error:", response);
            throw response;
          }
        })
        .then(data => {
          console.log(data);
          //Mapejem les dades del joc
          mapGameInfo(data);
          console.log("game INFO "+game);
          console.log(game.value.id);
          seeWinner();
        })
        .catch(error => {
          console.error("Error fetching game data:", error);
        });
  }
}

onMounted(loadGameInfo);
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Boto de tornar enrere -->
    <div class="fixed top-0 left-0 pt-4">
      <button @click="goBack" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <img src="/src/assets/game_filter/return_icon.png" class="w-6 h-6 mr-2 font-extrabold" alt=""/>
        <span class="hidden sm:inline">RETURN</span>
      </button>
    </div>

    <!-- Contenedor principal -->
    <div class="container mx-auto mt-1 max-w-5xl bg-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl">
      <!-- Contenedor de juego con fondo azul oscuro neón -->
      <div v-if="game" class="">
        <!-- Encabezado de Información del Juego -->
        <div class="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-lg shadow-md mb-6">
          <h4 class="text-4xl font-bold text-white text-center">Game Information</h4>
          <div class="grid grid-cols-2 gap-4 text-center mt-4">
            <div class="text-blue-200">
              <span class="text-lg">Name</span><br>
              <span class="text-white font-semibold">{{ game.id }}</span>
            </div>
            <div class="text-blue-200">
              <span class="text-lg">Board Size</span><br>
              <span class="text-white font-semibold">{{ game.size }}x{{ game.size }}</span>
            </div>
            <div class="text-blue-200">
              <span class="text-lg">Date of Creation</span><br>
              <span class="text-white font-semibold">{{ game.creationDate }}</span>
            </div>
            <div class="text-blue-200">
              <span class="text-lg">Maximum HP</span><br>
              <span class="text-white font-semibold">{{ game.maxHP }}</span>
            </div>
          </div>
        </div>

        <!-- Jugadores con Información de Monedas y XP -->
        <div class="flex justify-around items-center">
          <div class="flex flex-col items-center">
            <img :src="getRandomAvatar(winner.playerId)" class="w-24 h-24 mb-3 rounded-full shadow-xl transition-transform duration-300 hover:scale-110" />
            <span class="text-xl font-semibold text-yellow-300">{{ winner.playerId }}</span>
            <div class="mt-2 text-green-400 text-center">
              <span class="font-semibold">Coins: {{ winner.coinsWon }}</span><br>
              <span class="font-semibold">XP: {{ winner.xpWon }}</span>
            </div>
          </div>

          <span class="text-5xl text-white font-extrabold mx-10">VS</span>

          <div class="flex flex-col items-center hover-effect">
            <img :src="getRandomAvatar(loser.playerId)" class="w-24 h-24 mb-3 rounded-full shadow-xl transition-transform duration-300 hover:scale-110" />
            <span class="text-xl font-semibold text-red-500">{{ loser.playerId }}</span>
            <div class="mt-2 text-green-400 text-center">
              <span class="font-semibold">Coins: {{ loser.coinsWon }}</span><br>
              <span class="font-semibold">XP: {{ loser.xpWon }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.hover-effect:hover {
  transform: scale(1.05);
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>