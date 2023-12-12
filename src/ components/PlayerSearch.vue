<template>
  <section class="flex justify-center mt-4 bg-transparent">
    <input v-model="searchText" @keyup.enter="performSearch" type="text" placeholder="Search Players..." class="p-3 w-full max-w-2xl bg-white border-2 border-gray-300 text-black placeholder-gray-500 rounded-l text-xl font-bold mt-10">
    <button @click="emitSearch" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r mt-10">
      Search
    </button>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const searchText = ref('');
const emit = defineEmits(['search']);

const emitSearch = () => {
  emit('search', searchText.value);
};
</script>
