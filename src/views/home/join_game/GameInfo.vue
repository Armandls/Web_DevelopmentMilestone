<script setup>
import {inject, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const token = inject('authToken'); //Agafem el token del jugador desde App.vue
const game = ref(null);

const route = useRoute();
const gameId = route.query.gameID;
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

const winnerImage = ref(null);
const loserImage = ref(null);

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

  seeWinner();

  // Carregar imatges
  if (winner.value.playerId !== "N/A") {
    loadWinnerImage();
  }
  if (loser.value.playerId !== "N/A") {
    loadLoserImage();
  }
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
          if (response.status === 200) {
            return response.json();
          } else {
            console.error("Response error:", response);
            throw response;
          }
        })
        .then(data => {
          //Mapejem les dades del joc
          mapGameInfo(data);
          seeWinner();
        })
        .catch(error => {
          console.error("Error fetching game data:", error);
        });
  }
}

function loadWinnerImage() {
  fetch(`https://balandrau.salle.url.edu/i3/players/${winner.value.playerId}`, {
    method: 'GET',
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(player => {
        // Comprovació si l'URL de la imatge és vàlida
        winnerImage.value = (player.img && /^https:\/\/[^\s,]+/.test(player.img))
            ? player.img
            : getRandomAvatar(winner.value.playerId);
      })
      .catch(error => {
        console.error('Error fetching players:', error.message);
        winnerImage.value = getRandomAvatar(winner.value.playerId);
      });
}

function loadLoserImage() {
  fetch(`https://balandrau.salle.url.edu/i3/players/${loser.value.playerId}`, {
    method: 'GET',
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(player => {
        // Comprovació si l'URL de la imatge és vàlida
        loserImage.value = (player.img && /^https:\/\/[^\s,]+/.test(player.img))
            ? player.img
            : getRandomAvatar(loser.value.playerId);
      })
      .catch(error => {
        console.error('Error fetching players:', error.message);
        loserImage.value = getRandomAvatar(loser.value.playerId);
      });
}


onMounted(loadGameInfo);

const handlePlayerClick = (playerId) => {
  getPlayerInfo(playerId)
      .then(item => {
        router.push({
          name: 'profileranking',
          query: {
            username: item.username,
            imageSrc: item.imageSrc,
            lvl: item.level,
            xp: item.xp
          }
        });
      })
      .catch(error => {
        console.error('Error handling player click:', error);
        // Gestiona l'error com creguis convenient
      });
};

function getPlayerInfo(playerId) {
  return fetch(`https://balandrau.salle.url.edu/i3/players/${playerId}`, {
    method: 'GET',
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(player => {
        // Comprovació si l'URL de la imatge és vàlida
        return {
          username: player.player_ID,
          imageSrc: (player.img && /^https:\/\/[^\s,]+/.test(player.img))
              ? player.img
              : getRandomAvatar(player.player_ID),
          level: player.level,
          xp: player.xp
        };
      })
      .catch(error => {
        console.error('Error fetching player:', error.message);
        return {
          username: playerId,
          imageSrc: getRandomAvatar(playerId),
          level: 0,
          xp: 0
        };
      });
}
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
        <div class="flex justify-around items-center mb-6">
          <div class="flex flex-col items-center group hover-effect">
            <div class="relative">
              <!-- Efecto de gradiente animado -->
              <div class="absolute -inset-2 rounded-full blur-md opacity-75 animate-gradient"></div>
              <!-- Imagen del ganador -->
              <img @click="() => handlePlayerClick(winner.playerId)" :src="winnerImage" class="relative w-24 h-24 mb-3 rounded-full shadow-xl transition-transform duration-300 hover:scale-110" alt=""/>
            </div>

            <!-- Nombre del ganador con icono de trofeo -->
            <div class="mt-2 flex items-center justify-center bg-yellow-500 text-white font-bold text-lg rounded shadow-lg px-4 py-1">
              <span>{{ winner.playerId }}</span>
            </div>
            <div class="mt-2 text-yellow-300 text-center">
              <span class="font-semibold">Coins: {{ winner.coinsWon }}</span><br>
              <span class="font-semibold">XP: {{ winner.xpWon }}</span>
            </div>
          </div>

          <span class="text-5xl text-white font-extrabold mx-10">VS</span>

          <div class="flex flex-col items-center hover-effect">
            <img @click="() => handlePlayerClick(loser.playerId)" :src="loserImage" class="w-24 h-24 mb-3 rounded-full shadow-xl transition-transform duration-300 hover:scale-110" />
            <span class="mt-2 px-4 py-1 bg-red-600 text-white font-bold text-lg rounded shadow-lg">{{ loser.playerId }}</span>
            <div class="mt-2 text-red-600 text-center">
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

@keyframes gradientAnimation {
  0% {
    background-position: 0 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.animate-gradient {
  background: linear-gradient(90deg,
  #FF6B6B, #FFD500, #FF4757, #FFF500,
  #7ED957, #4D96FF, #812FF8, #FC67FA,
  #FDB813, #00C9FF, #92FE9D, #FF758C,
  #FF7EB3, #7AF8FF, #D4FF00, #F8BD7F,
  #FF6B6B, #FFD500, #FF4757, #FFF500,
  #7ED957, #4D96FF, #812FF8, #FC67FA,
  #FDB813, #00C9FF, #92FE9D, #FF758C,
  #FF7EB3, #7AF8FF, #D4FF00, #F8BD7F);
  background-size: 600% 100%;
  animation: gradientAnimation 5s linear infinite;
}

.hover-effect:hover {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>