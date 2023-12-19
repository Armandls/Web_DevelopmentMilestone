<script setup>
import {inject, onMounted, ref} from "vue";
import {useRoute} from "vue-router";

const token = inject('authToken'); //Agafem el token del jugador desde App.vue
const game = ref(null);

const route = useRoute();
const gameId = route.query.gameID;
console.log(gameId);

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

const winner = ref(null);
const loser = ref(null);

function seeWinner() {
  if (!game.value || !game.value.players || game.value.players.length < 2) {
    console.error("No game or players data available to determine the winner.");
    return;
  }

  const [firstPlayer, secondPlayer] = game.value.players;
  winner.value = firstPlayer.isWinner ? firstPlayer : secondPlayer;
  loser.value = firstPlayer.isWinner ? secondPlayer : firstPlayer;

  console.log("Winner:", winner.value.playerId);
  console.log("Loser:", loser.value.playerId);
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
    <!-- Botón de volver atrás -->
    <div class="fixed top-0 left-0 pt-4">
      <router-link to="/joingame" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <img src="/src/assets/game_filter/return_icon.png" class="w-6 h-6 mr-2 font-extrabold" alt=""/>
        <span class="hidden sm:inline">RETURN</span>
      </router-link>
    </div>
    <div class="container mx-auto mt-1">
      <!-- Titol de la batalla (guanyador vs perdedor) -->
      <div class="text-center text-2xl font-bold mb-4">
        <!-- Comprova que els objectes winner i loser no són nuls abans d'accedir a les seves propietats -->
        {{ winner && winner.value && winner.value.playerId }} VS {{ loser && loser.value && loser.value.playerId }}
      </div>

      <!-- Contenidor per mostrar la informació del game (size, creation_date, HP_max) -->
      <div class="bg-blue-400 p-4 rounded shadow mb-4 mr-96 ml-96">
        <div>Game ID: {{ game && game.id }}</div>
        <div>Size: {{ game && game.size }}</div>
        <div>Creation Date: {{ game && game.creationDate }}</div>
        <div>Max HP: {{ game && game.maxHP }}</div>
      </div>

      <div class="flex justify-around">
        <!-- Contenedor del ganador -->
        <div class="bg-yellow-100 p-10 rounded shadow flex-1 mr-8 ml-24 mt-10">
          <div class="font-bold">INFO DEL GANADOR</div>
          <div>Nombre: {{ winner && winner.value && winner.value.playerId }}</div>
          <!-- Asegúrate de proporcionar una imagen por defecto si imageSrc no está definido -->
          <img :src="winner && winner.value && winner.value.imageSrc || '/default-winner-image.png'" alt="Ganador" class="w-24 h-24 my-2" />
          <div>Monedas Ganadas: {{ winner && winner.value && winner.value.coinsWon }}</div>
          <div>XP Ganada: {{ winner && winner.value && winner.value.xpWon }}</div>
        </div>

        <!-- Contenedor del perdedor -->
        <div class="bg-yellow-100 p-10 rounded shadow flex-1 mr-24 ml-8 mt-10">
          <div class="font-bold">INFO DEL PERDEDOR</div>
          <div>Nombre: {{ loser && loser.value && loser.value.playerId }}</div>
          <!-- Asegúrate de proporcionar una imagen por defecto si imageSrc no está definido -->
          <img :src="loser && loser.value && loser.value.imageSrc || '/default-loser-image.png'" alt="Perdedor" class="w-24 h-24 my-2" />
          <div>Monedas Ganadas: {{ loser && loser.value && loser.value.coinsWon }}</div>
          <div>XP Ganada: {{ loser && loser.value && loser.value.xpWon }}</div>
        </div>
      </div>
    </div>
    </div>
</template>

<style scoped>

</style>