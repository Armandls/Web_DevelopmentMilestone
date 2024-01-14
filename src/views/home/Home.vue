<script setup>
import {inject, onMounted, ref} from 'vue';
import router from "../../router/index.js";
import NavigationBar from "../../ components/NavigationBar.vue";
import shop from "../shop/Shop.vue";

const showModal = ref(false);
const confirmDeletion = ref(false);

const confirmDelete = () => {
  showModal.value = true;
}

const cancelDelete = () => {
  showModal.value = false;
};

const authToken = inject('authToken'); //Agafem el token del jugador desde App.vue

function deletePlayer() {
  fetch('https://balandrau.salle.url.edu/i3/players', {
    method: 'DELETE',
    headers: { 'Bearer': authToken.value, 'Content-Type': 'application/json' }
  })
      .then(response => {
        if (response.status === 204) {
          return;
        }
        throw new Error(`Error: ${response.status}`);
      })
      .catch(error => {
        console.error('Error deleting players:', error.message);
      });
}
const deleteUserAccount = () => {
  confirmDeletion.value = true;
  deletePlayer(); //Eliminem l'usuari
  router.push('/');
};

const attacks = ref([]);

const fetchAttacks = () => {
  fetch('https://balandrau.salle.url.edu/i3/players/attacks', {
    method: 'GET',
    headers: {
      'Bearer': `${authToken.value}`,
    }
  })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      })
      .then(data => {
        attacks.value = data.filter(attack => attack.equipped === true);
      })
      .catch(error => {
        console.error('Error fetching attacks:', error.message);
      });
}

// Call fetchAttacks on component mount
onMounted(() => {
  fetchAttacks();
});

function getAttackIndex(attackID) {
  return Array.from(attackID).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getRandomAttackImage(index) {
  const image = [
    'src/assets/attacks/1.png',
    'src/assets/attacks/2.png',
    'src/assets/attacks/3.png',
    'src/assets/attacks/4.png',
    'src/assets/attacks/5.png',
    'src/assets/attacks/6.png',
    'src/assets/attacks/7.png',
    'src/assets/attacks/8.png',
    'src/assets/attacks/9.png',
    'src/assets/attacks/10.png'
  ];
  return image[index % image.length];
}
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Contenedor de la imagen del logo y la imagen de inicio -->
    <div class="pt-4 md:pt-8 relative h-screen flex flex-col items-center justify-center">
      <div class="absolute top-0 w-full">
        <img src="/src/assets/welcome_page/logo_480x313.png" alt="" class="max-w-[600px] max-h-[600px] object-contain mx-auto">
        <!-- Contenedor de la imagen del inicio -->
        <div class="absolute top-32 left-[15%] lg:left-[40%] lg:mt-20 lg:top-1/4 transform -translate-x-1/2 -translate-y-1/3 animate-smooth-bounce">
          <img src="/src/assets/shop/inicio.png" alt="Inicio" class="w-80 h-100 object-contain mx-auto">
        </div>
        <!-- Contenedor de los 3 ataques -->
        <div class="absolute top-72 right-8 md:right-72 lg:right-72 hidden sm:flex flex-col space-y-2 md:space-y-4 lg:space-y-6">
          <!-- Per cada atac equipat -->
          <div v-for="(attack, index) in attacks" :key="attack.attack_ID" class="flex items-stretch">

            <!-- Imatge de l'atac -->
            <div class="bg-blue-400 rounded-l-xl p-1 flex justify-center items-center" style="width: fit-content;">
              <img v-if="attack.equipped" :src= getRandomAttackImage(getAttackIndex(attack.attack_ID)) :alt="`Espadas ${index + 1}`" class="w-16 h-16 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-16 lg:h-16 object-cover rounded" />
              <span v-else class="font-bold">No attack equipped</span>
            </div>

            <!-- Separate container for attack details -->
            <div v-if="attack.equipped" class="bg-blue-400 rounded-r-xl p-2 font-bold" style="width: fit-content;">
              <p class="text-xs"> Name: {{ attack.attack_ID }}</p>
              <p class="text-xs">Power: {{ attack.power }}</p>
              <p class="text-xs">Positions: {{ attack.positions }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de crear game y join game -->
      <div class="hidden md:flex justify-center items-center w-full fixed bottom-0 left-0 right-0 pl-5 pr-5 mb-14">
        <RouterLink to="/creategame" class="flex items-center justify-center bg-fuchsia-500 hover:bg-cyan-500 text-black font-bold py-4 rounded-full w-1/6 mx-2 uppercase text-2xl">
          Create Game
        </RouterLink>
        <RouterLink to="/joingame" class="flex items-center justify-center bg-fuchsia-500 hover:bg-cyan-500 text-black font-bold py-4 rounded-full w-1/6 mx-2 uppercase text-2xl">
          Join Game
        </RouterLink>
      </div>
      <!-- Sign out y delete account -->
      <div class="absolute top-4 right-4 flex flex-col justify-center items-center">
        <RouterLink to="/" class="bg-fuchsia-500  text-white font-bold py-2 px-4 rounded-full mb-2 hover:bg-red-600 transition duration-300 uppercase text-sm">
          Sign Out Now
        </RouterLink>
        <!-- Botón Eliminar Cuenta -->
        <button @click="confirmDelete" class="hidden md:block bg-fuchsia-500 text-white font-bold py-2 px-4 rounded-full mb-2 hover:bg-red-600 transition duration-300 uppercase text-sm">
          Delete Account
        </button>

        <!-- Peticion de confirmación -->
        <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div class="bg-white p-6 rounded shadow-lg">
            <h3 class="mb-4">Are you sure you want to delete your account?</h3>
            <div class="flex justify-around">
              <button @click="deleteUserAccount" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Yes
              </button>
              <button @click="cancelDelete" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Menu lateral -->
    <div class="flex-grow flex flex-col md:flex-row">
      <NavigationBar/>
      <div class="flex md:hidden flex-row justify-between items-center w-full fixed bottom-0 left-0 right-0 bg-black pl-5 pr-5">
        <!-- Create game y join game para pantallas pequeñas -->
        <div class="flex justify-center items-center w-full fixed bottom-0 left-0 right-0 px-5 mb-28 md:mb-4">
          <RouterLink to="/creategame" class="flex items-center justify-center bg-fuchsia-500 hover:bg-cyan-500 text-black font-bold py-2 rounded-full w-full md:w-1/3 mx-2 uppercase text-xl md:text-2xl">
            Create Game
          </RouterLink>
          <RouterLink to="/joingame" class="flex items-center justify-center bg-fuchsia-500 hover:bg-cyan-500 text-black font-bold py-2 rounded-full w-full md:w-1/3 mx-2 uppercase text-xl md:text-2xl">
            Join Game
          </RouterLink>
        </div>
      </div>

      <div class="md:hidden absolute top-5 left-6">
        <button @click="confirmDelete" class="bg-fuchsia-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 transition duration-300 uppercase text-sm">
          Delete
        </button>

        <!-- Peticion de Confirmación pantallas pequeñass -->
        <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div class="bg-white p-6 rounded shadow-lg">
            <h3 class="mb-4">Are you sure you want to delete your account?</h3>
            <div class="flex justify-around">
              <button @click="deleteUserAccount" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Yes
              </button>
              <button @click="cancelDelete" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style>

</style>

