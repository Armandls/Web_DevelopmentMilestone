<script setup>
import {inject, onMounted, ref} from "vue";

//TODO: PANTALLA QUE TINDRÀ TOTA LA INFORMACIÓ DEL JOC, COM QUI HA GUANYAT, QUI HA PERDUT, ETC


const token = inject('authToken'); //Agafem el token del jugador desde App.vue
const game = ref(null);

function loadGameInfo() {
  const gameId = localStorage.getItem('gameId');
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
          //Parxexar la informacio del game
          game.value = data;
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


  </div>
</template>

<style scoped>

</style>