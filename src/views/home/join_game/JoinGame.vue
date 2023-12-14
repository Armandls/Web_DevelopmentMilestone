<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const items = ref([
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Armand', winRate: 60 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Oriolshhh', winRate: 60 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Oriolshhh', winRate: 60 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Armand', winRate: 60 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Oriolshhh', winRate: 60 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Oriolshhh', winRate: 60 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Oriolshhh', winRate: 60 },
  { imageSrc: '/welcome_page/avatar1.png/', username: 'Oriolshhh', winRate: 60 }
]);

</script>

<template>
  <div class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-24 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Available games i boto de filtrar -->
    <div class="flex justify-center md:justify-start items-start pt-10 md:pt-24 w-full">
      <div class="ml-5 md:ml-64 lg:ml-[200px] xl:ml-[350px] 2xl:ml-[500px]"> <!-- Augment significatiu del marge esquerre per a pantalles grans -->
        <div class="flex flex-col md:flex-row items-center">
          <div class="text-white text-4xl md:text-[50px] font-bold font-['Sigmar One'] uppercase">AVAILABLE GAMES</div>
          <RouterLink to="/joingamefilter" class="bg-fuchsia-500 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded mt-4 md:mt-0 md:ml-10">
            <font-awesome-icon icon="filter" class="mr-2" /> FILTER
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Container pels joinable games -->
    <div class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-20 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5">
      <div v-for="(item, index) in items" :key="item.id" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
        <div class="flex items-center">
          <div class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</div>
          <img class="w-[58px] h-[58px]" :src="item.imageSrc" />
          <div class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.username }} - WinRate: {{ item.winRate }}%</div>
        </div>
        <!-- Implementar aquesta logica en un futur
        <RouterLink :to="'/startgame/${item.id}'" class="bg-green-500 text-sm md:text-lg lg:text-xl xl:text-2xl hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-3">
          <font-awesome-icon icon="play" class="mr-2" /> JOIN GAME
        </RouterLink>
        -->
        <RouterLink to="/playgame" class="bg-green-500 text-sm md:text-lg lg:text-xl xl:text-2xl hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-3">
          <font-awesome-icon icon="play" class="mr-2" /> JOIN GAME
        </RouterLink>
      </div>
    </div>

    <!-- Menu lateral -->
    <div class="flex-grow flex flex-col md:flex-row">
      <div class="hidden md:flex flex-col justify-center items-start w-1/5 fixed left-0 top-1/2 -translate-y-1/2 h-screen">
        <RouterLink to="/home" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
          <font-awesome-icon icon="home" class="mr-2" /> Home
        </RouterLink>
        <RouterLink to="/profile" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
          <font-awesome-icon icon="user" class="mr-2" /> Profile
        </RouterLink>
        <RouterLink to="/shop" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
          <font-awesome-icon icon="shopping-cart" class="mr-2" /> Shop
        </RouterLink>
        <RouterLink to="/inventory" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
          <font-awesome-icon icon="list" class="mr-2" /> Inventory
        </RouterLink>
        <RouterLink to="/ranking" class="flex items-center pl-3.5 bg-fuchsia-500 text-black font-bold py-4 rounded-r-full w-full mb-4 hover:bg-cyan-500 hover:translate-x-2 transition duration-300 uppercase justify-start text-2xl">
          <font-awesome-icon icon="trophy" class="mr-2" /> Ranking
        </RouterLink>
      </div>
    </div>

    <!-- Menu inferior per small screens -->
    <div class="flex md:hidden flex-row justify-between items-center w-full fixed bottom-0 left-0 right-0 bg-black pl-5 pr-5">
      <RouterLink to="/home" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
        <font-awesome-icon icon="home" />
      </RouterLink>
      <RouterLink to="/profile" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
        <font-awesome-icon icon="user" />
      </RouterLink>
      <RouterLink to="/shop" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
        <font-awesome-icon icon="shopping-cart" />
      </RouterLink>
      <RouterLink to="/inventory" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
        <font-awesome-icon icon="list" />
      </RouterLink>
      <RouterLink to="/ranking" class="flex items-center ml-0.5 mr-0.5 justify-center bg-fuchsia-500 text-black font-bold p-2 rounded-t-md w-1/5 hover:bg-cyan-500 hover:-translate-y-1 transition duration-300 uppercase text-3xl">
        <font-awesome-icon icon="trophy" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
</style>

