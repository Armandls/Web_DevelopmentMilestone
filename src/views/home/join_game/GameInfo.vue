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

  const gameInfo = {
    id: gameData.game_ID,
    size: gameData.size,
    creationDate: gameData.creation_date,
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

function seeWinner() { //Guardar info del guanyador, i del perdedor
  if(game.value.players[0].isWinner === true) {
    winner.value = game.value.players[0];
    loser.value = game.value.players[1];
  } else {
    winner.value = game.value.players[1];
    loser.value = game.value.players[0];
  }
}

function loadGameInfo() {
  if (gameId) {
    fetch(`https://balandrau.salle.url.edu/i3/games/${gameId}`, {
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
          console.log(data);
          //Mapejem les dades del joc
          mapGameInfo(data);
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
    <div class="container mx-auto mt-10">
      <!-- Titol de la batalla (guanyador vs perdedor) -->
      <div class="text-center text-2xl font-bold mb-4">
        <!-- Comprova que els objectes winner i loser no són nuls abans d'accedir a les seves propietats -->
        {{ winner && winner.value && winner.value.playerId }} VS {{ loser && loser.value && loser.value.playerId }}
      </div>

      <!-- Contenidor per mostrar la informació del game (size, creation_date, HP_max) -->
      <div class="bg-gray-200 p-4 rounded shadow mb-4">
        <!-- Comprova que game no és nul abans d'accedir a les seves propietats -->
        <div>Game ID: {{ game && game.value && game.value.id }}</div>
        <div>Size: {{ game && game.value && game.value.size }}</div>
        <div>Creation Date: {{ game && game.value && game.value.creationDate }}</div>
        <div>Max HP: {{ game && game.value && game.value.maxHP }}</div>
      </div>

      <div class="flex justify-around">
        <!-- Contenidor del guanyador -->
        <div class="bg-gray-300 p-4 rounded shadow flex-1 mr-2">
          <div class="font-bold">INFO DEL GUANYADOR</div>
          <div>Nom: {{ winner && winner.value && winner.value.playerId }}</div>
          <!-- Assegura't de proporcionar una imatge per defecte si imageSrc no està definit -->
          <img :src="winner && winner.value && winner.value.imageSrc || '/default-winner-image.png'" alt="Guanyador" class="w-24 h-24 my-2" />
          <div>Monedes Guanyades: {{ winner && winner.value && winner.value.coinsWon }}</div>
          <div>XP Guanyada: {{ winner && winner.value && winner.value.xpWon }}</div>
        </div>

        <!-- Contenidor del perdedor -->
        <div class="bg-gray-300 p-4 rounded shadow flex-1 ml-2">
          <div class="font-bold">INFO DEL PERDEDOR</div>
          <div>Nom: {{ loser && loser.value && loser.value.playerId }}</div>
          <!-- Assegura't de proporcionar una imatge per defecte si imageSrc no està definit -->
          <img :src="loser && loser.value && loser.value.imageSrc || '/default-loser-image.png'" alt="Perdedor" class="w-24 h-24 my-2" />
          <div>Monedes Guanyades: {{ loser && loser.value && loser.value.coinsWon }}</div>
          <div>XP Guanyada: {{ loser && loser.value && loser.value.xpWon }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>