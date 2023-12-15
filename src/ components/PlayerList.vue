<template>
  <main class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-6 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5 mb-10">
    <!-- Bucle per a cada jugador en la llista filtrada -->
    <RouterLink v-for="(item, index) in filteredItems" :key="item.id" :to="`/profileranking`" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
      <div class="flex items-center">
        <span class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</span>
        <img class="w-[58px] h-[58px]" :src="item.imageSrc" />
        <span class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.username }} - Level: {{ item.level }}%</span>
        <aside class="flex flex-col items-center justify-center bg-transparent p-3 ml-2 rounded-2xl mb-2.5">
          <p class="text-black font-bold text-xl rounded">{{item.xp}} EXP</p>
        </aside>
      </div>
    </RouterLink>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps(['searchQuery']);
const items = ref([]);

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

const fetchPlayers = () => {
  const token = this.$root.authToken; // Obtenim el token de l'usuari
  fetch('https://balandrau.salle.url.edu/i3/players', {
    method: 'GET', //Fem la peticio GET
    headers: { //Els headers necessiten el token i el tipus de contingut
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => { //Amb el que ens respongui la API:
        if (response.status === 200) { //Si el codi es 200, es correcte
          return response.json(); //Retornem el json que ens ha enviat la API
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(players => { //Amb el json que ens ha enviat la API
        items.value = players.map(player => ({ //Per cada jugador, creem un objecte amb les dades que ens interessen
          imageSrc: avatars.includes(player.img) ? player.img : getRandomAvatar(), //Assignem un avatar aleatori si no està en la llista
          username: player.player_ID,
          level: player.level,
          xp: player.xp
        }));
      })
      .catch(error => { //Si hi ha un error
        console.error('Error fetching players:', error.message);
        //Aqui hauriem de mostrar un missatge d'error
      });
};

onMounted(fetchPlayers);

const filteredItems = computed(() => {
  if (!props.searchQuery) {
    return items.value;
  }
  return items.value.filter(item =>
      item.username.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});
</script>
