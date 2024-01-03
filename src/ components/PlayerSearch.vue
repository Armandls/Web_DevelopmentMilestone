<template>
  <section class="flex justify-center mt-4 bg-transparent">
    <input v-model="searchText" @keyup.enter="emitSearch" type="text" placeholder="Search Players..." class="p-3 w-full max-w-2xl bg-white border-2 border-gray-300 text-black placeholder-gray-500 rounded-l text-xl font-bold mt-10 ml-24">

    <button @click="emitSearch" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r mt-10 mr-2">
      Search
    </button>

    <button @click="clearSearch" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded mt-10 ml-2">
      Clear Search
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

const clearSearch = () => {
  searchText.value = '';
  emitSearch(); // Això farà que s'emeti l'esdeveniment de cerca amb un string buit
};

</script>
