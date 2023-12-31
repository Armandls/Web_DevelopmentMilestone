<template>
  <div :class="cellClasses" :style="{ width: `${cellSize}px`, height: `${cellSize}px` }">
    <!-- Imagen para el jugador 1 -->
    <img v-if="player === 1" src="/src/assets/game/Player1.png" alt="Player 1" class="w-full h-full object-cover"/>

    <!-- Imagen para el jugador 2 -->
    <img v-if="player === 2" src="/src/assets/game/Player1.png" alt="Player 2" class="w-full h-full object-cover"/>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  cellSize: Number,
  isDark: Boolean,
  player: {
    type: Number,
    default: null
  }
});

const cellClasses = computed(() => [
  props.isDark ? 'bg-gray-300' : 'bg-white',
  'flex justify-center items-center'
]);
</script>