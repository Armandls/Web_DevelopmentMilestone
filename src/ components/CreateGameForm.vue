<script setup>
import {inject, ref, onMounted} from 'vue';
import router from "../router/index.js";

const token = inject('authToken');
const name = ref(''); //Valor por defecto
const rowsAndColumns = ref(2); //Valor por defecto
const hp = ref(15); //Valor por defecto
const rowsErrorMessage = ref(''); //Variable para el mensaje de error de Filas y Columnas
const hpErrorMessage = ref(''); //Variable para el mensaje de error de HP
const nameErrorMessage = ref(''); //Variable para el mensaje de error del nombre
const attacks = ref([]);

function createGameInAPI() {
  fetch('https://balandrau.salle.url.edu/i3/arenas', {
    method: 'POST',
    headers: { 'Bearer': `${token.value}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_ID: name.value, size: rowsAndColumns.value, HP_max: hp.value})})
      .then(response => {
        if (response.status === 201) {
          console.log('Game created successfully!');
          router.push({ path: '/playgame', query: { name: name.value, rowsAndColumns: rowsAndColumns.value, hp: hp.value } });
          return;
        }
        return response.json().then(json => {
          throw new Error(`Error: ${response.status} - ${json.message}`);
        });
      })
      .catch(error => {
        console.error('Error creating game: ', error.message);
        nameErrorMessage.value = 'Error: The name already exists.';
      });
}

const createGame = () => {
  nameErrorMessage.value = '';
  rowsErrorMessage.value = '';
  hpErrorMessage.value = '';

  console.log("ATTACKS LENGTH: ", attacks.value.length);

  if (name.value.length < 1 || name.value.length > 21) {
    nameErrorMessage.value = 'The name must be between 1 and 21 characters';
  } if (rowsAndColumns.value < 2 || rowsAndColumns.value > 10) {
    rowsErrorMessage.value = 'The number of rows and columns must be between 2 and 10';
  } if (hp.value < 15) {
    hpErrorMessage.value = 'The HP must be at least 15';
  }

  if (nameErrorMessage.value === '' && rowsErrorMessage.value === '' && hpErrorMessage.value === '') {
    if (attacks.value.length < 1) {
      hpErrorMessage.value = 'You need at least one attack to create a game';
    } else {
      createGameInAPI();
    }
  }
};

//Get the attacks from the API
function loadPlayerAttacks() {
  fetch('https://balandrau.salle.url.edu/i3/players/attacks', {
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          console.log(response)
          return response.json();
        } else {
          console.error("Response error:", response);
          throw response;
        }
      })
      .then(data => {
        if (Array.isArray(data)) {
          // Primero filtramos los ataques que no estén en venta (attack.on_sale = false)
          const filteredAttacks = data.filter(attack => !attack.on_sale && attack.equipped);

          // Luego mapeamos los ataques ordenados para estructurarlos por orden
          attacks.value = filteredAttacks.map(attack => ({
            attackName: attack.attack_ID,
          }));
        } else {
          console.error("Expected an array, but got:", data);
        }
      })
      .catch(error => {
        console.error("Error fetching game data:", error);
      });
}

onMounted(loadPlayerAttacks);

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-cover bg-no-repeat bg-center" style="background-image: url('/src/assets/welcome_page/background.png')">

    <!-- Return Home -->
    <div class="fixed top-0 left-0 pt-4">
      <router-link to="/home" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <font-awesome-icon icon="home" class="mr-2"/>
        <span class="hidden sm:inline">Home</span>
      </router-link>
    </div>

    <!-- Container para los campos -->
    <div class="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
      <div class="flex items-center justify-center p-8">
        <div class="w-full max-w-7xl bg-black bg-opacity-60 shadow-xl rounded" style="background-image: url('/src/assets/welcome_page/neon.png'); background-size: cover; background-position: center;">

          <div class="p-8">
            <h2 class="mb-6 text-3xl font-bold text-center text-white uppercase">Create a Game</h2>

            <div class="space-y-4">
              <!-- Nombre de la partida -->
              <div>
                <label for="rows" class="block text-sm font-bold text-white uppercase">Name</label>
                <input @keyup.enter="createGame" type="text" id="name" v-model="name" class="w-full p-2 mt-1 bg-cyan-300 text-black rounded">
                <p v-if="nameErrorMessage" class="text-red-500">{{ nameErrorMessage }}</p>
              </div>

              <!-- Numero Rows i Columns -->
              <div>
                <label for="rows" class="block text-sm font-bold text-white uppercase">Number of Rows & Columns (2 - 10)</label>
                <input @keyup.enter="createGame" type="number" id="rows" v-model.number="rowsAndColumns" min="2" max="10" class="w-full p-2 mt-1 bg-cyan-300 text-black rounded">
                <p v-if="rowsErrorMessage" class="text-red-500">{{ rowsErrorMessage }}</p>
              </div>

              <!-- Player HP -->
              <div>
                <label for="hp" class="block text-sm font-bold text-white uppercase">Player HP</label>
                <input @keyup.enter="createGame" type="number" id="hp" v-model.number="hp" min="15" class="w-full p-2 mt-1 bg-cyan-300 text-black rounded">
                <p v-if="hpErrorMessage" class="text-red-500">{{ hpErrorMessage }}</p>
              </div>

              <!-- Create Game -->
              <button @click="createGame" @keyup.enter="createGame" class="block px-4 py-2 mt-4 text-lg font-bold text-center text-black bg-yellow-400 rounded hover:bg-yellow-500 uppercase">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>