<script setup>
import {computed, inject, onMounted, ref} from 'vue';
import NavigationBar   from "../../ components/NavigationBar.vue";
import PlayerSearch from "../../ components/PlayerSearch.vue";
import PlayerList from "../../ components/PlayerList.vue";

//Agafem el token de l'usuari que s'ha loggejat, per a poder fer la peticio GET a la API
const authToken = inject('authToken'); //Agafem el token del jugador desde App.vue

const avatars = [
  'src/assets/welcome_page/avatar1.png',
  'src/assets/welcome_page/avatar2.png',
  'src/assets/welcome_page/avatar3.png',
  'src/assets/welcome_page/avatar4.png',
  'src/assets/welcome_page/avatar5.png',
  'src/assets/welcome_page/avatar6.png',
  'src/assets/welcome_page/avatar7.png',
  'src/assets/welcome_page/avatar8.png',
  'src/assets/welcome_page/avatar9.png',
  'src/assets/welcome_page/avatar10.png',
];

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

const items = ref([]);
const fetchPlayers = () => {
  fetch('https://balandrau.salle.url.edu/i3/players', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log("TOKEN" + authToken.value);
        console.log(response);
        if (response.status === 200) {
          console.log(response)
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(players => {
        items.value = players.map(player => ({
          imageSrc: avatars.includes(player.img) ? player.img : getRandomAvatar(),
          username: player.player_ID,
          level: player.level,
          xp: player.xp
        }));
      })
      .catch(error => {
        console.error('Error fetching players:', error.message);
        // Potser mostrar un missatge d'error a l'usuari
      });
};

const searchQuery = ref('');
const handleSearch = (query) => {
  searchQuery.value = query;
};

const filteredItems = computed(() => {
  if (!searchQuery.value) {
    return items.value;
  }
  return items.value.filter(item =>
      item.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(fetchPlayers);
</script>

<template>
  <header class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-20 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Cercador de jugadors -->
    <PlayerSearch @search="handleSearch" />

    <article class="flex justify-center md:justify-start items-start pt-4 md:pt-20 w-full">
      <aside class="ml-2 md:ml-64 lg:ml-[200px] xl:ml-[350px] 2xl:ml-[350px]">
        <div class="flex flex-col md:flex-row items-center bg-fuchsia-300 w-full p-4 rounded">
          <h2 class="text-black text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold font-['Sigmar One'] uppercase">TOP PLAYERS</h2>
        </div>
      </aside>
    </article>

    <!-- Container pels personatges -->
    <PlayerList :items="filteredItems" />

    <!-- Navigation Bar -->
    <NavigationBar/>
  </header>
</template>

<style scoped>
</style>

