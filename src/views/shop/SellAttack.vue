<script setup>
import { ref, watch, onMounted, inject } from 'vue';
import ReturnToShop from "../../ components/ReturnToShop.vue";
import router from "../../router/index.js";

const token = inject('authToken');
const playerData = inject('playerData');
const showDropdown = ref(false);
const selectedItems = ref([]);
const errorMessage = ref('');
const successMessage = ref('');
const items = ref([]);
const coins = ref(playerData.value.coins);
const authToken = inject('authToken');
function getAttackIndex(attackID) {
  return Array.from(attackID).reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function getRandomAttackImage(index) {
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
  return attacks[index % attacks.length]
}

//Función para listar los ataques que tiene el jugador
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
          items.value = data.map(attack => ({
            attackName: attack.attack_ID,
            positions: attack.positions,
            power: attack.power,
            equipped: attack.equipped,
            on_sale: attack.on_sale,
            img: getRandomAttackImage(getAttackIndex(attack.attack_ID))
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

// Método para obtener los estilos basados en el nivel del jugador
function getAttackStyles(attack) {
  if (attack.on_sale) {
    return {
      'background-color': '#383736',
      'border-color': '#000000'
    }
  }
  return {
    'background-color': '#752ae8',
    'border-color': '#03fcf0'
  };
}

// Watcher para seleccionar/deseleccionar items
watch(items, (newItems) => {
  selectedItems.value = newItems.filter(item => item.isSelected);
}, { deep: true });

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const showConfirmModal = ref(false);
const sellingQuantity = ref(0);
const selectedAttack = ref(null);

function sellAttackMessage(attack) {
  selectedAttack.value = attack;
  showConfirmModal.value = true;
}

async function confirmSell() {
  console.log('Vendiendo con cantidad:', sellingQuantity.value);
  await sellAttack(selectedAttack.value.attackName, sellingQuantity.value);
  showConfirmModal.value = false;
}

function cancelSell() {
  showConfirmModal.value = false;
}

function sellAttack(attackID, price) {
  fetch(`https://balandrau.salle.url.edu/i3/shop/attacks/${attackID}/sell`, {
    method: 'POST',
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      price: price
    })
  })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          successMessage.value = 'Attack sold successfully!';
          errorMessage.value = '';
          selectedAttack.value.on_sale = true;
          loadPlayerAttacks();
          onMounted(loadPlayerAttacks);
          return;
        }
        throw new Error(`Error: ${response.statusCode}`)
      })
      .catch(error => {
        console.error("Error selling attack:", error);
        errorMessage.value = 'Error selling attack!';
        successMessage.value = '';
      });
}

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
      SELL AN ATTACK
    </button>

    !-- Botón de Regreso a Shop -->
    <ReturnToShop/>

    <!-- Imagen monedas -->
    <img src="/src/assets/shop/Monedas.png" alt="" class="mi-imagen" style="width: 150px; height: auto;">
    <div class="text-white text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-['Sigmar One'] absolute top-0 right-0 mt-6 mr-10">
      {{ playerCoins }}
    </div>

    <!--Imagen chico tamaño pequeño-->
    <div class="img-container">
      <img src="/src/assets/shop/image 16.png" alt=" " class="absolute top-50 left-0 m-4 w-50 h-50 object-cover">
    </div>


    <div class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pr-5 mr-4">
      <div v-for="(item, index) in items" :key="item.id" :style="getAttackStyles(item)" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <div class="flex items-center">
          <!-- Superposición para ataques bloqueados -->
          <div v-if="item.equipped" class="relative top-0 left-0 w-28 h-full bg-black bg-opacity-50 flex items-center justify-center">
            <img src="/src/assets/attacks/candado.png" alt="Lock" class="w-16 h-16 object-cover object-fit-contain" />
          </div>

          <div v-if="item.on_sale" class="relative top-0 left-0 w-28 h-full bg-black bg-opacity-50 flex items-center justify-center">
            <img src="/src/assets/attacks/candado.png" alt="Lock" class="w-16 h-16 object-cover object-fit-contain" />
          </div>

          <div class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</div>
          <img class="w-[58px] h-[58px]" :src="item.img" alt=""/>
          <div class="attack-name-container text-black text-sm md:text-s lg:text-l xl:text-xl font-bold font-['Sigmar One'] uppercase ml-4">{{ item.attackName }}</div>
          <div class="flex-col">
            <div class="attack-positions-container text-black text-sm md:text-s lg:text-l xl:text-xl font-bold font-['Sigmar One'] uppercase ml-5">Positions</div>
            <div class="attack-positions-container text-black text-sm md:text-s lg:text-l xl:text-xl mt-2 font-bold font-['Sigmar One'] ml-4">{{ item.positions }}</div>
          </div>
          <div class="flex-col">
            <div class="attack-power-container text-black text-sm md:text-s lg:text-l xl:text-xl font-bold font-['Sigmar One'] uppercase ml-5">Power</div>
            <div class="attack-power-container text-black text-sm md:text-s lg:text-l xl:text-xl mt-2 font-bold font-['Sigmar One'] ml-4">{{ item.power }}</div>
          </div>
        </div>
        <div v-if="!item.equipped && !item.on_sale" class="sell-button-container mr-6 bg-cyan-400 rounded-xl">
          <button class="sell-button" @click="sellAttackMessage(item)">Sell</button>
        </div>
        <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-semibold mb-4 text-gray-800">Confirm Sale</h3>
            <p class="mb-4 text-md text-gray-600">Please enter the quantity to sell for <span class="font-bold text-gray-800">{{ selectedAttack.attackName }}</span>:</p>
            <input type="number" v-model="sellingQuantity" placeholder="Cantidad" class="border border-gray-300 rounded py-2 px-4 w-full mb-4" />
            <div class="flex justify-around">
              <button @click="confirmSell" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Confirm
              </button>
              <!-- Mostrar mensaje de error -->
              <div v-if="errorMessage" class="bg-red-500 text-white text-lg p-3 rounded-lg shadow-md border border-red-500 animate-fade-in-down">
                {{ errorMessage }}
              </div>
              <div v-if="successMessage" class="bg-green-500 text-white text-lg p-3 rounded-lg shadow-md border border-green-500 animate-fade-in-down">
                {{ successMessage }}
              </div>
              <button @click="cancelSell" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div v-if="item.equipped" class="flex items-center w-full h-full justify-between mr-80">
          <label class="text-white text-xl font-bold">EQUIPPED</label>
        </div>
        <div v-if="item.on_sale" class="flex items-center justify-between w-full">
          <label class="text-red-600 text-xl font-bold truncate">ON SALE</label>
        </div>
      </div>
    </div>
    </div>
</template>

<!-- IMAGEN MONEDAS -->

<style>
.mi-imagen {
  position: absolute;
  top: 0;
  right: 0;
  margin: 4px;}

@media screen and (max-width: 767px) {
  .mi-imagen {
    width: 20%;
    height: auto;
    margin-top: 10px;
  }
}

@media screen and (min-width: 768px) {
  .mi-imagen {
    width: 10%;
    height: auto;
  }
}

.attack-name-container {
  display: inline-block;
  width: 300px; /* Ajustar para el padding */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attack-positions-container {
  justify-content: center;
  display: flex;
  width: 130px; /* Ajustar para el padding */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attack-power-container {
  justify-content: center;
  display: flex;
  width: 100px; /* Ajustar para el padding */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sell-button {
  padding: 8px 16px;
  font-size: 1.25rem;
  font-weight: bold;
  text-transform: uppercase;
}

.sell-button-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>

