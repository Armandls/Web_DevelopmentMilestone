<script setup>
import {computed, inject, onMounted, ref} from 'vue';
import NavigationBar   from "../../ components/NavigationBar.vue";
import PlayerSearch from "../../ components/PlayerSearch.vue";
import PlayerList from "../../ components/PlayerList.vue";
import router from "../../router/index.js";

//Agafem el token de l'usuari que s'ha loggejat, per a poder fer la peticio GET a la API
const authToken = inject('authToken'); //Agafem el token del jugador desde App.vue

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

function getRandomAvatar (playerID) {
  let index = getPlayerIndex(playerID);
  return avatars[index % avatars.length];
}

const items = ref([]);
const fetchPlayers = () => {
  fetch('https://balandrau.salle.url.edu/i3/players', {
    method: 'GET',
    headers: {
      'Bearer': `${authToken.value}`,
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
          imageSrc: (player.img.match(/^https:\/\/[^\s,]+/) ? player.img : getRandomAvatar(player.player_ID)),
          username: player.player_ID,
          level: player.level,
          xp: player.xp
        }));
      })
      .catch(error => {
        console.error('Error fetching players:', error.message);
      });
};

const searchQuery = ref('');
const isSearching = computed(() => searchQuery.value.length > 0);

const handleSearch = (query) => {
  searchQuery.value = query;
};

const filteredItems = computed(() => {
  const sorted = [...items.value].sort((a, b) => {
    if (a.level > b.level) return -1;
    if (a.level < b.level) return 1;

    if (a.xp > b.xp) return -1;
    if (a.xp < b.xp) return 1;

    return 0;
  });

  if (searchQuery.value) {
    return sorted.filter(item =>
        item.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return sorted;
});

onMounted(fetchPlayers);

const handlePlayerClick = (item) => {
  console.log(item.username);
  console.log(item.imageSrc);
  console.log(item.level);
  console.log(item.xp);
  router.push({
    name: 'profileranking',
    query: {
      username: item.username,
      imageSrc: item.imageSrc,
      lvl: item.level,
      xp: item.xp
    }
  });
};
</script>

<template>
  <header class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-20 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Cercador de jugadors -->
    <PlayerSearch @search="handleSearch" />

    <article class="flex justify-center items-start pt-4 md:pt-20 w-full">
      <aside>
        <div class="flex flex-col md:flex-row items-center bg-fuchsia-300 w-full p-4 rounded">
          <h2 class="text-black text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold font-['Sigmar One'] uppercase">LEADERBOARD</h2>
        </div>
      </aside>
    </article>

    <!-- Container pels personatges -->
    <PlayerList :items="filteredItems" :isSearching="isSearching"  @playerClick="handlePlayerClick"/>
    <!-- Navigation Bar -->
    <NavigationBar/>
  </header>
</template>
<style scoped>
</style>

