<script setup>
import { ref } from 'vue';
import NavigationBar from "../../ components/NavigationBar.vue";

  const attacks = ref([
    { img: 'src/assets/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
    { img: 'src/assets/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
    { img: '/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
    { img: '/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
    { img: '/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
    { img: '/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
    { img: '/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
    { img: '/inventory/attack.png', description: 'Lorem ipsum...', equipped: Math.random() < 0.5 },
  ]);

  const toggleEquip = (attack) => {
    attack.equipped = !attack.equipped;
  };
</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Menu lateral -->
    <NavigationBar/>

    <!-- Contenedor para los ataques -->
    <div class="flex-grow flex flex-col items-center m-1 md:ml-[20%]">
      <div class="w-full max-w-4xl bg-cover bg-center p-5 rounded-lg shadow-xl overflow-auto max-h-[calc(100vh-4rem)] mt-8" style="background-image: url('/src/assets/welcome_page/neon.png'); border: 2px solid white;">
        <div class="flex flex-wrap justify-between items-start">
          <div class="w-full">
            <h2 class="text-3xl text-left ml-5 text-white font-extrabold">AVAILABLE ATTACKS</h2>
            <div class="w-80 h-1 bg-cyan-500 ml-5 mt-2 rounded-full"></div>
          </div>
          <!-- Lista de ataques -->
          <div class="w-full flex flex-wrap">
            <div v-for="(attack, index) in attacks" :key="index" class="p-4 w-full md:w-1/2">
              <div class="bg-white p-4 rounded-lg shadow-md mb-4">
                <div class="flex items-center">
                  <img :src="attack.img" alt="Attack" class="w-16 h-16 bg-fuchsia-500 mr-2" />
                  <p class="text-black font-semibold uppercase flex-grow">{{ attack.description }}</p>
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