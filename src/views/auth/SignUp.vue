<script setup>
import { RouterLink } from 'vue-router';
import {inject, ref} from 'vue';
import router from "../../router/index.js";

const playerID = ref('');
const password = ref('');
const imageLink = ref('');
const errorMessage = ref('');
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

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

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * avatars.length);
  return avatars[randomIndex];
};

const setPlayerData = inject('setPlayerData');

function signInPlayer(player, pwd) {
  fetch('https://balandrau.salle.url.edu/i3/players/join', { // Enllaç de l'API
    method: 'POST', // Mètode de l'API per aquesta petició
    headers: { // Headers de l'API per aquesta petició
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ // Dades enviades a l'API per aquesta petició
      player_ID: player,
      password: pwd
    })
  })
      .then(response => {
        //console.log(this.$root);
        console.log(response);
        if (response.status === 200) { // Si la resposta és exitosa
          return response.json(); // Retornem el JSON de la resposta
        } else {
          throw response; // Si no és 200, llancem l'error
        }
      })
      .then(data => { // Amb el JSON de la resposta
        let img = (data.img.match(/^https:\/\/[^\s,]+/) ? data.img : getRandomAvatar(data.player_ID));
        console.log('Player info: ', data);
        const playerData = {
          player_ID: data.player_ID,
          img: img,
          xp: data.xp,
          level: data.level,
          coins: data.coins,
          token: data.token
        };
        localStorage.setItem('playerData', JSON.stringify(playerData)); //Guardem les dades de l'usuari al localStorage
        setPlayerData(playerData); //Guardem les dades de l'usuari al app.vue
        router.push('/home'); //Anem a la pàgina de home
      })
      .catch(error => {
        if (error instanceof Response) {
          // Si el error es una respuesta HTTP, se intenta parsear como JSON
          error.json().then(errorData => {
            errorMessage.value = errorData.message ? 'Error signing in! ' + errorData.message : 'Error signing in!';
          }).catch(jsonError => {
            // Error en caso de que el JSON sea inválido
            console.error('Error parsing JSON:', jsonError);
            errorMessage.value = 'Error signing in! Response not in JSON format.';
          });
        } else {
          // El error es de otro tipo (no relacionado con la respuesta HTTP) -> Global Protect
          console.error('Network error or other issue:', error);
          errorMessage.value = 'Network error! Please check Global Protect connection.';
        }
      });
}

const signUp = () => {
  fetch('https://balandrau.salle.url.edu/i3/players', { //Link de la API
    method: 'POST', //Metode de la API per aquella petició
    headers: { //Headers de la API per aquella petició
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ //Variables que s'envien a la API per aquella petició
      player_ID: playerID.value,
      password: password.value,
      img: imageLink.value //Fem servir la funció que hem creat per a obtenir un avatar aleatori
    })
  })
      .then(response => { //Amb el que ens respongui la API:
        if (response.status === 201) { //En aquest cas ens retornava només 201 en cas d'exit i un json en cas d'error, per tant primer comparem directament amb 201
          console.log('Player created successfully -> Now login it!');

          signInPlayer(playerID.value, password.value); //Fem sign in automàticament
        } else {
          return response.json(); //Si no és 201, retornem el json que ens ha enviat la API
        }
      })
      .then(data => { //Amb el json que ens ha enviat la API:
        if (data) { //Si hi ha un json, és que hi ha hagut un error
          console.error('Error creating player', data);
          errorMessage.value = data.message ? 'Error creating the player! ' + data.message : 'Error creating the player!';
        }
      })
      .catch(error => {
        if (error instanceof Response) {
          // Si el error es una respuesta HTTP, se intenta parsear como JSON
          error.json().then(errorData => {
            errorMessage.value = errorData.message ? 'Error signing up! ' + errorData.message : 'Error signing up!';
          }).catch(jsonError => {
            // Error en caso de que el JSON sea inválido
            console.error('Error parsing JSON:', jsonError);
            errorMessage.value = 'Error signing up! Response not in JSON format.';
          });
        } else {
          // El error es de otro tipo (no relacionado con la respuesta HTTP) -> Global Protect
          console.error('Network error or other issue:', error);
          errorMessage.value = 'Network error! Please check Global Protect connection.';
        }
      });
};
</script>

<template>
  <div class="flex flex-col min-h-screen w-screen items-center justify-center bg-cover bg-no-repeat bg-center" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Logo -->
    <div class="flex justify-center items-center w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mb-1">
      <img src="/src/assets/welcome_page/logo_480x313.png" alt="" class="max-w-[380px] max-h-[213px]">
    </div>

    <!-- Contenidor Neon -->
    <div class="relative w-9/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 pb-2/3 sm:pb-1/2 md:pb-2/5 lg:pb-1/3 2xl:pb-1/4">
      <img src="/src/assets/welcome_page/neon_signup.png" alt="" class="relative left-0 right-0 bottom-4 object-cover">

      <!-- Camps de registre -->
      <div class="absolute top-0 left-0 right-0 bottom-4 flex flex-col items-center justify-center p-4 md:p-6 gap-4">
        <div class="text-white text-3xl font-semibold uppercase">Sign Up</div>

        <div class="flex flex-col w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bottom-4">
          <!-- Username -->
          <div class="flex flex-col w-full mb-2">
            <label class="text-white text-sm font-semibold">Username *</label>
            <input v-model="playerID" type="text" placeholder="Enter username" class="w-full h-10 px-4 bg-white rounded-md border border-neutral-200">
          </div>

          <div class="flex flex-col w-full mb-2">
            <label class="text-white text-sm font-semibold">Profile picture *</label>
            <input v-model="imageLink" type="text" placeholder="Enter profile picture link" class="w-full h-10 px-4 bg-white rounded-md border border-neutral-200">
          </div>

          <!-- Password -->
          <div class="flex flex-col w-full mb-4">
            <label class="text-white text-sm font-semibold">Password *</label>
            <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Enter password" class="w-full h-10 px-4 bg-white rounded-md border border-neutral-200">
            <div class="flex justify-end items-center text-white text-sm mt-1 cursor-pointer" @click="togglePasswordVisibility">
              <div>{{ showPassword ? 'Hide' : 'Show' }} password</div>
            </div>
          </div>

          <!-- Sign Up -->
          <button  @click="signUp" class="flex justify-center items-center bg-fuchsia-500 text-yellow-400 font-semibold py-2 rounded-full text-center w-full">
              Sign Up
          </button>

          <!-- Sign In -->
          <div class="flex justify-center text-center text-white mt-4">
            <span class="pr-1">Already have an account?</span>
            <RouterLink to="/signin" class="font-bold">Sign In</RouterLink>
          </div>
        </div>

        <div class="flex justify-center items-center w-full">
          <div v-if="errorMessage" class="bg-red-400 text-white text-lg p-3 rounded-lg shadow-md mt-4 border border-red-500 animate-fade-in-down">
            {{ errorMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  color: #a1a1a1;
}
</style>
