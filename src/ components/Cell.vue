<template>
  <div :class="cellClasses" :style="{ width: `${cellSize}px`, height: `${cellSize}px` }">
    <span v-if="player === 1" class="text-center text-blue-500">P1</span>
    <span v-if="player === 2" class="text-center text-red-500">P2</span>
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