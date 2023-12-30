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
      <!-- Contenidor per mostrar la informació del game (size, creation_date, HP_max) -->
      <div class="justify-center mx-auto items-center text-center bg-blue-400 p-4 rounded shadow mb-4 top-1.5" v-if="game">
        <div class="bbg- rounded ml-96" style="width: 715px; height: 50px;">
          <div class="items-center text-center text-4xl font-bold mb-4 mt-3">
            {{ winner.playerId }} VS {{ loser.playerId }}
          </div>
        </div>
        <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] rounded px-40 mt-3">
            <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One']  bg-blue-300 rounded p-1.5 mr-96 ml-96">
              Game ID: {{ game.id }}
            </div>

            <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-purple-300 rounded p-1.5 pt-2 mr-96 ml-96">
              Size: {{ game.size }}
            </div>

            <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-pink-300 rounded p-1.5 pt-2 mr-96 ml-96">
              Creation Date: {{ game.creationDate }}
            </div>

            <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-green-200 rounded p-1.5 pt-2 mr-96 ml-96">
              Max HP: {{ game.maxHP }}
            </div>
          </div>

            <div class="flex justify-around">
              <!-- Contenedor del ganador -->
              <div class="justify-center mx-auto items-center text-center bg-yellow-100 p-5 rounded shadow flex-1 mr-8 ml-24 mt-10" v-if="winner">
                <div class="font-bold text-2xl">GANADOR</div>
                  <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] rounded p-3 px-16">
                    <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-blue-300 rounded p-1.5 ">
                      Name: {{ winner.playerId }}
                    </div>

                    <img :src="winner.imageSrc || '/default-winner-image.png'" class="w-24 h-24 my-2" />

                    <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-purple-300 rounded p-1.5 pt-2">
                      Coins: {{ winner.coinsWon }}
                    </div>

                    <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-pink-300 rounded p-1.5 pt-2">
                      XP: {{ winner.xpWon }}
                    </div>
                    </div>
              </div>


              <!-- Contenedor del perdedor -->
              <div class="justify-center mx-auto items-center text-center bg-yellow-100 p-5 rounded shadow flex-1 mr-8 ml-24 mt-10" v-if="loser">
                <div class="font-bold text-2xl">PERDEDOR</div>
                <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] rounded p-3 px-16">
                  <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-blue-300 rounded p-1.5 ">
                    Name: {{ loser.playerId }}
                  </div>

                  <img :src="loser.imageSrc || '/default-winner-image.png'" class="w-24 h-24 my-2" />

                  <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-purple-300 rounded p-1.5 pt-2">
                    Coins: {{ loser.coinsWon }}
                  </div>

                  <div v-if="!game.finished" class="items-center text-black text-sm md:text-md lg:text-lg font-bold font-['Sigmar One'] bg-pink-300 rounded p-1.5 pt-2">
                    XP: {{ loser.xpWon }}
                  </div>
                </div>
              </div>
            </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>