<script setup>
import { ref, provide, onMounted } from 'vue';

const playerData = ref(null);
const authToken = ref(null);

//Funció per actualitzar les dades del jugador que s'ha loggejat
const setPlayerData = (data) => {
  playerData.value = data;
  console.log("token: " + data.token);
  authToken.value = data ? data.token : null;
};

provide('setPlayerData', setPlayerData); //Proveim la funció per a actualitzar les dades del jugador al component fill que ens ho demani

provide('playerData', playerData); //Proveim les dades del jugador al component fill que ens ho demani
provide('authToken', authToken); //Proveim el token del jugador al component fill que ens ho demani

onMounted(() => {
  const storedData = localStorage.getItem('playerData');
  if (storedData) {
    setPlayerData(JSON.parse(storedData)); // Utilitza la funció per a establir les dades
  }
});
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>
