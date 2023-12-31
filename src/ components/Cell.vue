<template>
  <div :class="cellClasses" :style="{ width: `${cellSize}px`, height: `${cellSize}px` }">
    <!-- Imagen para el jugador 1 -->
    <img v-if="player === 1"
         :src="getPlayerImage(1, props.directionPlayer1)"
         alt="Player 1"
         class="w-full h-full object-cover" />

    <!-- Imagen para el jugador 2 -->
    <img v-if="player === 2"
         :src="getPlayerImage(2, props.directionPlayer2)"
         alt="Player 2"
         class="w-full h-full object-cover" />
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
  },
  directionPlayer1: String,
  directionPlayer2: String
});

const cellClasses = computed(() => [
  props.isDark ? 'bg-gray-300' : 'bg-white',
  'flex justify-center items-center'
]);

function getPlayerImage(playerNumber, direction) {
  const basePath = `/src/assets/game/Player${playerNumber}`;
  switch (direction) {
    case 'up':
      return `${basePath}Up.png`;
    case 'down':
      return `${basePath}Down.png`;
    case 'left':
      return `${basePath}Left.png`;
    case 'right':
      return `${basePath}Right.png`;
    default:
      return `${basePath}Up.png`;
  }
}
</script>