<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {useRoute} from 'vue-router';
import Cell from "../../ components/Cell.vue";
import GameBoard from "../../ components/GameBoard.vue";

const route = useRoute();
const rowsAndColumns = ref(4); // Valor por defecto
const screenWidth = ref(window.innerWidth);

// Obtener los valores de la URL cuando el componente se monte
onMounted(() => {
  const queryParams = route.query;
  if (queryParams.rows) {
    rowsAndColumns.value = parseInt(queryParams.rows, 10);
  }
});

const totalCells = computed(() => rowsAndColumns.value * rowsAndColumns.value);
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${rowsAndColumns.value}, 0.4fr)`,
}));

const playerPositions = { player1: [1], player2: [8] };

const getPlayer = (index) => {
  if (playerPositions.player1.includes(index)) return 1;
  if (playerPositions.player2.includes(index)) return 2;
  return null;
};

// Evento para detectar el cambio de tamaño de la pantalla
const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

// Montar el evento resize y eliminarlo al desmontar
onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

// Calcular el tamaño de la celda basado en el ancho de la pantalla
const cellSize = computed(() => {
  const gridSize = 400;
  if (screenWidth.value < 640) { // 640px = 'sm'
    return (gridSize / rowsAndColumns.value) * 0.67; // (* 0,67) para reducir el tamaño en pantallas pequeñas
  }
  return gridSize / rowsAndColumns.value;
});

</script>

<template>
  <div class="flex flex-col items-center justify-between min-h-screen bg-black p-4" style="background-image: url('/src/assets/welcome_page/background.png'); background-size: cover; background-position: center;">

    <!-- Botón de Regreso al Inicio -->
    <div class="fixed top-0 left-0 pt-4">
      <router-link to="/creategame" class="flex items-center pr-3.5 pl-4 bg-cyan-400 text-black font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <font-awesome-icon icon="home" class="mr-2"/>
        <span class="hidden sm:inline">Home</span>
      </router-link>
    </div>

    <div class="flex flex-col items-center justify-center mb-4">
      <!-- Encabezado de Jugadores dentro de un rectángulo gris -->
      <div class="bg-gray-300 p-2 md:p-4 shadow-xl rounded-lg mx-auto md:mx-0 md:ml-96 lg:ml-96 mb-auto mt-6">
        <div class="flex items-center justify-center bg-gray-300 rounded-lg">
          <div class="bg-yellow-400 text-black py-2 px-4 md:py-4 md:px-8 rounded-l-md font-extrabold text-xl md:text-2xl lg:text-3xl">PLAYER 1</div>
          <div class="bg-purple-500 text-white py-2 px-4 md:py-4 md:px-9 rounded-md font-extrabold text-xl md:text-2xl lg:text-3xl">VS</div>
          <div class="bg-green-400 text-black py-2 px-4 md:py-4 md:px-8 rounded-r-md font-extrabold text-xl md:text-2xl lg:text-3xl">PLAYER 2</div>
        </div>
      </div>

      <!-- Tablero de Juego Cuadrado -->
      <GameBoard imageUrl="/welcome_page/neon.png" :style="gridStyle" class="mt-10">
        <div class="grid gap-2" :class="`grid-cols-${rowsAndColumns}`" :style="gridStyle">
          <Cell v-for="index in totalCells" :key="index" :cellSize="cellSize" size="default" :isDark="(index + Math.floor((index - 1) / rowsAndColumns)) % 2 === 0" :player="getPlayer(index)"></Cell>
        </div>
      </GameBoard>
    </div>

    <!-- Controles del jugador -->
    <div class="fixed inset-x-0 bottom-0 p-4">
      <!-- Contenedor de los ataques para pantallas pequeñas -->
      <div class="sm:hidden bg-purple-600 rounded-lg shadow-lg p-4 flex justify-around items-center">
        <!-- Ataque 1 -->
        <div class="flex flex-col items-center">
          <img src="/src/assets/shop/espadas.png" class="w-20 h-20 bg-fuchsia-500 p-1 rounded-xl" alt=""/>
          <div class="text-center text-white">
            <div class="flex items-center justify-center space-x-2">
              <div class="font-bold text-l">DMG:</div>
              <div class="font-normal text-l">1000</div>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <div class="font-bold text-l">DIR:</div>
              <div class="font-normal text-l">RIGHT</div>
            </div>
          </div>
        </div>
        <!-- Ataque 2 -->
        <div class="flex flex-col items-center">
          <img src="/src/assets/shop/espadas.png" class="w-20 h-20 bg-fuchsia-500 p-1 rounded-xl" alt=""/>
          <div class="text-center text-white">
            <div class="flex items-center justify-center space-x-2">
              <div class="font-bold text-l">DMG:</div>
              <div class="font-normal text-l">500</div>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <div class="font-bold text-l">DIR:</div>
              <div class="font-normal text-l">DOWN</div>
            </div>
          </div>
        </div>
        <!-- Ataque 3 -->
        <div class="flex flex-col items-center">
          <img src="/src/assets/shop/espadas.png" class="w-20 h-20 bg-fuchsia-500 p-1 rounded-xl" alt=""/>
          <div class="text-center text-white">
            <div class="flex items-center justify-center space-x-2">
              <div class="font-bold text-l">DMG:</div>
              <div class="font-normal text-l">2050</div>
            </div>
            <div class="flex items-center justify-center space-x-2">
              <div class="font-bold text-l">DIR:</div>
              <div class="font-normal text-l">UP</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenedor de los ataques para pantallas medianas y grandes -->
      <div class="hidden sm:flex sm:flex-col items-center md:absolute md:left-10 md:bottom-3 md:ml-16 md:w-auto">
        <!-- Contenedor de los ataques -->
        <div class="bg-purple-600 rounded-lg shadow-lg">
          <!-- Primer ataque -->
          <div class="flex items-center bg-purple-600 text-white pt-8 pb-2 px-6 rounded-lg shadow-lg">
            <img src="/src/assets/shop/espadas.png" class="w-20 h-20 bg-fuchsia-500 p-1 rounded-xl" alt=""/>
            <div class="flex-grow flex flex-col justify-center mx-4">
              <div class="flex">
                <span class="font-bold text-xl">DAMAGE:</span>
                <span class="font-normal text-xl ml-2">1000</span>
              </div>
              <div class="flex">
                <span class="font-bold text-xl">DIRECTION:</span>
                <span class="font-normal text-xl ml-2">RIGHT</span>
              </div>
            </div>
            <button class="bg-yellow-200 w-16 h-16 font-extrabold rounded text-black text-2xl flex items-center justify-center mr-2">I</button>
          </div>

          <!-- Segundo ataque -->
          <div class="flex items-center bg-purple-600 text-white pt-8 pb-2 px-6 rounded-lg shadow-lg">
            <img src="/src/assets/shop/espadas.png" class="w-20 h-20 bg-fuchsia-500 p-1 rounded-xl" alt=""/>
            <div class="flex-grow flex flex-col justify-center mx-4">
              <div class="flex">
                <span class="font-bold text-xl">DAMAGE:</span>
                <span class="font-normal text-xl ml-2">1000</span>
              </div>
              <div class="flex">
                <span class="font-bold text-xl">DIRECTION:</span>
                <span class="font-normal text-xl ml-2">DOWN</span>
              </div>
            </div>
            <button class="bg-yellow-200 w-16 h-16 font-extrabold rounded text-black text-2xl flex items-center justify-center mr-2">O</button>
          </div>

          <!-- Tercer ataque -->
          <div class="flex items-center bg-purple-600 text-white pt-8 pb-8 px-6 rounded-lg shadow-lg">
            <img src="/src/assets/shop/espadas.png" class="w-20 h-20 bg-fuchsia-500 p-1 rounded-xl" alt=""/>
            <div class="flex-grow flex flex-col justify-center mx-4">
              <div class="flex">
                <span class="font-bold text-xl">DAMAGE:</span>
                <span class="font-normal text-xl ml-2">1000</span>
              </div>
              <div class="flex">
                <span class="font-bold text-xl">DIRECTION:</span>
                <span class="font-normal text-xl ml-2">LEFT</span>
              </div>
            </div>
            <button class="bg-yellow-200 w-16 h-16 font-extrabold rounded text-black text-2xl flex items-center justify-center mr-2">P</button>
          </div>
        </div>

        <!-- Botones de control -->
        <div class="flex flex-col items-center mt-12">
          <!-- Botón W -->
          <button class="bg-gray-300 w-24 h-24 font-extrabold text-3xl rounded-xl">W</button>
          <!-- Botones A, S, D -->
          <div class="flex justify-between w-full px-2 m-4">
            <button class="bg-gray-300 w-24 h-24 font-extrabold text-3xl rounded-xl">A</button>
            <button class="bg-gray-300 w-24 h-24 font-extrabold text-3xl rounded-xl">S</button>
            <button class="bg-gray-300 w-24 h-24 font-extrabold text-3xl rounded-xl">D</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>