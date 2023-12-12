<template>
  <main class="flex flex-col items-center overflow-y-auto overflow-x-hidden mt-6 h-[300px] xl:h-[500px] lg:h-[400px] md:h-[350px] sm:h-[300px] w-full xl:w-[900px] lg:w-[500px] md:w-[500px] sm:w-[300px] bg-white bg-opacity-0 mx-auto pl-5 mb-10">
    <!-- Bucle per a cada jugador en la llista filtrada -->
    <RouterLink v-for="(item, index) in filteredItems" :key="item.id" :to="`/profileranking`" class="flex items-center justify-between w-full h-[88px] my-2 bg-yellow-100 rounded-[10px] border-4 border-black">
      <div class="flex items-center">
        <span class="text-black text-xl md:text-xl lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase mr-4 ml-2">{{ index + 1 }}</span>
        <img class="w-[58px] h-[58px]" :src="item.imageSrc" />
        <span class="text-black text-sm md:text-lg lg:text-xl xl:text-3xl font-bold font-['Sigmar One'] uppercase ml-5">{{ item.username }} - WinRate: {{ item.winRate }}%</span>
        <aside class="flex flex-col items-center justify-center bg-transparent p-3 ml-2 rounded-2xl mb-2.5">
          <p class="text-black font-bold text-xl rounded">{{item.xp}} EXP</p>
        </aside>
      </div>
    </RouterLink>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['searchQuery']);

const items = ref([
  { imageSrc: '/src/assets/avatar.png', username: 'Oriolshhh', winRate: 90, xp: 7 },
  { imageSrc: '/src/assets/avatar.png', username: 'Oriolshhh', winRate: 78, xp: 6},
  { imageSrc: '/src/assets/avatar.png', username: 'Oriolshhh', winRate: 67, xp: 34},
  { imageSrc: '/src/assets/avatar.png', username: 'Oriolshhh', winRate: 56, xp: 89},
  { imageSrc: '/src/assets/avatar.png', username: 'Oriolshhh', winRate: 45, xp: 78},
  { imageSrc: '/src/assets/avatar.png', username: 'Oriolshhh', winRate: 23, xp: 9},
  { imageSrc: '/src/assets/avatar.png', username: 'Oriolshhh', winRate: 11, xp: 13}
]);

const filteredItems = computed(() => {
  if (!props.searchQuery) {
    return items.value;
  }
  return items.value.filter(item =>
      item.username.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});
</script>
