<template>
  <div class="game_board" :style="backgroundStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  imageUrl: String
});

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${props.imageUrl})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}));
</script>

<style>
.game_board {
  @apply flex md:ml-3 justify-center sm:justify-center sm:items-start md:items-center rounded-lg overflow-auto p-4 mb-48 lg:mb-0 md:mb-0 md:pt-4;
}
</style>