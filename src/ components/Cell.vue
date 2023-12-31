<template>
  <div :class="cellClasses" :style="{ width: `${cellSize}px`, height: `${cellSize}px` }">
    <!-- Imagen para el jugador 1 -->
    <img v-if="player === 1" src="/src/assets/game/Player1.png" alt="Player 1"
         :class="['w-full', 'h-full', 'object-cover', rotationClassPlayer1]" />

    <!-- Imagen para el jugador 2 -->
    <img v-if="player === 2" src="/src/assets/game/Player1.png" alt="Player 2"
         :class="['w-full', 'h-full', 'object-cover', rotationClassPlayer2]" />
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

const rotationClassPlayer1 = computed(() => {
  return props.player === 1 ? getRotationClass(props.directionPlayer1) : '';
});

const rotationClassPlayer2 = computed(() => {
  return props.player === 2 ? getRotationClass(props.directionPlayer2) : '';
});

function getRotationClass(direction) {
  switch (direction) {
    case 'right':
      return 'rotate-90';
    case 'down':
      return 'rotate-180';
    case 'left':
      return '-rotate-90'; // Asegúrate de que Tailwind CSS soporte '-rotate-90'
    case 'up':
    default:
      return '';
  }
}
</script>