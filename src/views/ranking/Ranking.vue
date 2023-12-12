<script setup>
import { ref } from 'vue';
import NavigationBar   from "../../ components/NavigationBar.vue";
import PlayerSearch from "../../ components/PlayerSearch.vue";
import PlayerList from "../../ components/PlayerList.vue";

const items = ref([
  { imageSrc: '/welcome_page/avatar.png/', username: 'Oriolshhh', winRate: 90, xp: 7 },
  { imageSrc: '/welcome_page/avatar.png/', username: 'Oriolshhh', winRate: 78, xp: 6},
  { imageSrc: '/welcome_page/avatar.png/', username: 'Oriolshhh', winRate: 67, xp: 34},
  { imageSrc: '/welcome_page/avatar.png/', username: 'Oriolshhh', winRate: 56, xp: 89},
  { imageSrc: '/welcome_page/avatar.png/', username: 'Oriolshhh', winRate: 45, xp: 78},
  { imageSrc: '/welcome_page/avatar.png/', username: 'Oriolshhh', winRate: 23, xp: 9},
  { imageSrc: '/welcome_page/avatar.png/', username: 'Oriolshhh', winRate: 11, xp: 13}
]);

const searchQuery = ref('');

const handleSearch = (query) => {
  searchQuery.value = query;
};
</script>

<template>
  <header class="flex flex-col h-screen w-full bg-cover bg-no-repeat bg-center justify-center pt-0 pb-20 md:pb-0 px-4" style="background-image: url('/src/assets/welcome_page/background.png')">
    <!-- Cercador de jugadors -->
    <PlayerSearch @search="handleSearch" />

    <article class="flex justify-center md:justify-start items-start pt-4 md:pt-20 w-full">
      <aside class="ml-2 md:ml-64 lg:ml-[200px] xl:ml-[350px] 2xl:ml-[350px]">
        <div class="flex flex-col md:flex-row items-center bg-fuchsia-300 w-full p-4 rounded">
          <h2 class="text-black text-lg md:text-2xl lg:text-3xl xl:text-4xl font-bold font-['Sigmar One'] uppercase">TOP PLAYERS</h2>
        </div>
      </aside>
    </article>

    <!-- Container pels personatges -->
    <PlayerList :searchQuery="searchQuery" />

    <!-- Navigation Bar -->
    <NavigationBar/>
  </header>
</template>

<style scoped>
</style>

