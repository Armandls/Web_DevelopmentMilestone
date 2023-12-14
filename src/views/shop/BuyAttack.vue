<script setup>
import ReturnToShop from "../../ components/ReturnToShop.vue";

import { ref, watch } from 'vue';

const items = ref([
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Ráfaga de Energía', cost: 50 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Martillo Celestial', cost: 70 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Vorágine Venenosa', cost: 20 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Cuchillada Fantasmal', cost: 40 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Explosión de las Sombras', cost: 100 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Vórtice Abrasador', cost: 25 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Golpe Relámpago', cost: 90 }
].map(item => ({ ...item, isSelected: false })));
const showDropdown = ref(false);
const selectedItems = ref([]);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const addToCart = (item) => {
  selectedItems.value.push(item);
};

const removeFromCart = (item) => {
  const index = selectedItems.value.findIndex(x => x.id === item.id);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  }
};

// Watcher
watch(items, (newItems) => {
  selectedItems.value = newItems.filter(item => item.isSelected);
}, { deep: true });

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
      <div v-if="showDropdown" class="absolute right-0 mt-2 w-60 bg-white shadow-xl rounded-lg overflow-y-auto max-h-60">
        <div v-for="item in selectedItems" :key="item.id" class="px-4 py-2 hover:bg-gray-100 border-b border-gray-200">
          {{ item.username }} - ${{ item.cost }}
        </div>
      </div>
    </div>

    <!-- Imagen monedas -->
    <img src="/src/assets/shop/Monedas.png" alt=" " class="mi-imagen">

    <!--Imagen chico tamaño pequeño-->
    <div class="img-container">
      <img src="/src/assets/shop/chico_sell.png" alt=" " class="absolute top-50 left-0 m-4 w-50 h-50 object-cover">
    </div>


    <div class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pr-5 mr-4">
      <div v-for="(item, index) in items" :key="item.id" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <div class="flex items-center">
          <div class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</div>
          <img class="w-[58px] h-[58px]" :src="item.imageSrc" />
          <div class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.username }} - Cost: {{ item.cost }}$</div>
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="item.isSelected" class="h-6 w-6 mr-4">
          <label class="mr-4 text-black text-2xl font-bold">BUY</label>
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
</style>




