<script setup>
import { ref, watch, onMounted, inject } from 'vue';
import ReturnToShop from "../../ components/ReturnToShop.vue";

const authToken = inject('authToken');
const playerData = inject('playerData');
const items = ref([]);
const showDropdown = ref(false);
const selectedItems = ref([]);
const errorMessage = ref('');
const successMessage = ref('');

function getRandomAttackImage() {
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
  return attacks[Math.floor(Math.random() * attacks.length)];
}

// Función para obtener ataques desde la API
const fetchAttacks = () => {
  fetch('https://balandrau.salle.url.edu/i3/shop/attacks', {
    method: 'GET',
    headers: { 'Bearer': `${authToken.value}`, 'Content-Type': 'application/json' }
  })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(attacks => {
        items.value = attacks.map(attack => ({
          ...attack,
          attackName: attack.attack_ID,
          positions: attack.positions,
          power: attack.power,
          price: attack.price,
          level_needed: attack.level_needed,
          imageSrc: getRandomAttackImage(), // Asignar una imagen aleatoria
          isSelected: false,
          isAbovePlayerLevel: attack.level_needed > playerData.value.level
        }));
      })
      .catch(error => {
        console.error('Error fetching attacks:', error.message);
        errorMessage.value = 'Error fetching attacks. ' + error.message;
        successMessage.value = '';
      });
};

onMounted(fetchAttacks);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

// Watcher para seleccionar/deseleccionar items
watch(items, (newItems) => {
  selectedItems.value = newItems.filter(item => item.isSelected);
}, { deep: true });

// Método para obtener los estilos basados en el nivel del jugador
function getAttackStyles(attack) {
  if (attack.isAbovePlayerLevel) {
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

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function buyAttacks() {
  let total = 0;
  for (let i = 0; i < selectedItems.value.length; i++) {
    total += selectedItems.value[i].price;
  }
  if (playerData.value.coins >= total) {
    for (let i = 0; i < selectedItems.value.length; i++) {
      buyAttack(selectedItems.value[i].attack_ID);
    }
  } else {
    errorMessage.value = 'Error: You don\'t have enough coins.';
    sleep(800).then(() => {
      errorMessage.value = '';
    });
  }
}

const buyAttack = (attackID) => {
  fetch(`https://balandrau.salle.url.edu/i3/shop/attacks/${attackID}/buy`, {
    method: 'POST',
    headers: { 'Bearer': `${authToken.value}`, 'Content-Type': 'application/json' }
  })
      .then(response => {
        console.log(response);
        if (response.status === 200) {
          console.log('Attack bought successfully');
          successMessage.value = 'Attack  ${{ attackID }} bought successfully!';
          sleep(800).then(() => {
            errorMessage.value = '';
          });
        } else {
          return response.json().then(json => {
            throw new Error(`Error: ${response.status} - ${json.message}`);
          });
        }
      })
      .catch(error => {
        console.error('Error buying attack:', error.message);
        errorMessage.value = 'Error buying attack. ' + error.message;
        successMessage.value = '';
        sleep(800).then(() => {
          errorMessage.value = '';
        });
      });
};

</script>


<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <button class="bg-cyan-400 text-black font-bold py-2 md:py-5 px-4 md:px-10 rounded-r-full rounded-l-md text-base md:text-2xl uppercase fixed top-5 left-0">
      BUY AN ATTACK
    </button>

    <!-- Botón de Show Shopping Cart -->
    <div class="fixed top-0 right-0 pt-6 mr-48">
      <!-- Botón del Carrito de Compras -->
      <button @click="toggleDropdown" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-full uppercase sm:w-auto">
        <img src="/src/assets/shop/carrito-de-compras.png" alt="Shopping Cart" class="w-6 h-6 object-cover object-fit-contain mr-2" />
        <span class="hidden sm:inline">Shopping Cart</span>
      </button>

      <!-- Menú Desplegable -->
      <div v-if="showDropdown" class="absolute right-0 mt-2 w-60 bg-yellow-100 shadow-xl rounded-lg overflow-hidden max-h-60 z-50">
        <div v-for="item in selectedItems" :key="item.id" class="px-4 py-2 hover:bg-yellow-100 border-b border-gray-200">
          {{ item.attackName }} - ${{ item.price }}
        </div>
        <!-- Botón de Comprar -->
        <div class="flex justify-center mt-2">
          <button @click="buyAttacks" class="bg-purple-600 hover:bg-yellow-300 text-white font-bold px-6 py-2 w-full rounded-lg text-xs sm:text-xs md:text-xs lg:text-xs xl:text-xs uppercase">
            BUY
          </button>
        </div>
        <!-- Mensaje de Error -->
        <div v-if="errorMessage" class="flex justify-center mt-4 mb-2 px-4 py-2 border border-red-500 bg-red-100 rounded">
          <span class="text-red-500 font-medium text-sm sm:text-sm md:text-sm lg:text-sm xl:text-sm">
            <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
          </span>
        </div>

        <!-- Mensaje de Éxito -->
        <div v-if="successMessage" class="flex justify-center mt-4 mb-2 px-4 py-2 border border-green-500 bg-green-100 rounded">
          <span class="text-green-500 font-medium text-sm sm:text-sm md:text-sm lg:text-sm xl:text-sm">
            <i class="fas fa-check-circle"></i> {{ successMessage }}
          </span>
        </div>
      </div>
    </div>

    <!-- Imagen monedas -->
    <img src="/src/assets/shop/Monedas.png" alt="" class="mi-imagen">

    <!--Imagen chico tamaño pequeño-->
    <div class="img-container">
      <img src="/src/assets/shop/chico_sell.png" alt=" " class="absolute top-50 left-0 m-4 w-50 h-50 object-cover">
    </div>

    <div class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pr-5 mr-4">
        <div v-for="(item, index) in items" :key="item.id" :style="getAttackStyles(item)" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <!-- Superposición para ataques bloqueados -->
        <div v-if="item.isAbovePlayerLevel" class="relative top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
          <img src="/src/assets/attacks/candado.png" alt="Lock" class="w-16 h-16 object-cover object-fit-contain" />
        </div>

        <div class="flex items-center">
          <div class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</div>
          <img class="w-[58px] h-[58px]" :src="item.imageSrc" alt=""/>
          <div class="attack-name-container text-black text-sm md:text-s lg:text-l xl:text-xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.attackName }}</div>
          <div class="flex-col">
            <div class="attack-positions-container text-black text-sm md:text-s lg:text-l xl:text-xl font-bold font-['Sigmar One'] uppercase ml-5">Positions</div>
            <div class="attack-positions-container text-black text-sm md:text-s lg:text-l xl:text-xl mt-2 font-bold font-['Sigmar One'] ml-5">{{ item.positions }}</div>
          </div>
          <div class="flex-col">
            <div class="attack-power-container text-black text-sm md:text-s lg:text-l xl:text-xl font-bold font-['Sigmar One'] uppercase ml-5">Power</div>
            <div class="attack-power-container text-black text-sm md:text-s lg:text-l xl:text-xl mt-2 font-bold font-['Sigmar One'] ml-5">{{ item.power }}</div>
          </div>
          <div class="flex-col">
            <div class="attack-price-container text-black text-sm md:text-s lg:text-l xl:text-xl font-bold font-['Sigmar One'] uppercase ml-5">Price</div>
            <div class="attack-price-container text-black text-sm md:text-s lg:text-l xl:text-xl mt-2 font-bold font-['Sigmar One'] ml-5">{{ item.price }}$</div>
          </div>
        </div>
        <div v-if="!item.isAbovePlayerLevel" class="flex items-center">
          <input type="checkbox" v-model="item.isSelected" class="h-6 w-6 mr-2">
          <label class="mr-8 text-black text-2xl font-bold">BUY</label>
        </div>
      </div>
    </div>

    <!-- Botón de Regreso a Shop -->
    <ReturnToShop/>
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.attack-price-container {
  justify-content: center;
  display: flex;
  width: 100px; /* Ajustar para el padding */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>




