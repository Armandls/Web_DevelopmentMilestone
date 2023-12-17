<script setup>
import {inject, onMounted, computed, ref} from 'vue';
import NavigationBar from "../../ components/NavigationBar.vue";

const token = inject('authToken');
const playerData = inject('playerData');
const attacks = ref([]);

// Propiedad computada para contar los ataques equipados
const attacksEquipped = computed(() => {
  return attacks.value.filter(attack => attack.equipped).length;
});

function getRandomAttackImage() {
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
  return image[Math.floor(Math.random() * image.length)];
}

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
          const filteredAttacks = data.filter(attack => !attack.on_sale);

          // Ordenamos los ataques para que los equipados aparezcan primero
          const sortedAttacks = filteredAttacks.sort((a, b) => {
            // Si 'a' está equipado y 'b' no, 'a' debe ir primero (retornamos -1)
            // Si 'b' está equipado y 'a' no, 'b' debe ir primero (retornamos 1)
            // Si ambos tienen el mismo estado de equipamiento, se mantienen en su orden actual (retornamos 0)
            return a.equipped === b.equipped ? 0 : a.equipped ? -1 : 1;
          });

          // Luego mapeamos los ataques ordenados para estructurarlos por orden
          attacks.value = sortedAttacks.map(attack => ({
            attackName: attack.attack_ID,
            positions: attack.positions,
            power: attack.power,
            equipped: attack.equipped,
            on_sale: attack.on_sale,
            img: getRandomAttackImage(),
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

const toggleEquip = (attack) => {
  let postOrDelete = attack.equipped ? 'DELETE' : 'POST'
  fetch(`https://balandrau.salle.url.edu/i3/players/attacks/${attack.attackName}`, {
    method: postOrDelete,
    headers: {
      'Bearer': `${token.value}`,
      'Content-Type': 'application/json'
    }
  })
      .then(response => {
        if (response.status === 204) {
          console.log(response);
          attack.equipped = !attack.equipped;
          loadPlayerAttacks();
          return;
        }
        throw new Error(`Error: ${response.status}`);
      })
      .catch(error => {
        console.error("Error fetching game data:", error);
      });
};

function getAttackStyles() {
  return {
    'background-color': '#752ae8',
    'border-color': '#03fcf0'
  };
}
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Menu lateral -->
    <NavigationBar/>

    <!-- Contenedor para los ataques -->
    <div class="flex-grow flex flex-col items-center m-1 md:ml-[20%]">
      <div class="w-full max-w-4xl bg-cover bg-center p-5 rounded-lg shadow-xl overflow-auto max-h-[calc(100vh-4rem)] mt-8" style="background-image: url('/src/assets/welcome_page/neon.png'); border: 2px solid white;">
        <div class="flex flex-wrap justify-between items-start">
          <div class="w-full flex justify-between items-center ml-5">
            <h2 class="text-3xl text-white font-extrabold">AVAILABLE ATTACKS</h2>
            <h2 class="text-xl text-white font-extrabold">EQUIPPED ATTACKS: {{ attacksEquipped }} / 3</h2>
          </div>
          <div class="w-full h-1 bg-cyan-500 ml-5 mt-2 rounded-full"></div>
          <!-- Lista de ataques -->
          <div class="w-full flex flex-wrap">
            <div v-for="(attack, index) in attacks" :key="index" class="p-4 w-full md:w-1/2">
              <div :style="getAttackStyles()" class="p-4 rounded-lg shadow-md mb-4">
                <div class="flex items-center">
                  <img :src="attack.img" alt="Attack" class="w-16 h-16 bg-fuchsia-500 mr-2" />
                  <p class="text-black font-semibold uppercase flex-grow">{{ attack.attackName }}</p>
                </div>
                <button :class="{'bg-cyan-500': !attack.equipped, 'bg-red-600': attack.equipped}"
                        class="w-full text-white font-bold py-2 transition duration-300 mt-5 rounded-xl"
                        @click="toggleEquip(attack)">
                  {{ attack.equipped ? 'UNEQUIP' : 'EQUIP' }} ATTACK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>