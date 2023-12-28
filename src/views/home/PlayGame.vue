<script setup>
import {computed, inject, onMounted, onUnmounted, ref} from 'vue';
import {useRoute} from 'vue-router';
import Cell from "../../ components/Cell.vue";
import GameBoard from "../../ components/GameBoard.vue";
import PingAndFPS from "../../ components/PingAndFPS.vue";
import router from "../../router/index.js";

const authToken = inject('authToken'); //Agafem el token del jugador desde App.vue
const route = useRoute();
const rowsAndColumns = ref(1); //Valor por defecto
const gameId = ref('');
const screenWidth = ref(window.innerWidth);
let playerPositions = {
  player1: [],
  player2: [],
};

const calculateInitialPositions = (rowsAndColumns) => {
  const middleRow = Math.ceil(rowsAndColumns / 2);
  let player1Position, player2Position;

  player1Position = (middleRow - 1) * rowsAndColumns + 1;
  player2Position = middleRow * rowsAndColumns;

  return { player1: [player1Position], player2: [player2Position] };
};

onMounted(() => {
  const queryParams = route.query;
  // Se verifica que 'rowsAndColumns' exista y sea un número válido
  if (queryParams.rowsAndColumns && !isNaN(queryParams.rowsAndColumns)) {
    rowsAndColumns.value = parseInt(queryParams.rowsAndColumns, 10);
    playerPositions = calculateInitialPositions(rowsAndColumns.value)
  }
  if (queryParams.name) {
    gameId.value = queryParams.name;
  }
});

const totalCells = computed(() => rowsAndColumns.value * rowsAndColumns.value);
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${rowsAndColumns.value}, 0.4fr)`,
}));

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


const isPressedW = ref(false);
const isPressedA = ref(false);
const isPressedS = ref(false);
const isPressedD = ref(false);

const handleKeydown = (event) => {
  switch(event.key.toLowerCase()) {
    case 'w':
      isPressedW.value = true; goUp();
      break;
    case 'a':
      isPressedA.value = true; goLeft();
      break;
    case 's':
      isPressedS.value = true; goDown();
      break;
    case 'd':
      isPressedD.value = true; goRight();
      break;
  }
};

// Method to handle keyup events
const handleKeyup = (event) => {
  switch(event.key.toLowerCase()) {
    case 'w':
      isPressedW.value = false;
      break;
    case 'a':
      isPressedA.value = false;
      break;
    case 's':
      isPressedS.value = false;
      break;
    case 'd':
      isPressedD.value = false;
      break;
  }
};

// Attach event listeners on mount and clean up on unmount
onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('keyup', handleKeyup);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('keyup', handleKeyup);
});

//Funcions per moure el personatge
const goUp = () => { //Funció per moure el personatge cap amunt
  console.log("Going up!");
  //Moviment amunt
};

const goDown = () => { //Funció per moure el personatge cap avall
  console.log("Going down!");
  //Moviment avall
};

const goLeft = () => { //Funció per moure el personatge cap a l'esquerra
  console.log("Going left!");
  //Moviment a l'esquerra
};

const goRight = () => { //Funció per moure el personatge cap a la dreta
  console.log("Going right!");
  //Moviment a la dreta
};

//Funcions relacionades amb els atacs
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

const keys = ['i', 'o', 'p'];

const attack1 = () => {
  console.log("Attack 1 executed!");
  //Logica atack1
};

const attack2 = () => {
  console.log("Attack 2 executed!");
  //Logica atack2
};

const attack3 = () => {
  console.log("Attack 3 executed!");
  //Logica atack3
};
const pressedKey = ref(null);

const handleAttackKeydown = (event) => {
  pressedKey.value = event.key.toLowerCase();  // Update the pressedKey for UI feedback

  switch(event.key.toLowerCase()) {
    case 'i': attack1(); break;
    case 'o': attack2(); break;
    case 'p': attack3(); break;
  }
};

const handleAttackKeyup = () => {
  pressedKey.value = null;  // Reseteja la tecla premuda quan es deixa anar
};

onMounted(() => {
  window.addEventListener('keydown', handleAttackKeydown);
  window.addEventListener('keyup', handleAttackKeyup);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleAttackKeydown);
  window.removeEventListener('keyup', handleAttackKeyup);
});

const showSurrenderModal = ref(false);
const surrenderGame = () => {
  showSurrenderModal.value = true;
};

const confirmSurrender = () => {
  showSurrenderModal.value = false;
  console.log("Player has confirmed surrender.");

  // Asegúrate de utilizar gameId.value para obtener el valor actual de gameId
  fetch(`https://balandrau.salle.url.edu/i3/arenas/${gameId.value}/play`, {
    method: 'DELETE',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log('Response: ', response);
        if (response.status === 204) {
          console.log('Left game successfully!');
          router.push({ name: 'home' });
          return;
        }
        return response.json().then(json => {
          throw new Error(`Error: ${response.status} - ${json.message}`);
        });
      })
      .catch(error => {
        console.error('Error leaving game: ', error.message);
      });
};

</script>

<template>
  <div class="flex flex-col items-center justify-between min-h-screen bg-black p-4" style="background-image: url('/src/assets/welcome_page/background.png'); background-size: cover; background-position: center;">

    <!-- Botón para rendirse/salir de la partida -->
    <div class="fixed top-0 left-0 pt-4">
      <button @click="surrenderGame" class="flex items-center pr-3.5 pl-4 bg-red-500 hover:bg-red-700 text-white font-extrabold py-2 rounded-r-full rounded-l-none uppercase sm:w-auto">
        <font-awesome-icon icon="flag" class="mr-2"/>
        <span class="hidden sm:inline">Surrender</span>
      </button>
    </div>

    <div class="flex flex-col items-center justify-center mb-4">
      <!-- Encabezado de Jugadores dentro de un rectángulo gris -->
      <div class="bg-blue-200 p-2 md:p-4 shadow-xl rounded-lg mx-auto md:mx-0 md:ml-96 lg:ml-96 mb-auto mt-6">
        <div class="flex items-center justify-center bg-gray-300 rounded-lg">
          <div class="bg-yellow-400 text-black py-2 px-4 md:py-4 md:px-8 rounded-l-md font-extrabold text-xl md:text-2xl lg:text-3xl">PLAYER 1</div>
          <div class="bg-purple-500 text-white py-2 px-4 md:py-4 md:px-9  font-extrabold text-xl md:text-2xl lg:text-3xl">VS</div>
          <div class="bg-green-400 text-black py-2 px-4 md:py-4 md:px-8 rounded-r-md font-extrabold text-xl md:text-2xl lg:text-3xl">PLAYER 2</div>
        </div>
      </div>

      <!-- Component pel ping i FPS -->
      <div class="ml-96 flex flex-col justify-center mb-3">
        <PingAndFPS class="mt-4"/>
      </div>

      <div v-if="showSurrenderModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold mb-4 text-gray-800">Confirm Surrender</h3>
          <p class="mb-4 text-md text-gray-600">Are you sure you want to surrender? You will lose the game.</p>
          <div class="flex justify-around">
            <button @click="confirmSurrender" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Yes, Surrender
            </button>
            <button @click="showSurrenderModal = false" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              No, Keep Playing
            </button>
          </div>
        </div>
      </div>

      <!-- Tablero de Juego Cuadrado -->
      <GameBoard imageUrl="/src/assets/welcome_page/neon.png" :style="gridStyle" class="">
        <div class="grid gap-2" :class="`grid-cols-${rowsAndColumns}`" :style="gridStyle">
          <Cell v-for="index in totalCells" :key="index" :cellSize="cellSize" size="default" :isDark="(index + Math.floor((index - 1) / rowsAndColumns)) % 2 === 0" :player="getPlayer(index)"></Cell>
        </div>
      </GameBoard>
    </div>

    <!-- Controles del jugador -->
    <div class="fixed inset-x-0 bottom-0 p-4">
      <!-- Contenedor de los ataques para pantallas pequeñas -->
      <div class="sm:hidden bg-purple-600 rounded-lg shadow-lg p-2 flex justify-around items-center">
        <div v-for="(attack, index) in attacks" :key="attack.attack_ID" class="flex flex-col items-center">
          <img src="/src/assets/shop/espadas.png" class="w-16 h-16 bg-fuchsia-500 p-1 rounded-lg" alt=""/>
          <div class="text-center text-white">
            <!-- Reduint la mida del text i dels espais -->
            <p class="font-bold text-sm">NAME: {{ attack.attack_ID }}</p>
            <div class="flex items-center justify-center space-x-1">
              <div class="font-bold text-sm">DMG:</div>
              <div class="font-normal text-sm">{{ attack.power }}</div>
            </div>
            <div class="flex items-center justify-center space-x-1">
              <div class="font-bold text-sm">DIR:</div>
              <div class="font-normal text-sm">{{ attack.positions }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenedor de los ataques para pantallas medianas y grandes -->
      <div class="hidden sm:flex sm:flex-col items-center md:absolute md:left-10 md:bottom-3 md:ml-16 md:w-auto">
        <!-- Contenedor de los ataques -->
        <div class="bg-purple-600 rounded-lg shadow-lg">
          <div v-for="(attack, index) in attacks" :key="attack.id" class="flex items-center bg-purple-600 text-white pt-8 pb-2 px-6 rounded-lg shadow-lg">
            <!-- Detalls de l'atac -->
            <img src="/src/assets/shop/espadas.png" class="w-20 h-20 bg-fuchsia-500 p-1 rounded-xl" alt="Espada"/>
            <div class="flex-grow flex flex-col justify-center mx-4">
              <div class="flex">
                <span class="font-bold text-xl">NAME:</span>
                <span class="font-normal text-xl ml-2">{{ attack.attack_ID }}</span>
              </div>
              <div class="flex">
                <span class="font-bold text-xl">DAMAGE:</span>
                <span class="font-normal text-xl ml-2">{{ attack.power }}</span>
              </div>
              <div class="flex">
                <span class="font-bold text-xl">DIRECTION:</span>
                <span class="font-normal text-xl ml-2">{{ attack.positions }}</span>
              </div>
            </div>
            <!-- Botó que canvia de color -->
            <button :class="{'bg-yellow-500': pressedKey === keys[index], 'bg-yellow-200': pressedKey !== keys[index]}" class="w-16 h-16 font-extrabold rounded text-black text-2xl flex items-center justify-center mr-2">
              {{ keys[index].toUpperCase() }}
            </button>
          </div>
        </div>

        <!-- Botones de control -->
        <div class="flex flex-col items-center mt-12">
          <button :class="{'bg-blue-500': isPressedW, 'bg-blue-200': !isPressedW}" class="w-24 h-24 font-extrabold text-3xl rounded-xl">W</button>
          <div class="flex justify-between w-full px-2 m-4">
            <button :class="{'bg-blue-500': isPressedA, 'bg-blue-200': !isPressedA}" class="w-24 h-24 font-extrabold text-3xl rounded-xl">A</button>
            <button :class="{'bg-blue-500': isPressedS, 'bg-blue-200': !isPressedS}" class="w-24 h-24 font-extrabold text-3xl rounded-xl">S</button>
            <button :class="{'bg-blue-500': isPressedD, 'bg-blue-200': !isPressedD}" class="w-24 h-24 font-extrabold text-3xl rounded-xl">D</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
