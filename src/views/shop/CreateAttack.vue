<script>
import router from "../../router/index.js";
import {defineComponent, inject, ref} from "vue";
import {RouterLink} from "vue-router";
import Shop from "./Shop.vue";
import ReturnToShop from "../../ components/ReturnToShop.vue";

export default defineComponent({
  components: {ReturnToShop, Shop, RouterLink}
})
</script>

<script setup>
import {inject, onMounted, ref} from "vue";

const authToken = inject('authToken');
const errorMessage = ref('');
const successMessage = ref('');
const playerData = inject('playerData');
const coins = ref(playerData.value.coins);

const attacks = [
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

const getRandomAttackImage = () => {
  const randomIndex = Math.floor(Math.random() * attacks.length);
  return attacks[randomIndex];
};

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function checkForErrors(attackName, positionX, positionY) {
  errorMessage.value = '';
  successMessage.value = '';

  if (attackName.length > 20 || attackName.length < 1) {
    errorMessage.value = 'Error: The name must be between 1 and 20 characters.';
    return;
  }

  if (positionX < 0 || positionX > 9 || positionX === '') {
    errorMessage.value = 'Error: Position X must be an integer between 0 and 9.';
    return;
  }

  if (positionY < -9 || positionY > 9 || positionY === '') {
    errorMessage.value = 'Error: Position Y must be an integer between -9 and 9.';
  }
}

const createAttack = () => {
  const attackName = document.getElementById("name").value;
  const positionX = document.getElementById("positionX").value;
  const positionY = document.getElementById("positionY").value;
  const positions = `(${positionX},${positionY})`; // Formato (x,y)

  checkForErrors(attackName, positionX, positionY);

  fetch('https://balandrau.salle.url.edu/i3/shop/attacks', {
    method: 'POST',
    headers: { 'Bearer': `${authToken.value}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ attack_ID: attackName, positions: positions, img: getRandomAttackImage()})})
      .then(response => {
        if (response.status === 201) {
          errorMessage.value = '';
          successMessage.value = 'Attack created successfully!';
          sleep(800).then(() => {
            router.push('/shop');
          });
          return;
        }
        return response.json().then(json => {
          throw new Error(`Error: ${response.status} - ${json.message}`);
        });
      })
      .catch(error => {
        console.error('Error creating attack:', error.message);
        successMessage.value = '';
        if (errorMessage.value === '') {
          errorMessage.value = 'Error: The name already exists.';
        }
      });
};

const playerCoins = ref(0);

function getPlayerCoins() {
  const playerId = playerData.value.player_ID; // Obtener el ID del jugador desde playerData
  fetch(`https://balandrau.salle.url.edu/i3/players/${playerId}`, {
    method: 'GET',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error(`Error: ${response.status}`);
      })
      .then(player => {
        const coins = player.coins;
        console.log(`Coins for player ${playerId}: ${coins}`);
        playerCoins.value = coins;
      })
      .catch(error => {
        console.error('Error fetching player coins:', error.message);
      });
}

// Llamar a la función para obtener las monedas del jugador actual
onMounted(getPlayerCoins);

</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">

    <button class="bg-cyan-400 text-black font-bold py-2 md:py-5 px-4 md:px-10 rounded-r-full rounded-l-md text-base md:text-2xl uppercase fixed top-5 left-0">
      CREATE AN ATTACK
    </button>

    <!-- Imagen monedas -->
    <img src="/src/assets/shop/Monedas.png" alt="" class="mi-imagen" style="width: 150px; height: auto;">
    <div class="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-['Sigmar One'] absolute top-0 right-0 mt-6 mr-10">
      {{ playerCoins }}
    </div>

    <!--Imagen chico tamaño pequeño-->
    <div class="img-container">
      <img src="/src/assets/shop/imagen_createattack.png" alt=" " class="absolute top-50 left-0 m-4 w-50 h-50 object-cover">
    </div>

    <!-- Imagen del cuadro -->
    <div class="flex items-center justify-center h-1/2 sm:h-1/3 md:h-1/3 lg:h-1/4 xl:h-1/5">
      <div class="relative w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-full transition-transform duration-300 transform translate-y-0 sm:translate-y-1/4 md:translate-y-1/4 lg:translate-y-1/2 xl:translate-y-6 mi-contenedor">
        <div class="flex items-center justify-center p-8 h-full">
          <div class="h-[350px] xl:h-[400px] lg:h-[400px] md:h-[400px] sm:h-[350px] w-full xl:w-[700px] lg:w-[700px] md:w-[700px] sm:w-[700px] max-w-7xl bg-white bg-opacity-0 shadow-xl rounded" style="background-image: url('/src/assets/welcome_page/neon.png'); background-size: cover; background-position: center;">

            <!-- Contenedor para los campos -->
            <div class="p-8">
              <h2 class="text-xs h:text-xs sm:text-sm md:text-ml lg:text-xl xl:text-2xl font-bold text-white uppercase">THE DAMAGE
                WILL BE GENERATED RANDOMLY</h2>

              <div class="space-y-10 mt-6">
                <!-- Name -->
                <div>
                  <label for="name" class="block text-sm font-bold text-white uppercase">Name</label>
                  <input type="text" id="name" name="name" class="w-full p-2 mt-1 bg-white text-black rounded">
                </div>

                <!-- Direction -->
                <div class="flex flex-row justify-between">
                  <!-- Position X -->
                  <div class="flex-1 mr-2">
                    <label for="positionX" class="block text-sm font-bold text-white uppercase">Position X (positive integer)</label>
                    <input type="number" id="positionX" name="positionX" min="0" class="w-full p-2 mt-1 bg-white text-black rounded">
                  </div>

                  <!-- Position Y -->
                  <div class="flex-1 ml-2">
                    <label for="positionY" class="block text-sm font-bold text-white uppercase">Position Y (integer)</label>
                    <input type="number" id="positionY" name="positionY" class="w-full p-2 mt-1 bg-white text-black rounded">
                  </div>
                </div>

                <!-- Botón Create Attack -->
                <div class="text-right mb-4"> <!-- Agregar un margen abajo si es necesario -->
                  <button @click="createAttack" class="bg-purple-600 hover:bg-yellow-300 p-3 text-white font-bold px-6 rounded-lg text-lg sm:text-base md:text-lg lg:text-xl xl:text-2xl uppercase">
                    Create
                  </button>
                </div>

                <!-- Mensaje de Éxito -->
                <div v-if="successMessage" class="bg-green-400 text-white text-lg p-3 rounded-lg shadow-md border border-green-500 animate-fade-in-down">
                  {{ successMessage }}
                </div>

                <!-- Mensaje de Error -->
                <div v-if="errorMessage" class="bg-red-400 text-white text-lg p-3 rounded-lg shadow-md border border-red-500 animate-fade-in-down">
                  {{ errorMessage }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Botón de Regreso a Shop -->
    <ReturnToShop/>

  </div>
</template>

<style scoped>

</style>

<style>
.img-container {
  position: fixed;
  left: 4%;
  top: 50%;
  width: 100%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 1440px) {
  .img-container {
    display: flex;
  }
}

@media (max-width: 1439px) {
  .img-container {
    display: none;
  }
  .img-container img {
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
}
</style>

<!--CONTENEDOR DE LA MONEDA-->
<style>
.mi-imagen {
  position: absolute;
  top: 0;
  right: 0;
  margin: 4px;
}

@media screen and (max-width: 767px) {
  .mi-imagen {
    width: 20%;
    height: auto;
    margin-top: 15px;
  }
}

@media screen and (min-width: 768px) {
  .mi-imagen {
    width: 10%;
    height: auto;
  }
}
</style>

<style>
.mi-contenedor {
  position: relative;
  max-width: 700px;
  width: 100%;
  margin: auto;
}

@media screen and (max-width: 767px) and (min-width: 576px){
  .mi-contenedor {
    max-width: 100%;
    top: 0;
    right: 0;
  }
}

@media screen and (max-width: 980px) and (min-width: 768px) {
  .mi-contenedor {
    max-width: 100%;
    top: -40px;
  }
}

@media screen and (max-width: 1439px) and (min-width: 981px) {
  .mi-contenedor {
    max-width: 100%;
    top: -40px;
  }
}

@media screen and (max-width: 575px) and (min-width: 0px){
  .mi-contenedor {
    max-width: 90%;
    max-height: 1%;
  }
}
</style>
