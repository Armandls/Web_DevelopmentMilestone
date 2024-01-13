<script setup>
import {computed, inject, onMounted, onUnmounted, ref, reactive, watchEffect} from 'vue';
import {useRoute} from 'vue-router';
import Cell from "../../ components/Cell.vue";
import GameBoard from "../../ components/GameBoard.vue";
import PingAndFPS from "../../ components/PingAndFPS.vue";
import router from "../../router/index.js";

const authToken = inject('authToken'); //Agafem el token del jugador desde App.vue
const playerData = inject('playerData'); //Agafem les dades del jugador desde App.vue
const route = useRoute();
const rowsAndColumns = ref(1); //Valor por defecto
const gameId = ref('');
const screenWidth = ref(window.innerWidth);
let playerPositions = reactive({
  player1: [],
  player2: [],
});

let firstTime = true;
let PLAYER_1_NAME = 'Waiting...';
let PLAYER_2_NAME = 'Waiting...';

let directionPlayer1 = ref("right");
let directionPlayer2 = ref("left");

const forceUpdateTrigger = ref(0);

function forceUpdate() {
  forceUpdateTrigger.value++;
}

function updatePlayerPositions(x1, y1, x2, y2, rowsAndColumns) {
  // Calculando la posición lineal
  let player1Position = (y1 * rowsAndColumns) + x1 + 1;
  let player2Position = (y2 * rowsAndColumns) + x2 + 1;

  // Actualizando las posiciones globales de los jugadores
  playerPositions.player1 = [player1Position];
  playerPositions.player2 = [player2Position];
}

watchEffect(() => {
  const queryParams = route.query;
  // Se verifica que 'rowsAndColumns' exista y sea un número válido
  if (queryParams.rowsAndColumns && !isNaN(queryParams.rowsAndColumns)) {
    rowsAndColumns.value = parseInt(queryParams.rowsAndColumns, 10);
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
  if (playerPositions.player1.includes(index)) {
    return 1;
  }
  if (playerPositions.player2.includes(index)) {
    return 2;
  }
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
function movePlayer(direction) {
  fetch('https://balandrau.salle.url.edu/i3/arenas/move', {
    method: 'POST',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ movement: direction })
  })
      .then(response => {
        if (response.status === 200) {
          console.log('Player moved successfully!');
        } else {
          return response.json().then(json => {
            throw new Error(`Error: ${response.status} - ${json.message}`);
          });
        }
      })
      .catch(error => {
        console.error('Error moving player:', error.message);
      });
}

const goUp = () => { //Funció per moure el personatge cap amunt
  //Moviment amunt
  movePlayer("up");
  getCurrentGame();
  forceUpdate();
};

const goDown = () => { //Funció per moure el personatge cap avall
  //Moviment avall
  movePlayer("down");
  getCurrentGame();
  forceUpdate();
};

const goLeft = () => {
  movePlayer("left");
  getCurrentGame();
  forceUpdate();
};

const goRight = () => {
  movePlayer("right");
  getCurrentGame();
  forceUpdate();
};


//Funcions relacionades amb la direcció
function changePlayerDirection(direction) {
  fetch('https://balandrau.salle.url.edu/i3/arenas/direction', {
    method: 'POST',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ direction: direction })
  })
      .then(response => {
        if (response.status === 200) {
          console.log('Direction changed successfully!');
        } else {
          return response.json().then(json => {
            throw new Error(`Error: ${response.status} - ${json.message}`);
          });
        }
      })
      .catch(error => {
        console.error('Error changing direction:', error.message);
      });
}

const isPressedQ = ref(false);
const isPressedE = ref(false);
const isPressedF = ref(false);
const isPressedX = ref(false);

const lookLeft = () => {
  changePlayerDirection("left");
  getCurrentGame();
  //TODO: Girar imagen
  forceUpdate();
};

const lookUp = () => {
  changePlayerDirection("up");
  getCurrentGame();
  //TODO: Girar imagen
  forceUpdate();
};

const lookRight = () => {
  changePlayerDirection("right");
  getCurrentGame();
  //TODO: Girar imagen
  forceUpdate();
};

const lookDown = () => {
  changePlayerDirection("down");
  getCurrentGame();

  const playerImage = document.querySelector('#player-image');
  playerImage.classList.remove('rotate-0', '-rotate-90', 'rotate-180', '-rotate-180', 'rotate-270');
  playerImage.classList.add('rotate-90');

  forceUpdate();
};


const handleKeydownQEFX = (event) => {
  switch(event.key.toLowerCase()) {
    case 'q':
      isPressedQ.value = true; lookLeft();
      break;
    case 'e':
      isPressedE.value = true; lookUp();
      break;
    case 'f':
      isPressedF.value = true; lookRight();
      break;
    case 'x':
      isPressedX.value = true; lookDown();
      break;
  }
};

const handleKeyupQEFX = (event) => {
  switch(event.key.toLowerCase()) {
    case 'q':
      isPressedQ.value = false;
      break;
    case 'e':
      isPressedE.value = false;
      break;
    case 'f':
      isPressedF.value = false;
      break;
    case 'x':
      isPressedX.value = false;
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydownQEFX);
  window.addEventListener('keyup', handleKeyupQEFX);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydownQEFX);
  window.removeEventListener('keyup', handleKeyupQEFX);
});

//Funcions relacionades amb els atacs
const attacks = ref([]);

const fetchAttacks = () => {
  fetch('https://balandrau.salle.url.edu/i3/players/attacks', {
    method: 'GET',
    headers: {
      'Bearer': authToken.value,
    }
  })
      .then(response => {
        if (response.status === 200) {
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

function attackInGame(id) {
  fetch('https://balandrau.salle.url.edu/i3/arenas/attack/' + id, {
    method: 'POST',
    headers: {
      'Bearer': authToken.value,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log(response);
        if (response.status === 204) {
          console.log('Attack successful!');
        } else {
          return response.json().then(json => {
            throw new Error(`Error: ${response.status} - ${json.message}`);
          });
        }
      })
      .catch(error => {
        //console.error('Error attacking:', error.message);
      });
}

const attack1 = () => {
  console.log("Attack 1 executed!");
  //Logica atack1
  console.log('Attack: ' + attacks.value[0].attack_ID)
  attackInGame(attacks.value[0].attack_ID);
};

const attack2 = () => {
  console.log("Attack 2 executed!");
  //Logica atack2
  console.log('Attack: ' + attacks.value[1].attack_ID)
  attackInGame(attacks.value[1].attack_ID);
};

const attack3 = () => {
  console.log("Attack 3 executed!");
  //Logica atack3
  console.log('Attack: ' + attacks.value[2].attack_ID)
  attackInGame(attacks.value[2].attack_ID);
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

  fetch(`https://balandrau.salle.url.edu/i3/arenas/${gameId.value}/play`, {
    method: 'DELETE',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 204) {
          console.log('Left game successfully!');
          clearInterval(intervalId);
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

// Establecer un intervalo
let intervalId;

onMounted(() => {
  intervalId = setInterval(getCurrentGame, 5000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const showGameFinishedWin = ref(false);
const showGameFinishedLost = ref(false);
const coinsWin = ref(0);
const xpWin = ref(0);

function endGameSuccessful() {
  showGameFinishedWin.value = true;
}

function endGameLost() {
  showGameFinishedLost.value = true;
}

function checkGameFinishedInfo() {
  fetch(`https://balandrau.salle.url.edu/i3/arenas/${gameId.value}`, {
    method: 'GET',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        console.log('Response: ', response);
        if (response.status === 200) {
          return response.json();
        } else {
          return response.json().then(json => {
            throw new Error(`Error: ${response.status} - ${json.message}`);
          });
        }
      })
      .then(data => {
        console.log('Game finished info:', data);
        //Map the info
        const player1Data = data.players_games[0];
        const player2Data = data.players_games[1];
        console.log('Player 1 data:', player1Data);
        console.log('PlayerData:', playerData.value.player_ID);
        if (player1Data.player_ID === playerData.value.player_ID) {
          if (player1Data.winner === true) {
            endGameSuccessful();
            coinsWin.value = player1Data.coins_win;
            xpWin.value = player1Data.xp_win;
          } else {
            endGameLost();
          }
        } else {
          if (player2Data.winner === true) {
            endGameSuccessful();
            coinsWin.value = player2Data.coins_win;
            xpWin.value = player2Data.xp_win;
          } else {
            endGameLost();
          }
        }
      })
      .catch(error => {
        console.error('Error getting game finished info:', error.message);
      });
}

function getCurrentGame() {
  fetch('https://balandrau.salle.url.edu/i3/players/arenas/current', {
    method: 'GET',
    headers: {
      'Bearer': `${authToken.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status !== 200) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Game data:', data[0]);

        if (data[0].players_games.length === 1) {
          PLAYER_1_NAME = data[0].players_games[0].player_ID;
          forceUpdate();
        }

        if (data[0].players_games.length === 2) {
          const player1Data = data[0].players_games[0];

          const player2Data = data[0].players_games[1];
          directionPlayer1.value = player1Data.direction;
          directionPlayer2.value = player2Data.direction;

          if (firstTime === true) {
            console.log('First time!');
            console.log('Player 1 data:', player1Data.player_ID);
            console.log('Player 2 data:', player2Data.player_ID);
            PLAYER_1_NAME = player1Data.player_ID;
            PLAYER_2_NAME = player2Data.player_ID;
            forceUpdate();
            firstTime = false;
          }
          // Actualiza las posiciones de los jugadores
          updatePlayerPositions(player1Data.x_game, player1Data.y_game, player2Data.x_game, player2Data.y_game, rowsAndColumns.value);
        }
      })
      .catch(() => {
        console.log('Game finished!');
        clearInterval(intervalId);

        checkGameFinishedInfo();
      });
}

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
      <div :key="forceUpdateTrigger" class="bg-blue-200 p-2 md:p-4 shadow-xl rounded-lg mx-auto md:mx-0 md:ml-96 lg:ml-96 mb-auto mt-6">
        <div class="flex items-center justify-center bg-gray-300 rounded-lg">
          <div class="bg-yellow-400 text-black py-2 px-4 md:py-4 md:px-8 rounded-l-md font-extrabold text-xl md:text-2xl lg:text-3xl">{{ PLAYER_1_NAME }}</div>
          <div class="bg-purple-500 text-white py-2 px-4 md:py-4 md:px-9 font-extrabold text-xl md:text-2xl lg:text-3xl">VS</div>
          <div class="bg-green-400 text-black py-2 px-4 md:py-4 md:px-8 rounded-r-md font-extrabold text-xl md:text-2xl lg:text-3xl">{{ PLAYER_2_NAME }}</div>
        </div>
      </div>

      <!-- Component pel ping i FPS -->
      <div class="ml-96 flex flex-col justify-center mb-3">
        <PingAndFPS class="mt-4"/>
      </div>

      <div v-if="showSurrenderModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg z-50">
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

      <div class="flex justify-center items-start mt-2"> <!-- Contenedor principal para alinear todo horizontalmente -->
        <!-- Contenedor de los botones QEFX, alineados de lado a lado -->
        <div class="md:flex md:flex-col ml-72 mt-9 hidden"> <!-- Margen derecho para separar del GameBoard -->
          <button :class="{'bg-green-500': isPressedQ, 'bg-green-300': !isPressedQ}" class="w-20 h-20 font-extrabold text-3xl rounded-xl mb-4">Q</button>
          <button :class="{'bg-green-500': isPressedE, 'bg-green-300': !isPressedE}" class="w-20 h-20 font-extrabold text-3xl rounded-xl mb-4">E</button>
          <button :class="{'bg-green-500': isPressedF, 'bg-green-300': !isPressedF}" class="w-20 h-20 font-extrabold text-3xl rounded-xl mb-4">F</button>
          <button :class="{'bg-green-500': isPressedX, 'bg-green-300': !isPressedX}" class="w-20 h-20 font-extrabold text-3xl rounded-xl">X</button>
        </div>
        <!-- Tablero de Juego Cuadrado -->
        <GameBoard :key="forceUpdateTrigger" imageUrl="/src/assets/welcome_page/neon.png" :style="gridStyle">
          <div class="grid gap-2" :class="`grid-cols-${rowsAndColumns}`" :style="gridStyle">
            <Cell v-for="index in totalCells" :key="index" :cellSize="cellSize" size="default" :isDark="(index + Math.floor((index - 1) / rowsAndColumns)) % 2 === 0" :player="getPlayer(index)" :directionPlayer1="directionPlayer1" :directionPlayer2="directionPlayer2" />
          </div>
        </GameBoard>
      </div>
    </div>

    <!-- Controles del jugador -->
    <div class="fixed inset-x-0 bottom-0 p-4">
      <!-- Contenedor de los ataques para pantallas pequeñas -->
      <div v-if="showGameFinishedLost" class="sm:hidden fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <!-- Contenido del mensaje simplificado para pantallas pequeñas -->
        <div class="bg-white p-4 rounded-xl shadow-2xl flex flex-col items-center justify-center">
          <!-- Títol -->
          <h2 class="text-xl font-bold text-red-600 mb-2">Game Over</h2>
          <!-- Subtítol -->
          <p class="text-lg font-semibold text-gray-800 mb-4">You Lost!</p>
          <!-- Botó de retorn a l'inici -->
          <button @click="router.push({ name: 'home' })" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Return Home
          </button>
        </div>
      </div>
      <!-- Nou missatge de victòria per a pantalles petites, sense animacions -->
      <div v-if="showGameFinishedWin" class="sm:hidden flex fixed inset-0 bg-black bg-opacity-60 items-center z-50">
        <div class="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center justify-center ml-20">
          <h2 class="text-4xl font-bold text-green-500 mb-2">Congratulations!</h2>
          <p class="text-2xl font-semibold text-gray-800 mb-4">You Won!</p>
          <div class="text-lg text-gray-700 mb-4">
            <p><strong>Coins Earned:</strong> {{ coinsWin }}</p>
            <p><strong>XP Gained:</strong> {{ xpWin }}</p>
          </div>
          <button @click="router.push({ name: 'home' })" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Return Home
          </button>
        </div>
      </div>
      <div class="sm:hidden bg-purple-600 rounded-lg shadow-lg p-2 flex justify-around items-center">
        <div v-for="(attack) in attacks" :key="attack.attack_ID" class="flex flex-col items-center">
          <img :src= getRandomAttackImage(getAttackIndex(attack.attack_ID)) class="w-16 h-16 bg-blue-400 p-1 rounded-lg" alt=""/>
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
        <div class="bg-purple-600 rounded-lg shadow-lg flex flex-col "
             :class="{ 'mb-36': attacks.length === 1, 'mb-24':attacks.length === 2, 'mb-3': attacks.length >= 3}">
          <div v-for="(attack, index) in attacks" :key="attack.id" class="flex items-center bg-purple-600 text-white pt-8 pb-2 px-6 rounded-lg shadow-lg">
            <!-- Detalls de l'atac -->
            <img :src= getRandomAttackImage(getAttackIndex(attack.attack_ID)) class="w-20 h-20 bg-blue-400 p-1 rounded-xl" alt="Espada"/>
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

        <!-- Contenedor para el mensaje y las animaciones de juego terminado (Victoria) -->
        <div v-if="showGameFinishedWin" class="hidden sm:flex fixed inset-0 bg-black bg-opacity-60 items-center justify-center z-50">
          <!-- Confeti y globos -->
          <div class="absolute top-0 left-0 right-0 bottom-0 flex justify-around items-start overflow-hidden">
            <!-- Confeti -->
            <div v-for="i in 25" :key="i" class="confetti" :style="{
                background: ['red', 'yellow', 'green', 'blue', 'indigo', 'purple'][i % 6],
                top: '-10%',
                left: (Math.random()*100) + '%',
                width: (6 + Math.random()*4) + 'px',
                height: (6 + Math.random()*4) + 'px',
                opacity: (0.5 + Math.random()*0.5),
                animationDuration: (4 + Math.random()*4) + 's',
                animationDelay: -(Math.random()*2) + 's'
             }">
            </div>
            <!-- Globos -->
            <div v-for="i in 15" :key="`balloon-${i}`" :class="`balloon bg-${['pink', 'purple', 'indigo'][i % 3]}-500`" :style="{bottom: -(i * 5) + '%', left: (10 * i) + '%', width: '40px', height: '100px', animationDuration: (2 + i/5) + 's', animationDelay: -(i/5) + 's'}"></div>
          </div>

          <!-- Contenido del mensaje -->
          <div class="bg-white p-8 rounded-xl shadow-2xl transition-all transform duration-500 scale-95 opacity-0 flex flex-col items-center justify-center" :class="{'scale-100 opacity-100': showGameFinishedWin}">
            <!-- Título -->
            <h2 class="text-4xl font-bold text-green-500 mb-2">Congratulations!</h2>
            <!-- Subtítulo -->
            <p class="text-2xl font-semibold text-gray-800 mb-4">You Won!</p>
            <!-- Detalles de las recompensas -->
            <div class="text-lg text-gray-700 mb-4">
              <p><strong>Coins Earned:</strong> {{ coinsWin }}</p>
              <p><strong>XP Gained:</strong> {{ xpWin }}</p>
            </div>
            <!-- Botón de retorno al inicio -->
            <button @click="router.push({ name: 'home' })" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Return Home
            </button>
          </div>
        </div>

        <!-- Contenedor para el mensaje y las animaciones de juego terminado (Derrota) -->
        <div v-if="showGameFinishedLost" class="hidden sm:flex fixed inset-0 bg-black bg-opacity-60 items-center justify-center">
          <!-- Animación de lluvia -->
          <div class="absolute top-0 left-0 right-0 bottom-0 flex justify-around items-start overflow-hidden">
            <!-- Lluvia -->
            <div v-for="i in 50" :key="i" class="rain-drop" :style="{left: (Math.random()*100) + '%', animationDelay: (Math.random()*-2) + 's', animationDuration: (2 + Math.random()*3) + 's'}"></div>
          </div>

          <!-- Contenido del mensaje -->
          <div class="bg-white p-4 sm:p-8 rounded-xl shadow-2xl transition-all transform duration-500 scale-95 opacity-0 flex flex-col items-center justify-center" :class="{'scale-100 opacity-100': showGameFinishedLost}">
            <!-- Título -->
            <h2 class="text-2xl sm:text-4xl font-bold text-red-600 mb-2">Game Over</h2>
            <!-- Subtítulo -->
            <p class="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">You Lost!</p>
            <!-- Botón de retorno al inicio -->
            <button @click="router.push({ name: 'home' })" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Return Home
            </button>
          </div>
        </div>

        <!-- Botones de control movimiento-->
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

<style scoped>
/* Estilos para confeti y globos */
@keyframes confetti {
  0% { transform: translateY(-10vh) rotate(0deg); }
  100% { transform: translateY(110vh) rotate(360deg); }  /* Ajustar para que vaya más abajo de la pantalla */
}

.confetti {
  position: absolute;
  border-radius: 50%;
  animation: confetti linear infinite;
}

@keyframes balloon {
  0% { transform: translateY(100%) scale(0.5); }
  100% { transform: translateY(-1000%) scale(1); }
}

.balloon {
  position: absolute;
  border-radius: 50%;
  animation: balloon 5s linear infinite;
}

@keyframes fallAnimation {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes fall {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
}

.particle-animation {
  overflow: hidden;
  position: relative;
}

.particle-animation::before, .particle-animation::after {
  content: '';
  position: absolute;
  top: -10%;
  left: 50%;
  width: 15px;
  height: 15px;
  background-color: #ccc;
  opacity: 0;
  border-radius: 50%;
  animation: fall 2s linear infinite;
}

.particle-animation::after {
  left: 60%;
  animation-delay: -1s;
}

@keyframes rain {
  0% { transform: translateY(-100vh); }  /* Iniciar más arriba de la pantalla */
  100% { transform: translateY(100vh); } /* Mover hasta el final de la pantalla */
}

.rain-drop {
  position: absolute;
  top: -20px; /* Asegurar que empiecen fuera de la pantalla */
  width: 3px;  /* Ancho de la gota */
  height: 15px; /* Altura de la gota */
  background-color: blue;
  opacity: 0.7;
  border-radius: 50%;  /* Hace que los extremos sean redondeados, dando una forma más ovalada */
  animation: rain 4s linear infinite; /* Ralentizar la animación */
  transform: scale(1, 1.5); /* Escalar para que sea más ovalada */
}

.rain-drop::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: inherit;
  animation-delay: -0.25s;
}
</style>